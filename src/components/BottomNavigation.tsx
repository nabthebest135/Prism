import { Link, useLocation } from 'react-router-dom'
import { Home, Camera, Shirt, Layers, User } from 'lucide-react'

const BottomNavigation = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/world-lens', icon: Camera, label: 'World' },
    { path: '/style-lens', icon: Shirt, label: 'Style' },
    { path: '/wardrobe', icon: Layers, label: 'Wardrobe' },
    { path: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb"
    >
      <div className="flex justify-around items-center max-w-xl mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path

          return (
            <Link
              key={path}
              to={path}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive ? 'text-primary bg-stone-100' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNavigation
