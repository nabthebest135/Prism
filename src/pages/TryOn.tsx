import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { readPhoto } from '../lib/images'
import { useWardrobeStore } from '../store/wardrobeStore'
import { useHistoryStore } from '../store/historyStore'
const TryOn = () => {
  const navigate = useNavigate()
  const { items, fetchItems } = useWardrobeStore()
  const [person, setPerson] = useState(''),
    [garment, setGarment] = useState(''),
    [result, setResult] = useState('')
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [painted, setPainted] = useState(false),
    [brush, setBrush] = useState(30)
  const canvas = useRef<HTMLCanvasElement>(null),
    mask = useRef<HTMLCanvasElement | null>(null),
    painting = useRef(false)
  useEffect(() => {
    void fetchItems()
  }, [fetchItems])
  useEffect(() => {
    if (!person) return
    let cancelled = false
    const image = new Image()
    image.onload = () => {
      if (cancelled || !canvas.current) return
      canvas.current.width = image.width
      canvas.current.height = image.height
      canvas.current.getContext('2d')!.clearRect(0, 0, image.width, image.height)
      mask.current = document.createElement('canvas')
      mask.current.width = image.width
      mask.current.height = image.height
      const ctx = mask.current.getContext('2d')!
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, image.width, image.height)
      setPainted(false)
      setResult('')
    }
    image.src = person
    return () => {
      cancelled = true
    }
  }, [person])
  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!painting.current || busy || !canvas.current || !mask.current) return
    const rect = canvas.current.getBoundingClientRect(),
      scale = canvas.current.width / rect.width
    const x = (event.clientX - rect.left) * scale,
      y = (event.clientY - rect.top) * scale
    for (const [surface, color] of [
      [canvas.current, 'rgba(99,102,241,0.45)'],
      [mask.current, 'white'],
    ] as const) {
      const ctx = surface.getContext('2d')!
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, (brush * scale) / 2, 0, Math.PI * 2)
      ctx.fill()
    }
    setPainted(true)
    setResult('')
  }
  const generate = async () => {
    if (!person || !garment || !painted || !mask.current || busy) return
    setBusy(true)
    setError('')
    setResult('')
    try {
      const response = await fetch('/api/tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          person,
          garment,
          mask: mask.current.toDataURL('image/png'),
          seed: Math.floor(Math.random() * 1000000),
        }),
        signal: AbortSignal.timeout(610000),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Try-on failed. Please retry.')
      if (typeof data.image !== 'string' || !data.image.startsWith('data:image/'))
        throw new Error('The model returned no preview.')
      setResult(data.image)
      useHistoryStore
        .getState()
        .addAnalysis({
          type: 'outfit',
          result: 'Generated virtual try-on preview with CatVTON.',
          image: data.image,
          mode: 'try-on',
        })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }
  const upload = async (file: File | undefined, set: (v: string) => void) => {
    if (!file) return
    try {
      setError('')
      set(await readPhoto(file))
      setResult('')
    } catch (err) {
      setError((err as Error).message)
    }
  }
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-5">
      <button onClick={() => navigate('/style-lens')} className="text-primary">
        ← Style Lens
      </button>
      <h1 className="text-2xl font-bold">Virtual try-on</h1>
      <p className="text-gray-600">
        Choose a clear person photo and a garment photo. Paint over the clothing to replace, keeping
        the face and hands clear. The generated preview is an approximation of appearance, not a fit
        measurement.
      </p>
      <label className="block bg-white rounded-xl p-4 border">
        1. Person photo
        <input
          aria-label="Person photo"
          disabled={busy}
          type="file"
          accept="image/*"
          className="block mt-2"
          onChange={(e) => void upload(e.target.files?.[0], setPerson)}
        />
      </label>
      {person && (
        <div className="space-y-3">
          <div className="relative max-w-sm mx-auto">
            <img src={person} alt="Person to dress" className="w-full rounded-xl" />
            <canvas
              ref={canvas}
              aria-label="Paint clothing region"
              className="absolute inset-0 w-full h-full touch-none rounded-xl cursor-crosshair"
              onPointerDown={(e) => {
                if (busy) return
                painting.current = true
                e.currentTarget.setPointerCapture(e.pointerId)
                draw(e)
              }}
              onPointerMove={draw}
              onPointerUp={() => (painting.current = false)}
              onPointerCancel={() => (painting.current = false)}
            />
          </div>
          <button
            disabled={busy}
            className="text-primary block"
            onClick={() => {
              if (!canvas.current || !mask.current) return
              const w = canvas.current.width,
                h = canvas.current.height
              canvas.current.getContext('2d')!.clearRect(0, 0, w, h)
              const ctx = mask.current.getContext('2d')!
              ctx.fillStyle = 'black'
              ctx.fillRect(0, 0, w, h)
              const points = [
                [0.34, 0.25],
                [0.44, 0.29],
                [0.56, 0.29],
                [0.66, 0.25],
                [0.73, 0.32],
                [0.73, 0.58],
                [0.64, 0.62],
                [0.36, 0.62],
                [0.27, 0.58],
                [0.27, 0.32],
              ]
              for (const [surface, color] of [
                [canvas.current, 'rgba(99,102,241,0.45)'],
                [mask.current, 'white'],
              ] as const) {
                const c = surface.getContext('2d')!
                c.fillStyle = color
                c.beginPath()
                points.forEach(([x, y], i) => (i ? c.lineTo(x * w, y * h) : c.moveTo(x * w, y * h)))
                c.closePath()
                c.fill()
              }
              setPainted(true)
              setResult('')
            }}
          >
            Start with upper-body mask
          </button>
          <p className="text-sm text-gray-600">
            Check the painted area and adjust it to your photo before generating.
          </p>
          <label>
            Brush size{' '}
            <input
              disabled={busy}
              type="range"
              min={8}
              max={80}
              value={brush}
              onChange={(e) => setBrush(Number(e.target.value))}
            />
          </label>
          <button
            disabled={busy}
            className="text-primary ml-4"
            onClick={() => {
              if (!canvas.current || !mask.current) return
              const { width, height } = canvas.current
              canvas.current.getContext('2d')!.clearRect(0, 0, width, height)
              const ctx = mask.current.getContext('2d')!
              ctx.fillStyle = 'black'
              ctx.fillRect(0, 0, width, height)
              setPainted(false)
              setResult('')
            }}
          >
            Clear paint
          </button>
        </div>
      )}
      <label className="block bg-white rounded-xl p-4 border">
        2. Garment photo
        <input
          aria-label="Garment photo"
          disabled={busy}
          type="file"
          accept="image/*"
          className="block mt-2"
          onChange={(e) => void upload(e.target.files?.[0], setGarment)}
        />
      </label>
      {items.length > 0 && (
        <label className="block">
          Or choose from your wardrobe
          <select
            aria-label="Wardrobe garment"
            disabled={busy}
            value={items.find((i) => i.image_url === garment)?.id || ''}
            onChange={(e) => {
              const item = items.find((i) => i.id === e.target.value)
              if (item) {
                setGarment(item.image_url)
                setResult('')
              }
            }}
            className="block p-3 border rounded-xl w-full"
          >
            <option value="">Choose a garment</option>
            {items
              .filter((i) => i.category === 'tops' || i.category === 'bottoms')
              .map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
          </select>
        </label>
      )}
      {garment && (
        <img src={garment} alt="Selected garment" className="h-40 rounded-xl object-contain" />
      )}
      <button
        onClick={() => void generate()}
        disabled={busy || !person || !garment || !painted}
        className="bg-primary text-white p-4 rounded-xl w-full disabled:opacity-40"
      >
        {busy ? 'Generating preview… This can take a few minutes.' : 'Generate try-on preview'}
      </button>
      {error && (
        <p role="alert" className="text-red-700 bg-red-50 p-4 rounded-xl">
          {error}
        </p>
      )}
      {result && (
        <div className="space-y-3">
          <h2 className="font-bold">Your preview</h2>
          <img
            src={result}
            alt="Generated virtual try-on"
            className="max-w-sm w-full mx-auto rounded-xl"
          />
          <a href={result} download="prism-tryon.png" className="block text-center text-primary">
            Download preview
          </a>
        </div>
      )}
    </div>
  )
}
export default TryOn
