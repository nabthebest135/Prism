import { Settings, Award, BarChart3, LogOut, User, Camera } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const Profile = () => {
  const { user, signOut } = useAuthStore()

  const stats = [
    { label: 'Discoveries', value: '23', icon: Camera },
    { label: 'Outfits Created', value: '45', icon: User },
    { label: 'Achievements', value: '12', icon: Award }
  ]

  const achievements = [
    { id: 1, title: 'First Discovery', description: 'Made your first discovery', earned: true },
    { id: 2, title: 'Style Explorer', description: 'Added 10 items to wardrobe', earned: true },
    { id: 3, title: 'World Traveler', description: 'Discovered 5 different locations', earned: false },
    { id: 4, title: 'Fashion Forward', description: 'Created 20 outfits', earned: false }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent px-4 py-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <User size={32} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user?.name || 'User'}</h1>
            <p className="opacity-90">{user?.email}</p>
            <p className="text-sm opacity-75 mt-1">Explorer since today</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-6 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Icon className="text-primary" size={20} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h2>
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 ${
                achievement.earned ? '' : 'opacity-60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  achievement.earned ? 'bg-success/10' : 'bg-gray-100'
                }`}>
                  <Award className={achievement.earned ? 'text-success' : 'text-gray-400'} size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
                {achievement.earned && (
                  <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 space-y-2">
        <button className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center space-x-3 text-left">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <Settings className="text-gray-600" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Settings</h3>
            <p className="text-sm text-gray-600">App preferences and privacy</p>
          </div>
        </button>

        <button className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center space-x-3 text-left">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <BarChart3 className="text-gray-600" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Analytics</h3>
            <p className="text-sm text-gray-600">Your exploration insights</p>
          </div>
        </button>

        <button 
          onClick={signOut}
          className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center space-x-3 text-left"
        >
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <LogOut className="text-red-600" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-red-600">Sign Out</h3>
            <p className="text-sm text-gray-600">Log out of your account</p>
          </div>
        </button>
      </div>
    </div>
  )
}

export default Profile