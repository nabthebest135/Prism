import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useHistoryStore } from '../store/historyStore'
import { useWardrobeStore } from '../store/wardrobeStore'
const Profile = () => {
  const { user, setName, signOut } = useAuthStore(),
    { analyses } = useHistoryStore(),
    { items, fetchItems } = useWardrobeStore()
  const [name, setDraft] = useState(user?.name || ''),
    [status, setStatus] = useState<{
      ai: boolean
      tryon: { ready: boolean; busy?: boolean }
    } | null>(null),
    [message, setMessage] = useState('')
  const check = async () => {
    try {
      const r = await fetch('/api/health')
      if (!r.ok) throw new Error()
      setStatus(await r.json())
    } catch {
      setMessage('Cannot reach the local server.')
    }
  }
  useEffect(() => {
    void fetchItems()
    void check()
  }, [fetchItems])
  const discoveries = analyses.filter((a) => a.type === 'discovery').length,
    outfits = analyses.filter((a) => a.type === 'outfit').length
  const milestones = [
    ['First discovery', discoveries >= 1],
    ['10 wardrobe items', items.length >= 10],
    ['5 discoveries', discoveries >= 5],
    ['20 outfit analyses', outfits >= 20],
  ] as const
  return (
    <div className="max-w-2xl mx-auto p-5 space-y-5">
      <h1 className="text-2xl font-bold">Your profile</h1>
      <p className="text-gray-600">
        Your wardrobe, photos, and history are saved in this browser. Analysis runs on your
        Bladefall PC.
      </p>
      <div className="grid grid-cols-3 gap-3 text-center bg-white rounded-xl p-4">
        <div>
          <strong>{discoveries}</strong>
          <p>Discoveries</p>
        </div>
        <div>
          <strong>{outfits}</strong>
          <p>Outfits</p>
        </div>
        <div>
          <strong>{items.length}</strong>
          <p>Items</p>
        </div>
      </div>
      <form
        className="bg-white p-4 rounded-xl space-y-3"
        onSubmit={(e) => {
          e.preventDefault()
          setName(name)
          setMessage('Name saved.')
        }}
      >
        <label className="block">
          Name
          <input
            aria-label="Profile name"
            maxLength={60}
            value={name}
            onChange={(e) => setDraft(e.target.value)}
            className="block border p-3 rounded-xl w-full mt-2"
          />
        </label>
        <button className="text-primary">Save name</button>
      </form>
      <div className="bg-white p-4 rounded-xl space-y-2">
        <h2 className="font-bold">Local services</h2>
        <p>Image analysis: {status ? (status.ai ? 'Ready' : 'Unavailable') : 'Checking…'}</p>
        <p>
          Virtual try-on:{' '}
          {status
            ? status.tryon.ready
              ? status.tryon.busy
                ? 'Busy'
                : 'Ready'
              : 'Unavailable'
            : 'Checking…'}
        </p>
        <button onClick={() => void check()} className="text-primary">
          Check connection
        </button>
      </div>
      <div className="bg-white p-4 rounded-xl space-y-2">
        <h2 className="font-bold">Milestones</h2>
        {milestones.map(([title, earned]) => (
          <p key={title}>
            {earned ? '✓' : '○'} {title}
          </p>
        ))}
      </div>
      <button
        className="text-primary"
        onClick={() => {
          const blob = new Blob(
            [
              JSON.stringify(
                { version: 1, profile: user?.name, wardrobe: items, history: analyses },
                null,
                2
              ),
            ],
            { type: 'application/json' }
          )
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'prism-backup.json'
          a.click()
          setTimeout(() => URL.revokeObjectURL(url), 1000)
        }}
      >
        Export wardrobe and history
      </button>
      <Link to="/testimonials" className="block text-primary">
        Local feedback
      </Link>
      <Link to="/history" className="block text-primary">
        View analysis history
      </Link>
      <button onClick={() => void signOut()} className="block text-gray-600">
        Leave profile
      </button>
      {message && <p role="status">{message}</p>}
    </div>
  )
}
export default Profile
