/**
 * Skills Taxonomy - Canonical mapping for skill normalization
 * Maps various skill name variations to canonical forms
 */

export const skillsTaxonomy = {
  // Programming Languages
  'javascript': ['js', 'javascript', 'ecmascript', 'es6', 'es2015'],
  'typescript': ['ts', 'typescript'],
  'python': ['python', 'python3', 'py'],
  'java': ['java', 'java se', 'java ee'],
  'c++': ['c++', 'cpp', 'cplusplus'],
  'c#': ['c#', 'csharp', 'c sharp'],
  'c': ['c', 'c programming'],
  'go': ['go', 'golang'],
  'rust': ['rust'],
  'ruby': ['ruby', 'rb'],
  'php': ['php'],
  'swift': ['swift'],
  'kotlin': ['kotlin'],
  'scala': ['scala'],
  'r': ['r', 'r programming'],
  'matlab': ['matlab'],
  'sql': ['sql', 'structured query language'],
  'html': ['html', 'html5'],
  'css': ['css', 'css3'],

  // Frontend Frameworks/Libraries
  'react': ['react', 'reactjs', 'react.js'],
  'vue': ['vue', 'vuejs', 'vue.js'],
  'angular': ['angular', 'angularjs'],
  'svelte': ['svelte'],
  'next.js': ['next', 'nextjs', 'next.js'],
  'nuxt': ['nuxt', 'nuxtjs'],
  'gatsby': ['gatsby', 'gatsbyjs'],

  // Backend Frameworks
  'node.js': ['node', 'nodejs', 'node.js'],
  'express': ['express', 'expressjs', 'express.js'],
  'django': ['django'],
  'flask': ['flask'],
  'fastapi': ['fastapi'],
  'spring': ['spring', 'spring boot', 'spring framework'],
  'asp.net': ['asp.net', 'aspnet', '.net'],
  'rails': ['rails', 'ruby on rails', 'ror'],

  // Databases
  'mongodb': ['mongodb', 'mongo'],
  'postgresql': ['postgresql', 'postgres', 'psql'],
  'mysql': ['mysql'],
  'redis': ['redis'],
  'dynamodb': ['dynamodb'],
  'firebase': ['firebase', 'firestore'],
  'sqlite': ['sqlite'],
  'cassandra': ['cassandra'],
  'elasticsearch': ['elasticsearch', 'elastic'],

  // Cloud & DevOps
  'aws': ['aws', 'amazon web services'],
  'azure': ['azure', 'microsoft azure'],
  'gcp': ['gcp', 'google cloud', 'google cloud platform'],
  'docker': ['docker'],
  'kubernetes': ['kubernetes', 'k8s'],
  'terraform': ['terraform'],
  'jenkins': ['jenkins'],
  'github actions': ['github actions', 'gh actions'],
  'ci/cd': ['ci/cd', 'cicd', 'continuous integration'],

  // Data Science & ML
  'tensorflow': ['tensorflow', 'tf'],
  'pytorch': ['pytorch', 'torch'],
  'scikit-learn': ['scikit-learn', 'sklearn', 'scikit learn'],
  'pandas': ['pandas'],
  'numpy': ['numpy'],
  'jupyter': ['jupyter', 'jupyter notebook'],
  'keras': ['keras'],
  'opencv': ['opencv', 'cv2'],

  // Tools & Platforms
  'git': ['git', 'version control'],
  'github': ['github'],
  'gitlab': ['gitlab'],
  'jira': ['jira'],
  'figma': ['figma'],
  'vscode': ['vscode', 'vs code', 'visual studio code'],
  'postman': ['postman'],
  'linux': ['linux', 'unix'],
  'bash': ['bash', 'shell'],

  // Testing
  'jest': ['jest'],
  'pytest': ['pytest'],
  'selenium': ['selenium'],
  'cypress': ['cypress'],
  'junit': ['junit'],

  // Soft Skills
  'agile': ['agile', 'scrum', 'kanban'],
  'leadership': ['leadership', 'team lead'],
  'communication': ['communication', 'collaboration'],
  'problem solving': ['problem solving', 'debugging'],
  'project management': ['project management', 'pm']
}

/**
 * Normalizes a skill name to its canonical form
 * @param {string} skill - Raw skill name
 * @returns {string|null} - Canonical skill name or null if not found
 */
export function normalizeSkill(skill) {
  if (!skill || typeof skill !== 'string') return null

  const normalized = skill.toLowerCase().trim()

  // Check if it's already canonical
  if (skillsTaxonomy[normalized]) {
    return normalized
  }

  // Search for the canonical form
  for (const [canonical, variations] of Object.entries(skillsTaxonomy)) {
    if (variations.includes(normalized)) {
      return canonical
    }
  }

  // If not found in taxonomy, return the normalized input
  // (allows for new/unknown skills to pass through)
  return normalized
}

/**
 * Normalizes an array of skills
 * @param {string[]} skills - Array of raw skill names
 * @returns {string[]} - Array of unique canonical skill names
 */
export function normalizeSkills(skills) {
  if (!Array.isArray(skills)) return []

  const normalized = skills
    .map(skill => normalizeSkill(skill))
    .filter(skill => skill !== null)

  // Return unique skills
  return [...new Set(normalized)]
}

/**
 * Gets all variations of a canonical skill
 * @param {string} canonicalSkill - Canonical skill name
 * @returns {string[]} - Array of all variations
 */
export function getSkillVariations(canonicalSkill) {
  return skillsTaxonomy[canonicalSkill?.toLowerCase()] || []
}
