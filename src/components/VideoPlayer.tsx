'use client'

import { useEffect, useRef, memo } from 'react'

interface VideoPlayerProps {
  src: string
  className?: string
}

const VideoPlayer = memo(function VideoPlayer({ src, className = '' }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<any>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Defer HLS initialization to reduce Total Blocking Time
    const initHls = () => {
      import('hls.js').then(({ default: Hls }) => {
        if (!videoRef.current) return

        if (Hls.isSupported()) {
          const hls = new Hls({
            autoStartLoad: true,
            debug: false,
          })

          hls.loadSource(src)
          hls.attachMedia(videoRef.current)

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoRef.current?.play().catch(() => {})
          })

          hlsRef.current = hls
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
          videoRef.current.src = src
          videoRef.current.play().catch(() => {})
        }
      })
    }

    // Use requestIdleCallback to defer heavy HLS loading
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(initHls, { timeout: 2000 })
    } else {
      setTimeout(initHls, 100)
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [src])

  return (
    <video
      ref={videoRef}
      className={`w-full h-full object-cover ${className}`}
      autoPlay
      muted
      loop
      playsInline
    />
  )
})

export default VideoPlayer
