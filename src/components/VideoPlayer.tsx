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

    // Dynamic import of hls.js — keeps it out of main bundle
    // No requestIdleCallback — dynamic import() is already async enough
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
        // Safari native HLS
        videoRef.current.src = src
        videoRef.current.play().catch(() => {})
      }
    })

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
