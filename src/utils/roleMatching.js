/**
 * Role Matching Engine
 * Calculates compatibility between user profiles and role requirements
 */

import { roleProfiles, getAllRoleProfiles } from '../config/roleProfiles'
import { normalizeSkills } from '../config/skillsTaxonomy'
import { ExperienceLevels, MatchLevels } from '../types/careerMatching'
import { aiService } from '../services/ai'

/**
 * Calculate skill match percentage
 * @param {string[]} userSkills - User's skills
 * @param {string[]} requiredSkills - Role's required skills
 * @returns {number} - Match percentage (0-100)
 */
function calculateSkillMatch(userSkills, requiredSkills) {
  if (!requiredSkills || requiredSkills.length === 0) return 100

  const normalizedUserSkills = normalizeSkills(userSkills).map(s => s.toLowerCase())
  const normalizedRequired = normalizeSkills(requiredSkills).map(s => s.toLowerCase())

  const matchCount = normalizedRequired.filter(skill =>
    normalizedUserSkills.includes(skill)
  ).length

  return Math.round((matchCount / normalizedRequired.length) * 100)
}

/**
 * Calculate bonus from preferred skills
 * @param {string[]} userSkills - User's skills
 * @param {string[]} preferredSkills - Role's preferred skills
 * @returns {number} - Bonus score (0-20)
 */
function calculateBonusScore(userSkills, preferredSkills) {
  if (!preferredSkills || preferredSkills.length === 0) return 0

  const normalizedUserSkills = normalizeSkills(userSkills).map(s => s.toLowerCase())
  const normalizedPreferred = normalizeSkills(preferredSkills).map(s => s.toLowerCase())

  const matchCount = normalizedPreferred.filter(skill =>
    normalizedUserSkills.includes(skill)
  ).length

  // Max 20 bonus points
  return Math.min(20, Math.round((matchCount / normalizedPreferred.length) * 20))
}

/**
 * Map experience level string to numeric value
 * @param {string} experienceLevel - Experience level string
 * @returns {number} - Numeric experience level
 */
function mapExperienceLevel(experienceLevel) {
  const level = experienceLevel?.toLowerCase()

  if (level?.includes('beginner') || level?.includes('no experience')) {
    return ExperienceLevels.BEGINNER
  } else if (level?.includes('intermediate') || level?.includes('some experience')) {
    return ExperienceLevels.INTERMEDIATE
  } else if (level?.includes('advanced') || level?.includes('expert')) {
    return ExperienceLevels.ADVANCED
  }

  return ExperienceLevels.BEGINNER
}

/**
 * Calculate experience level compatibility
 * @param {number} userLevel - User's experience level (0-2)
 * @param {number} roleMinLevel - Role's minimum required level (0-2)
 * @returns {number} - Adjustment factor (-10 to +10)
 */
function calculateExperienceAdjustment(userLevel, roleMinLevel) {
  const difference = userLevel - roleMinLevel

  if (difference >= 0) {
    // User meets or exceeds requirements
    return Math.min(10, difference * 5)
  } else {
    // User is below requirements
    return Math.max(-10, difference * 5)
  }
}

/**
 * Get match level classification
 * @param {number} score - Match score (0-100)
 * @returns {string} - Match level name
 */
function getMatchLevel(score) {
  if (score >= MatchLevels.EXCELLENT.min) return 'excellent'
  if (score >= MatchLevels.GOOD.min) return 'good'
  if (score >= MatchLevels.FAIR.min) return 'fair'
  return 'needs-development'
}

/**
 * Generate personalized recommendation
 * @param {Object} matchResult - Match result object
 * @param {Object} roleProfile - Role profile
 * @returns {string} - Recommendation text
 */
