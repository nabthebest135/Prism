import { useRef, useState, useCallback, useEffect } from 'react'
export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null),
    canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null),
    generation = useRef(0)
  const [isActive, setIsActive] = useState(false),
    [error, setError] = useState<string | null>(null)
  const stopCamera = useCallback(() => {
    generation.current++
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setIsActive(false)
  }, [])
  const startCamera = useCallback(async () => {
    stopCamera()
    const ticket = generation.current
    setError(null)
    try {
      if (!navigator.mediaDevices?.getUserMedia)
        throw new Error('Camera needs localhost or HTTPS. You can upload a photo below.')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1024 }, height: { ideal: 768 } },
        audio: false,
      })
      if (ticket !== generation.current) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        if (ticket === generation.current) setIsActive(true)
      }
    } catch (err) {
      if (ticket === generation.current)
        setError(err instanceof Error ? err.message : 'Camera unavailable. Upload a photo instead.')
    }
  }, [stopCamera])
  const captureImage = () => {
    const video = videoRef.current,
      canvas = canvasRef.current
    if (!video || !canvas || !video.videoWidth) return null
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')!.drawImage(video, 0, 0)
    return canvas.toDataURL('image/jpeg', 0.8)
  }
  useEffect(() => stopCamera, [stopCamera])
  return {
    videoRef,
    canvasRef,
    isActive,
    error,
    startCamera,
    stopCamera,
    captureImage,
    captureImageAsBase64: () => captureImage()?.split(',')[1] ?? null,
  }
}
