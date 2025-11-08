import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { USER_TYPE_INFO } from '../../config/userTypes'
import Badge from '../Badge'
import Button from '../Button'
import { FiRefreshCw, FiEdit3, FiGrid, FiList } from 'react-icons/fi'

/**
 * RoadmapHeader - Header component for the roadmap view
 *
 * Displays:
 * - Title and subtitle with dynamic stats
 * - User type and selected role chips
 * - Controls for regenerating, refining, and view toggling
 */
const RoadmapHeader = ({
  overallProgress = 0,
  selectedRole = null,
  viewMode = 'detailed',
  onViewModeChange,
  onRegenerate,
  onRefine
}) => {
  const { profile, roadmap } = useStore()
  const [isRegenerating, setIsRegenerating] = useState(false)

  const userTypeInfo = profile?.userType ? USER_TYPE_INFO[profile.userType] : null
  const displayRole = selectedRole || roadmap?.tracks?.[0] || 'Career Track'

  const handleRegenerate = async () => {
    setIsRegenerating(true)
    try {
      await onRegenerate?.()
    } finally {
      setIsRegenerating(false)
    }
  }

  // Build subtitle based on user type
  const buildSubtitle = () => {
    const parts = []

    // Track/Role
    parts.push(`Track: ${displayRole}`)

    // Readiness
    parts.push(`Readiness: ${overallProgress}%`)

    // User-type specific info
    if (profile?.userType === 'student' && profile?.graduationTimeline) {
      parts.push(`Graduating: ${profile.graduationTimeline}`)
    } else if (profile?.userType === 'professional' && profile?.experienceLevel) {
      const level = profile.experienceLevel.charAt(0).toUpperCase() + profile.experienceLevel.slice(1)
      parts.push(level)
    }

    return parts.join(' · ')
  }

  return (
    <div className="bg-white border-b-2 border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Top Row: Title and Controls */}
        <div className="flex items-start justify-between gap-6 mb-4">
          {/* Left: Title and Subtitle */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your LaunchPad Roadmap
            </h1>
            <p className="text-gray-600 text-sm">
              {buildSubtitle()}
            </p>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => onViewModeChange?.('detailed')}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium transition-all
                  ${viewMode === 'detailed'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
                title="Detailed view"
              >
                <FiList className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange?.('compact')}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium transition-all
                  ${viewMode === 'compact'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
                title="Compact view"
              >
                <FiGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Refine Button */}
            {onRefine && (
              <Button
                variant="outline"
                size="md"
                onClick={onRefine}
                className="flex items-center gap-2"
              >
                <FiEdit3 className="w-4 h-4" />
                Refine
              </Button>
            )}

            {/* Regenerate Button */}
            {onRegenerate && (
              <Button
                variant="primary"
                size="md"
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="flex items-center gap-2"
              >
                <FiRefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                {isRegenerating ? 'Regenerating...' : 'Regenerate'}
              </Button>
            )}
          </div>
        </div>

        {/* Bottom Row: Chips/Badges */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* User Type Chip */}
          {userTypeInfo && (
            <Badge variant="default" size="md">
              {userTypeInfo.icon} {userTypeInfo.label}
            </Badge>
          )}

          {/* Role Chips */}
          {roadmap?.tracks && roadmap.tracks.length > 0 && (
            <>
              {roadmap.tracks.map((track, index) => (
                <Badge
                  key={track}
                  variant={track === selectedRole ? 'primary' : 'default'}
                  size="md"
                >
                  {track}
                </Badge>
              ))}
            </>
          )}

          {/* Progress Indicator */}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-600">Overall Progress:</span>
            <span className="text-lg font-bold text-primary">{overallProgress}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoadmapHeader
