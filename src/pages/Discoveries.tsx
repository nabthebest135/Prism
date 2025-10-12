import { useState } from 'react'
import { MapPin, Calendar, Heart, Share2, Map, List } from 'lucide-react'

interface Discovery {
  id: string
  title: string
  description: string
  location: string
  date: string
  image?: string
  type: 'historical' | 'landmark' | 'cultural'
}

const Discoveries = () => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  
  // Mock data - in real app this would come from Supabase
  const discoveries: Discovery[] = [
    {
      id: '1',
      title: 'Historic City Hall',
      description: 'Built in 1892, this beautiful Victorian architecture served as the center of local government for over a century.',
      location: 'Downtown District',
      date: '2 hours ago',
      type: 'historical'
    },
    {
      id: '2',
      title: 'Ancient Oak Tree',
      description: 'This 300-year-old oak tree witnessed the founding of the city and survived multiple historical events.',
      location: 'Central Park',
      date: '1 day ago',
      type: 'landmark'
    },
    {
      id: '3',
      title: 'Street Art Mural',
      description: 'Created by local artist Maria Santos in 2020, this mural represents the cultural diversity of the neighborhood.',
      location: 'Arts Quarter',
      date: '3 days ago',
      type: 'cultural'
    }
  ]

  const getTypeColor = (type: Discovery['type']) => {
    switch (type) {
      case 'historical': return 'bg-blue-100 text-blue-800'
      case 'landmark': return 'bg-green-100 text-green-800'
      case 'cultural': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Discoveries</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${
                viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-lg ${
                viewMode === 'map' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Map size={20} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{discoveries.length}</p>
            <p className="text-sm text-gray-600">Discovered</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-success">12</p>
            <p className="text-sm text-gray-600">Quests</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">8</p>
            <p className="text-sm text-gray-600">Badges</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {viewMode === 'map' ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Map View</h3>
            <p className="text-gray-600">Interactive map coming soon!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {discoveries.map((discovery) => (
              <div
                key={discovery.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{discovery.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(discovery.type)}`}>
                        {discovery.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{discovery.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin size={12} />
                        <span>{discovery.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>{discovery.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                      <Heart size={16} />
                      <span className="text-sm">Save</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                      <Share2 size={16} />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                  <button className="text-primary font-medium text-sm">
                    Learn More
                  </button>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {discoveries.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No discoveries yet</h3>
                <p className="text-gray-600 mb-6">Start exploring with World Lens to discover amazing places around you</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Discoveries