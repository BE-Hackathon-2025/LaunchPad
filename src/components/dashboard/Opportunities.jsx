import { useState, useMemo } from 'react'
import { useStore } from '../../store/useStore'
import { calculateFitScore } from '../../utils/matching'
import { filterOpportunitiesByUserType, USER_TYPES } from '../../config/userTypes'
import Card from '../Card'
import Badge from '../Badge'
import Button from '../Button'
import CareerMatchPanel from '../careerMatching/CareerMatchPanel'
import opportunitiesData from '../../data/opportunities.json'
import sponsorsData from '../../data/sponsors.json'

const Opportunities = () => {
  const { profile, roadmap } = useStore()
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedSponsor, setSelectedSponsor] = useState('all')

  // Get user type from profile
  const userType = profile?.userType || USER_TYPES.STUDENT

  // Filter opportunities by user type first, then calculate fit scores
  const opportunitiesWithScores = useMemo(() => {
    // Apply user type filtering
    const userTypeFiltered = filterOpportunitiesByUserType(
      opportunitiesData.opportunities,
      userType
    )

    // Calculate fit scores and combine with relevance scores
    return userTypeFiltered.map(opp => {
      const fitResult = calculateFitScore(profile, roadmap, opp)
      const combinedScore = (fitResult.score * 0.7) + ((opp.relevanceScore || 50) * 0.3)
      return { ...opp, fitResult: { ...fitResult, score: combinedScore } }
    }).sort((a, b) => b.fitResult.score - a.fitResult.score)
  }, [profile, roadmap, userType])

  // Filter opportunities
  const filteredOpportunities = opportunitiesWithScores.filter(opp => {
    if (selectedRole !== 'all' && opp.role_type !== selectedRole) return false
    if (selectedSponsor !== 'all' && opp.sponsor_tag !== selectedSponsor) return false
    return true
  })

  const roleTypes = [...new Set(opportunitiesData.opportunities.map(o => o.role_type))]
  const sponsors = sponsorsData.sponsors

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Opportunities 🎯
          </h1>
          <p className="text-gray-600">
            Discover internships and roles matched to your profile with transparent fit scores
          </p>
        </div>

        {/* Career Match - Compact View */}
        <CareerMatchPanel limit={1} showTitle={false} compact={true} />

        {/* Filters */}
        <Card>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Roles</option>
                {roleTypes.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Sponsor
              </label>
              <select
                value={selectedSponsor}
                onChange={(e) => setSelectedSponsor(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Sponsors</option>
                {sponsors.map(sponsor => (
                  <option key={sponsor.id} value={sponsor.name}>{sponsor.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredOpportunities.length} opportunities
          </div>
        </Card>

        {/* Sponsor Spotlight */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Partner Companies</h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sponsors.map(sponsor => (
              <button
                key={sponsor.id}
                onClick={() => setSelectedSponsor(selectedSponsor === sponsor.name ? 'all' : sponsor.name)}
                className={`
                  p-4 rounded-xl border-2 transition-all text-center
                  ${selectedSponsor === sponsor.name
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary/50 bg-white'
                  }
                `}
              >
                <div className="h-12 mb-2 flex items-center justify-center">
                  <img
                    src={sponsor.logo}
                    alt={`${sponsor.name} logo`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="text-xs font-semibold text-gray-700">
                  {sponsor.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Opportunities List */}
        <div className="space-y-4">
          {filteredOpportunities.map(opp => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}

          {filteredOpportunities.length === 0 && (
            <Card>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No opportunities found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

const OpportunityCard = ({ opportunity }) => {
  const [expanded, setExpanded] = useState(false)
  const { fitResult } = opportunity

  const fitColor = fitResult.score >= 80 ? 'text-green-600' :
                   fitResult.score >= 60 ? 'text-yellow-600' :
                   'text-orange-600'

  const fitBgColor = fitResult.score >= 80 ? 'bg-green-50 border-green-200' :
                     fitResult.score >= 60 ? 'bg-yellow-50 border-yellow-200' :
                     'bg-orange-50 border-orange-200'

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900">
                {opportunity.title}
              </h3>
              <Badge variant="sponsor" size="sm">
                {opportunity.sponsor_tag}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                🏢 {opportunity.company}
              </span>
              <span className="flex items-center gap-1">
                📍 {opportunity.location_type}
              </span>
              <span className="flex items-center gap-1">
                ⏱️ {opportunity.duration}
              </span>
            </div>
          </div>

          {/* Fit Score */}
          <div className={`flex-shrink-0 text-center px-6 py-3 rounded-xl border-2 ${fitBgColor}`}>
            <div className={`text-3xl font-bold ${fitColor}`}>
              {fitResult.score}%
            </div>
            <div className="text-xs font-semibold text-gray-600">
              Fit Score
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700">
          {opportunity.description}
        </p>

        {/* Skills */}
        <div className="space-y-3">
          <div>
            <div className="text-xs font-semibold text-gray-700 mb-2">Required Skills:</div>
            <div className="flex flex-wrap gap-2">
              {opportunity.required_skills.map(skill => {
                const isMatched = fitResult.matchedSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
                return (
                  <Badge
                    key={skill}
                    variant={isMatched ? 'success' : 'default'}
                    size="sm"
                  >
                    {isMatched && '✓ '}
                    {skill}
                  </Badge>
                )
              })}
            </div>
          </div>

          {expanded && opportunity.preferred_skills.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-700 mb-2">Preferred Skills:</div>
              <div className="flex flex-wrap gap-2">
                {opportunity.preferred_skills.map(skill => {
                  const isMatched = fitResult.matchedSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
                  return (
                    <Badge
                      key={skill}
                      variant={isMatched ? 'success' : 'default'}
                      size="sm"
                    >
                      {isMatched && '✓ '}
                      {skill}
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Missing Skills */}
        {fitResult.missingSkills.length > 0 && expanded && (
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span>⚠️</span>
              Skills to Add ({fitResult.missingSkills.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {fitResult.missingSkills.map(skill => (
                <Badge key={skill} variant="warning" size="sm">
                  {skill}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Consider adding these skills to your roadmap to improve your fit score.
            </p>
          </div>
        )}

        {/* Fit Breakdown */}
        {expanded && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="font-semibold text-gray-900 mb-3">Fit Score Breakdown:</div>
            <div className="space-y-2">
              {fitResult.factors.map((factor, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">
                    {factor.name}
                    {factor.details && <span className="text-gray-500 ml-2">({factor.details})</span>}
                  </span>
                  <span className="font-semibold text-gray-900">+{factor.points}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => window.open(opportunity.application_link, '_blank', 'noopener,noreferrer')}
          >
            Apply Now
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show Less' : 'View Details'}
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default Opportunities
