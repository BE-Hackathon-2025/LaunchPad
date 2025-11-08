/**
 * User Type Configuration
 * Defines different user personas and their content preferences
 */

// User Type Constants
export const USER_TYPES = {
  STUDENT: 'student',
  PROFESSIONAL: 'professional',
  OTHER: 'other'
}

// User Type Display Names and Descriptions
export const USER_TYPE_INFO = {
  [USER_TYPES.STUDENT]: {
    label: 'Student',
    description: 'Currently enrolled in an educational institution',
    icon: '🎓',
    examples: 'Undergraduate, graduate student, or recent graduate'
  },
  [USER_TYPES.PROFESSIONAL]: {
    label: 'Industry Professional',
    description: 'Working in the industry or looking to transition',
    icon: '💼',
    examples: 'Software engineer, career changer, or upskilling professional'
  },
  [USER_TYPES.OTHER]: {
    label: 'Exploring / Other',
    description: 'Learning for personal growth or career exploration',
    icon: '🚀',
    examples: 'Self-taught developer, career explorer, or lifelong learner'
  }
}

/**
 * Student Content Configuration
 * Optimized for students with semester-based planning and early-career focus
 */
export const studentContentConfig = {
  // Roadmap Structure
  roadmapStyle: 'semester-based',

  // Timeline Naming Convention
  phaseNaming: {
    prefix: 'Semester',
    format: 'numeric', // "Semester 1", "Semester 2", etc.
    alternativeFormat: 'seasonal' // "Fall 2024", "Spring 2025", etc.
  },

  // Content Emphasis Weights (0-1 scale)
  contentWeights: {
    // Academic Resources
    universityCourses: 0.8,
    requiredCoursework: 0.9,
    electiveCourses: 0.7,
    campusResources: 0.8,

    // Projects and Experience
    foundationalProjects: 0.9,
    academicProjects: 0.8,
    personalProjects: 0.7,

    // Career Programs
    internships: 1.0,
    coops: 0.9,
    fellowships: 0.8,
    earlyTalentPrograms: 1.0,
    newGradRoles: 0.9,

    // Learning Resources
    beginnerCertifications: 0.9,
    intermediateCertifications: 0.6,
    advancedCertifications: 0.3,
    moocs: 0.7,
    freeResources: 0.9,

    // Professional Development
    hackathons: 0.9,
    competitiveProgramming: 0.8,
    openSource: 0.7,
    networking: 0.6,

    // Advanced/Industry
    industryCertifications: 0.4,
    professionalUpskilling: 0.3,
    leadershipSkills: 0.2
  },

  // Opportunity Filters
  opportunityPreferences: {
    preferredTypes: [
      'internship',
      'co-op',
      'fellowship',
      'new-grad',
      'entry-level',
      'student-program'
    ],
    experienceLevel: ['entry', 'junior', 'intern'],
    excludeTypes: ['senior', 'staff', 'principal', 'executive']
  },

  // Resource Recommendations
  resourcePriorities: [
    'University courses and curricula',
    'Campus career services',
    'Student-friendly certifications (AWS Academy, Microsoft Learn)',
    'Beginner/intermediate MOOCs (freeCodeCamp, Codecademy)',
    'Hackathons and coding competitions',
    'Open source contributions',
    'Personal portfolio projects',
    'Interview preparation (LeetCode, HackerRank)',
    'Internship preparation programs'
  ],

  // Roadmap Characteristics
  roadmapCharacteristics: {
    typicalDuration: '4-8 semesters',
    focusAreas: [
      'Building foundational skills',
      'Academic excellence',
      'Hands-on projects',
      'Internship readiness',
      'Interview preparation',
      'Portfolio development'
    ],
    milestoneStyle: 'academic-aligned', // Aligned with semester/quarter schedules
    constraintConsiderations: [
      'Course load and academic schedule',
      'Limited time outside classes',
      'Budget constraints (prefer free resources)',
      'Campus resources availability'
    ]
  },

  // AI Prompt Adjustments
  promptModifiers: {
    tone: 'encouraging and educational',
    context: 'student with academic commitments',
    timeframeLanguage: 'semesters, academic years',
    experienceAssumptions: 'limited professional experience, strong foundational learning',
    goalOrientation: 'preparing for first internship or full-time role'
  }
}

/**
 * Professional Content Configuration
 * Optimized for working professionals with phase-based planning and career transition focus
 */
