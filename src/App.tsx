import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import WorldLens from './pages/WorldLens'
import StyleLens from './pages/StyleLens'
import Wardrobe from './pages/Wardrobe'
import Discoveries from './pages/Discoveries'
import Profile from './pages/Profile'
import History from './pages/History'
import Testimonials from './pages/Testimonials'
import Onboarding from './pages/Onboarding'
import OutfitAnalysis from './pages/OutfitAnalysis'
import SmartOutfitSuggestion from './pages/SmartOutfitSuggestion'
import AuthModal from './components/AuthModal'
import { useAuthStore } from './store/authStore'

function App() {
  const { user, initialize } = useAuthStore()
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    initialize()
  }, [initialize])

  // Show auth modal if no user
  if (user === null) {
    return (
      <>
        <Onboarding onGetStarted={() => setShowAuthModal(true)} />
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    )
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/world-lens" element={<WorldLens />} />
          <Route path="/style-lens" element={<StyleLens />} />
          <Route path="/wardrobe" element={<Wardrobe />} />
          <Route path="/discoveries" element={<Discoveries />} />
          <Route path="/history" element={<History />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/outfit-analysis" element={<OutfitAnalysis />} />
          <Route path="/smart-outfit" element={<SmartOutfitSuggestion />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App