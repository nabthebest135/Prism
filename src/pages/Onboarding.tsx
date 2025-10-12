import { useState } from 'react'
import { Camera, MapPin, Shirt, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const Onboarding = () => {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const { signUp, loading } = useAuthStore()

  const slides = [
    {
      icon: Camera,
      title: 'Discover the World',
      description: 'Point your camera at any text or landmark to instantly translate and learn fascinating stories'
    },
    {
      icon: Shirt,
      title: 'Smart Wardrobe',
      description: 'Digitize your clothes and get AI-powered outfit recommendations based on weather and occasions'
    },
    {
      icon: MapPin,
      title: 'Gamified Exploration',
      description: 'Complete quests, earn achievements, and unlock hidden stories about places around you'
    }
  ]

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1)
    } else {
      setStep(slides.length)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signUp(formData.email, formData.password, formData.name)
    } catch (error) {
      console.error('Sign up error:', error)
    }
  }

  if (step < slides.length) {
    const slide = slides[step]
    const Icon = slide.icon

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-accent flex flex-col items-center justify-center p-6 text-white">
        <div className="text-center space-y-8 max-w-sm">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto">
            <Icon size={48} />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{slide.title}</h1>
            <p className="text-lg opacity-90 leading-relaxed">{slide.description}</p>
          </div>

          <div className="flex justify-center space-x-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === step ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-white text-primary font-semibold py-4 rounded-2xl flex items-center justify-center space-x-2 active:scale-95 transition-transform"
          >
            <span>{step === slides.length - 1 ? 'Get Started' : 'Next'}</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center p-6">
      <div className="max-w-sm mx-auto w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Prism</h1>
          <p className="text-gray-600">Create your account to start exploring</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Create a password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold py-4 rounded-xl disabled:opacity-50 active:scale-95 transition-transform"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Onboarding