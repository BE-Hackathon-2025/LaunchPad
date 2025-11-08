import MilestoneNode from './MilestoneNode'
import ProgressBar from '../ProgressBar'

/**
 * PhaseCard - Represents a phase segment in the roadmap timeline
 *
 * Displays:
 * - Phase name and goal
 * - Timeline/duration
 * - Progress bar
 * - Milestone nodes
 */
const PhaseCard = ({
  phase,
  phaseIndex,
  isCompact = false,
  onMilestoneSelect,
  onMilestoneStatusChange,
  selectedMilestoneId = null
}) => {
  // Calculate phase progress
  const completedCount = phase.milestones.filter(m => m.status === 'completed').length
  const progress = phase.milestones.length > 0
    ? Math.round((completedCount / phase.milestones.length) * 100)
    : 0

  // Determine phase status color
  const getPhaseColor = () => {
    if (progress === 100) return 'border-green-500 bg-green-50'
    if (progress > 0) return 'border-primary bg-primary/5'
    return 'border-gray-300 bg-white'
  }

  const getProgressColor = () => {
    if (progress === 100) return 'from-green-500 to-green-600'
    return 'from-primary to-secondary'
  }

  if (isCompact) {
    // Compact view: smaller card with dots for milestones
    return (
      <div className={`
        relative flex-shrink-0 w-64 h-auto
      `}>
        {/* Phase Card */}
        <div className={`
          p-4 rounded-xl border-2 shadow-md transition-all
          ${getPhaseColor()}
        `}>
          {/* Phase Number */}
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
              {phaseIndex + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">
                {phase.name}
              </h3>
              <p className="text-xs text-gray-600">
                {phase.timeline}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-gray-700">Progress</span>
              <span className="text-xs font-bold text-gray-900">{progress}%</span>
            </div>
            <ProgressBar progress={progress} size="sm" />
          </div>

          {/* Milestones as dots */}
          <div className="flex flex-wrap gap-2">
            {phase.milestones.map(milestone => (
              <MilestoneNode
                key={milestone.id}
                milestone={milestone}
                phaseId={phase.id}
                isCompact={true}
                onSelect={onMilestoneSelect}
                onStatusChange={onMilestoneStatusChange}
                isSelected={selectedMilestoneId === milestone.id}
              />
            ))}
          </div>
        </div>

        {/* Connecting line to next phase (on the right) */}
        <div className="absolute top-1/2 -right-4 w-4 h-0.5 bg-gray-300" />
      </div>
    )
  }

  // Detailed view: full card with milestone list
  return (
    <div className={`
      relative flex-shrink-0 w-80
    `}>
      {/* Phase Card */}
      <div className={`
        p-6 rounded-xl border-2 shadow-lg transition-all
        ${getPhaseColor()}
      `}>
        {/* Phase Header */}
        <div className="mb-4">
          <div className="flex items-start gap-3 mb-2">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold">
              {phaseIndex + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">
                {phase.name}
              </h3>
              <p className="text-sm text-gray-600">
                {phase.timeline}
              </p>
            </div>
          </div>

          {/* Goal/Description if available */}
          {phase.goal && (
            <p className="text-sm text-gray-700 mt-2 pl-13">
              {phase.goal}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Progress</span>
            <span className="text-sm font-bold text-gray-900">{progress}%</span>
          </div>
          <ProgressBar progress={progress} size="md" />
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
            <span>{completedCount} / {phase.milestones.length} completed</span>
          </div>
        </div>

        {/* Milestones */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-700 mb-2">Milestones:</div>
          {phase.milestones.map(milestone => (
            <MilestoneNode
              key={milestone.id}
              milestone={milestone}
              phaseId={phase.id}
              isCompact={false}
              onSelect={onMilestoneSelect}
              onStatusChange={onMilestoneStatusChange}
              isSelected={selectedMilestoneId === milestone.id}
            />
          ))}
        </div>
      </div>

      {/* Connecting line to next phase */}
      <div className="absolute top-1/2 -right-8 w-8 h-0.5 bg-gray-300" />
    </div>
  )
}

export default PhaseCard
