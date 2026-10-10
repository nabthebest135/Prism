import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useHistoryStore } from '../store/historyStore'
const Discoveries = () => {
  const { analyses, toggleSaved } = useHistoryStore()
  const [savedOnly, setSavedOnly] = useState(false),
    [message, setMessage] = useState('')
  const discoveries = analyses.filter((a) => a.type === 'discovery' && (!savedOnly || a.saved))
  return (
    <div className="max-w-2xl mx-auto p-5 space-y-5">
      <h1 className="text-2xl font-bold">Discoveries</h1>
      <div className="flex gap-3">
        <button
          onClick={() => setSavedOnly(false)}
          className={!savedOnly ? 'text-primary font-bold' : ''}
        >
          All discoveries
        </button>
        <button
          onClick={() => setSavedOnly(true)}
          className={savedOnly ? 'text-primary font-bold' : ''}
        >
          Saved
        </button>
      </div>
      {!discoveries.length && (
        <div className="bg-white rounded-xl p-6">
          <p>No {savedOnly ? 'saved ' : ''}discoveries yet.</p>
          <Link to="/world-lens" className="text-primary block mt-3">
            Explore with World Lens
          </Link>
        </div>
      )}
      {discoveries.map((a) => (
        <article key={a.id} className="bg-white rounded-xl p-4 space-y-3">
          {a.image && (
            <img
              src={a.image}
              alt="Discovered place"
              className="w-full h-48 object-cover rounded-xl"
            />
          )}
          <time className="text-sm text-gray-500">{new Date(a.timestamp).toLocaleString()}</time>
          <p className="whitespace-pre-wrap">{a.result}</p>
          <div className="flex gap-4">
            <button onClick={() => toggleSaved(a.id)} className="text-primary">
              {a.saved ? 'Unsave' : 'Save'}
            </button>
            <button
              className="text-primary"
              onClick={async () => {
                try {
                  if (navigator.share)
                    await navigator.share({ title: 'Prism discovery', text: a.result })
                  else {
                    await navigator.clipboard.writeText(a.result)
                    setMessage('Discovery copied.')
                  }
                } catch (err) {
                  if ((err as Error).name !== 'AbortError')
                    setMessage('Could not share this discovery.')
                }
              }}
            >
              Share
            </button>
          </div>
        </article>
      ))}
      {message && <p role="status">{message}</p>}
    </div>
  )
}
export default Discoveries
