import { useEffect, ReactNode } from 'react'
import { ArrowLeft, Zap, ZapOff } from 'lucide-react'
import { useCamera } from '../hooks/useCamera'

interface CameraViewProps {
  onBack: () => void
  onCapture?: (imageBase64: string) => void
  children?: ReactNode
  title?: string
}

const CameraView = ({ onBack, onCapture, children, title }: CameraViewProps) => {
  const { videoRef, canvasRef, isActive, error, startCamera, stopCamera, captureImageAsBase64 } = useCamera()

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

  const handleCapture = () => {
    const imageBase64 = captureImageAsBase64()
    if (imageBase64 && onCapture) {
      onCapture(imageBase64)
    }
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white">
        <div className="text-center p-6">
          <p className="text-lg mb-4">{error}</p>
          <button 
            onClick={onBack}
            className="bg-primary px-6 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black">
      {/* Camera Feed */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
      />
      
      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <button
          onClick={onBack}
          className="lens-button"
        >
          <ArrowLeft size={24} />
        </button>
        
        {title && (
          <h1 className="text-white font-semibold text-lg">{title}</h1>
        )}
        
        <div className="w-16" />
      </div>

      {/* AR Overlays */}
      <div className="camera-overlay">
        {children}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex items-center justify-center">
          {onCapture && (
            <button
              onClick={handleCapture}
              disabled={!isActive}
              className="w-20 h-20 rounded-full bg-white border-4 border-white/30 flex items-center justify-center disabled:opacity-50"
            >
              <div className="w-16 h-16 rounded-full bg-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CameraView