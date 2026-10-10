import { Link } from 'react-router-dom'
import { useHistoryStore } from '../store/historyStore'
const History = () => {
  const { analyses, clearHistory } = useHistoryStore()
  return (
    <div className="max-w-2xl mx-auto p-5 space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analysis history</h1>
        <button
          disabled={!analyses.length}
          onClick={() => {
            if (confirm('Clear all analysis history?')) clearHistory()
          }}
          className="text-red-600 disabled:opacity-40"
        >
          Clear history
        </button>
      </div>
      {!analyses.length && (
        <p className="text-gray-600">
          No analyses yet.{' '}
          <Link to="/world-lens" className="text-primary">
            Explore with World Lens
          </Link>
        </p>
      )}
      {analyses.map((a) => (
        <article key={a.id} className="bg-white rounded-xl p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <strong className="capitalize">{a.mode || a.type}</strong>
            <time className="text-gray-500">{new Date(a.timestamp).toLocaleString()}</time>
          </div>
          {a.image && (
            <img
              src={a.image}
              alt="Analysis photo"
              className="w-full max-h-64 object-contain rounded-xl"
            />
          )}
          <details>
            <summary className="text-primary cursor-pointer">
              {a.result.slice(0, 100)}
              {a.result.length > 100 ? '…' : ''}
            </summary>
            <p className="whitespace-pre-wrap mt-3">{a.result}</p>
          </details>
        </article>
      ))}
    </div>
  )
}
export default History
