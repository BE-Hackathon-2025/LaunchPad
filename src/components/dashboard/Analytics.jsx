import Card from '../Card'
import Badge from '../Badge'

// Mock data for analytics demo
const mockAnalyticsData = {
  totalStudents: 1247,
  activeStudents: 892,
  completionRate: 67,
  avgRoadmapProgress: 58,
  popularRoles: [
    { role: 'Software Engineer', count: 487, percentage: 39 },
    { role: 'Data Analyst', count: 312, percentage: 25 },
    { role: 'Cybersecurity', count: 186, percentage: 15 },
    { role: 'Product Manager', count: 149, percentage: 12 },
    { role: 'UX Designer', count: 113, percentage: 9 }
  ],
  topMissingSkills: [
    { skill: 'Cloud Computing', count: 523, percentage: 42 },
    { skill: 'System Design', count: 487, percentage: 39 },
    { skill: 'Data Structures & Algorithms', count: 456, percentage: 37 },
    { skill: 'SQL', count: 398, percentage: 32 },
    { skill: 'Machine Learning', count: 367, percentage: 29 }
  ],
  sponsorEngagement: [
    { sponsor: 'Fidelity', interactions: 342, applications: 89 },
    { sponsor: 'Verizon', interactions: 298, applications: 76 },
    { sponsor: 'PepsiCo', interactions: 267, applications: 63 },
    { sponsor: "McDonald's", interactions: 234, applications: 58 },
    { sponsor: 'Toyota', interactions: 198, applications: 47 },
    { sponsor: 'American Airlines', interactions: 176, applications: 41 }
  ],
  timeToFirstMilestone: {
    avg: '4.2 days',
    median: '3 days'
  },
  interviewPractice: {
    totalSessions: 3421,
    avgScore: 72,
    mostPracticedRole: 'Software Engineer'
  }
}

const Analytics = () => {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics Dashboard 📊
          </h1>
          <p className="text-gray-600">
            Platform insights for institutional partners and sponsors (Demo View)
          </p>
          <Badge variant="warning" size="sm" className="mt-2">
            Mock Data for Demonstration
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {mockAnalyticsData.totalStudents.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Students</div>
          </Card>

          <Card className="text-center">
            <div className="text-4xl font-bold text-secondary mb-2">
              {mockAnalyticsData.activeStudents.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Active Students</div>
          </Card>

          <Card className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {mockAnalyticsData.completionRate}%
            </div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </Card>

          <Card className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {mockAnalyticsData.avgRoadmapProgress}%
            </div>
            <div className="text-sm text-gray-600">Avg Roadmap Progress</div>
          </Card>
        </div>

        {/* Popular Roles */}
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Most Popular Target Roles</h3>
          <div className="space-y-4">
            {mockAnalyticsData.popularRoles.map(role => (
              <div key={role.role}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{role.role}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{role.count} students</span>
                    <span className="text-sm font-bold text-primary">{role.percentage}%</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                    style={{ width: `${role.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Missing Skills */}
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Top Missing Skills</h3>
          <p className="text-sm text-gray-600 mb-6">
            Skills students need most to meet role requirements
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {mockAnalyticsData.topMissingSkills.map(item => (
              <div key={item.skill} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">{item.skill}</div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-orange-600">{item.percentage}%</div>
                  <div className="text-xs text-gray-500">{item.count}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-gray-700">
              💡 <strong>Insight:</strong> Consider offering workshops or resources for Cloud Computing
              and System Design to address the most common skill gaps.
            </p>
          </div>
        </Card>

        {/* Sponsor Engagement */}
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Sponsor Engagement</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Sponsor</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Interactions</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Applications</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {mockAnalyticsData.sponsorEngagement.map(sponsor => (
                  <tr key={sponsor.sponsor} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{sponsor.sponsor}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{sponsor.interactions}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{sponsor.applications}</td>
                    <td className="py-3 px-4 text-right">
                      <Badge variant="success" size="sm">
                        {Math.round((sponsor.applications / sponsor.interactions) * 100)}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Interview Practice Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Interview Practice</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Total Sessions</span>
                <span className="text-2xl font-bold text-gray-900">
                  {mockAnalyticsData.interviewPractice.totalSessions.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Average Score</span>
                <span className="text-2xl font-bold text-green-600">
                  {mockAnalyticsData.interviewPractice.avgScore}%
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Most Practiced Role</span>
                <Badge variant="primary" size="lg">
                  {mockAnalyticsData.interviewPractice.mostPracticedRole}
                </Badge>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Engagement Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Time to First Milestone</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {mockAnalyticsData.timeToFirstMilestone.avg}
                  </div>
                  <div className="text-xs text-gray-500">
                    Median: {mockAnalyticsData.timeToFirstMilestone.median}
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
                <div className="text-sm font-semibold text-gray-900 mb-1">
                  Student Satisfaction
                </div>
                <div className="text-3xl font-bold text-primary mb-1">94%</div>
                <div className="text-xs text-gray-600">
                  Based on surveys and feedback
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Impact Statement */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20">
          <div className="text-center py-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              LaunchPad Impact
            </h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Students using LaunchPad are <strong>3.2x more likely</strong> to complete career
              development milestones and <strong>2.8x more likely</strong> to apply to internships
              compared to traditional career services.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Analytics
