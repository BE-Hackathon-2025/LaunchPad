/**
 * Resume Parsing Utility
 * Extracts structured data from resume text
 *
 * NOTE: This is a client-side implementation. For production, consider:
 * - Server-side processing for better PDF parsing
 * - Integration with specialized resume parsing APIs (e.g., Affinda, Sovren, HireAbility)
 * - OpenAI GPT-4 for intelligent extraction
 */

import { normalizeSkills } from '../config/skillsTaxonomy'
import { aiService } from '../services/ai'

/**
 * Extract text from PDF file (browser-based)
 * @param {File} file - PDF file
 * @returns {Promise<string>} - Extracted text
 */
export async function extractTextFromPDF(file) {
  // For production: Use pdf.js library or server-side processing
  // This is a placeholder that reads the file as text
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      // This is a simplified version. In production, use pdfjs-dist:
      // import * as pdfjsLib from 'pdfjs-dist'
      // const pdf = await pdfjsLib.getDocument(event.target.result).promise
      // Extract text from all pages

      resolve(event.target.result)
    }

    reader.onerror = (error) => reject(error)

    reader.readAsText(file)
  })
}

/**
 * Extract programming languages from text
 * @param {string} text - Resume text
 * @returns {string[]} - Extracted languages
 */
function extractProgrammingLanguages(text) {
  const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C\\+\\+', 'C#', 'Go', 'Rust',
    'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'SQL', 'HTML', 'CSS'
  ]

  const found = []
  const lowerText = text.toLowerCase()

  languages.forEach(lang => {
    const pattern = new RegExp(`\\b${lang.toLowerCase()}\\b`, 'i')
    if (pattern.test(lowerText)) {
      found.push(lang.replace(/\\\+/g, '+'))
    }
  })

  return found
}

/**
 * Extract frameworks and libraries from text
 * @param {string} text - Resume text
 * @returns {string[]} - Extracted frameworks
 */
function extractFrameworks(text) {
  const frameworks = [
    'React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt', 'Express',
    'Django', 'Flask', 'FastAPI', 'Spring', 'Rails', 'ASP.NET',
    'Node.js', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy'
  ]

  const found = []
  const lowerText = text.toLowerCase()

  frameworks.forEach(framework => {
    const pattern = new RegExp(`\\b${framework.toLowerCase().replace('.', '\\.')}\\b`, 'i')
    if (pattern.test(lowerText)) {
      found.push(framework)
    }
  })

  return found
}

/**
 * Extract tools and platforms from text
 * @param {string} text - Resume text
 * @returns {string[]} - Extracted tools
 */
function extractTools(text) {
  const tools = [
    'Git', 'GitHub', 'GitLab', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
    'Jenkins', 'Terraform', 'Ansible', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
    'Firebase', 'Figma', 'Jira', 'VS Code', 'Postman', 'Linux', 'Elasticsearch'
  ]

  const found = []
  const lowerText = text.toLowerCase()

  tools.forEach(tool => {
    const pattern = new RegExp(`\\b${tool.toLowerCase()}\\b`, 'i')
    if (pattern.test(lowerText)) {
      found.push(tool)
    }
  })

  return found
}

/**
 * Extract work experience entries
 * @param {string} text - Resume text
 * @returns {Array} - Work experience entries
 */
function extractExperiences(text) {
  const experiences = []

  // Common job title patterns
  const titlePatterns = [
    /(?:software|frontend|backend|full[- ]stack|data|ml|devops|security|web)\s+(?:engineer|developer|analyst|scientist)/gi,
    /(?:product|project|program)\s+manager/gi,
    /(?:senior|junior|lead|principal|staff)\s+(?:engineer|developer)/gi,
    /intern(?:ship)?/gi
  ]

  // Try to find experience sections
  const expSection = text.match(/experience\s*:?\s*(.*?)(?:education|projects|skills|$)/is)
  const workText = expSection ? expSection[1] : text

  titlePatterns.forEach(pattern => {
    const matches = workText.matchAll(pattern)
    for (const match of matches) {
      // Extract context around the title
      const startIndex = Math.max(0, match.index - 50)
      const endIndex = Math.min(workText.length, match.index + 300)
      const context = workText.substring(startIndex, endIndex)

      // Try to extract company name (words in title case after "at" or before title)
      const companyMatch = context.match(/at\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i)

      experiences.push({
        title: match[0],
        company: companyMatch ? companyMatch[1] : 'Company',
        duration: 'Duration not specified',
        responsibilities: [],
        technologies: []
      })
    }
  })

  return experiences.slice(0, 5) // Limit to 5 entries
}

