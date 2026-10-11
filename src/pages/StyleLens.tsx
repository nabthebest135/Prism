import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CameraView from '../components/CameraView'
import AnalysisResult from '../components/AnalysisResult'
import { AIService, parseAIJSON } from '../services/aiService'
import { useWardrobeStore, ClothingItem } from '../store/wardrobeStore'
import { useHistoryStore } from '../store/historyStore'
type StyleMode = 'scan' | 'outfit' | 'care'
const StyleLens = () => {
  const navigate = useNavigate()
  const [mode, setMode] = useState<StyleMode>('scan'),
    [busy, setBusy] = useState(false),
    [text, setText] = useState('')
  const capture = async (image: string) => {
    if (busy) return
    setBusy(true)
    setText('')
    try {
      const ai = new AIService()
      let result: string
      if (mode === 'scan') {
        const response = await ai.analyzeImage(
          image,
          'Identify this clothing item. Return JSON only: {"type":"tops|bottoms|shoes|accessories","color":"primary color","description":"short item name","tags":["style","season"]}. If no clothing is visible, return {"error":"No clothing detected"}.',
          false,
          true
        )
        const item = parseAIJSON<{
          type: ClothingItem['category']
          color: string
          description: string
          tags: string[]
          error?: string
        }>(response.choices[0].message.content)
        if (item.error) throw new Error(item.error)
        if (
          !['tops', 'bottoms', 'shoes', 'accessories'].includes(item.type) ||
          typeof item.description !== 'string' ||
          !item.description.trim() ||
          typeof item.color !== 'string' ||
          !Array.isArray(item.tags)
        )
          throw new Error('Could not identify a clothing item. Try a clearer photo.')
        await useWardrobeStore.getState().addItem({
          name: item.description,
          category: item.type,
          color: item.color,
          tags: item.tags.filter((t) => typeof t === 'string'),
          image_url: 'data:image/jpeg;base64,' + image,
        })
        result = item.description + ' added to your wardrobe.'
      } else {
        await useWardrobeStore.getState().fetchItems()
        const items = useWardrobeStore
          .getState()
          .items.map(({ name, category, color }) => ({ name, category, color }))
        const prompt =
          mode === 'outfit'
            ? 'Give practical outfit feedback on the photo. Suggest combinations using ONLY these available wardrobe items: ' +
              JSON.stringify(items) +
              '. If the wardrobe is empty, give general advice and suggest adding items.'
            : 'Give clothing care advice based on visible fabric and construction. Explain possible wear, fading, and care needs; acknowledge that exact fabric composition and lifespan cannot be determined from a photo.'
        result = (await ai.analyzeImage(image, prompt)).choices[0].message.content
      }
      setText(result)
      useHistoryStore.getState().addAnalysis({
        type: mode === 'scan' ? 'scan' : mode === 'care' ? 'aging' : 'outfit',
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
    <CameraView title="Style Lens" onBack={() => navigate('/')} onCapture={capture} busy={busy}>
      <div className="absolute top-24 left-3 right-3 z-20 flex justify-center gap-2 flex-wrap">
        {(
          [
            { id: 'scan', label: 'Add item' },
            { id: 'outfit', label: 'Outfit' },
            { id: 'care', label: 'Care' },
          ] as { id: StyleMode; label: string }[]
        ).map((m) => (
          <button
            key={m.id}
            disabled={busy}
            onClick={() => {
              setMode(m.id)
              setText('')
            }}
            className={
              'mode-button ' + (mode === m.id ? 'mode-button-active' : 'mode-button-inactive')
            }
          >
            {m.label}
          </button>
        ))}
        <button
          disabled={busy}
          onClick={() => navigate('/try-on')}
          className="mode-button mode-button-inactive"
        >
          Try on
        </button>
      </div>
      {busy && (
        <div
          role="status"
          className="absolute top-1/2 left-4 right-4 text-center text-white bg-black/70 p-4 rounded-xl z-30"
        >
          Analyzing your clothing…
        </div>
      )}
      {text ? (
        <AnalysisResult text={text} onClose={() => setText('')} />
      ) : (
        !busy && (
          <p className="absolute bottom-36 left-4 right-4 text-center text-white">
            Take or upload a clothing photo.
          </p>
        )
      )}
    </CameraView>
  )
}
export default StyleLens