export const professionalContentConfig = {
  // Roadmap Structure
  roadmapStyle: 'phase-based',

  // Timeline Naming Convention
  phaseNaming: {
    format: 'descriptive', // "Phase 1: Assess", "Phase 2: Skill Up", etc.
    phases: [
      { id: 1, name: 'Assess & Plan', duration: '1-2 months' },
      { id: 2, name: 'Skill Acquisition', duration: '2-4 months' },
      { id: 3, name: 'Build Proof of Expertise', duration: '2-3 months' },
      { id: 4, name: 'Transition & Apply', duration: '1-3 months' }
    ]
  },

  // Content Emphasis Weights (0-1 scale)
  contentWeights: {
    // Academic Resources
    universityCourses: 0.2,
    requiredCoursework: 0.1,
    electiveCourses: 0.2,
    campusResources: 0.0,

    // Projects and Experience
    foundationalProjects: 0.3,
    academicProjects: 0.1,
    personalProjects: 0.9,
    professionalProjects: 1.0,

    // Career Programs
    internships: 0.1,
    coops: 0.0,
    fellowships: 0.2,
    earlyTalentPrograms: 0.0,
    newGradRoles: 0.0,

    // Learning Resources
    beginnerCertifications: 0.4,
    intermediateCertifications: 0.8,
    advancedCertifications: 0.9,
    moocs: 0.9,
    vendorCertifications: 1.0, // AWS, Azure, GCP, etc.
    nanoDegrees: 0.9,

    // Professional Development
    hackathons: 0.5,
    competitiveProgramming: 0.3,
    openSource: 0.8,
    networking: 0.9,

    // Advanced/Industry
    industryCertifications: 1.0,
    professionalUpskilling: 1.0,
    leadershipSkills: 0.8,
    specializedSkills: 0.9,
    portfolioRefinement: 0.9
  },

  // Opportunity Filters
  opportunityPreferences: {
    preferredTypes: [
      'mid-level',
      'senior',
      'staff',
      'career-transition',
      'reskilling-program',
      'professional-development'
    ],
    experienceLevel: ['mid', 'senior', 'staff', 'principal'],
    excludeTypes: ['intern', 'new-grad'] // Unless explicitly requested
  },

  // Resource Recommendations
  resourcePriorities: [
    'Professional certifications (AWS, Azure, GCP, Security+)',
    'Advanced MOOCs (Coursera, EdX, Udacity)',
    'Specialized nano-degrees and bootcamps',
    'Industry-specific training programs',
    'Leadership and management courses',
    'Portfolio and resume refinement',
    'Professional networking (LinkedIn optimization)',
    'Open source contributions (demonstrating expertise)',
    'Technical blog writing and thought leadership',
    'Conference speaking and presentations'
  ],

  // Roadmap Characteristics
  roadmapCharacteristics: {
    typicalDuration: '6-12 months',
    focusAreas: [
      'Professional upskilling',
      'Career transition or advancement',
      'Specialized certifications',
      'Portfolio enhancement',
      'Leadership development',
      'Strategic networking'
    ],
    milestoneStyle: 'outcome-focused', // Focused on tangible deliverables
    constraintConsiderations: [
      'Full-time work commitments',
      'Family and personal obligations',
      'Budget for paid certifications and programs',
      'Time efficiency (prefer condensed, high-ROI programs)'
    ]
  },

  // AI Prompt Adjustments
  promptModifiers: {
    tone: 'professional and strategic',
    context: 'working professional with career goals',
    timeframeLanguage: 'phases, months, quarters',
    experienceAssumptions: 'existing professional experience, targeted skill development',
    goalOrientation: 'career advancement, transition, or specialization'
  }
}

/**
 * Other/Exploring Content Configuration
 * Neutral defaults for users who don't fit traditional categories
 */
export const otherContentConfig = {
  // Roadmap Structure
  roadmapStyle: 'flexible',

  // Timeline Naming Convention
  phaseNaming: {
    format: 'simple', // "Phase 1", "Phase 2", etc.
    prefix: 'Phase'
  },

  // Content Emphasis Weights (balanced approach)
  contentWeights: {
    universityCourses: 0.5,
    foundationalProjects: 0.8,
    personalProjects: 0.8,
    moocs: 0.8,
    certifications: 0.6,
    openSource: 0.7,
    networking: 0.6
  },

  // Opportunity Filters
  opportunityPreferences: {
    preferredTypes: ['entry-level', 'mid-level', 'freelance', 'contract'],
    experienceLevel: ['entry', 'junior', 'mid'],
    excludeTypes: []
  },

  // Resource Recommendations (balanced mix)
  resourcePriorities: [
    'Self-paced online courses',
    'Free and low-cost certifications',
    'Personal projects and portfolio',
    'Open source contributions',
    'Flexible learning resources',
    'Community-driven programs'
  ],

  // Roadmap Characteristics
  roadmapCharacteristics: {
    typicalDuration: '3-12 months',
    focusAreas: [
      'Skill development',
      'Portfolio building',
      'Career exploration',
      'Flexible learning'
    ],
    milestoneStyle: 'self-paced',
    constraintConsiderations: [
      'Flexible time commitment',
      'Budget-conscious options',
      'Self-directed learning'
    ]
  },

  // AI Prompt Adjustments
  promptModifiers: {
    tone: 'supportive and flexible',
    context: 'self-directed learner with varied background',
    timeframeLanguage: 'phases, flexible timeline',
    experienceAssumptions: 'varied experience, personalized approach',
    goalOrientation: 'skill development and career exploration'
  }
}

