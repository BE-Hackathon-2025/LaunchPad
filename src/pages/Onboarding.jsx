import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { aiService } from '../services/ai'
import { getRoleProfile } from '../config/roleProfiles'
import { USER_TYPES, USER_TYPE_INFO } from '../config/userTypes'
import {
  FiZap,
  FiUser,
  FiBookOpen,
  FiHeart,
  FiCode,
  FiClock,
  FiMapPin,
  FiBriefcase,
  FiLoader,
  FiArrowRight,
  FiCheckCircle,
  FiUpload,
  FiTarget,
  FiUsers
} from 'react-icons/fi'
import Button from '../components/Button'
import Input from '../components/Input'
import Select from '../components/Select'
import ProgressBar from '../components/ProgressBar'
import RoleSelectionPanel from '../components/careerMatching/RoleSelectionPanel'
import ResumeUpload from '../components/careerMatching/ResumeUpload'
import skillsData from '../data/skills.json'

const Onboarding = () => {
  const navigate = useNavigate()
  const { setProfile, setRoadmap, settings, resumeData, setResumeData } = useStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [showMatches, setShowMatches] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [formData, setFormData] = useState({
    userType: '',  // NEW: Student, Professional, or Other
    name: '',
    major: '',
    interests: [],
    currentSkills: [],
    experienceLevel: '',
    graduationTimeline: '',
    location: '',
    constraints: {
      timeAvailability: '',
      budget: ''
    },
    targetRoles: []
  })

  const totalSteps = 9 // Increased from 8 to 9 for user type step

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleConstraintChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      constraints: { ...prev.constraints, [field]: value }
    }))
  }

  const handleMultiSelect = (field, value) => {
    setFormData(prev => {
      const current = prev[field]
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(v => v !== value) }
      } else {
        return { ...prev, [field]: [...current, value] }
      }
    })
  }

  const handleResumeParseComplete = (parsedData) => {
    // Prefill skills from resume
    if (parsedData.parsed.normalizedSkills) {
      setFormData(prev => ({
        ...prev,
        currentSkills: [...new Set([...prev.currentSkills, ...parsedData.parsed.normalizedSkills])]
      }))
    }
    console.log('✅ Resume parsed, skills prefilled:', parsedData.parsed.normalizedSkills)
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsGenerating(true)

    // Initialize AI service
    aiService.initialize(settings.apiKey)

    // Create profile (NO roadmap generation yet)
    const profile = {
      id: `student-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString()
    }

    // Save profile and show career matches
    setProfile(profile)
    setIsGenerating(false)
    setShowMatches(true) // Show career matches for role selection
  }

  const handleRoleSelection = async (roleId) => {
    setSelectedRole(roleId)
  }

  const handleGenerateRoadmap = async () => {
    if (!selectedRole) {
      alert('Please select a role first!')
      return
    }

    setIsGenerating(true)

    // Initialize AI service
    aiService.initialize(settings.apiKey)

    // Get current profile from store
    const { profile: currentProfile } = useStore.getState()

    // Update profile with selected role focus
    const updatedProfile = {
      ...currentProfile,
      focusRole: selectedRole
    }

    // Generate roadmap based on selected role
    try {
      const roadmap = await aiService.generateRoadmap(updatedProfile)
      setProfile(updatedProfile)
      setRoadmap(roadmap)
      setIsGenerating(false)
      setShowCompletion(true) // Show completion screen
    } catch (error) {
      console.error('Error generating roadmap:', error)
      alert('Failed to generate roadmap. Please try again.')
      setIsGenerating(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.userType !== '' // User type selection
      case 2: return formData.name.trim() !== ''
      case 3: return formData.major.trim() !== ''
      case 4: return true // Resume upload is optional
      case 5: return formData.interests.length > 0
      case 6: return true // Skills are optional
      case 7: return formData.experienceLevel !== ''
      case 8: return formData.graduationTimeline !== '' && formData.location !== ''
      case 9: return formData.targetRoles.length > 0 || true // Can be "not sure"
      default: return false
    }
  }

  const roleOptions = Object.keys(skillsData).map(key => ({
    value: key,
    label: skillsData[key].role
  }))

  const stepIcons = [FiUsers, FiUser, FiBookOpen, FiUpload, FiHeart, FiCode, FiClock, FiMapPin, FiBriefcase]
  const StepIcon = stepIcons[currentStep - 1]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-accent-cream/30">
      {/* Header */}
      <header className="px-6 py-6 backdrop-blur-sm bg-white/70 border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
              <FiZap className="text-white text-xl" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              LaunchPad
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Completion Screen - After Roadmap Generated */}
          {showCompletion ? (
            <div className="space-y-8">
              {/* Success Message */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                    <FiCheckCircle className="text-white text-4xl" />
                  </div>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-3">
                  Roadmap Ready, {formData.name}!
                </h2>
                <p className="text-gray-600 text-lg mb-6">
                  Your personalized roadmap for {selectedRole && getRoleProfile(selectedRole)?.name} has been generated!
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full text-primary font-medium">
                  <FiZap className="text-xl" />
                  Your journey starts now
                </div>
              </div>

              {/* Continue to Dashboard */}
              <div className="flex justify-center">
                <Button
                  onClick={() => navigate('/dashboard')}
                  size="lg"
                  className="group"
                >
                  Continue to Dashboard
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ) : showMatches ? (
            <div className="space-y-8">
              {/* Role Selection Header */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-3">
                  Choose Your Career Path, {formData.name}!
                </h2>
                <p className="text-gray-600 text-lg mb-6">
                  Based on your profile, we've identified your top 3 role matches. Select the role you want to focus on, and we'll generate a personalized roadmap for you.
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full text-primary font-medium">
                  <FiTarget className="text-xl" />
                  Step 1: Choose your path
                </div>
              </div>

              {/* Career Match Panel with Selection */}
              <RoleSelectionPanel
                selectedRole={selectedRole}
                onRoleSelect={handleRoleSelection}
              />

              {/* Generate Roadmap Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleGenerateRoadmap}
                  size="lg"
                  className="group"
                  disabled={!selectedRole || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <FiLoader className="mr-2 animate-spin" />
                      Generating Your Roadmap...
                    </>
                  ) : (
                    <>
                      Generate {selectedRole && getRoleProfile(selectedRole)?.name} Roadmap
                      <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Progress */}
              <ProgressBar current={currentStep} total={totalSteps} className="mb-12" />

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
            {/* Step Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center">
                <StepIcon className="text-primary text-3xl" />
              </div>
            </div>

            {/* Step 1: User Type Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-3">
                    Welcome to LaunchPad!
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Let's personalize your experience. Which best describes you?
                  </p>
                </div>
                <div className="space-y-4">
                  {Object.entries(USER_TYPE_INFO).map(([type, info]) => (
                    <button
                      key={type}
                      onClick={() => handleInputChange('userType', type)}
                      className={`
                        w-full p-6 rounded-xl border-2 transition-all duration-200 text-left
                        ${formData.userType === type
                          ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]'
                          : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{info.icon}</div>
                        <div className="flex-1">
                          <div className="font-bold text-xl text-gray-900 mb-1">
                            {info.label}
                          </div>
                          <div className="text-gray-600 mb-2">
                            {info.description}
                          </div>
                          <div className="text-sm text-gray-500 italic">
                            {info.examples}
                          </div>
                        </div>
                        {formData.userType === type && (
                          <FiCheckCircle className="text-primary text-2xl flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Name */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-3">
                    Great! Now tell us your name.
                  </h2>
                  <p className="text-gray-600 text-lg">
                    What should we call you?
                  </p>
                </div>
                <Input
                  label="Your Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Alex Johnson"
                  required
                  autoFocus
                />
              </div>
            )}

            {/* Step 3: Major/Background */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-3">
                    What are you studying?
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Tell us your major or area of study.
                  </p>
                </div>
                <Input
                  label="Major / Area of Study"
                  value={formData.major}
                  onChange={(e) => handleInputChange('major', e.target.value)}
                  placeholder="e.g., Computer Science, Business, Engineering"
                  required
                />
              </div>
            )}

            {/* Step 4: Resume Upload */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-3">
                    Upload your resume (Optional)
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Upload your resume to automatically extract your skills and experience.
                  </p>
                </div>
                <ResumeUpload
                  onParseComplete={handleResumeParseComplete}
                  showCompact={false}
                />
                {resumeData && (
                  <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">
                      ✓ Resume uploaded! We'll use this to prefill your skills in the next steps.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Interests */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-3">
                    What interests you?
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Select all that apply. We'll use this to personalize your roadmap.
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {interestOptions.map(interest => (
                    <button
                      key={interest}
                      onClick={() => handleMultiSelect('interests', interest)}
                      className={`
                        p-4 rounded-xl border-2 transition-all duration-200 text-left
                        ${formData.interests.includes(interest)
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-gray-200 hover:border-primary/50'
                        }
                      `}
                    >
                      <span className="font-medium">{interest}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Current Skills */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-3">
                    Any skills already?
                  </h2>
                  <p className="text-gray-600 text-lg mb-2">
                    Select what you're already comfortable with. It's okay if none apply!
                  </p>
                  {resumeData && (
                    <p className="text-primary font-medium">
                      ✓ {formData.currentSkills.length} skills (including {resumeData.parsed.normalizedSkills?.length || 0} from your resume)
                    </p>
                  )}
                  {formData.currentSkills.length > 0 && !resumeData && (
                    <p className="text-secondary font-medium">
                      {formData.currentSkills.length} skills selected
                    </p>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-xl p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {skillOptions.map(skill => (
                      <button
                        key={skill}
                        onClick={() => handleMultiSelect('currentSkills', skill)}
                        className={`
                          p-3 rounded-lg border-2 transition-all duration-200 text-left
                          ${formData.currentSkills.includes(skill)
                            ? 'border-secondary bg-secondary/5 shadow-sm'
                            : 'border-gray-200 hover:border-secondary/50'
                          }
                        `}
                      >
                        <span className="font-medium text-xs">{skill}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Experience Level */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-3">
                    What's your experience level?
                  </h2>
                  <p className="text-gray-600 text-lg">
                    This helps us calibrate your roadmap.
                  </p>
                </div>
                <div className="space-y-3">
                  {experienceLevels.map(level => (
                    <button
                      key={level.value}
                      onClick={() => handleInputChange('experienceLevel', level.value)}
                      className={`
                        w-full p-6 rounded-xl border-2 transition-all duration-200 text-left
                        ${formData.experienceLevel === level.value
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-gray-200 hover:border-primary/50'
                        }
                      `}
                    >
                      <div className="font-bold text-lg mb-1">{level.label}</div>
                      <div className="text-sm text-gray-600">{level.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 8: Timeline & Location */}
            {currentStep === 8 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-3">
                    Timeline and location
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Help us understand your context.
                  </p>
                </div>
                <Select
                  label="When do you graduate?"
                  value={formData.graduationTimeline}
                  onChange={(e) => handleInputChange('graduationTimeline', e.target.value)}
                  options={timelineOptions}
                  required
                />
                <Input
                  label="Where are you located?"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Atlanta, GA or Remote"
                  required
                />
                <div className="space-y-4 pt-4">
                  <p className="font-medium text-gray-700">Any constraints we should know about?</p>
                  <Select
                    label="Time Availability"
                    value={formData.constraints.timeAvailability}
                    onChange={(e) => handleConstraintChange('timeAvailability', e.target.value)}
                    options={timeAvailabilityOptions}
                    placeholder="Select your availability"
                  />
                  <Select
                    label="Budget Considerations"
                    value={formData.constraints.budget}
                    onChange={(e) => handleConstraintChange('budget', e.target.value)}
                    options={budgetOptions}
                    placeholder="Select your budget preference"
                  />
                </div>
              </div>
            )}

            {/* Step 9: Target Roles */}
            {currentStep === 9 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-3">
                    What roles interest you?
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Select one or more. Not sure? We'll recommend options for you!
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roleOptions.map(role => (
                    <button
                      key={role.value}
                      onClick={() => handleMultiSelect('targetRoles', role.value)}
                      className={`
                        p-6 rounded-xl border-2 transition-all duration-200 text-left
                        ${formData.targetRoles.includes(role.value)
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-gray-200 hover:border-primary/50'
                        }
                      `}
                    >
                      <div className="font-bold text-lg">{role.label}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {skillsData[role.value].description}
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleInputChange('targetRoles', ['SWE'])}
                  className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary/50 transition-colors text-gray-600"
                >
                  I'm not sure yet - recommend for me!
                </button>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                ← Back
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                >
                  Next →
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isGenerating}
                  className="group"
                >
                  {isGenerating ? (
                    <>
                      <FiLoader className="mr-2 animate-spin" />
                      Generating Your Roadmap...
                    </>
                  ) : (
                    <>
                      Generate Roadmap
                      <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

const interestOptions = [
  'AI / Machine Learning',
  'Web Development',
  'Mobile Apps',
  'Data & Analytics',
  'Cybersecurity',
  'Cloud / DevOps',
  'Product Management',
  'UX / Design',
  'Fintech',
  'Gaming',
  'Robotics',
  'Social Impact'
]

const skillOptions = [
  // Programming Languages
  'Python', 'JavaScript', 'Java', 'C++', 'C', 'C#', 'Go', 'Rust', 'Swift', 'Kotlin',
  'TypeScript', 'Ruby', 'PHP', 'Scala', 'R', 'MATLAB',

  // Web Development
  'HTML/CSS', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Next.js',
  'Django', 'Flask', 'Spring Boot', 'ASP.NET', 'GraphQL', 'REST APIs',

  // Mobile Development
  'React Native', 'Flutter', 'iOS Development', 'Android Development',

  // Data & Analytics
  'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Pandas',
  'NumPy', 'Data Analysis', 'Data Visualization', 'Tableau', 'Power BI',
  'Excel', 'Statistics',

  // Machine Learning & AI
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Scikit-learn',
  'NLP', 'Computer Vision', 'Neural Networks',

  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD',
  'Jenkins', 'Terraform', 'Linux', 'Bash',

  // Fundamentals & Tools
  'Data Structures', 'Algorithms', 'Git', 'GitHub', 'Debugging',
  'Testing', 'Agile', 'Scrum', 'Object-Oriented Programming',

  // Cybersecurity
  'Network Security', 'Cryptography', 'Penetration Testing', 'Security Analysis',

  // Other
  'Product Management', 'UI/UX Design', 'Figma', 'Technical Writing',
  'System Design', 'Microservices', 'Blockchain'
]

const experienceLevels = [
  {
    value: 'beginner',
    label: 'Beginner',
    description: 'Just starting out, little to no prior experience'
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    description: 'Some coursework or projects, building confidence'
  },
  {
    value: 'advanced',
    label: 'Advanced',
    description: 'Strong foundation, ready for challenging opportunities'
  }
]

const timelineOptions = [
  { value: 'less-than-1-year', label: 'Less than 1 year' },
  { value: '1-year', label: '1 year' },
  { value: '2-years', label: '2 years' },
  { value: '3-years', label: '3 years' },
  { value: '4-plus-years', label: '4+ years' },
  { value: 'graduated', label: 'Already graduated' }
]

const timeAvailabilityOptions = [
  { value: 'full-time', label: 'Full-time (30+ hours/week)' },
  { value: 'part-time', label: 'Part-time (15-30 hours/week)' },
  { value: 'limited', label: 'Limited (5-15 hours/week)' },
  { value: 'minimal', label: 'Minimal (Less than 5 hours/week)' },
  { value: 'flexible', label: 'Flexible - varies by week' }
]

const budgetOptions = [
  { value: 'free-only', label: 'Free resources only' },
  { value: 'minimal', label: 'Minimal budget (up to $50)' },
  { value: 'moderate', label: 'Moderate budget ($50-$200)' },
  { value: 'flexible', label: 'Flexible budget' },
  { value: 'employer-sponsored', label: 'Employer or school sponsored' }
]

export default Onboarding
