import { useState } from 'react'
import { Camera, MapPin, Shirt, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

interface OnboardingProps {
  onGetStarted?: () => void
}

const Onboarding = ({ onGetStarted }: OnboardingProps) => {
  const [step, setStep] = useState(0)
  const [formData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const { signUp } = useAuthStore()

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
            onClick={step === slides.length - 1 ? onGetStarted : handleNext}
            className="w-full bg-white text-primary font-semibold py-4 rounded-2xl flex items-center justify-center space-x-2 active:scale-95 transition-transform"
          >
            <span>{step === slides.length - 1 ? 'Get Started' : 'Next'}</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    )
  }

  // This should never render since we handle auth in the modal
  return null
}

export default Onboarding