/**
 * Get configuration for a specific user type
 * @param {string} userType - One of USER_TYPES values
 * @returns {Object} - Configuration object for the user type
 */
export function getUserTypeConfig(userType) {
  switch (userType) {
    case USER_TYPES.STUDENT:
      return studentContentConfig
    case USER_TYPES.PROFESSIONAL:
      return professionalContentConfig
    case USER_TYPES.OTHER:
    default:
      return otherContentConfig
  }
}

/**
 * Get roadmap phase naming based on user type
 * @param {string} userType - User type
 * @param {number} phaseIndex - Phase number (0-based)
 * @param {Object} profile - User profile for context (graduation year, etc.)
 * @returns {string} - Formatted phase name
 */
export function getPhaseNameForUserType(userType, phaseIndex, profile = {}) {
  const config = getUserTypeConfig(userType)

  if (userType === USER_TYPES.STUDENT) {
    // For students, use semester-based naming
    const semesterNum = phaseIndex + 1

    // If graduation timeline is available, we could compute actual semester/year
    // For now, simple numeric: "Semester 1", "Semester 2", etc.
    return `Semester ${semesterNum}`
  } else if (userType === USER_TYPES.PROFESSIONAL) {
    // For professionals, use descriptive phase names
    const phases = config.phaseNaming.phases
    const phase = phases[phaseIndex] || { name: `Phase ${phaseIndex + 1}` }
    return `Phase ${phaseIndex + 1}: ${phase.name}`
  } else {
    // For others, simple phase naming
    return `Phase ${phaseIndex + 1}`
  }
}

/**
 * Filter opportunities based on user type
 * @param {Array} opportunities - All opportunities
 * @param {string} userType - User type
 * @returns {Array} - Filtered and weighted opportunities
 */
export function filterOpportunitiesByUserType(opportunities, userType) {
  const config = getUserTypeConfig(userType)
  const { preferredTypes, experienceLevel, excludeTypes } = config.opportunityPreferences

  return opportunities
    .filter(opp => {
      // Exclude explicitly excluded types
      if (excludeTypes.some(excluded => opp.type?.toLowerCase().includes(excluded))) {
        return false
      }

      // Include if matches preferred types or experience levels
      const matchesType = preferredTypes.some(type =>
        opp.type?.toLowerCase().includes(type) ||
        opp.tags?.some(tag => tag.toLowerCase().includes(type))
      )

      const matchesLevel = experienceLevel.some(level =>
        opp.experienceLevel?.toLowerCase().includes(level) ||
        opp.level?.toLowerCase().includes(level)
      )

      return matchesType || matchesLevel
    })
    .map(opp => ({
      ...opp,
      // Add relevance score based on user type
      relevanceScore: calculateOpportunityRelevance(opp, userType, config)
    }))
    .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
}

/**
 * Calculate opportunity relevance score
 * @param {Object} opportunity - Opportunity object
 * @param {string} userType - User type
 * @param {Object} config - User type configuration
 * @returns {number} - Relevance score (0-100)
 */
function calculateOpportunityRelevance(opportunity, userType, config) {
  let score = 50 // Base score

  const { preferredTypes, experienceLevel } = config.opportunityPreferences

  // Bonus for matching preferred types
  if (preferredTypes.some(type => opportunity.type?.toLowerCase().includes(type))) {
    score += 30
  }

  // Bonus for matching experience level
  if (experienceLevel.some(level => opportunity.experienceLevel?.toLowerCase().includes(level))) {
    score += 20
  }

  // Bonus for sponsor tags (if applicable)
  if (opportunity.sponsor && userType === USER_TYPES.STUDENT) {
    score += 10
  }

  return Math.min(100, score)
}
