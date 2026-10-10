import { Link } from 'react-router-dom'
import { Camera, Shirt, CloudSun, Sparkles, MapPin } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useHistoryStore } from '../store/historyStore'
import { WeatherService, WeatherData } from '../services/weatherService'
const Home = () => {
  const { user } = useAuthStore(),
    { analyses } = useHistoryStore()
  const [weather, setWeather] = useState<WeatherData | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('')
  const discovery = analyses.find((a) => a.type === 'discovery')
  const actions = [
    {
      to: '/world-lens',
      title: 'World Lens',
      description: 'Translate text, explore places, and identify objects.',
      icon: Camera,
    },
    {
      to: '/style-lens',
      title: 'Style Lens',
      description: 'Scan clothes into your wardrobe and get styling advice.',
      icon: Shirt,
    },
    {
      to: '/smart-outfit',
      title: 'Smart outfit',
      description: 'Choose an outfit for your occasion and weather.',
      icon: CloudSun,
    },
    {
      to: '/try-on',
      title: 'Virtual try-on',
      description: 'Generate a preview of yourself wearing a garment.',
      icon: Sparkles,
    },
  ]
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-7">
      <header className="pt-8">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl mb-4">
          P
        </div>
        <h1 className="text-3xl font-bold">Hey {user?.name || 'Explorer'}</h1>
        <p className="text-gray-600 mt-2">What would you like to explore today?</p>
      </header>
      <div className="grid sm:grid-cols-2 gap-4">
        {actions.map(({ to, title, description, icon: Icon }) => (
          <Link key={to} to={to} className="glass-card p-5 hover:shadow-2xl transition-shadow">
            <Icon className="text-primary mb-4" size={28} />
            <h2 className="font-bold text-lg">{title}</h2>
            <p className="text-sm text-gray-600 mt-2">{description}</p>
          </Link>
        ))}
      </div>
      <section className="glass-card p-5 space-y-3">
        <h2 className="font-bold">Weather for your outfit</h2>
        {weather ? (
          <>
            <p>
              {weather.temperature}°C · {weather.description}
            </p>
            <p className="text-gray-600">{new WeatherService().getOutfitRecommendation(weather)}</p>
          </>
        ) : (
          <p className="text-gray-600">
            Use your location for current weather, or choose an outfit by occasion.
          </p>
        )}
        <button
          disabled={busy}
          className="text-primary font-medium"
          onClick={async () => {
            setBusy(true)
            setError('')
            try {
              setWeather(await new WeatherService().getCurrentWeather())
            } catch (err) {
              setError((err as Error).message)
            } finally {
              setBusy(false)
            }
          }}
        >
          {busy ? 'Getting weather…' : 'Use current weather'}
        </button>
        {error && (
          <p role="alert" className="text-sm text-gray-600">
            {error}
          </p>
        )}
      </section>
      <section className="glass-card p-5 space-y-3">
        <div className="flex justify-between">
          <h2 className="font-bold flex gap-2">
            <MapPin size={20} />
            Recent discovery
          </h2>
          <Link to="/discoveries" className="text-primary text-sm">
            View all
          </Link>
        </div>
        <p className="text-gray-600">
          {discovery
            ? discovery.result.slice(0, 180) + (discovery.result.length > 180 ? '…' : '')
            : 'Your discoveries will appear here after using World Lens.'}
        </p>
      </section>
      <Link to="/wardrobe" className="block glass-card p-5 text-primary font-bold">
        Open my wardrobe →
      </Link>
      <p className="text-sm text-gray-500">
        Photos are analyzed on Bladefall. Your wardrobe and history stay in this browser.
      </p>
    </div>
  )
}
export default Home