/**
 * Extract project entries
 * @param {string} text - Resume text
 * @returns {Array} - Project entries
 */
function extractProjects(text) {
  const projects = []

  // Try to find projects section
  const projectSection = text.match(/projects?\s*:?\s*(.*?)(?:experience|education|skills|$)/is)

  if (projectSection) {
    // Look for bullet points or project names
    const bullets = projectSection[1].match(/[•\-\*]\s*(.+)/g)

    if (bullets && bullets.length > 0) {
      bullets.slice(0, 5).forEach(bullet => {
        const cleanText = bullet.replace(/^[•\-\*]\s*/, '').trim()
        const firstSentence = cleanText.split('.')[0]

        projects.push({
          name: firstSentence.length > 50 ? 'Project' : firstSentence,
          description: cleanText,
          technologies: [],
          url: null
        })
      })
    }
  }

  return projects
}

/**
 * Extract education entries
 * @param {string} text - Resume text
 * @returns {Array} - Education entries
 */
function extractEducation(text) {
  const education = []

  const degreePatterns = [
    /(?:bachelor|b\.?s\.?|b\.?a\.?|master|m\.?s\.?|m\.?a\.?|phd|doctorate)\s+(?:of|in)?\s+([^,\n]+)/gi,
    /(?:computer science|software engineering|data science|information technology|engineering)/gi
  ]

  const eduSection = text.match(/education\s*:?\s*(.*?)(?:experience|projects|skills|$)/is)
  const eduText = eduSection ? eduSection[1] : text

  degreePatterns.forEach(pattern => {
    const matches = eduText.matchAll(pattern)
    for (const match of matches) {
      const context = eduText.substring(
        Math.max(0, match.index - 100),
        Math.min(eduText.length, match.index + 200)
      )

      // Try to find university name
      const universityMatch = context.match(/(?:university|college|institute)\s+(?:of\s+)?([^,\n]+)/i)

      education.push({
        degree: match[0],
        institution: universityMatch ? universityMatch[0] : 'University',
        field: match[1] || 'Computer Science',
        graduation: null
      })
      break // Take first match
    }
  })

  return education.slice(0, 2)
}

/**
 * Extract certifications from text
 * @param {string} text - Resume text
 * @returns {string[]} - Certifications
 */
function extractCertifications(text) {
  const certs = []
  const certPatterns = [
    /AWS Certified/i,
    /Microsoft Certified/i,
    /Google Cloud Certified/i,
    /CompTIA Security\+/i,
    /CISSP/i,
    /PMP/i,
    /Scrum Master/i,
    /Certified.*(?:Developer|Engineer|Professional)/i
  ]

  certPatterns.forEach(pattern => {
    const match = text.match(pattern)
    if (match) {
      certs.push(match[0])
    }
  })

  return certs
}

/**
 * Parse resume text into structured data
 * @param {string} text - Resume text content
 * @returns {Object} - Parsed resume data
 */
export function parseResumeText(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid resume text')
  }

  // Extract all components
  const programmingLanguages = extractProgrammingLanguages(text)
  const frameworks = extractFrameworks(text)
  const tools = extractTools(text)
  const experiences = extractExperiences(text)
  const projects = extractProjects(text)
  const education = extractEducation(text)
  const certifications = extractCertifications(text)

  // Combine all skills
  const allSkills = [
    ...programmingLanguages,
    ...frameworks,
    ...tools,
    ...certifications
  ]

  // Normalize skills using taxonomy
  const normalizedSkills = normalizeSkills(allSkills)

  return {
    programmingLanguages,
    frameworks,
    tools,
    experiences,
    projects,
    education,
    certifications,
    normalizedSkills
  }
}

