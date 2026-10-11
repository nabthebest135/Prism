import { useEffect, useState, ReactNode } from 'react'
import { ArrowLeft, Upload, Camera } from 'lucide-react'
import { useCamera } from '../hooks/useCamera'
import { readPhoto } from '../lib/images'
interface CameraViewProps {
  onBack: () => void
  onCapture?: (image: string) => void
  children?: ReactNode
  title?: string
  busy?: boolean
}
const CameraView = ({ onBack, onCapture, children, title, busy = false }: CameraViewProps) => {
  const { videoRef, canvasRef, isActive, error, startCamera, stopCamera, captureImageAsBase64 } =
    useCamera()
  const [uploadError, setUploadError] = useState('')
  useEffect(() => {
    void startCamera()
    return stopCamera
  }, [startCamera, stopCamera])
  return (
    <div className="fixed inset-0 bg-black">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
        autoPlay
      />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent">
        <button aria-label="Go back" onClick={onBack} className="lens-button">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-white font-semibold text-lg">{title}</h1>
        <div className="w-16" />
      </div>
      {(error || uploadError) && (
        <div
          role="alert"
          className="absolute top-44 left-4 right-4 z-20 bg-white rounded-xl p-4 text-sm"
        >
          {uploadError || error}
          <button onClick={() => void startCamera()} className="block mt-2 text-primary">
            Retry camera
          </button>
        </div>
      )}
      <div className="camera-overlay">{children}</div>
      <div className="absolute bottom-0 left-0 right-0 z-40 p-5 bg-gradient-to-t from-black/80 to-transparent flex justify-center items-center gap-8">
        <label
          className={
            'text-white text-center ' + (busy ? 'opacity-40 pointer-events-none' : 'cursor-pointer')
          }
        >
          <Upload className="mx-auto mb-1" />
          Upload photo
          <input
            aria-label="Upload photo"
            type="file"
            accept="image/*"
            className="hidden"
            disabled={busy}
            onChange={async (e) => {
              const file = e.target.files?.[0]
              e.target.value = ''
              if (!file) return
              try {
                setUploadError('')
                const data = await readPhoto(file)
                onCapture?.(data.split(',')[1])
              } catch (err) {
                setUploadError((err as Error).message)
              }
            }}
          />
        </label>
        <button
          aria-label="Capture photo"
          onClick={() => {
            const image = captureImageAsBase64()
            if (image) onCapture?.(image)
          }}
          disabled={!isActive || busy}
          className="w-20 h-20 rounded-full bg-white border-4 border-white/30 flex items-center justify-center disabled:opacity-40"
        >
          <Camera size={30} />
        </button>
      </div>
    </div>
  )
}
export default CameraView