function generateRecommendation(matchResult, roleProfile) {
  const { score, gapSkills, matchLevel } = matchResult

  if (matchLevel === 'excellent') {
    return `Excellent match! You have most skills needed for ${roleProfile.name}. Consider applying to ${roleProfile.name} positions.`
  } else if (matchLevel === 'good') {
    return `Good fit for ${roleProfile.name}. Focus on gaining ${gapSkills.slice(0, 2).join(' and ')} to strengthen your candidacy.`
  } else if (matchLevel === 'fair') {
    const topGaps = gapSkills.slice(0, 3).join(', ')
    return `${roleProfile.name} is achievable with effort. Build skills in ${topGaps} through projects and courses.`
  } else {
    return `${roleProfile.name} is a longer-term goal. Start with foundational skills: ${gapSkills.slice(0, 3).join(', ')}.`
  }
}

/**
 * Calculate role match score
 * Pure function that computes compatibility between user profile and role
 *
 * @param {Object} userProfile - User profile data
 * @param {Object} roleProfile - Role profile definition
 * @returns {Object} - Role match result
 */
export function calculateRoleMatch(userProfile, roleProfile) {
  // Combine all user skills from different sources
  const allUserSkills = [
    ...(userProfile.currentSkills || []),
    ...(userProfile.interests || []),
    ...(userProfile.resumeData?.parsed?.normalizedSkills || [])
  ]

  // Calculate required skills match (0-80 points)
  const requiredMatch = calculateSkillMatch(allUserSkills, roleProfile.requiredSkills)
  const requiredScore = (requiredMatch * 0.8) // Max 80 points

  // Calculate preferred skills bonus (0-20 points)
  const bonusScore = calculateBonusScore(allUserSkills, roleProfile.preferredSkills)

  // Calculate experience level adjustment (-10 to +10)
  const userExperienceLevel = mapExperienceLevel(userProfile.experienceLevel)
  const expAdjustment = calculateExperienceAdjustment(
    userExperienceLevel,
    roleProfile.minExperienceLevel
  )

  // Calculate final score (capped at 100)
  let finalScore = requiredScore + bonusScore + expAdjustment
  finalScore = Math.max(0, Math.min(100, Math.round(finalScore)))

  // Identify matched and gap skills
  const normalizedUserSkills = normalizeSkills(allUserSkills).map(s => s.toLowerCase())
  const normalizedRequired = normalizeSkills(roleProfile.requiredSkills).map(s => s.toLowerCase())
  const normalizedPreferred = normalizeSkills(roleProfile.preferredSkills).map(s => s.toLowerCase())

  const matchedSkills = normalizedRequired.filter(skill =>
    normalizedUserSkills.includes(skill)
  )

  const gapSkills = normalizedRequired.filter(skill =>
    !normalizedUserSkills.includes(skill)
  )

  const bonusSkills = normalizedPreferred.filter(skill =>
    normalizedUserSkills.includes(skill)
  )

  const matchLevel = getMatchLevel(finalScore)

  const result = {
    roleId: roleProfile.id,
    roleName: roleProfile.name,
    score: finalScore,
    matchedSkills,
    gapSkills,
    bonusSkills,
    matchLevel,
    recommendation: ''
  }

  result.recommendation = generateRecommendation(result, roleProfile)

  return result
}

/**
 * Calculate matches for all roles
 * @param {Object} userProfile - User profile data
 * @returns {Array} - Array of role match results, sorted by score
 */
export function calculateAllRoleMatches(userProfile) {
  const allRoles = getAllRoleProfiles()

  const matches = allRoles.map(roleProfile =>
    calculateRoleMatch(userProfile, roleProfile)
  )

  // Sort by score (descending)
  matches.sort((a, b) => b.score - a.score)

  return matches
}

/**
 * Get top N role matches
 * @param {Object} userProfile - User profile data
 * @param {number} limit - Number of matches to return (default 3)
 * @returns {Array} - Top N role matches
 */
export function getTopRoleMatches(userProfile, limit = 3) {
  const allMatches = calculateAllRoleMatches(userProfile)
  return allMatches.slice(0, limit)
}