/**
 * Parse resume file (PDF or text)
 * @param {File} file - Resume file
 * @param {Object} settings - User settings (contains API key)
 * @returns {Promise<Object>} - Complete resume data object
 */
export async function parseResumeFile(file, settings = {}) {
  if (!file) {
    throw new Error('No file provided')
  }

  let rawText = ''

  // Extract text based on file type
  if (file.type === 'application/pdf') {
    // For PDFs, read as text (works for simple PDFs)
    // In production, use pdf.js for better extraction
    rawText = await extractTextFromPDF(file)
  } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
    rawText = await file.text()
  } else {
    throw new Error('Unsupported file type. Please upload PDF or TXT file.')
  }

  console.log('📄 Resume text extracted, length:', rawText.length)

  // Try AI-powered parsing first
  let parsed
  try {
    parsed = await parseResumeWithAI(rawText, settings)
    console.log('✅ Used AI parsing, found', parsed.normalizedSkills.length, 'skills')
  } catch (error) {
    console.warn('AI parsing failed, using regex fallback:', error)
    parsed = parseResumeText(rawText)
    console.log('⚠️ Used regex parsing, found', parsed.normalizedSkills.length, 'skills')
  }

  return {
    fileName: file.name,
    uploadedAt: new Date().toISOString(),
    parsed,
    rawText
  }
}

/**
 * Advanced resume parsing using AI (OpenAI integration)
 * This is called when an API key is available for better accuracy
 *
 * @param {string} resumeText - Resume text
 * @returns {Promise<Object>} - Parsed resume data
 */
export async function parseResumeWithAI(resumeText, settings) {
  console.log('🤖 Using AI-powered resume parsing...')

  // Initialize AI service
  aiService.initialize(settings?.apiKey)

  const prompt = `You are a resume parser. Extract ALL technical skills, programming languages, frameworks, tools, and technologies from this resume.

RESUME TEXT:
${resumeText.substring(0, 10000)}

TASK:
Extract every technical skill mentioned. Be thorough - include:
- Programming languages (Python, JavaScript, Java, C++, etc.)
- Web frameworks (React, Angular, Vue, Django, Flask, etc.)
- Mobile frameworks (React Native, Flutter, etc.)
- Databases (SQL, MongoDB, PostgreSQL, etc.)
- Cloud platforms (AWS, Azure, GCP, etc.)
- Tools (Git, Docker, Kubernetes, etc.)
- Data science tools (Pandas, NumPy, TensorFlow, PyTorch, etc.)
- Any other technical skills

Return ONLY a valid JSON object in this exact format:
{
  "programmingLanguages": ["language1", "language2"],
  "frameworks": ["framework1", "framework2"],
  "tools": ["tool1", "tool2"],
  "allSkills": ["skill1", "skill2", "skill3"]
}

Be comprehensive - extract ALL skills mentioned. The "allSkills" array should contain everything.`

  try {
    const response = await aiService.chat([
      { role: 'user', content: prompt }
    ])

    const aiResult = JSON.parse(response)

    console.log('✅ AI extracted skills:', aiResult.allSkills)

    // Normalize all skills
    const normalizedSkills = normalizeSkills(aiResult.allSkills || [])

    return {
      programmingLanguages: aiResult.programmingLanguages || [],
      frameworks: aiResult.frameworks || [],
      tools: aiResult.tools || [],
      experiences: [],
      projects: [],
      education: [],
      certifications: [],
      normalizedSkills
    }
  } catch (error) {
    console.error('AI parsing failed, using fallback:', error)
    // Fallback to regex-based parsing
    return parseResumeText(resumeText)
  }
}
