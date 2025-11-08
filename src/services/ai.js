import OpenAI from 'openai'
import { USER_TYPES, getUserTypeConfig, getPhaseNameForUserType } from '../config/userTypes'

class AIService {
  constructor() {
    this.client = null
    this.demoMode = true
  }

  initialize(apiKey) {
    if (apiKey && apiKey.trim()) {
      this.client = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      })
      this.demoMode = false
      console.log('✅ AI Service: Real API mode enabled with key:', apiKey.substring(0, 10) + '...')
    } else {
      this.demoMode = true
      console.log('⚠️ AI Service: Demo mode enabled (no API key)')
    }
  }

  async generateRoadmap(profile) {
    if (this.demoMode) {
      return this.generateMockRoadmap(profile)
    }

    // Get user type configuration
    const userType = profile.userType || USER_TYPES.STUDENT
    const config = getUserTypeConfig(userType)

    // Determine primary focus role
    const focusRole = profile.focusRole || profile.targetRoles?.[0] || 'Software Engineer'

    // Build user type-specific system prompt
    const systemPrompt = this.buildSystemPrompt(userType, config)

    // Build user type-specific user prompt
    const userPrompt = this.buildUserPrompt(profile, userType, config, focusRole)

    try {
      console.log('🤖 Calling OpenAI API for roadmap generation...')
      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      })

      const content = response.choices[0].message.content
      console.log('✅ OpenAI API call successful! Tokens used:', response.usage)
      return JSON.parse(content)
    } catch (error) {
      console.error('❌ OpenAI API Error:', error)
      console.log('⚠️ Falling back to demo mode')
      return this.generateMockRoadmap(profile)
    }
  }

  /**
   * Simple chat method for general AI calls (resume parsing, role matching, etc.)
   * @param {Array} messages - Array of message objects with role and content
   * @returns {Promise<string>} - AI response content
   */
  /**
   * Build system prompt based on user type
   * @param {string} userType - User type (student/professional/other)
   * @param {Object} config - User type configuration
   * @returns {string} - System prompt
   */
  buildSystemPrompt(userType, config) {
    const { tone, context, timeframeLanguage, goalOrientation } = config.promptModifiers

    let basePrompt = `You are LaunchPad AI, a career advisor. Generate a detailed, personalized career roadmap. Return ONLY valid JSON with no additional text.

The JSON should have this structure:
{
  "tracks": ["array of target roles"],
  "phases": [{
    "id": "phase-1",
    "name": "Phase name",
    "timeline": "e.g., ${timeframeLanguage === 'semesters, academic years' ? 'Semester 1 or Fall 2024' : 'Phase 1: 1-2 months'}",
    "milestones": [{
      "id": "milestone-1",
      "name": "Milestone name",
      "description": "What to do",
      "skills": ["skills to learn"],
      "projects": ["project ideas"],
      "resources": ["learning resources"],
      "status": "not_started",
      "sponsorTags": ["relevant sponsors"]
    }]
  }]
}`

    if (userType === USER_TYPES.STUDENT) {
      basePrompt += `\n\nUSER CONTEXT: You are advising a ${context}.
TONE: ${tone}
TIMELINE FORMAT: Use ${timeframeLanguage} (e.g., "Semester 1", "Semester 2", "Fall 2024", "Spring 2025")
FOCUS: ${goalOrientation}
RECOMMENDATIONS: Emphasize campus resources, foundational skills, internships, academic projects, and student-friendly certifications.`
    } else if (userType === USER_TYPES.PROFESSIONAL) {
      basePrompt += `\n\nUSER CONTEXT: You are advising a ${context}.
TONE: ${tone}
TIMELINE FORMAT: Use ${timeframeLanguage} with descriptive phases (e.g., "Phase 1: Assess & Plan (1-2 months)", "Phase 2: Skill Acquisition (2-4 months)")
FOCUS: ${goalOrientation}
RECOMMENDATIONS: Emphasize professional certifications, advanced courses, portfolio refinement, networking, and career transition strategies.`
    } else {
      basePrompt += `\n\nUSER CONTEXT: You are advising a ${context}.
TONE: ${tone}
TIMELINE FORMAT: Use ${timeframeLanguage} with flexible phases
FOCUS: ${goalOrientation}
RECOMMENDATIONS: Provide balanced, flexible approach suitable for self-directed learning.`
    }

    return basePrompt
  }

  /**
   * Build user prompt based on profile and user type
   * @param {Object} profile - User profile
   * @param {string} userType - User type
   * @param {Object} config - User type configuration
   * @param {string} focusRole - Primary focus role
   * @returns {string} - User prompt
   */
  buildUserPrompt(profile, userType, config, focusRole) {
    const { resourcePriorities, roadmapCharacteristics } = config

    let prompt = `Generate a career roadmap for:
${userType === USER_TYPES.PROFESSIONAL ? 'Current Role/Background' : 'Major'}: ${profile.major}
Interests: ${profile.interests.join(', ')}
Current Skills: ${profile.currentSkills.join(', ') || 'None listed'}
Experience Level: ${profile.experienceLevel}
${userType === USER_TYPES.STUDENT ? 'Graduation Timeline' : 'Availability'}: ${profile.graduationTimeline}
Location: ${profile.location || 'Not specified'}
PRIMARY FOCUS ROLE: ${focusRole} (This is the MAIN role they selected - optimize the roadmap for THIS role specifically!)
Other Interested Roles: ${profile.targetRoles?.join(', ') || 'None'}
Constraints: ${JSON.stringify(profile.constraints)}`

    if (userType === USER_TYPES.STUDENT) {
      prompt += `\n\nSTUDENT-SPECIFIC REQUIREMENTS:
- Use semester-based planning (${roadmapCharacteristics.typicalDuration})
- Consider academic calendar and course load
- Emphasize: ${roadmapCharacteristics.focusAreas.join(', ')}
- Prioritize resources: ${resourcePriorities.slice(0, 4).join('; ')}
- Include campus resources, study groups, and academic support
- Budget-conscious options (prefer free/student discounts)
- Internship preparation and interview practice`
    } else if (userType === USER_TYPES.PROFESSIONAL) {
      prompt += `\n\nPROFESSIONAL-SPECIFIC REQUIREMENTS:
- Use phase-based planning (${roadmapCharacteristics.typicalDuration})
- Consider full-time work commitments
- Emphasize: ${roadmapCharacteristics.focusAreas.join(', ')}
- Prioritize resources: ${resourcePriorities.slice(0, 4).join('; ')}
- Focus on high-ROI certifications and programs
- Include networking and personal branding
- Career transition strategies and portfolio refinement`
    } else {
      prompt += `\n\nFLEXIBLE REQUIREMENTS:
- Use adaptive phase-based planning
- Self-paced and flexible timeline
- Emphasize: ${roadmapCharacteristics.focusAreas.join(', ')}
- Mix of free and paid resources
- Community-driven learning`
    }

    prompt += `\n\nIMPORTANT: Create a roadmap specifically tailored for becoming a ${focusRole}. All milestones, projects, and skills should directly support this career path.

Create 3-4 phases with 2-4 milestones each. Be specific and actionable.`

    return prompt
  }

  async chat(messages) {
    if (this.demoMode) {
      return this.generateMockChatResponse(messages[messages.length - 1].content)
    }

    if (!this.client) {
      throw new Error('AI Service not initialized. Call initialize() first.')
    }

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: messages,
        temperature: 0.7,
      })

      return response.choices[0].message.content
    } catch (error) {
      console.error('❌ OpenAI API Error:', error)
      throw error
    }
  }

  async chatResponse(messages, context) {
    if (this.demoMode) {
      return this.generateMockChatResponse(messages[messages.length - 1].content)
    }

    // Get user type from profile
    const userType = context?.profile?.userType || USER_TYPES.STUDENT
    const config = getUserTypeConfig(userType)
    const { tone, goalOrientation } = config.promptModifiers

    // Build user type-specific system prompt
    let systemPrompt = `You are LaunchPad AI, a friendly career advisor. `

    if (userType === USER_TYPES.STUDENT) {
      systemPrompt += `You help students with:
- Career advice and role explanations
- Academic planning and skill recommendations
- Internship preparation and interview practice
- Roadmap adjustments for balancing coursework and career prep
- Campus resources and student-friendly opportunities

Tone: ${tone}
Context: You are advising a student (${context?.profile?.experienceLevel || 'beginner'} level) pursuing ${context?.profile?.major || 'tech career'}.
Focus: ${goalOrientation}`
    } else if (userType === USER_TYPES.PROFESSIONAL) {
      systemPrompt += `You help working professionals with:
- Career transition strategies and skill development
- Professional certifications and advanced courses
- Portfolio refinement and personal branding
- Roadmap adjustments for balancing work and upskilling
- Networking and job search strategies

Tone: ${tone}
Context: You are advising a working professional (${context?.profile?.experienceLevel || 'mid-level'}) transitioning to ${context?.profile?.focusRole || 'new role'}.
Focus: ${goalOrientation}`
    } else {
      systemPrompt += `You help learners with:
- Self-directed learning strategies
- Skill development and portfolio building
- Flexible roadmap planning
- Career exploration and goal setting
- Resource recommendations for independent learners

Tone: ${tone}
Context: You are advising a self-directed learner exploring ${context?.profile?.major || 'tech careers'}.
Focus: ${goalOrientation}`
    }

    systemPrompt += `\n\nContext about the user:
${JSON.stringify(context, null, 2)}

Be conversational, encouraging, and specific. Reference their roadmap when relevant. Tailor advice to their experience level and user type.`

    try {
      console.log('🤖 Calling OpenAI API for chat response...')
      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.8,
      })

      console.log('✅ OpenAI API call successful! Tokens used:', response.usage)
      return response.choices[0].message.content
    } catch (error) {
      console.error('❌ OpenAI API Error:', error)
      return "I'm having trouble connecting right now. Please check your API key in settings or enable demo mode."
    }
  }

  async generateInterviewQuestions(role, company) {
    if (this.demoMode) {
      return this.generateMockInterviewQuestions(role)
    }

    const prompt = `Generate 6 realistic interview questions for a ${role} intern position${company ? ` at ${company}` : ''}.
Include a mix of:
- 2 behavioral questions
- 2 technical/role-specific questions
- 2 situational questions

Return as a JSON array of strings.`

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      })

      const content = response.choices[0].message.content
      return JSON.parse(content)
    } catch (error) {
      console.error('AI Error:', error)
      return this.generateMockInterviewQuestions(role)
    }
  }

  async evaluateAnswer(question, answer) {
    if (this.demoMode) {
      return this.generateMockEvaluation(answer)
    }

    const prompt = `Evaluate this interview answer:
Question: ${question}
Answer: ${answer}

Provide:
1. Score (0-100)
2. Brief feedback (2-3 sentences)
3. 2-3 specific improvement suggestions

Return as JSON:
{
  "score": number,
  "feedback": "string",
  "improvements": ["string", "string", "string"]
}`

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      })

      const content = response.choices[0].message.content
      return JSON.parse(content)
    } catch (error) {
      console.error('AI Error:', error)
      return this.generateMockEvaluation(answer)
    }
  }

  // Mock responses for demo mode
  generateMockRoadmap(profile) {
    const userType = profile.userType || USER_TYPES.STUDENT
    const config = getUserTypeConfig(userType)
    const targetRole = profile.focusRole || profile.targetRoles?.[0] || 'SWE'

    // Generate phases based on user type
    if (userType === USER_TYPES.STUDENT) {
      return this.generateStudentMockRoadmap(targetRole, profile)
    } else if (userType === USER_TYPES.PROFESSIONAL) {
      return this.generateProfessionalMockRoadmap(targetRole, profile)
    } else {
      return this.generateFlexibleMockRoadmap(targetRole, profile)
    }
  }

  // Student-specific mock roadmap
  generateStudentMockRoadmap(targetRole, profile) {
    return {
      tracks: [targetRole],
      phases: [
        {
          id: 'phase-1',
          name: 'Semester 1: Foundation Building',
          timeline: 'Fall 2024 (Current)',
          milestones: [
            {
              id: 'milestone-1',
              name: 'Master Core Programming',
              description: 'Build strong fundamentals in data structures, algorithms, and problem-solving',
              skills: ['Data Structures', 'Algorithms', 'Problem Solving'],
              projects: ['LeetCode/HackerRank practice', 'Build a personal portfolio website'],
              resources: ['freeCodeCamp', 'CS50 by Harvard'],
              status: 'not_started',
              sponsorTags: []
            },
            {
              id: 'milestone-2',
              name: 'Learn Version Control',
              description: 'Master Git and GitHub for collaboration',
              skills: ['Git', 'GitHub', 'Collaboration'],
              projects: ['Create GitHub profile', 'Contribute to open source'],
              resources: ['GitHub Learning Lab', 'Git documentation'],
              status: 'not_started',
              sponsorTags: []
            }
          ]
        },
        {
          id: 'phase-2',
          name: 'Skill Specialization',
          timeline: 'Semester 2',
          milestones: [
            {
              id: 'milestone-3',
              name: 'Build Real Projects',
              description: 'Create portfolio projects that demonstrate your skills',
              skills: ['Full-stack Development', 'APIs', 'Databases'],
              projects: ['Build a CRUD application', 'Deploy to cloud platform'],
              resources: ['The Odin Project', 'freeCodeCamp projects'],
              status: 'not_started',
              sponsorTags: ['Fidelity', 'McDonald\'s']
            },
            {
              id: 'milestone-4',
              name: 'Get Certified',
              description: 'Earn industry-recognized certifications',
              skills: ['Cloud Computing', 'Professional Development'],
              projects: ['AWS Cloud Practitioner prep', 'Complete online courses'],
              resources: ['AWS Training', 'Coursera'],
              status: 'not_started',
              sponsorTags: ['Verizon', 'Fidelity']
            }
          ]
        },
        {
          id: 'phase-3',
          name: 'Career Preparation',
          timeline: 'Summer',
          milestones: [
            {
              id: 'milestone-5',
              name: 'Interview Prep',
              description: 'Practice technical and behavioral interviews',
              skills: ['Technical Interviews', 'Communication', 'Problem Solving'],
              projects: ['Mock interviews', '100+ coding problems'],
              resources: ['Cracking the Coding Interview', 'Pramp'],
              status: 'not_started',
              sponsorTags: []
            },
            {
              id: 'milestone-6',
              name: 'Apply to Internships',
              description: 'Target roles at sponsor companies and beyond',
              skills: ['Resume Building', 'Networking', 'Applications'],
              projects: ['Attend career fairs', 'Network on LinkedIn'],
              resources: ['LaunchPad Opportunities', 'LinkedIn'],
              status: 'not_started',
              sponsorTags: ['Fidelity', 'PepsiCo', 'Verizon', 'McDonald\'s']
            }
          ]
        }
      ]
    }
  }

  // Professional-specific mock roadmap
  generateProfessionalMockRoadmap(targetRole, profile) {
    return {
      tracks: [targetRole],
      phases: [
        {
          id: 'phase-1',
          name: 'Phase 1: Assess & Plan',
          timeline: '1-2 months',
          milestones: [
            {
              id: 'milestone-1',
              name: 'Skills Gap Analysis',
              description: 'Identify gaps between current skills and target role requirements',
              skills: ['Self-assessment', 'Market Research'],
              projects: ['Analyze job postings', 'Create skill matrix'],
              resources: ['LinkedIn Learning', 'Industry reports'],
              status: 'not_started',
              sponsorTags: []
            },
            {
              id: 'milestone-2',
              name: 'Build Learning Plan',
              description: 'Create a structured learning roadmap based on identified gaps',
              skills: ['Goal Setting', 'Time Management'],
              projects: ['Define learning objectives', 'Schedule study blocks'],
              resources: ['Coursera', 'Udacity'],
              status: 'not_started',
              sponsorTags: []
            }
          ]
        },
        {
          id: 'phase-2',
          name: 'Phase 2: Skill Acquisition',
          timeline: '2-4 months',
          milestones: [
            {
              id: 'milestone-3',
              name: 'Earn Professional Certifications',
              description: 'Complete industry-recognized certifications',
              skills: ['AWS', 'Azure', 'Cloud Architecture'],
              projects: ['AWS Solutions Architect', 'Complete certification exam'],
              resources: ['A Cloud Guru', 'Linux Academy'],
              status: 'not_started',
              sponsorTags: ['Verizon', 'Fidelity']
            },
            {
              id: 'milestone-4',
              name: 'Advanced Technical Skills',
              description: 'Deep dive into specialized technologies',
              skills: ['Microservices', 'DevOps', 'System Design'],
              projects: ['Build production-grade system', 'Deploy scalable architecture'],
              resources: ['System Design Primer', 'Designing Data-Intensive Applications'],
              status: 'not_started',
              sponsorTags: []
            }
          ]
        },
        {
          id: 'phase-3',
          name: 'Phase 3: Build Proof of Expertise',
          timeline: '2-3 months',
          milestones: [
            {
              id: 'milestone-5',
              name: 'Portfolio Refinement',
              description: 'Create advanced portfolio showcasing expertise',
              skills: ['Technical Writing', 'Presentation', 'Documentation'],
              projects: ['Open source contributions', 'Technical blog posts', 'Conference talks'],
              resources: ['Dev.to', 'Medium', 'GitHub'],
              status: 'not_started',
              sponsorTags: []
            },
            {
              id: 'milestone-6',
              name: 'Professional Networking',
              description: 'Build industry connections and personal brand',
              skills: ['Networking', 'Personal Branding', 'LinkedIn Optimization'],
              projects: ['Attend tech meetups', 'Connect with recruiters', 'Update LinkedIn'],
              resources: ['LinkedIn', 'Meetup.com', 'Tech conferences'],
              status: 'not_started',
              sponsorTags: []
            }
          ]
        },
        {
          id: 'phase-4',
          name: 'Phase 4: Transition & Apply',
          timeline: '1-3 months',
          milestones: [
            {
              id: 'milestone-7',
              name: 'Job Search Strategy',
              description: 'Systematic approach to finding and applying for roles',
              skills: ['Resume Optimization', 'Interview Skills', 'Negotiation'],
              projects: ['Tailor resume for target roles', 'Practice STAR method', 'Salary research'],
              resources: ['Pramp', 'Blind', 'Levels.fyi'],
              status: 'not_started',
              sponsorTags: ['Fidelity', 'PepsiCo', 'Verizon']
            }
          ]
        }
      ]
    }
  }

  // Flexible mock roadmap for "Other" user type
  generateFlexibleMockRoadmap(targetRole, profile) {
    return {
      tracks: [targetRole],
      phases: [
        {
          id: 'phase-1',
          name: 'Phase 1: Foundation',
          timeline: 'Flexible (2-4 months)',
          milestones: [
            {
              id: 'milestone-1',
              name: 'Learn Core Skills',
              description: 'Build foundational technical skills at your own pace',
              skills: ['Programming Fundamentals', 'Version Control', 'Problem Solving'],
              projects: ['Complete online courses', 'Build simple projects'],
              resources: ['freeCodeCamp', 'The Odin Project', 'Codecademy'],
              status: 'not_started',
              sponsorTags: []
            },
            {
              id: 'milestone-2',
              name: 'Hands-on Practice',
              description: 'Apply skills through practical projects',
              skills: ['Web Development', 'APIs', 'Databases'],
              projects: ['Personal website', 'Portfolio project'],
              resources: ['YouTube tutorials', 'MDN Web Docs'],
              status: 'not_started',
              sponsorTags: []
            }
          ]
        },
        {
          id: 'phase-2',
          name: 'Phase 2: Skill Development',
          timeline: 'Flexible (3-6 months)',
          milestones: [
            {
              id: 'milestone-3',
              name: 'Specialized Learning',
              description: 'Focus on technologies relevant to your target role',
              skills: ['Framework Mastery', 'Best Practices', 'Testing'],
              projects: ['Advanced project', 'Open source contribution'],
              resources: ['Coursera', 'Udemy', 'Pluralsight'],
              status: 'not_started',
              sponsorTags: []
            },
            {
              id: 'milestone-4',
              name: 'Portfolio Building',
              description: 'Create a portfolio showcasing your work',
              skills: ['Documentation', 'GitHub', 'Presentation'],
              projects: ['3-5 portfolio projects', 'GitHub profile'],
              resources: ['GitHub Pages', 'Dev.to'],
              status: 'not_started',
              sponsorTags: []
            }
          ]
        },
        {
          id: 'phase-3',
          name: 'Phase 3: Career Ready',
          timeline: 'Flexible (2-4 months)',
          milestones: [
            {
              id: 'milestone-5',
              name: 'Interview Preparation',
              description: 'Prepare for technical interviews and applications',
              skills: ['Technical Interviews', 'System Design', 'Communication'],
              projects: ['LeetCode practice', 'Mock interviews'],
              resources: ['Cracking the Coding Interview', 'InterviewCake'],
              status: 'not_started',
              sponsorTags: []
            },
            {
              id: 'milestone-6',
              name: 'Job Search',
              description: 'Apply to roles and build professional network',
              skills: ['Resume Writing', 'Networking', 'Applications'],
              projects: ['Optimize resume', 'Connect on LinkedIn', 'Apply to jobs'],
              resources: ['LinkedIn', 'Indeed', 'AngelList'],
              status: 'not_started',
              sponsorTags: []
            }
          ]
        }
      ]
    }
  }

  generateMockChatResponse(userMessage) {
    const responses = {
      'what should i': 'Based on your roadmap, I recommend focusing on your current milestone: building core programming skills. Start with data structures and algorithms, as they\'re fundamental for tech interviews. Would you like specific resource recommendations?',
      'difference between': 'Great question! A Data Analyst typically focuses on analyzing existing data to derive insights using SQL, Excel, and visualization tools. A Data Scientist builds predictive models and uses machine learning. Both are excellent career paths with lots of demand!',
      'only 5 hours': 'Absolutely! Let\'s adjust your roadmap to be more realistic. With 5 hours per week, I recommend focusing on one skill at a time. We can extend your timeline and prioritize the most impactful activities. Would you like me to suggest a modified schedule?',
      'default': 'I\'m here to help with your career journey! You can ask me about specific roles, skills to learn, how to adjust your roadmap, or anything else about your tech career path.'
    }

    const lowerMessage = userMessage.toLowerCase()
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response
      }
    }
    return responses.default
  }

  generateMockInterviewQuestions(role) {
    const questions = {
      'SWE': [
        'Tell me about a challenging coding project you worked on and how you approached it.',
        'Explain the difference between a stack and a queue, and give examples of when to use each.',
        'How would you debug a program that\'s running slowly?',
        'Describe a time you had to learn a new technology quickly. How did you approach it?',
        'How would you explain APIs to someone non-technical?',
        'Walk me through how you would design a simple e-commerce shopping cart.'
      ],
      'Data': [
        'Tell me about a time you used data to solve a problem or make a decision.',
        'How would you handle missing or inconsistent data in a dataset?',
        'Explain the difference between correlation and causation.',
        'Describe a data analysis project you\'ve worked on. What tools did you use?',
        'How would you present complex data findings to a non-technical audience?',
        'What metrics would you track for a mobile app, and why?'
      ],
      'default': [
        'Tell me about yourself and why you\'re interested in this role.',
        'Describe a challenging situation you faced and how you handled it.',
        'Where do you see yourself in 3-5 years?',
        'Tell me about a time you worked in a team. What was your role?',
        'What are your greatest strengths and areas for improvement?',
        'Why do you want to work at our company?'
      ]
    }

    return questions[role] || questions.default
  }

  generateMockEvaluation(answer) {
    const wordCount = answer.split(' ').length
    let score = 50

    if (wordCount > 30) score += 20
    if (wordCount > 60) score += 10
    if (answer.includes('example') || answer.includes('experience')) score += 10
    if (answer.includes('result') || answer.includes('learned')) score += 10

    return {
      score: Math.min(score, 95),
      feedback: wordCount < 20
        ? 'Your answer is quite brief. Try to provide more detail and specific examples.'
        : 'Good response! You provided relevant information. Consider adding more specific examples to strengthen your answer.',
      improvements: [
        'Use the STAR method (Situation, Task, Action, Result) to structure your response',
        'Include specific metrics or outcomes when possible',
        'Connect your experience to the role requirements'
      ]
    }
  }
}

export const aiService = new AIService()
