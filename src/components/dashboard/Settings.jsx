import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { USER_TYPES, USER_TYPE_INFO } from '../../config/userTypes'
import Card from '../Card'
import Button from '../Button'
import Input from '../Input'
import Badge from '../Badge'
import ResumeUpload from '../careerMatching/ResumeUpload'
import { FiCheckCircle } from 'react-icons/fi'

const Settings = () => {
  const { settings, updateSettings, profile, setUserType } = useStore()
  const [apiKey, setApiKey] = useState(settings.apiKey || '')
  const [saved, setSaved] = useState(false)
  const [userTypeChanged, setUserTypeChanged] = useState(false)

  const handleSave = () => {
    updateSettings({ apiKey: apiKey.trim() })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleToggleDemoMode = () => {
    updateSettings({ demoMode: !settings.demoMode })
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Settings ⚙️
          </h1>
          <p className="text-gray-600">
            Configure your LaunchPad experience
          </p>
        </div>

        {/* User Type Selection */}
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-4">User Type</h3>
          <p className="text-gray-600 mb-6">
            Your user type affects roadmap structure, resource recommendations, and opportunity matching.
          </p>
          <div className="space-y-3">
            {Object.entries(USER_TYPE_INFO).map(([type, info]) => (
              <button
                key={type}
                onClick={() => {
                  setUserType(type)
                  setUserTypeChanged(true)
                  setTimeout(() => setUserTypeChanged(false), 3000)
                }}
                className={`
                  w-full p-4 rounded-xl border-2 transition-all duration-200 text-left
                  ${profile?.userType === type
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{info.icon}</div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                      {info.label}
                      {profile?.userType === type && (
                        <FiCheckCircle className="text-primary" />
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {info.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {userTypeChanged && (
            <Badge variant="success" size="md" className="mt-4">
              ✓ User type updated! Your roadmap and recommendations will reflect this change.
            </Badge>
          )}
        </Card>

        {/* Profile Info */}
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Profile Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Name</span>
              <span className="font-semibold text-gray-900">{profile?.name}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Major</span>
              <span className="font-semibold text-gray-900">{profile?.major}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Experience Level</span>
              <Badge variant="default">
                {profile?.experienceLevel?.charAt(0).toUpperCase() + profile?.experienceLevel?.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Graduation Timeline</span>
              <span className="font-semibold text-gray-900">{profile?.graduationTimeline}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Location</span>
              <span className="font-semibold text-gray-900">{profile?.location}</span>
            </div>
          </div>
        </Card>

        {/* Resume Upload */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Resume Management</h3>
          <p className="text-gray-600 mb-4">
            Upload your resume to automatically extract skills and improve your career matches.
          </p>
          <ResumeUpload showCompact={true} />
        </div>

        {/* AI Configuration */}
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-4">AI Configuration</h3>

          {/* Demo Mode Toggle */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">Demo Mode</div>
                <p className="text-sm text-gray-600">
                  Use mock AI responses instead of calling OpenAI API. Perfect for testing without an API key.
                </p>
              </div>
              <button
                onClick={handleToggleDemoMode}
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
                  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                  ${settings.demoMode ? 'bg-primary' : 'bg-gray-200'}
                `}
              >
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
                    transition duration-200 ease-in-out
                    ${settings.demoMode ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
            {settings.demoMode && (
              <Badge variant="warning" size="sm" className="mt-3">
                Currently in Demo Mode
              </Badge>
            )}
          </div>

          {/* API Key Input */}
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-900 mb-2">
                OpenAI API Key
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Enter your OpenAI API key to enable full AI features. Your key is stored locally and never sent to our servers.
              </p>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                helperText="Get your API key from platform.openai.com"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={handleSave} disabled={!apiKey.trim()}>
                Save API Key
              </Button>
              {saved && (
                <Badge variant="success" size="md">
                  ✓ Saved successfully!
                </Badge>
              )}
            </div>

            {!settings.demoMode && !apiKey.trim() && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  ⚠️ No API key configured. AI features will use demo mode. Add your OpenAI API key above to enable full functionality.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">About API Usage</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your API key is stored securely in your browser's local storage</li>
              <li>• LaunchPad makes direct calls to OpenAI from your browser</li>
              <li>• You have full control over your API usage and costs</li>
              <li>• Typical session costs less than $0.50</li>
            </ul>
          </div>
        </Card>

        {/* Data Management */}
        <Card className="border-2 border-red-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Data Management</h3>
          <p className="text-sm text-gray-600 mb-4">
            All your data is stored locally in your browser. No data is sent to external servers.
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900 mb-1">Export Data</div>
              <p className="text-sm text-gray-600 mb-3">
                Download a copy of your profile, roadmap, and progress as JSON.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  const data = {
                    profile,
                    roadmap: useStore.getState().roadmap,
                    chatHistory: useStore.getState().chatHistory,
                    interviewSessions: useStore.getState().interviewSessions,
                    portfolio: useStore.getState().portfolio,
                    exportDate: new Date().toISOString()
                  }
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `launchpad-data-${Date.now()}.json`
                  a.click()
                }}
              >
                Download Data
              </Button>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="font-semibold text-red-900 mb-1">Clear All Data</div>
              <p className="text-sm text-red-700 mb-3">
                This will permanently delete your profile, roadmap, and all progress. This cannot be undone.
              </p>
              <Button
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50"
                onClick={() => {
                  if (confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
                    useStore.getState().reset()
                    window.location.href = '/'
                  }
                }}
              >
                Clear All Data
              </Button>
            </div>
          </div>
        </Card>

        {/* About */}
        <Card>
          <h3 className="text-xl font-bold text-gray-900 mb-4">About LaunchPad</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong className="text-gray-900">Version:</strong> 1.0.0
            </p>
            <p>
              LaunchPad is an AI-powered career operating system designed to help students
              navigate their path to meaningful tech careers with clarity and confidence.
            </p>
            <p>
              Built with React, powered by GPT, and designed for students at HBCUs,
              community colleges, and universities nationwide.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Settings
