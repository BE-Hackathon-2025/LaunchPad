// Calculate fit score between student profile and opportunity
export const calculateFitScore = (profile, roadmap, opportunity) => {
  let score = 0
  const factors = []

  // Role match (30 points)
  if (profile.targetRoles.includes(opportunity.role_type)) {
    score += 30
    factors.push({ name: 'Target Role Match', points: 30 })
  }

  // Skills match (40 points)
  const studentSkills = [
    ...profile.currentSkills,
    ...getCompletedSkills(roadmap)
  ].map(s => s.toLowerCase())

  const requiredSkills = opportunity.required_skills.map(s => s.toLowerCase())
  const preferredSkills = opportunity.preferred_skills.map(s => s.toLowerCase())

  const matchedRequired = requiredSkills.filter(skill =>
    studentSkills.some(s => s.includes(skill) || skill.includes(s))
  )
  const matchedPreferred = preferredSkills.filter(skill =>
    studentSkills.some(s => s.includes(skill) || skill.includes(s))
  )

  const requiredScore = (matchedRequired.length / requiredSkills.length) * 30
  const preferredScore = (matchedPreferred.length / preferredSkills.length) * 10

  score += requiredScore + preferredScore
  factors.push({
    name: 'Skills Match',
    points: Math.round(requiredScore + preferredScore),
    details: `${matchedRequired.length}/${requiredSkills.length} required, ${matchedPreferred.length}/${preferredSkills.length} preferred`
  })

  // Experience level (15 points)
  if (opportunity.level === 'Intern') {
    score += 15
    factors.push({ name: 'Level Appropriate', points: 15 })
  }

  // Location preference (15 points)
  if (opportunity.location_type === 'Remote' ||
      (profile.location && opportunity.location_type.includes(profile.location.split(',')[1]?.trim()))) {
    score += 15
    factors.push({ name: 'Location Match', points: 15 })
  } else {
    score += 7
    factors.push({ name: 'Location Partial', points: 7 })
  }

  return {
    score: Math.min(Math.round(score), 100),
    factors,
    matchedSkills: [...matchedRequired, ...matchedPreferred],
    missingSkills: requiredSkills.filter(skill =>
      !studentSkills.some(s => s.includes(skill) || skill.includes(s))
    )
  }
}

// Get skills from completed milestones
export const getCompletedSkills = (roadmap) => {
  if (!roadmap || !roadmap.phases) return []

  const skills = []
  roadmap.phases.forEach(phase => {
    phase.milestones.forEach(milestone => {
      if (milestone.status === 'completed') {
        skills.push(...milestone.skills)
      }
    })
  })

  return [...new Set(skills)]
}

// Calculate overall portfolio readiness score
export const calculateReadinessScore = (profile, roadmap, targetRole) => {
  if (!roadmap) return 0

  let totalMilestones = 0
  let completedMilestones = 0
  let inProgressMilestones = 0

  roadmap.phases.forEach(phase => {
    phase.milestones.forEach(milestone => {
      totalMilestones++
      if (milestone.status === 'completed') completedMilestones++
      if (milestone.status === 'in_progress') inProgressMilestones++
    })
  })

  const completionScore = (completedMilestones / totalMilestones) * 60
  const progressScore = (inProgressMilestones / totalMilestones) * 20
  const skillScore = profile.currentSkills.length * 2

  return Math.min(Math.round(completionScore + progressScore + skillScore), 100)
}

// Get recommended next steps
export const getNextSteps = (roadmap) => {
  if (!roadmap || !roadmap.phases) return []

  const nextSteps = []

  for (const phase of roadmap.phases) {
    const notStarted = phase.milestones.filter(m => m.status === 'not_started')
    const inProgress = phase.milestones.filter(m => m.status === 'in_progress')

    if (inProgress.length > 0) {
      nextSteps.push({
        type: 'continue',
        phase: phase.name,
        phaseId: phase.id,
        milestone: inProgress[0]
      })
    }

    if (notStarted.length > 0 && nextSteps.length < 3) {
      nextSteps.push({
        type: 'start',
        phase: phase.name,
        phaseId: phase.id,
        milestone: notStarted[0]
      })
    }

    if (nextSteps.length >= 3) break
  }

  return nextSteps
}

// Filter opportunities by various criteria
export const filterOpportunities = (opportunities, filters) => {
  return opportunities.filter(opp => {
    if (filters.roleType && opp.role_type !== filters.roleType) return false
    if (filters.sponsor && opp.sponsor_tag !== filters.sponsor) return false
    if (filters.locationType && opp.location_type.toLowerCase().includes(filters.locationType.toLowerCase())) return true
    return true
  })
}
