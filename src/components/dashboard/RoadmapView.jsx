import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { useNavigate } from 'react-router-dom'
import RoadmapHeader from '../roadmap/RoadmapHeader'
import RoadmapTimeline from '../roadmap/RoadmapTimeline'
import RoadmapDetailPanel from '../roadmap/RoadmapDetailPanel'
import Card from '../Card'
import Button from '../Button'
import Badge from '../Badge'
import CareerMatchPanel from '../careerMatching/CareerMatchPanel'
import { getNextSteps } from '../../utils/matching'

/**
 * RoadmapView - Visual journey-based roadmap interface
 *
 * Features:
 * - Horizontal timeline view with phases
 * - Detail panel for selected milestones
 * - Next steps recommendations
 * - Integration with Career Copilot and Video Generation
 */
const RoadmapView = () => {
  const navigate = useNavigate()
  const { roadmap, updateMilestoneStatus, profile } = useStore()
  const [viewMode, setViewMode] = useState('detailed') // 'detailed' | 'compact'
  const [selectedMilestone, setSelectedMilestone] = useState(null)
  const [selectedPhase, setSelectedPhase] = useState(null)

  // Calculate overall progress
  const calculateProgress = () => {
    if (!roadmap || !roadmap.phases || roadmap.phases.length === 0) return 0

    let totalMilestones = 0
    let completedMilestones = 0

    roadmap.phases.forEach(phase => {
      totalMilestones += phase.milestones.length
      completedMilestones += phase.milestones.filter(m => m.status === 'completed').length
    })

    return totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0
  }

  const overallProgress = calculateProgress()

  // Handle milestone selection
  const handleMilestoneSelect = (phaseId, milestoneId) => {
    const phase = roadmap.phases.find(p => p.id === phaseId)
    const milestone = phase?.milestones.find(m => m.id === milestoneId)

    if (phase && milestone) {
      setSelectedPhase(phase)
      setSelectedMilestone(milestone)
    }
  }

  // Handle milestone status change
  const handleMilestoneStatusChange = (phaseId, milestoneId, newStatus) => {
    updateMilestoneStatus(phaseId, milestoneId, newStatus)

    // Update selected milestone if it's the one being changed
    if (selectedMilestone && selectedMilestone.id === milestoneId) {
      const phase = roadmap.phases.find(p => p.id === phaseId)
      const milestone = phase?.milestones.find(m => m.id === milestoneId)
      if (milestone) {
        setSelectedMilestone({ ...milestone, status: newStatus })
      }
    }
  }

  // Handle close detail panel
  const handleCloseDetailPanel = () => {
    setSelectedMilestone(null)
    setSelectedPhase(null)
  }

  // Handle regenerate roadmap
  const handleRegenerate = async () => {
    // Navigate to onboarding or roadmap generation
    navigate('/dashboard/career-copilot')
    // TODO: Trigger roadmap regeneration
    console.log('Regenerate roadmap')
  }

  // Handle refine roadmap
  const handleRefine = () => {
    navigate('/dashboard/career-copilot')
    // TODO: Open refine dialog
    console.log('Refine roadmap')
  }

  // Handle AI Copilot shortcut
  const handleAskCopilot = (milestone, phase) => {
    navigate('/dashboard/career-copilot', {
      state: {
        initialMessage: `Help me with this milestone: ${milestone.name} in ${phase.name}. ${milestone.description}`
      }
    })
  }

  // Handle video generation shortcut
  const handleGenerateVideo = (milestone, phase) => {
    // TODO: Integrate with video generation
    console.log('Generate video for:', milestone.name)
    alert('Video generation coming soon! This will create an AI-generated explanation video for this milestone.')
  }

  // Empty state
  if (!roadmap) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-8 py-16">
          <div className="text-center">
            <div className="text-6xl mb-6">🗺️</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              No Roadmap Yet
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Complete onboarding to generate your personalized career roadmap.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/onboarding')}
            >
              Start Onboarding
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const nextSteps = getNextSteps(roadmap)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <RoadmapHeader
        overallProgress={overallProgress}
        selectedRole={roadmap.tracks?.[0]}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRegenerate={handleRegenerate}
        onRefine={handleRefine}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Career Match - Compact View */}
        <CareerMatchPanel limit={1} showTitle={false} compact={true} />

        {/* Next Steps Card */}
        {nextSteps.length > 0 && (
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🎯</span>
              Recommended Next Steps
            </h3>
            <div className="space-y-3">
              {nextSteps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => handleMilestoneSelect(step.phaseId, step.milestone.id)}
                  className="w-full flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-all group"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    step.type === 'continue' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {step.type === 'continue' ? 'Continue: ' : 'Start: '}
                      {step.milestone.name}
                    </div>
                    <div className="text-sm text-gray-600">{step.phase}</div>
                  </div>
                  <Badge variant={step.type === 'continue' ? 'primary' : 'default'} size="sm">
                    {step.milestone.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                  </Badge>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Roadmap Timeline */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your Journey
            </h2>
            <p className="text-gray-600">
              {roadmap.phases.length} phases • {roadmap.phases.reduce((acc, p) => acc + p.milestones.length, 0)} milestones
            </p>
          </div>

          <RoadmapTimeline
            phases={roadmap.phases}
            viewMode={viewMode}
            onMilestoneSelect={handleMilestoneSelect}
            onMilestoneStatusChange={handleMilestoneStatusChange}
            selectedMilestoneId={selectedMilestone?.id}
          />
        </div>

        {/* Completion Banner */}
        {overallProgress === 100 && (
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300">
            <div className="text-center py-6">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-green-900 mb-2">
                Congratulations! You've Completed Your Roadmap!
              </h3>
              <p className="text-green-800 mb-6">
                You've achieved all milestones in your career roadmap. Ready for the next challenge?
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/dashboard/opportunities')}
                >
                  Explore Opportunities
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleRegenerate}
                >
                  Create New Roadmap
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Detail Panel */}
      {selectedMilestone && selectedPhase && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={handleCloseDetailPanel}
          />

          {/* Panel */}
          <RoadmapDetailPanel
            milestone={selectedMilestone}
            phase={selectedPhase}
            onClose={handleCloseDetailPanel}
            onStatusChange={handleMilestoneStatusChange}
            onAskCopilot={handleAskCopilot}
            onGenerateVideo={handleGenerateVideo}
          />
        </>
      )}
    </div>
  )
}

export default RoadmapView
