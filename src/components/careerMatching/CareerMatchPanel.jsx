/**
 * Career Match Panel Component
 * Compact panel showing top role matches
 * Can be integrated into Onboarding completion, Roadmap, or Opportunities
 */

import { useEffect, useState } from 'react'
import { useStore } from '../../store/useStore'
import { getTopRoleMatches, calculateAIRoleMatches } from '../../utils/roleMatching'
import { getRoleProfile } from '../../config/roleProfiles'
import { aiService } from '../../services/ai'
import RoleMatchCard from './RoleMatchCard'
import Card from '../Card'
import { FiTarget, FiTrendingUp } from 'react-icons/fi'

const CareerMatchPanel = ({ limit = 3, showTitle = true, compact = false }) => {
  const { profile, resumeData, roleMatches, setRoleMatches, settings } = useStore()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Calculate role matches if profile exists
    if (profile && roleMatches.length === 0) {
      calculateMatches()
    }
  }, [profile, resumeData])

  const calculateMatches = async () => {
    setLoading(true)

    // Initialize AI service first
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
      const fallbackMatches = getTopRoleMatches(enrichedProfile, limit)
      console.log('📊 Fallback matches:', fallbackMatches.map(m => `${m.roleName}: ${m.score}%`))
      setRoleMatches(fallbackMatches)
    } finally {
      setLoading(false)
    }
  }

  if (!profile) {
    return null
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

  // Compact view for headers/sidebars
  if (compact) {
    const topMatch = roleMatches[0]
    if (!topMatch) return null

    const roleProfile = getRoleProfile(topMatch.roleId)
    if (!roleProfile) return null

    return (
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-xl font-bold">
            {topMatch.score}%
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">Top Match</p>
            <p className="font-bold text-gray-900">{roleProfile.name}</p>
          </div>
          <FiTarget className="text-2xl text-primary" />
        </div>
      </Card>
    )
  }

  // Full view
  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="flex items-center gap-3">
          <FiTrendingUp className="text-3xl text-primary" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Top Role Matches</h2>
            <p className="text-gray-600">
              Based on your profile, skills, and experience
            </p>
          </div>
        </div>
      )}

      {roleMatches.length === 0 ? (
        <Card>
          <div className="text-center p-8">
            <FiTarget className="mx-auto text-5xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No matches calculated yet
            </h3>
            <p className="text-gray-600 mb-4">
              Complete your profile to see personalized role recommendations
            </p>
            <button
              onClick={calculateMatches}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Calculate Matches
            </button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {roleMatches.slice(0, limit).map((match, index) => (
            <RoleMatchCard
              key={match.roleId}
              match={match}
              rank={index + 1}
            />
          ))}
        </div>
      )}

      {roleMatches.length > limit && (
        <p className="text-center text-gray-600">
          Showing top {limit} of {roleMatches.length} matches
        </p>
      )}
    </div>
  )
}

export default CareerMatchPanel
