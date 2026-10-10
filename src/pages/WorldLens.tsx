import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CameraView from '../components/CameraView'
import AnalysisResult from '../components/AnalysisResult'
import { AIService } from '../services/aiService'
import { useHistoryStore } from '../store/historyStore'
type LensMode = 'translate' | 'discover' | 'scan'
const languages = [
  'English',
  'Urdu',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Russian',
  'Japanese',
  'Korean',
  'Chinese',
  'Arabic',
  'Hindi',
]
const WorldLens = () => {
  const navigate = useNavigate()
  const [mode, setMode] = useState<LensMode>('translate'),
    [language, setLanguage] = useState('English')
  const [text, setText] = useState(''),
    [busy, setBusy] = useState(false)
  const capture = async (image: string) => {
    if (busy) return
    setBusy(true)
    setText('')
    try {
      const prompt =
        mode === 'translate'
          ? 'Read all legible text in this image and translate it to ' +
            language +
            '. Include the original text. If there is no text or it is unreadable, say so.'
          : mode === 'discover'
            ? 'Describe this building or landmark. Identify it only if you are confident. Separate visible features from uncertain historical information. Do not invent names or dates.'
            : 'Identify the main object and give useful practical information. State uncertainty.'
      const response = await new AIService().analyzeImage(image, prompt, false)
      const result = response.choices[0].message.content
      setText(result)
      useHistoryStore
        .getState()
        .addAnalysis({
          type: mode === 'translate' ? 'translation' : mode === 'discover' ? 'discovery' : 'scan',
          result,
          image: 'data:image/jpeg;base64,' + image,
          mode,
        })
    } catch (error) {
      setText((error as Error).message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <CameraView title="World Lens" onBack={() => navigate('/')} onCapture={capture} busy={busy}>
      <div className="absolute top-24 left-4 right-4 z-20 flex justify-center gap-2">
        {(['translate', 'discover', 'scan'] as LensMode[]).map((id) => (
          <button
            disabled={busy}
            key={id}
            onClick={() => {
              setMode(id)
              setText('')
            }}
            className={
              'mode-button capitalize ' +
              (mode === id ? 'mode-button-active' : 'mode-button-inactive')
            }
          >
            {id}
          </button>
        ))}
      </div>
      {mode === 'translate' && (
        <label className="absolute top-36 left-4 z-20 text-white">
          Translate to{' '}
          <select
            aria-label="Translation language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-gray-900 rounded-lg p-2 ml-2"
          >
            {languages.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </label>
      )}
      {busy && (
        <div
          role="status"
          className="absolute top-1/2 left-4 right-4 z-30 text-center text-white bg-black/70 rounded-xl p-4"
        >
          Analyzing your photo…
        </div>
      )}
      {text ? (
        <AnalysisResult text={text} onClose={() => setText('')} />
      ) : (
        !busy && (
          <p className="absolute bottom-36 left-4 right-4 text-center text-white">
            Take or upload a photo to{' '}
            {mode === 'translate'
              ? 'translate text'
              : mode === 'discover'
                ? 'explore a place'
                : 'identify an object'}
            .
          </p>
        )
      )}
    </CameraView>
  )
}
export default WorldLens
