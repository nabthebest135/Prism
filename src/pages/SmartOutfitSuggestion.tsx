import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWardrobeStore } from '../store/wardrobeStore'
import { useHistoryStore } from '../store/historyStore'
import { WeatherService, WeatherData } from '../services/weatherService'
import { WardrobeAnalysisService, OutfitAnalysis } from '../services/wardrobeAnalysisService'
const SmartOutfitSuggestion = () => {
  const navigate = useNavigate()
  const [occasion, setOccasion] = useState('daily casual'),
    [weather, setWeather] = useState<WeatherData | null>(null)
  const [suggestion, setSuggestion] = useState<OutfitAnalysis | null>(null),
    [busy, setBusy] = useState(false),
    [weatherBusy, setWeatherBusy] = useState(false)
  const [error, setError] = useState(''),
    [weatherError, setWeatherError] = useState('')
  const generate = async () => {
    setBusy(true)
    setError('')
    setSuggestion(null)
    try {
      await useWardrobeStore.getState().fetchItems()
      const items = useWardrobeStore.getState().items
      const result = await new WardrobeAnalysisService().suggestOutfitForOccasion(
        items,
        occasion,
        weather
      )
      setSuggestion(result)
      useHistoryStore.getState().addAnalysis({
        type: 'outfit',
        result: result.recommendation + '\n' + result.reasoning,
        mode: occasion,
      })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="max-w-2xl mx-auto p-5 space-y-5">
      <button onClick={() => navigate('/')} className="text-primary">
        ← Home
      </button>
      <h1 className="text-2xl font-bold">Smart outfit</h1>
      <label className="block">
        Occasion
        <select
          aria-label="Occasion"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
          className="block p-3 rounded-xl border mt-2 w-full"
        >
          {['daily casual', 'work', 'formal event', 'sport', 'social gathering'].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </label>
      <div className="bg-white rounded-xl p-4 space-y-3">
        <p>
          {weather
            ? weather.temperature + '°C · ' + weather.description
            : 'Weather is optional. You can get outfit suggestions without location access.'}
        </p>
        <button
          disabled={weatherBusy}
          className="text-primary"
          onClick={async () => {
            setWeatherBusy(true)
            setWeatherError('')
            try {
              setWeather(await new WeatherService().getCurrentWeather())
            } catch (err) {
              setWeatherError((err as Error).message)
            } finally {
              setWeatherBusy(false)
            }
          }}
        >
          {weatherBusy ? 'Getting weather…' : 'Use current weather'}
        </button>
        {weatherError && (
          <p role="alert" className="text-gray-600">
            {weatherError}
          </p>
        )}
      </div>
      <button
        disabled={busy}
        onClick={() => void generate()}
        className="bg-primary text-white rounded-xl p-4 w-full disabled:opacity-50"
      >
        {busy ? 'Choosing from your wardrobe…' : 'Suggest outfit'}
      </button>
      {error && (
        <p role="alert" className="bg-red-50 p-4 rounded-xl text-red-700">
          {error}{' '}
          <button onClick={() => navigate('/style-lens')} className="underline">
            Open Style Lens
          </button>
        </p>
      )}
      {suggestion && (
        <div className="bg-white p-5 rounded-xl space-y-4">
          <h2 className="font-bold text-xl">Your outfit</h2>
          <p>{suggestion.recommendation}</p>
          <ul className="list-disc pl-5">
            {suggestion.suggestedItems.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
          <p>{suggestion.reasoning}</p>
          <p className="text-gray-500 text-sm">
            Subjective style rating: {suggestion.styleRating}/10
          </p>
        </div>
      )}
    </div>
  )
}
export default SmartOutfitSuggestion
