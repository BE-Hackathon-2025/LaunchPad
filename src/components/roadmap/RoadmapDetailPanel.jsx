import { useState } from 'react'
import { useStore } from '../../store/useStore'
import Badge from '../Badge'
import Button from '../Button'
import Card from '../Card'
import {
  FiX,
  FiCheckCircle,
  FiCircle,
  FiLoader,
  FiMessageCircle,
  FiVideo,
  FiExternalLink,
  FiBookmark
} from 'react-icons/fi'

/**
 * RoadmapDetailPanel - Slide-in detail panel for selected milestone
 *
 * Shows:
 * - Full description and context
 * - Checklist items
 * - Resources with links
 * - AI Copilot shortcut
 * - Video generation shortcut
 * - Status controls
 * - Notes field
 * - Portfolio tagging
 */
const RoadmapDetailPanel = ({
  milestone,
  phase,
  onClose,
  onStatusChange,
  onAskCopilot,
  onGenerateVideo
}) => {
  const { profile } = useStore()
  const [notes, setNotes] = useState(milestone?.notes || '')
  const [isPortfolioItem, setIsPortfolioItem] = useState(milestone?.isPortfolioItem || false)

  if (!milestone || !phase) return null

  // Get status configuration
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          icon: FiCheckCircle,
          label: 'Completed',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        }
      case 'in_progress':
        return {
          icon: FiLoader,
          label: 'In Progress',
          color: 'text-primary',
          bgColor: 'bg-primary/5',
          borderColor: 'border-primary/30'
        }
      case 'not_started':
      default:
        return {
          icon: FiCircle,
          label: 'Not Started',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        }
    }
  }

  const currentStatus = getStatusConfig(milestone.status)
  const StatusIcon = currentStatus.icon

  // Get why this matters based on user type
  const getWhyItMatters = () => {
    const userType = profile?.userType || 'student'
    const role = profile?.focusRole || profile?.targetRoles?.[0] || 'your target role'

    if (userType === 'student') {
      return `This milestone helps build foundational skills essential for ${role} positions. Completing this will strengthen your resume and prepare you for internship interviews.`
    } else if (userType === 'professional') {
      return `This milestone is crucial for your transition to ${role}. It demonstrates hands-on expertise that hiring managers look for when evaluating career changers.`
    } else {
      return `This milestone aligns with industry expectations for ${role} and will help you build credible, demonstrable skills.`
    }
  }

  const handleStatusChange = (newStatus) => {
    onStatusChange?.(phase.id, milestone.id, newStatus)
  }

  const handleAskCopilot = () => {
    onAskCopilot?.(milestone, phase)
  }

  const handleGenerateVideo = () => {
    onGenerateVideo?.(milestone, phase)
  }

  const handleSaveNotes = () => {
    // TODO: Save notes to store
    console.log('Saving notes:', notes)
  }

  const handleTogglePortfolio = () => {
    setIsPortfolioItem(!isPortfolioItem)
    // TODO: Update in store
    console.log('Toggle portfolio item:', !isPortfolioItem)
  }

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-6 py-4 z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {milestone.name}
            </h2>
            <p className="text-sm text-gray-600">
              {phase.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            aria-label="Close panel"
          >
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Status Section */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <StatusIcon className={`w-5 h-5 ${currentStatus.color}`} />
              <span className={`font-semibold ${currentStatus.color}`}>
                {currentStatus.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {milestone.status !== 'not_started' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleStatusChange('not_started')}
                >
                  Reset
                </Button>
              )}
              {milestone.status === 'not_started' && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleStatusChange('in_progress')}
                >
                  Start
                </Button>
              )}
              {milestone.status === 'in_progress' && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleStatusChange('completed')}
                >
                  Complete
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Description */}
        <div>
          <h3 className="font-bold text-gray-900 mb-2">Description</h3>
          <p className="text-gray-700 leading-relaxed">
            {milestone.description}
          </p>
        </div>

        {/* Why This Matters */}
        <Card className="bg-blue-50 border-2 border-blue-200">
          <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <span>💡</span>
            Why This Matters
          </h3>
          <p className="text-blue-800 text-sm leading-relaxed">
            {getWhyItMatters()}
          </p>
        </Card>

        {/* Skills */}
        {milestone.skills && milestone.skills.length > 0 && (
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Skills You'll Build</h3>
            <div className="flex flex-wrap gap-2">
              {milestone.skills.map(skill => (
                <Badge key={skill} variant="default" size="md">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {milestone.projects && milestone.projects.length > 0 && (
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Projects</h3>
            <ul className="space-y-2">
              {milestone.projects.map((project, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <span className="text-primary mt-1">•</span>
                  <span>{project}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Resources */}
        {milestone.resources && milestone.resources.length > 0 && (
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Recommended Resources</h3>
            <div className="space-y-2">
              {milestone.resources.map((resource, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <FiExternalLink className="w-4 h-4 text-gray-600 group-hover:text-primary" />
                  <span className="text-sm text-gray-700 group-hover:text-primary flex-1">
                    {resource}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* AI Shortcuts */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={handleAskCopilot}
            className="flex items-center gap-2 justify-center"
          >
            <FiMessageCircle className="w-4 h-4" />
            Ask Copilot
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={handleGenerateVideo}
            className="flex items-center gap-2 justify-center"
          >
            <FiVideo className="w-4 h-4" />
            Generate Video
          </Button>
        </div>

        {/* Notes */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Your Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add personal notes, resources, or progress updates..."
            className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveNotes}
            className="mt-2"
          >
            Save Notes
          </Button>
        </div>

        {/* Portfolio Tag */}
        <Card className="border-2 border-gray-200">
          <button
            onClick={handleTogglePortfolio}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <FiBookmark className={`w-5 h-5 ${isPortfolioItem ? 'text-primary' : 'text-gray-400'}`} />
              <div className="text-left">
                <div className="font-semibold text-gray-900">
                  Showcase in Portfolio
                </div>
                <div className="text-sm text-gray-600">
                  Mark this as a highlight project
                </div>
              </div>
            </div>
            <div className={`
              w-12 h-6 rounded-full transition-colors
              ${isPortfolioItem ? 'bg-primary' : 'bg-gray-300'}
            `}>
              <div className={`
                w-5 h-5 rounded-full bg-white shadow-md transform transition-transform mt-0.5
                ${isPortfolioItem ? 'translate-x-6' : 'translate-x-0.5'}
              `} />
            </div>
          </button>
        </Card>

        {/* Sponsor Tags */}
        {milestone.sponsorTags && milestone.sponsorTags.length > 0 && (
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Sponsor Aligned</h3>
            <div className="flex flex-wrap gap-2">
              {milestone.sponsorTags.map(tag => (
                <Badge key={tag} variant="sponsor" size="md">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RoadmapDetailPanel
