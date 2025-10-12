import { useRef, useEffect, useState } from 'react'

export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      setError(null)
      console.log('Camera - Starting camera...')
      
      // iOS-friendly camera constraints
      const constraints = {
        video: { 
          facingMode: 'environment',
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 }
        },
        audio: false
      }
      
      console.log('Camera - Requesting media with constraints:', constraints)
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
      streamRef.current = stream
      console.log('Camera - Stream obtained:', stream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        console.log('Camera - Video source set')
        
        // iOS needs these attributes
        videoRef.current.setAttribute('playsinline', 'true')
        videoRef.current.setAttribute('webkit-playsinline', 'true')
        
        await videoRef.current.play()
        console.log('Camera - Video playing')
        setIsActive(true)
      }
    } catch (err) {
      console.error('Camera error details:', err)
      setError(`Camera error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    setIsActive(false)
  }

  const captureImage = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null
    
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return null
    
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    ctx.drawImage(video, 0, 0)
    
    return canvas.toDataURL('image/jpeg', 0.8)
  }

  const captureImageAsBase64 = (): string | null => {
    console.log('Camera - Attempting to capture image')
    console.log('Camera - Video active:', isActive)
    console.log('Camera - Video element:', videoRef.current ? 'Present' : 'Missing')
    console.log('Camera - Canvas element:', canvasRef.current ? 'Present' : 'Missing')
    
    const dataUrl = captureImage()
    console.log('Camera - DataURL captured:', dataUrl ? 'Yes' : 'No')
    
    if (!dataUrl) {
      console.error('Camera - Failed to capture image')
      return null
    }
    
    const base64 = dataUrl.split(',')[1]
    console.log('Camera - Base64 extracted, length:', base64?.length || 0)
    return base64
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return {
    videoRef,
    canvasRef,
    isActive,
    error,
    startCamera,
    stopCamera,
    captureImage,
    captureImageAsBase64
  }
}