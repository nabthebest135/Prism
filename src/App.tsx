import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import WorldLens from './pages/WorldLens'
import StyleLens from './pages/StyleLens'
import Wardrobe from './pages/Wardrobe'
import Discoveries from './pages/Discoveries'
import Profile from './pages/Profile'
import Onboarding from './pages/Onboarding'
import OutfitAnalysis from './pages/OutfitAnalysis'
import SmartOutfitSuggestion from './pages/SmartOutfitSuggestion'
import { useAuthStore } from './store/authStore'

function App() {
  const { user, initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  // Temporarily skip auth for testing
  // if (user === null) {
  //   return <Onboarding />
  // }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/world-lens" element={<WorldLens />} />
          <Route path="/style-lens" element={<StyleLens />} />
          <Route path="/wardrobe" element={<Wardrobe />} />
          <Route path="/discoveries" element={<Discoveries />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/outfit-analysis" element={<OutfitAnalysis />} />
          <Route path="/smart-outfit" element={<SmartOutfitSuggestion />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App