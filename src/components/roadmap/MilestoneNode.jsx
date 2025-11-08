import { useState } from 'react'
import Badge from '../Badge'
import {
  FiBook,
  FiCode,
  FiAward,
  FiSend,
  FiUsers,
  FiTarget,
  FiCheckCircle,
  FiCircle,
  FiLoader
} from 'react-icons/fi'

/**
 * MilestoneNode - Individual milestone node in the roadmap timeline
 *
 * Displays milestone as a node with:
 * - Status indicator (not started, in progress, completed)
 * - Icon representing category
 * - Hover/click for quick details
 */
const MilestoneNode = ({
  milestone,
  phaseId,
  isCompact = false,
  onSelect,
  onStatusChange,
  isSelected = false
}) => {
  const [isHovered, setIsHovered] = useState(false)

  // Get icon based on milestone type or infer from content
  const getMilestoneIcon = () => {
    const name = milestone.name.toLowerCase()
    const description = (milestone.description || '').toLowerCase()

    // Check for explicit type if added
    if (milestone.type === 'course') return FiBook
    if (milestone.type === 'project') return FiCode
    if (milestone.type === 'certification') return FiAward
    if (milestone.type === 'application') return FiSend
    if (milestone.type === 'networking') return FiUsers
    if (milestone.type === 'interview') return FiTarget

    // Infer from name/description
    if (name.includes('course') || name.includes('learn') || description.includes('course')) return FiBook
    if (name.includes('project') || name.includes('build') || description.includes('project')) return FiCode
    if (name.includes('certif') || name.includes('certificate') || description.includes('certif')) return FiAward
    if (name.includes('apply') || name.includes('application') || description.includes('apply')) return FiSend
    if (name.includes('network') || name.includes('connect') || description.includes('network')) return FiUsers
    if (name.includes('interview') || name.includes('practice') || description.includes('interview')) return FiTarget

    // Default
    return FiTarget
  }

  // Get status configuration
  const getStatusConfig = () => {
    switch (milestone.status) {
      case 'completed':
        return {
          icon: FiCheckCircle,
          color: 'bg-green-500 border-green-600 text-white',
          ringColor: 'ring-green-200',
          dotColor: 'bg-green-500',
          label: 'Completed'
        }
      case 'in_progress':
        return {
          icon: FiLoader,
          color: 'bg-primary border-primary text-white',
          ringColor: 'ring-primary/30',
          dotColor: 'bg-primary',
          label: 'In Progress'
        }
      case 'not_started':
      default:
        return {
          icon: FiCircle,
          color: 'bg-white border-gray-300 text-gray-600',
          ringColor: 'ring-gray-200',
          dotColor: 'bg-gray-300',
          label: 'Not Started'
        }
    }
  }

  const MilestoneIcon = getMilestoneIcon()
  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon

  const handleClick = () => {
    onSelect?.(phaseId, milestone.id)
  }

  const handleQuickStatusChange = (e) => {
    e.stopPropagation()
    const nextStatus = milestone.status === 'not_started'
      ? 'in_progress'
      : milestone.status === 'in_progress'
      ? 'completed'
      : 'not_started'
    onStatusChange?.(phaseId, milestone.id, nextStatus)
  }

  if (isCompact) {
    // Compact view: just a dot with status color
    return (
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative group
          ${isSelected ? 'ring-4 ring-offset-2 ' + statusConfig.ringColor : ''}
        `}
        title={milestone.name}
      >
        <div className={`
          w-3 h-3 rounded-full transition-all
          ${statusConfig.dotColor}
          ${isHovered ? 'scale-150' : 'scale-100'}
        `} />

        {/* Tooltip on hover */}
        {isHovered && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-20 shadow-lg">
            {milestone.name}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900" />
          </div>
        )}
      </button>
    )
  }

  // Detailed view: full node with icon and hover details
  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative group w-full text-left
        ${isSelected ? 'ring-4 ring-offset-2 ' + statusConfig.ringColor : ''}
      `}
    >
      <div className={`
        flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200
        ${statusConfig.color}
        ${isHovered ? 'shadow-lg scale-105' : 'shadow-sm'}
      `}>
        {/* Status Icon */}
        <div className="flex-shrink-0">
          <StatusIcon className="w-5 h-5" />
        </div>

        {/* Category Icon */}
        <div className="flex-shrink-0">
          <MilestoneIcon className="w-4 h-4 opacity-70" />
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">
            {milestone.name}
          </div>
        </div>

        {/* Quick status change button */}
        <button
          onClick={handleQuickStatusChange}
          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Change status"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center">
            <span className="text-xs">→</span>
          </div>
        </button>
      </div>

      {/* Hover Details Card */}
      {isHovered && milestone.description && (
        <div className="absolute left-0 top-full mt-2 p-4 bg-white rounded-xl shadow-2xl border-2 border-gray-200 z-30 w-80 max-w-sm">
          <div className="space-y-3">
            <div>
              <div className="font-bold text-gray-900 mb-1">{milestone.name}</div>
              <div className="text-sm text-gray-600">{milestone.description}</div>
            </div>

            {milestone.skills && milestone.skills.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-gray-700 mb-1">Skills:</div>
                <div className="flex flex-wrap gap-1">
                  {milestone.skills.slice(0, 5).map(skill => (
                    <Badge key={skill} variant="default" size="sm">
                      {skill}
                    </Badge>
                  ))}
                  {milestone.skills.length > 5 && (
                    <span className="text-xs text-gray-500">+{milestone.skills.length - 5} more</span>
                  )}
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500">
              Click to view full details
            </div>
          </div>
        </div>
      )}
    </button>
  )
}

export default MilestoneNode
