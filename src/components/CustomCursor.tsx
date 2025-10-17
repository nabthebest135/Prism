import { useEffect, useState } from 'react'

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isClicking, setIsClicking] = useState(false)

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    document.addEventListener('mousemove', updatePosition)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', updatePosition)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  useEffect(() => {
    const createTrail = () => {
      const trail = document.createElement('div')
      trail.className = 'trail-particle'
      trail.style.left = position.x + 'px'
      trail.style.top = position.y + 'px'
      document.body.appendChild(trail)

      setTimeout(() => {
        if (document.body.contains(trail)) {
          document.body.removeChild(trail)
        }
      }, 1200)
    }

    const interval = setInterval(createTrail, 50)
    return () => clearInterval(interval)
  }, [position])

  return (
    <div
      className={`cursor-dot ${isClicking ? 'beat' : ''}`}
      style={{
        left: position.x,
        top: position.y,
      }}
    />
  )
}

export default CustomCursor