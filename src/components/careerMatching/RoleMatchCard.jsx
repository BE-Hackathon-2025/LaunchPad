/**
 * Role Match Card Component
 * Displays a single role match with score, skills, and actions
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { getRoleProfile } from '../../config/roleProfiles'
import { requestRoleExplainerVideo, initializeVideoService } from '../../services/videoGeneration'
import Button from '../Button'
import Card from '../Card'
import Badge from '../Badge'
import VideoPlayer from './VideoPlayer'
import { FiMessageCircle, FiVideo, FiChevronDown, FiChevronUp } from 'react-icons/fi'

const RoleMatchCard = ({ match, rank }) => {
  const navigate = useNavigate()
  const { profile, addVideoRequest, videoGenerationRequests, chatHistory, addChatMessage, settings } = useStore()
  const [expanded, setExpanded] = useState(false)
  const [generatingVideo, setGeneratingVideo] = useState(false)
  const [showVideo, setShowVideo] = useState(false)

  const roleProfile = getRoleProfile(match.roleId)

  if (!roleProfile) return null

  // Match level styling
  const matchLevelColors = {
    'excellent': 'from-green-500 to-emerald-500',
    'good': 'from-blue-500 to-cyan-500',
    'fair': 'from-yellow-500 to-orange-500',
    'needs-development': 'from-gray-500 to-slate-500'
  }

  const matchLevelBg = {
    'excellent': 'bg-green-50 border-green-200',
    'good': 'bg-blue-50 border-blue-200',
    'fair': 'bg-yellow-50 border-yellow-200',
    'needs-development': 'bg-gray-50 border-gray-200'
  }

  const handleAskCopilot = () => {
    // Pre-fill Career Copilot with role-specific question
    const message = {
      role: 'user',
      content: `Tell me more about the ${roleProfile.name} role. Based on my profile, what should I focus on to prepare for this career path?`
    }

    addChatMessage(message)
    navigate('/dashboard/copilot')
  }

  const handleGenerateVideo = async () => {
    setGeneratingVideo(true)

    try {
      // Initialize video service with API key
      initializeVideoService(settings.apiKey)

      const videoResult = await requestRoleExplainerVideo(match.roleId, profile)
      addVideoRequest(match.roleId, videoResult)

      console.log('✅ Video generated:', videoResult)
      setShowVideo(true) // Show the video player
    } catch (error) {
      console.error('Video generation error:', error)
      alert('Failed to generate video. Please try again.')
    } finally {
      setGeneratingVideo(false)
    }
  }

  // Get video data for this role
  const videoData = videoGenerationRequests[match.roleId]
  const hasVideo = !!videoData

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {rank && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold text-sm">
                  #{rank}
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900">
                {roleProfile.name}
              </h3>
            </div>
            <p className="text-gray-600">{roleProfile.summary}</p>
          </div>

          {/* Match Score */}
          <div className={`flex-shrink-0 text-center px-6 py-3 rounded-xl border-2 ${matchLevelBg[match.matchLevel]}`}>
            <div className={`text-3xl font-bold bg-gradient-to-r ${matchLevelColors[match.matchLevel]} bg-clip-text text-transparent`}>
              {match.score}%
            </div>
            <p className="text-xs text-gray-600 mt-1">Match</p>
          </div>
        </div>

        {/* Skills Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Matched Skills</p>
            <p className="text-lg font-bold text-green-700">
              {match.matchedSkills.length}
            </p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Skills to Learn</p>
            <p className="text-lg font-bold text-red-700">
              {match.gapSkills.length}
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Bonus Skills</p>
            <p className="text-lg font-bold text-blue-700">
              {match.bonusSkills.length}
            </p>
          </div>
        </div>

        {/* Recommendation */}
        <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-primary">
          <p className="text-gray-800">{match.recommendation}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleAskCopilot} variant="primary">
            <FiMessageCircle className="mr-2" />
            Ask Career Copilot
          </Button>
          <Button
            onClick={() => {
              if (hasVideo) {
                setShowVideo(!showVideo)
              } else {
                handleGenerateVideo()
              }
            }}
            variant={hasVideo ? "primary" : "outline"}
            disabled={generatingVideo}
          >
            <FiVideo className="mr-2" />
            {generatingVideo ? 'Generating...' : hasVideo ? (showVideo ? 'Hide Video' : 'Show Video') : 'Generate Role Video'}
          </Button>
          <Button
            onClick={() => setExpanded(!expanded)}
            variant="ghost"
          >
            {expanded ? <FiChevronUp className="mr-2" /> : <FiChevronDown className="mr-2" />}
            {expanded ? 'Show Less' : 'View Details'}
          </Button>
        </div>

        {/* Video Player */}
        {showVideo && hasVideo && (
          <div className="pt-4 border-t border-gray-200">
            <VideoPlayer
              videoData={videoData}
              roleName={roleProfile.name}
              onClose={() => setShowVideo(false)}
            />
          </div>
        )}

        {/* Expanded Details */}
        {expanded && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            {/* Description */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">About this Role</h4>
              <p className="text-gray-600">{roleProfile.description}</p>
            </div>

            {/* Matched Skills */}
            {match.matchedSkills.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">✅ Your Matching Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {match.matchedSkills.map(skill => (
                    <Badge key={skill} variant="success">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Gap Skills */}
            {match.gapSkills.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">📚 Skills to Develop</h4>
                <div className="flex flex-wrap gap-2">
                  {match.gapSkills.map(skill => (
                    <Badge key={skill} variant="warning">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Responsibilities */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Key Responsibilities</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {roleProfile.responsibilities.slice(0, 4).map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </div>

            {/* Career Trajectory */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Career Path</h4>
              <p className="text-gray-600">{roleProfile.careerTrajectory}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default RoleMatchCard
