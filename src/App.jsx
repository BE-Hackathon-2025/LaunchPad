import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import Landing from './pages/Landing'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'

function App() {
  const { profile, settings } = useStore()
  const hasCompletedOnboarding = profile?.id

  // Debug: Log settings on mount
  useEffect(() => {
    console.log('🔧 App Settings:', {
      hasApiKey: !!settings.apiKey,
      apiKeyPrefix: settings.apiKey ? settings.apiKey.substring(0, 10) + '...' : 'none',
      demoMode: settings.demoMode
    })
  }, [settings])

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route
            path="/dashboard/*"
            element={hasCompletedOnboarding ? <Dashboard /> : <Navigate to="/onboarding" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
