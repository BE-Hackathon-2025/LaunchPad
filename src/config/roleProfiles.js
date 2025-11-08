/**
 * Role Profiles Configuration
 * Defines canonical tech roles with requirements and characteristics
 */

import { ExperienceLevels } from '../types/careerMatching'

export const roleProfiles = {
  'software-engineer': {
    id: 'software-engineer',
    name: 'Software Engineer',
    summary: 'Build scalable software systems solving real-world problems',
    description: 'Software Engineers design, develop, test, and maintain software applications. They work across the full development lifecycle, collaborating with cross-functional teams to deliver high-quality software solutions.',
    requiredSkills: ['programming', 'data structures', 'algorithms', 'git', 'debugging'],
    preferredSkills: ['java', 'python', 'c++', 'javascript', 'sql', 'testing', 'agile'],
    typicalTools: ['git', 'jira', 'vscode', 'docker', 'ci/cd'],
    typicalStack: 'Varies by company - could be Java/Spring, Python/Django, or JavaScript/Node.js',
    responsibilities: [
      'Write clean, maintainable code',
      'Design system architectures',
      'Debug and optimize existing systems',
      'Collaborate with product and design teams',
      'Participate in code reviews',
      'Write technical documentation'
    ],
    exampleProjects: [
      'Build a scalable REST API',
      'Develop microservices architecture',
      'Create automated testing frameworks',
      'Optimize database queries and system performance'
    ],
    careerTrajectory: 'Junior SWE → Mid-level SWE → Senior SWE → Staff/Principal Engineer → Engineering Manager/Architect',
    minExperienceLevel: ExperienceLevels.BEGINNER,
    relatedRoles: ['frontend-engineer', 'backend-engineer', 'full-stack-engineer']
  },

  'frontend-engineer': {
    id: 'frontend-engineer',
    name: 'Frontend Engineer',
    summary: 'Create engaging user interfaces and exceptional user experiences',
    description: 'Frontend Engineers build the visual and interactive elements of web and mobile applications. They focus on user experience, responsive design, and performance optimization.',
    requiredSkills: ['html', 'css', 'javascript', 'responsive design', 'git'],
    preferredSkills: ['react', 'vue', 'typescript', 'tailwind', 'webpack', 'figma', 'accessibility'],
    typicalTools: ['vscode', 'figma', 'chrome devtools', 'git', 'npm'],
    typicalStack: 'React/Vue/Angular + TypeScript + CSS frameworks + REST APIs',
    responsibilities: [
      'Build responsive user interfaces',
      'Implement designs from mockups',
      'Optimize for performance and accessibility',
      'Integrate with backend APIs',
      'Ensure cross-browser compatibility',
      'Write component tests'
    ],
    exampleProjects: [
      'Build a responsive e-commerce site',
      'Create a design system and component library',
      'Develop an interactive data dashboard',
      'Optimize web vitals and page load times'
    ],
    careerTrajectory: 'Junior Frontend → Mid-level → Senior Frontend → Lead Frontend → Frontend Architect',
    minExperienceLevel: ExperienceLevels.BEGINNER,
    relatedRoles: ['full-stack-engineer', 'ux-engineer', 'software-engineer']
  },

  'backend-engineer': {
    id: 'backend-engineer',
    name: 'Backend Engineer',
    summary: 'Build robust server-side systems and APIs',
    description: 'Backend Engineers develop server-side logic, databases, and APIs. They ensure applications are scalable, secure, and performant.',
    requiredSkills: ['programming', 'databases', 'apis', 'sql', 'git'],
    preferredSkills: ['node.js', 'python', 'java', 'postgresql', 'redis', 'docker', 'aws', 'microservices'],
    typicalTools: ['postman', 'docker', 'sql client', 'aws/gcp', 'monitoring tools'],
    typicalStack: 'Node.js/Python/Java + PostgreSQL/MongoDB + Docker + AWS/Azure',
    responsibilities: [
      'Design and implement APIs',
      'Manage database schemas and queries',
      'Build authentication and authorization systems',
      'Optimize server performance',
      'Implement caching strategies',
      'Write API documentation'
    ],
    exampleProjects: [
      'Build a RESTful API with auth',
      'Design a scalable microservices architecture',
      'Implement real-time data processing pipelines',
      'Create database migration and backup systems'
    ],
    careerTrajectory: 'Junior Backend → Mid-level → Senior Backend → Staff Engineer → Backend Architect',
    minExperienceLevel: ExperienceLevels.BEGINNER,
    relatedRoles: ['full-stack-engineer', 'devops-engineer', 'software-engineer']
  },

  'full-stack-engineer': {
    id: 'full-stack-engineer',
    name: 'Full-Stack Engineer',
    summary: 'Work across the entire application stack from UI to database',
    description: 'Full-Stack Engineers handle both frontend and backend development. They build complete features end-to-end and understand the full application architecture.',
    requiredSkills: ['html', 'css', 'javascript', 'databases', 'apis', 'git'],
    preferredSkills: ['react', 'node.js', 'typescript', 'postgresql', 'docker', 'aws', 'testing'],
    typicalTools: ['vscode', 'postman', 'docker', 'git', 'database client'],
    typicalStack: 'React/Next.js + Node.js/Express + PostgreSQL + Docker + Cloud platform',
    responsibilities: [
      'Build features across frontend and backend',
      'Design database schemas',
      'Create and consume APIs',
      'Deploy and monitor applications',
      'Implement security best practices',
      'Mentor junior developers'
    ],
    exampleProjects: [
      'Build a full-stack web application',
      'Create an e-commerce platform',
      'Develop a SaaS application with billing',
      'Build a real-time collaboration tool'
    ],
    careerTrajectory: 'Full-Stack Developer → Senior Full-Stack → Technical Lead → Engineering Manager',
    minExperienceLevel: ExperienceLevels.INTERMEDIATE,
    relatedRoles: ['frontend-engineer', 'backend-engineer', 'software-engineer']
  },

  'data-scientist': {
    id: 'data-scientist',
    name: 'Data Scientist',
    summary: 'Extract insights from data using statistics and machine learning',
    description: 'Data Scientists analyze complex data sets to inform business decisions. They build predictive models, conduct statistical analyses, and communicate findings to stakeholders.',
    requiredSkills: ['python', 'statistics', 'sql', 'data analysis', 'machine learning'],
    preferredSkills: ['pandas', 'numpy', 'scikit-learn', 'tensorflow', 'jupyter', 'r', 'tableau', 'a/b testing'],
    typicalTools: ['jupyter', 'python', 'sql', 'tableau', 'git'],
    typicalStack: 'Python + Pandas/NumPy + Scikit-learn/TensorFlow + SQL + Visualization tools',
    responsibilities: [
      'Analyze large datasets',
      'Build predictive models',
      'Design experiments and A/B tests',
      'Create data visualizations',
      'Communicate findings to stakeholders',
      'Deploy ML models to production'
    ],
    exampleProjects: [
      'Build a customer churn prediction model',
      'Create a recommendation system',
      'Analyze user behavior patterns',
      'Develop a time series forecasting model'
    ],
    careerTrajectory: 'Junior Data Scientist → Data Scientist → Senior Data Scientist → Lead DS → Principal Data Scientist',
    minExperienceLevel: ExperienceLevels.INTERMEDIATE,
    relatedRoles: ['ml-engineer', 'data-analyst', 'data-engineer']
  },

  'data-analyst': {
    id: 'data-analyst',
    name: 'Data Analyst',
    summary: 'Turn data into actionable business insights',
    description: 'Data Analysts collect, process, and analyze data to help organizations make informed decisions. They create reports, dashboards, and visualizations.',
    requiredSkills: ['sql', 'excel', 'data analysis', 'data visualization'],
    preferredSkills: ['python', 'tableau', 'power bi', 'statistics', 'r', 'business intelligence'],
    typicalTools: ['excel', 'tableau', 'sql', 'python', 'power bi'],
    typicalStack: 'SQL + Python/R + Tableau/Power BI + Excel',
    responsibilities: [
      'Query and analyze data from databases',
      'Create dashboards and reports',
      'Identify trends and patterns',
      'Support business decision-making',
      'Clean and prepare data',
      'Present findings to stakeholders'
    ],
    exampleProjects: [
      'Build executive dashboards',
      'Analyze sales and marketing performance',
      'Create customer segmentation analyses',
      'Develop KPI tracking systems'
    ],
    careerTrajectory: 'Junior Analyst → Data Analyst → Senior Data Analyst → Analytics Manager → Director of Analytics',
    minExperienceLevel: ExperienceLevels.BEGINNER,
    relatedRoles: ['data-scientist', 'business-intelligence-analyst', 'data-engineer']
  },

  'ml-engineer': {
    id: 'ml-engineer',
    name: 'Machine Learning Engineer',
    summary: 'Build and deploy production machine learning systems',
    description: 'ML Engineers design, build, and deploy machine learning models at scale. They bridge the gap between data science and software engineering.',
    requiredSkills: ['python', 'machine learning', 'deep learning', 'programming', 'mathematics'],
    preferredSkills: ['tensorflow', 'pytorch', 'scikit-learn', 'docker', 'kubernetes', 'aws', 'mlops'],
    typicalTools: ['python', 'jupyter', 'docker', 'git', 'cloud platforms', 'ml frameworks'],
    typicalStack: 'Python + TensorFlow/PyTorch + Docker + Kubernetes + Cloud ML services',
    responsibilities: [
      'Design ML model architectures',
      'Train and optimize models',
      'Deploy models to production',
      'Build ML pipelines',
      'Monitor model performance',
      'Implement MLOps practices'
    ],
    exampleProjects: [
      'Build a real-time fraud detection system',
      'Create a computer vision application',
      'Develop NLP models for text analysis',
      'Implement recommendation engines'
    ],
    careerTrajectory: 'ML Engineer → Senior ML Engineer → Staff ML Engineer → ML Architect',
    minExperienceLevel: ExperienceLevels.INTERMEDIATE,
    relatedRoles: ['data-scientist', 'ai-researcher', 'software-engineer']
  },

  'devops-engineer': {
    id: 'devops-engineer',
    name: 'DevOps/Cloud Engineer',
    summary: 'Automate infrastructure and streamline software deployment',
    description: 'DevOps Engineers build and maintain the infrastructure and tools that enable rapid, reliable software delivery. They focus on automation, monitoring, and scalability.',
    requiredSkills: ['linux', 'networking', 'scripting', 'ci/cd', 'cloud platforms'],
    preferredSkills: ['docker', 'kubernetes', 'terraform', 'aws', 'jenkins', 'python', 'bash', 'monitoring'],
    typicalTools: ['terraform', 'docker', 'kubernetes', 'jenkins', 'aws/azure/gcp', 'monitoring tools'],
    typicalStack: 'Cloud platforms + Docker + Kubernetes + Terraform + CI/CD tools',
    responsibilities: [
      'Manage cloud infrastructure',
      'Build CI/CD pipelines',
      'Automate deployment processes',
      'Monitor system performance',
      'Ensure security and compliance',
      'Optimize costs and scalability'
    ],
    exampleProjects: [
      'Build automated deployment pipelines',
      'Implement infrastructure as code',
      'Create monitoring and alerting systems',
      'Migrate applications to cloud'
    ],
    careerTrajectory: 'DevOps Engineer → Senior DevOps → Platform Engineer → SRE → Infrastructure Architect',
    minExperienceLevel: ExperienceLevels.INTERMEDIATE,
    relatedRoles: ['site-reliability-engineer', 'cloud-architect', 'backend-engineer']
  },

  'cybersecurity-analyst': {
    id: 'cybersecurity-analyst',
    name: 'Cybersecurity Analyst',
    summary: 'Protect systems and data from security threats',
    description: 'Cybersecurity Analysts monitor, detect, and respond to security threats. They implement security measures and ensure compliance with security policies.',
    requiredSkills: ['networking', 'security fundamentals', 'linux', 'incident response'],
    preferredSkills: ['python', 'security tools', 'siem', 'penetration testing', 'security+', 'cryptography'],
    typicalTools: ['siem tools', 'wireshark', 'metasploit', 'burp suite', 'security scanners'],
    typicalStack: 'Security tools + Python/Bash + SIEM platforms + Cloud security services',
    responsibilities: [
      'Monitor security alerts',
      'Investigate security incidents',
      'Conduct vulnerability assessments',
      'Implement security controls',
      'Develop security policies',
      'Provide security training'
    ],
    exampleProjects: [
      'Build security monitoring systems',
      'Conduct penetration testing',
      'Implement zero-trust architecture',
      'Develop incident response playbooks'
    ],
    careerTrajectory: 'Security Analyst → Senior Security Analyst → Security Engineer → Security Architect → CISO',
    minExperienceLevel: ExperienceLevels.BEGINNER,
    relatedRoles: ['penetration-tester', 'security-engineer', 'compliance-analyst']
  },

  'product-manager': {
    id: 'product-manager',
    name: 'Product Manager',
    summary: 'Drive product strategy and deliver customer value',
    description: 'Product Managers define product vision, strategy, and roadmap. They work with engineering, design, and stakeholders to build products customers love.',
    requiredSkills: ['product strategy', 'communication', 'data analysis', 'agile', 'user research'],
    preferredSkills: ['sql', 'jira', 'figma', 'analytics tools', 'a/b testing', 'technical writing'],
    typicalTools: ['jira', 'figma', 'analytics tools', 'sql', 'presentation software'],
    typicalStack: 'Product management tools + Analytics platforms + Collaboration tools',
    responsibilities: [
      'Define product vision and strategy',
      'Prioritize product backlog',
      'Work with engineering and design',
      'Conduct user research',
      'Analyze product metrics',
      'Communicate with stakeholders'
    ],
    exampleProjects: [
      'Launch a new product feature',
      'Redesign user onboarding flow',
      'Define product roadmap',
      'Conduct competitive analysis'
    ],
    careerTrajectory: 'Associate PM → Product Manager → Senior PM → Group PM → Director of Product → VP of Product',
    minExperienceLevel: ExperienceLevels.INTERMEDIATE,
    relatedRoles: ['technical-product-manager', 'product-owner', 'program-manager']
  }
}

/**
 * Get role profile by ID
 * @param {string} roleId - Role identifier
 * @returns {Object|null} - Role profile or null
 */
export function getRoleProfile(roleId) {
  return roleProfiles[roleId] || null
}

/**
 * Get all role profiles as an array
 * @returns {Array} - Array of role profiles
 */
export function getAllRoleProfiles() {
  return Object.values(roleProfiles)
}

/**
 * Search roles by skill
 * @param {string} skill - Skill to search for
 * @returns {Array} - Matching role profiles
 */
export function getRolesBySkill(skill) {
  const normalizedSkill = skill.toLowerCase()
  return getAllRoleProfiles().filter(role =>
    role.requiredSkills.some(s => s.toLowerCase().includes(normalizedSkill)) ||
    role.preferredSkills.some(s => s.toLowerCase().includes(normalizedSkill))
  )
}
