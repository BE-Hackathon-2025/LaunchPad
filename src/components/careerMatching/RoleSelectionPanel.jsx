/**
 * Role Selection Panel Component
 * Shows top 3 role matches with video generation and selection
 * Used in onboarding workflow before roadmap generation
 */

import { useEffect, useState } from 'react'
import { useStore } from '../../store/useStore'
import { getTopRoleMatches, calculateAIRoleMatches } from '../../utils/roleMatching'
import { getRoleProfile } from '../../config/roleProfiles'
import { requestRoleExplainerVideo, initializeVideoService } from '../../services/videoGeneration'
import { aiService } from '../../services/ai'
import Card from '../Card'
import Badge from '../Badge'
import VideoPlayer from './VideoPlayer'
import { FiTarget, FiVideo, FiCheck, FiChevronDown, FiChevronUp } from 'react-icons/fi'

const RoleSelectionPanel = ({ selectedRole, onRoleSelect }) => {
  const { profile, resumeData, roleMatches, setRoleMatches, settings, addVideoRequest, videoGenerationRequests } = useStore()
  const [loading, setLoading] = useState(false)
  const [expandedRole, setExpandedRole] = useState(null)
  const [generatingVideos, setGeneratingVideos] = useState({})

  useEffect(() => {
    // Calculate role matches if not already done
    if (profile && roleMatches.length === 0) {
      calculateMatches()
    }
  }, [profile, resumeData])

  const calculateMatches = async () => {
    setLoading(true)

    // Initialize AI service
    console.log('🔧 Initializing AI service...')
    aiService.initialize(settings.apiKey)
    console.log('✅ AI service initialized, demo mode:', aiService.demoMode)

    try {
      // Combine profile with resume data for matching
      const enrichedProfile = {
        ...profile,
        resumeData
      }

      console.log('🔍 Profile for matching:', {
        name: enrichedProfile.name,
        skills: enrichedProfile.currentSkills?.length || 0,
        interests: enrichedProfile.interests?.length || 0,
        resumeSkills: enrichedProfile.resumeData?.parsed?.normalizedSkills?.length || 0,
        experienceLevel: enrichedProfile.experienceLevel
      })

      // Use AI-powered matching for better scores
      console.log('🤖 Starting AI-powered role matching...')
      const matches = await calculateAIRoleMatches(enrichedProfile)

      console.log('✅ AI matches received:', matches.length, 'matches')
      console.log('🎯 Match scores:', matches.map(m => `${m.roleName}: ${m.score}%`))

      setRoleMatches(matches)
    } catch (error) {
      console.error('❌ AI matching error:', error)
      console.error('Error details:', error.message, error.stack)

      // Fallback to algorithmic matching
      console.warn('⚠️ Falling back to algorithmic matching')
      const enrichedProfile = {
        ...profile,
        resumeData
      }
      const fallbackMatches = getTopRoleMatches(enrichedProfile, 3)
      console.log('📊 Fallback matches:', fallbackMatches.map(m => `${m.roleName}: ${m.score}%`))
      setRoleMatches(fallbackMatches)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateVideo = async (roleId) => {
    setGeneratingVideos(prev => ({ ...prev, [roleId]: true }))

    try {
      // Initialize video service with API key
      initializeVideoService(settings.apiKey)

      const videoResult = await requestRoleExplainerVideo(roleId, profile)
      addVideoRequest(roleId, videoResult)

      console.log('✅ Video generated for', roleId, ':', videoResult)
    } catch (error) {
      console.error('Video generation error:', error)
      alert('Failed to generate video. Please try again.')
    } finally {
      setGeneratingVideos(prev => ({ ...prev, [roleId]: false }))
    }
  }

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="ml-3 text-gray-600">Calculating your role matches...</p>
        </div>
      </Card>
    )
  }

  if (!profile || roleMatches.length === 0) {
    return (
      <Card>
        <div className="text-center p-8">
          <FiTarget className="mx-auto text-5xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No matches calculated yet
          </h3>
          <p className="text-gray-600">
            Complete your profile to see personalized role recommendations
          </p>
        </div>
      </Card>
    )
  }

  const topMatches = roleMatches.slice(0, 3)

  return (
    <div className="space-y-4">
      {topMatches.map((match, index) => {
        const roleProfile = getRoleProfile(match.roleId)
        if (!roleProfile) return null

        const isSelected = selectedRole === match.roleId
        const isExpanded = expandedRole === match.roleId
        const videoData = videoGenerationRequests[match.roleId]
        const hasVideo = !!videoData
        const isGenerating = generatingVideos[match.roleId]

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

        return (
          <Card
            key={match.roleId}
            className={`cursor-pointer transition-all ${
              isSelected
                ? 'ring-4 ring-primary shadow-xl'
                : 'hover:shadow-lg hover:border-primary/30'
            }`}
            onClick={() => onRoleSelect(match.roleId)}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {/* Rank Badge */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold text-sm">
                      #{index + 1}
                    </div>

                    {/* Role Name */}
                    <h3 className="text-xl font-bold text-gray-900">
                      {roleProfile.name}
                    </h3>

                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-primary text-white rounded-full text-sm font-medium">
                        <FiCheck className="text-lg" />
                        Selected
                      </div>
                    )}
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
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Matched</p>
                  <p className="text-lg font-bold text-green-700">
                    {match.matchedSkills.length}
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">To Learn</p>
                  <p className="text-lg font-bold text-red-700">
                    {match.gapSkills.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Bonus</p>
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
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (hasVideo) {
                      setExpandedRole(isExpanded ? null : match.roleId)
                    } else {
                      handleGenerateVideo(match.roleId)
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    hasVideo
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'border-2 border-primary text-primary hover:bg-primary/5'
                  }`}
                  disabled={isGenerating}
                >
                  <FiVideo />
                  {isGenerating ? 'Generating...' : hasVideo ? 'Watch Role Video' : 'Generate Role Video'}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setExpandedRole(isExpanded ? null : match.roleId)
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary transition-all"
                >
                  {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                  {isExpanded ? 'Hide Details' : 'View Details'}
                </button>
              </div>

              {/* Video Player */}
              {isExpanded && hasVideo && (
                <div className="pt-4 border-t border-gray-200">
                  <VideoPlayer
                    videoData={videoData}
                    roleName={roleProfile.name}
                    onClose={() => setExpandedRole(null)}
                  />
                </div>
              )}

              {/* Expanded Details */}
              {isExpanded && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
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
                        {match.gapSkills.slice(0, 5).map(skill => (
                          <Badge key={skill} variant="warning">{skill}</Badge>
                        ))}
                        {match.gapSkills.length > 5 && (
                          <Badge variant="default">+{match.gapSkills.length - 5} more</Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Career Path */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Career Trajectory</h4>
                    <p className="text-gray-600">{roleProfile.careerTrajectory}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}

export default RoleSelectionPanel
