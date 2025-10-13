import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Trash2 } from 'lucide-react'
import { useHistoryStore } from '../store/historyStore'

const History = () => {
  const navigate = useNavigate()
  const { analyses, clearHistory } = useHistoryStore()

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'translation': return 'bg-blue-100 text-blue-800'
      case 'outfit': return 'bg-purple-100 text-purple-800'
      case 'aging': return 'bg-orange-100 text-orange-800'
      case 'discovery': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold">Analysis History</h1>
          <button
            onClick={clearHistory}
            className="p-2 hover:bg-gray-100 rounded-full text-red-500"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* History List */}
      <div className="p-4 space-y-4">
        {analyses.length === 0 ? (
          <div className="text-center py-12">
            <Clock size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No analysis history yet</p>
            <p className="text-sm text-gray-400">Start using the camera to see your results here</p>
          </div>
        ) : (
          analyses.map((analysis) => (
            <div key={analysis.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(analysis.type)}`}>
                  {analysis.type.charAt(0).toUpperCase() + analysis.type.slice(1)}
                </span>
                <span className="text-xs text-gray-500">{formatTime(analysis.timestamp)}</span>
              </div>
              
              {analysis.image && (
                <div className="mb-3">
                  <img 
                    src={analysis.image} 
                    alt="Analysis" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <p className="text-sm text-gray-700 leading-relaxed">
                {analysis.result.length > 200 
                  ? `${analysis.result.substring(0, 200)}...` 
                  : analysis.result
                }
              </p>
              
              {analysis.mode && (
                <div className="mt-2">
                  <span className="text-xs text-gray-400">Mode: {analysis.mode}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default History