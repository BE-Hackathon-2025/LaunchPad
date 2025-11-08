/**
 * Type definitions for Career Matching System
 *
 * @typedef {Object} ResumeData
 * @property {string} fileName - Original file name
 * @property {string} uploadedAt - ISO timestamp
 * @property {ParsedResumeContent} parsed - Parsed content
 * @property {string} rawText - Raw extracted text
 */

/**
 * @typedef {Object} ParsedResumeContent
 * @property {string[]} programmingLanguages - Extracted programming languages
 * @property {string[]} frameworks - Frameworks and libraries
 * @property {string[]} tools - Tools and platforms
 * @property {WorkExperience[]} experiences - Work experience entries
 * @property {Project[]} projects - Project entries
 * @property {Education[]} education - Education entries
 * @property {string[]} certifications - Certifications
 * @property {string[]} normalizedSkills - All skills normalized to canonical form
 */

/**
 * @typedef {Object} WorkExperience
 * @property {string} title - Job title
 * @property {string} company - Company name
 * @property {string} duration - Duration (e.g., "Jan 2022 - Present")
 * @property {string[]} responsibilities - Key responsibilities
 * @property {string[]} technologies - Technologies used
 */

/**
 * @typedef {Object} Project
 * @property {string} name - Project name
 * @property {string} description - Project description
 * @property {string[]} technologies - Technologies used
 * @property {string} [url] - Project URL if available
 */

/**
 * @typedef {Object} Education
 * @property {string} degree - Degree name
 * @property {string} institution - School/University name
 * @property {string} field - Field of study
 * @property {string} [graduation] - Graduation date
 */

/**
 * @typedef {Object} RoleProfile
 * @property {string} id - Unique role identifier
 * @property {string} name - Display name
 * @property {string} summary - One-sentence summary
 * @property {string} description - Detailed description
 * @property {string[]} requiredSkills - Must-have skills
 * @property {string[]} preferredSkills - Nice-to-have skills
 * @property {string[]} typicalTools - Common tools for this role
 * @property {string} typicalStack - Technology stack description
 * @property {string[]} responsibilities - Key responsibilities
 * @property {string[]} exampleProjects - Example project types
 * @property {string} careerTrajectory - Career progression path
 * @property {number} minExperienceLevel - Minimum experience (0=beginner, 1=intermediate, 2=advanced)
 * @property {string[]} relatedRoles - Related career paths
 */

/**
 * @typedef {Object} RoleMatchResult
 * @property {string} roleId - Role identifier
 * @property {string} roleName - Role display name
 * @property {number} score - Match score (0-100)
 * @property {string[]} matchedSkills - Skills user has that match
 * @property {string[]} gapSkills - Skills user is missing
 * @property {string[]} bonusSkills - Additional relevant skills user has
 * @property {string} matchLevel - 'excellent' | 'good' | 'fair' | 'needs-development'
 * @property {string} recommendation - Personalized recommendation text
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} name
 * @property {string} major
 * @property {string[]} interests
 * @property {string[]} currentSkills
 * @property {string} experienceLevel
 * @property {string} graduationTimeline
 * @property {string} location
 * @property {Object} constraints
 * @property {string[]} targetRoles
 * @property {ResumeData} [resumeData] - Optional resume data
 */

/**
 * @typedef {Object} VideoGenerationRequest
 * @property {string} roleId - Role to explain
 * @property {string} userName - User's name
 * @property {string} experienceLevel - User's experience level
 * @property {string[]} currentSkills - User's current skills
 * @property {string} major - User's major/background
 */

/**
 * @typedef {Object} VideoGenerationResult
 * @property {string} status - 'pending' | 'processing' | 'ready' | 'failed'
 * @property {string} [videoUrl] - URL to video when ready
 * @property {string} [thumbnailUrl] - Video thumbnail
 * @property {number} [progress] - Progress percentage (0-100)
 * @property {string} [error] - Error message if failed
 * @property {string} requestId - Unique request identifier
 * @property {string} createdAt - ISO timestamp
 */

export const ExperienceLevels = {
  BEGINNER: 0,
  INTERMEDIATE: 1,
  ADVANCED: 2
}

export const MatchLevels = {
  EXCELLENT: { min: 80, label: 'Excellent Match', color: 'green' },
  GOOD: { min: 60, label: 'Good Match', color: 'blue' },
  FAIR: { min: 40, label: 'Fair Match', color: 'yellow' },
  NEEDS_DEVELOPMENT: { min: 0, label: 'Needs Development', color: 'orange' }
}
