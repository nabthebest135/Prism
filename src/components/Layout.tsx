import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import BottomNavigation from './BottomNavigation'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()
  const isLensMode = location.pathname.includes('-lens')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className={`flex-1 ${isLensMode ? '' : 'pb-20'}`}>
        {children}
      </main>
      {!isLensMode && <BottomNavigation />}
    </div>
  )
}

export default Layout