/**
 * Calculate match for specific roles
 * @param {Object} userProfile - User profile data
 * @param {string[]} roleIds - Array of role IDs to match against
 * @returns {Array} - Role match results for specified roles
 */
export function calculateSpecificRoleMatches(userProfile, roleIds) {
  if (!roleIds || roleIds.length === 0) {
    return getTopRoleMatches(userProfile, 3)
  }

  const matches = roleIds
    .map(roleId => {
      const roleProfile = roleProfiles[roleId]
      if (!roleProfile) return null
      return calculateRoleMatch(userProfile, roleProfile)
    })
    .filter(match => match !== null)

  matches.sort((a, b) => b.score - a.score)

  return matches
}

/**
 * Get role recommendations based on interests
 * @param {string[]} interests - User's interests
 * @returns {Array} - Recommended role IDs
 */
export function getRoleRecommendationsByInterests(interests) {
  if (!interests || interests.length === 0) {
    return []
  }

  const recommendations = []
  const normalizedInterests = interests.map(i => i.toLowerCase())

  // Simple interest-to-role mapping
  const interestMap = {
    'ai': ['ml-engineer', 'data-scientist'],
    'machine learning': ['ml-engineer', 'data-scientist'],
    'web development': ['frontend-engineer', 'full-stack-engineer', 'backend-engineer'],
    'frontend': ['frontend-engineer', 'full-stack-engineer'],
    'backend': ['backend-engineer', 'full-stack-engineer'],
    'mobile': ['software-engineer', 'frontend-engineer'],
    'data': ['data-scientist', 'data-analyst', 'ml-engineer'],
    'cloud': ['devops-engineer', 'backend-engineer'],
    'security': ['cybersecurity-analyst'],
    'product': ['product-manager']
  }

  normalizedInterests.forEach(interest => {
    Object.entries(interestMap).forEach(([key, roles]) => {
      if (interest.includes(key)) {
        recommendations.push(...roles)
      }
    })
  })

  // Return unique role IDs
  return [...new Set(recommendations)]
}

/**
 * AI-Powered Role Matching
 * Uses GPT to analyze user profile and generate realistic match scores
 *
 * @param {Object} userProfile - User profile data
 * @param {Object} roleProfile - Role profile definition
 * @returns {Promise<Object>} - AI-generated role match result
 */
export async function calculateAIRoleMatch(userProfile, roleProfile) {
  const allUserSkills = [
    ...(userProfile.currentSkills || []),
    ...(userProfile.interests || []),
    ...(userProfile.resumeData?.parsed?.normalizedSkills || [])
  ]

  console.log(`  🔍 Matching ${roleProfile.name} - User has ${allUserSkills.length} total skills`)

  const prompt = `You are a career advisor analyzing a candidate's fit for a specific tech role.

CANDIDATE PROFILE:
- Name: ${userProfile.name}
- Major: ${userProfile.major}
- Experience Level: ${userProfile.experienceLevel}
- Current Skills: ${allUserSkills.join(', ')}
- Interests: ${userProfile.interests?.join(', ')}
- Target Roles: ${userProfile.targetRoles?.join(', ')}
${userProfile.resumeData ? `- Resume Skills: ${userProfile.resumeData.parsed?.normalizedSkills?.join(', ')}` : ''}

ROLE: ${roleProfile.name}
- Summary: ${roleProfile.summary}
- Required Skills: ${roleProfile.requiredSkills.join(', ')}
- Preferred Skills: ${roleProfile.preferredSkills.join(', ')}
- Min Experience: ${roleProfile.minExperienceLevel === 0 ? 'Beginner' : roleProfile.minExperienceLevel === 1 ? 'Intermediate' : 'Advanced'}

TASK:
Analyze how well this candidate matches this role. Be realistic but encouraging. Consider:
1. Skills overlap (both technical and transferable)
2. Experience level fit
3. Interest alignment
4. Growth potential

Respond with ONLY a valid JSON object in this exact format:
{
  "score": <number 0-100>,
  "matchedSkills": ["skill1", "skill2"],
  "gapSkills": ["skill3", "skill4"],
  "bonusSkills": ["skill5"],
  "matchLevel": "excellent|good|fair|needs-development",
  "recommendation": "Personalized 2-sentence recommendation"
}

SCORING GUIDANCE:
- 85-100: Excellent fit, candidate has most required skills and clear interest
- 70-84: Good fit, candidate has core foundation and matching interests
- 55-69: Fair fit, candidate has potential and some relevant skills
- Below 55: Needs development, but still achievable with effort

IMPORTANT: Be generous and encouraging. Students with matching interests and some foundation skills should score 65-90%. Only give very low scores (<50%) if there's almost no skill overlap. Consider:
- Matching major/interests as worth 20-30 points alone
- Any relevant coursework or projects
- Transferable skills and learning potential
- Growth mindset and career trajectory`

  try {
    console.log(`  📡 Sending AI request for ${roleProfile.name}...`)
    const response = await aiService.chat([
      { role: 'user', content: prompt }
    ])

    console.log(`  ✅ AI response received for ${roleProfile.name}`)
    const result = JSON.parse(response)

    const finalResult = {
      roleId: roleProfile.id,
      roleName: roleProfile.name,
      score: Math.max(0, Math.min(100, result.score)),
      matchedSkills: result.matchedSkills || [],
      gapSkills: result.gapSkills || [],
      bonusSkills: result.bonusSkills || [],
      matchLevel: result.matchLevel || getMatchLevel(result.score),
      recommendation: result.recommendation || `Based on your profile, ${roleProfile.name} could be a good fit.`
    }

    console.log(`  🎯 ${roleProfile.name}: ${finalResult.score}%`)
    return finalResult
  } catch (error) {
    console.error(`  ❌ AI matching error for ${roleProfile.name}:`, error.message)
    // Fallback to algorithmic matching
    const fallback = calculateRoleMatch(userProfile, roleProfile)
    console.log(`  ⚠️ Using fallback for ${roleProfile.name}: ${fallback.score}%`)
    return fallback
  }
}

/**
 * Calculate AI-powered matches for all roles
 * Returns top 3 matches with realistic scores
 *
 * @param {Object} userProfile - User profile data
 * @returns {Promise<Array>} - Top 3 AI-generated role matches
 */
export async function calculateAIRoleMatches(userProfile) {
  console.log('🚀 calculateAIRoleMatches called')

  const allRoles = getAllRoleProfiles()
  console.log('📋 Total roles to match:', allRoles.length)

  if (!userProfile) {
    console.error('❌ No user profile provided')
    throw new Error('User profile is required')
  }

  try {
    console.log('🔄 Starting parallel AI matching for', allRoles.length, 'roles...')

    // Get AI matches for all roles in parallel
    const matchPromises = allRoles.map((roleProfile, index) => {
      console.log(`  ${index + 1}. Matching ${roleProfile.name}...`)
      return calculateAIRoleMatch(userProfile, roleProfile)
    })

    const matches = await Promise.all(matchPromises)
    console.log('✅ All', matches.length, 'AI matches completed')

    // Sort by score (descending) and return top 3
    matches.sort((a, b) => b.score - a.score)

    const top3 = matches.slice(0, 3)
    console.log('🏆 Top 3 matches:', top3.map(m => `${m.roleName}: ${m.score}%`))

    return top3
  } catch (error) {
    console.error('❌ AI role matching failed:', error)
    console.error('Error type:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)

    // Fallback to algorithmic matching
    console.warn('⚠️ Using algorithmic fallback matching')
    const fallback = getTopRoleMatches(userProfile, 3)
    console.log('📊 Fallback results:', fallback.map(m => `${m.roleName}: ${m.score}%`))
    return fallback
  }
}
