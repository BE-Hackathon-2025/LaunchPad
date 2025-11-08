import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { calculateReadinessScore, getCompletedSkills } from '../../utils/matching'
import Card from '../Card'
import Badge from '../Badge'
import Button from '../Button'
import Input from '../Input'
import Modal from '../Modal'
import skillsData from '../../data/skills.json'

const Portfolio = () => {
  const {
    profile,
    roadmap,
    interviewSessions,
    portfolio,
    addCustomProject,
    removeCustomProject,
    updateProfileLinks
  } = useStore()

  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showLinksModal, setShowLinksModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareLink, setShareLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    link: ''
  })
  const [links, setLinks] = useState({
    githubUrl: portfolio?.githubUrl || '',
    linkedinUrl: portfolio?.linkedinUrl || '',
    resumeUrl: portfolio?.resumeUrl || '',
    portfolioUrl: portfolio?.portfolioUrl || ''
  })

  // Ensure customProjects exists
  const customProjects = portfolio?.customProjects || []

  if (!profile || !roadmap) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Portfolio Not Available
          </h2>
          <p className="text-gray-600">
            Complete your onboarding to generate your portfolio.
          </p>
        </div>
      </div>
    )
  }

  const completedMilestones = roadmap.phases.flatMap(phase =>
    phase.milestones.filter(m => m.status === 'completed')
  )

  const completedSkills = getCompletedSkills(roadmap)
  const allSkills = [...new Set([...profile.currentSkills, ...completedSkills])]

  // Calculate readiness scores for each target role
  const readinessScores = profile.targetRoles.map(role => ({
    role,
    score: calculateReadinessScore(profile, roadmap, role)
  }))

  const avgInterviewScore = interviewSessions.length > 0
    ? Math.round(interviewSessions.reduce((sum, s) => sum + s.averageScore, 0) / interviewSessions.length)
    : 0

  const handleAddProject = () => {
    if (!newProject.title.trim()) return

    addCustomProject({
      ...newProject,
      technologies: newProject.technologies.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString()
    })

    setNewProject({ title: '', description: '', technologies: '', link: '' })
    setShowProjectModal(false)
  }

  const handleSaveLinks = () => {
    updateProfileLinks(links)
    setShowLinksModal(false)
  }

  const handleGenerateShareLink = () => {
    // Generate a shareable portfolio summary
    const portfolioData = {
      name: profile.name,
      roles: profile.targetRoles.join(', '),
      skills: allSkills.slice(0, 10).join(', '),
      readiness: readinessScores.length > 0 ? readinessScores[0].score : 0,
      projects: customProjects.length + completedMilestones.filter(m => m.projects?.length > 0).length,
      interviews: interviewSessions.length,
      avgScore: avgInterviewScore
    }

    // Create a shareable URL with encoded data
    const baseUrl = window.location.origin + window.location.pathname
    const params = new URLSearchParams({
      portfolio: btoa(JSON.stringify(portfolioData))
    })
    const link = `${baseUrl}?${params.toString()}`

    setShareLink(link)
    setShowShareModal(true)
    setCopied(false)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      console.error('Failed to copy:', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareLink
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Portfolio 🏆
            </h1>
            <p className="text-gray-600">
              Your shareable career profile showcasing skills, progress, and readiness
            </p>
          </div>
          <Button onClick={() => setShowLinksModal(true)} variant="outline">
            Edit Links
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-4xl font-bold flex-shrink-0">
              {profile.name[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {profile.name}
              </h2>
              <p className="text-lg text-gray-700 mb-3">
                {profile.major} • {profile.experienceLevel.charAt(0).toUpperCase() + profile.experienceLevel.slice(1)} Level
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.targetRoles.map(role => (
                  <Badge key={role} variant="primary" size="lg">
                    {skillsData[role]?.role || role}
                  </Badge>
                ))}
              </div>

              {/* Social Links */}
              {(portfolio.githubUrl || portfolio.linkedinUrl || portfolio.resumeUrl || portfolio.portfolioUrl) && (
                <div className="flex flex-wrap gap-3">
                  {portfolio.githubUrl && (
                    <a
                      href={portfolio.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                    >
                      GitHub →
                    </a>
                  )}
                  {portfolio.linkedinUrl && (
                    <a
                      href={portfolio.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                      LinkedIn →
                    </a>
                  )}
                  {portfolio.resumeUrl && (
                    <a
                      href={portfolio.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                    >
                      Resume →
                    </a>
                  )}
                  {portfolio.portfolioUrl && (
                    <a
                      href={portfolio.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
                    >
                      Portfolio →
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Readiness Scores */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Career Readiness</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {readinessScores.map(({ role, score }) => (
              <Card key={role} className="bg-white">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-900">
                    {skillsData[role]?.role || role}
                  </h4>
                  <span className={`text-2xl font-bold ${
                    score >= 80 ? 'text-green-600' :
                    score >= 60 ? 'text-yellow-600' :
                    score >= 40 ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {score}%
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      score >= 80 ? 'bg-green-500' :
                      score >= 60 ? 'bg-yellow-500' :
                      score >= 40 ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {score >= 80 ? 'Ready to apply!' :
                   score >= 60 ? 'Making good progress' :
                   score >= 40 ? 'Keep building skills' :
                   'Just getting started'}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Skills */}
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Skills ({allSkills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {allSkills.map(skill => (
              <Badge
                key={skill}
                variant={completedSkills.includes(skill) ? 'success' : 'default'}
                size="md"
              >
                {completedSkills.includes(skill) && '✓ '}
                {skill}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Custom Projects */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Projects ({customProjects.length + completedMilestones.filter(m => m.projects?.length > 0).length})
            </h3>
            <Button onClick={() => setShowProjectModal(true)} size="sm">
              + Add Project
            </Button>
          </div>

          <div className="space-y-4">
            {/* Custom Projects */}
            {customProjects.map((project, idx) => (
              <div
                key={idx}
                className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border-2 border-primary/20"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-gray-900">{project.title}</h4>
                  <button
                    onClick={() => removeCustomProject(idx)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.technologies.map((tech, i) => (
                      <Badge key={i} variant="secondary" size="sm">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    View Project →
                  </a>
                )}
              </div>
            ))}

            {/* Milestone Projects */}
            {completedMilestones
              .filter(m => m.projects && m.projects.length > 0)
              .map((milestone, idx) => (
                <div key={idx} className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-bold text-gray-900 mb-2">{milestone.name}</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {milestone.projects.map((project, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>{project}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

            {customProjects.length === 0 && completedMilestones.filter(m => m.projects?.length > 0).length === 0 && (
              <p className="text-gray-600 text-center py-4">
                No projects yet. Add your custom projects or complete milestones to build your portfolio!
              </p>
            )}
          </div>
        </Card>

        {/* Completed Milestones */}
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Completed Milestones ({completedMilestones.length})
          </h3>
          {completedMilestones.length === 0 ? (
            <p className="text-gray-600">
              No milestones completed yet. Start working on your roadmap!
            </p>
          ) : (
            <div className="space-y-3">
              {completedMilestones.map((milestone, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{milestone.name}</div>
                    <div className="text-sm text-gray-600">{milestone.description}</div>
                    {milestone.skills && milestone.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {milestone.skills.map(skill => (
                          <Badge key={skill} variant="success" size="sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Interview Performance */}
        {interviewSessions.length > 0 && (
          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Interview Practice
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {interviewSessions.length}
                </div>
                <div className="text-sm text-gray-600">Sessions Completed</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-3xl font-bold mb-1 ${
                  avgInterviewScore >= 80 ? 'text-green-600' :
                  avgInterviewScore >= 60 ? 'text-yellow-600' :
                  'text-orange-600'
                }`}>
                  {avgInterviewScore}%
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {interviewSessions.reduce((sum, s) => sum + s.results.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Questions Answered</div>
              </div>
            </div>
          </Card>
        )}

        {/* Share Card */}
        <Card className="bg-gradient-to-r from-primary to-secondary text-white">
          <div className="text-center py-6">
            <h3 className="text-2xl font-bold mb-2">Share Your Portfolio</h3>
            <p className="mb-6 opacity-90">
              Showcase your progress to recruiters and mentors
            </p>
            <button
              onClick={handleGenerateShareLink}
              className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Generate Share Link
            </button>
          </div>
        </Card>
      </div>

      {/* Add Project Modal */}
      <Modal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        title="Add Custom Project"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowProjectModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProject} disabled={!newProject.title.trim()}>
              Add Project
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Project Title"
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            placeholder="e.g., E-commerce Website"
            required
          />
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Brief description of your project..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <Input
            label="Technologies Used"
            value={newProject.technologies}
            onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
            placeholder="e.g., React, Node.js, MongoDB"
            helperText="Separate with commas"
          />
          <Input
            label="Project Link (optional)"
            value={newProject.link}
            onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
            placeholder="https://github.com/username/project"
          />
        </div>
      </Modal>

      {/* Edit Links Modal */}
      <Modal
        isOpen={showLinksModal}
        onClose={() => setShowLinksModal(false)}
        title="Edit Profile Links"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowLinksModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLinks}>
              Save Links
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="GitHub URL"
            value={links.githubUrl}
            onChange={(e) => setLinks({ ...links, githubUrl: e.target.value })}
            placeholder="https://github.com/username"
          />
          <Input
            label="LinkedIn URL"
            value={links.linkedinUrl}
            onChange={(e) => setLinks({ ...links, linkedinUrl: e.target.value })}
            placeholder="https://linkedin.com/in/username"
          />
          <Input
            label="Resume URL"
            value={links.resumeUrl}
            onChange={(e) => setLinks({ ...links, resumeUrl: e.target.value })}
            placeholder="https://drive.google.com/file/..."
            helperText="Link to your resume (Google Drive, Dropbox, etc.)"
          />
          <Input
            label="Portfolio Website"
            value={links.portfolioUrl}
            onChange={(e) => setLinks({ ...links, portfolioUrl: e.target.value })}
            placeholder="https://yourportfolio.com"
          />
        </div>
      </Modal>

      {/* Share Link Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Your Portfolio"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Share this link with recruiters, mentors, or on your resume to showcase your progress:
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
              />
              <Button
                onClick={handleCopyLink}
                variant={copied ? 'primary' : 'outline'}
                size="sm"
              >
                {copied ? '✓ Copied!' : 'Copy Link'}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>💡 Tip:</strong> This link contains a snapshot of your portfolio.
              Update your progress and regenerate to get the latest version.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Portfolio
