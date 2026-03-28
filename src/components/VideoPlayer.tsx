'use client'

import { memo } from 'react'

interface VideoPlayerProps {
  src: string
  className?: string
}

// Extract Mux playback ID from HLS URL and use MP4 instead
// This eliminates hls.js (~70KB) entirely — native <video> handles MP4
function getMuxMp4Url(hlsUrl: string): string {
  const match = hlsUrl.match(/stream\.mux\.com\/([^/.]+)/)
  if (match) {
    return `https://stream.mux.com/${match[1]}/medium.mp4`
  }
  return hlsUrl
}

const VideoPlayer = memo(function VideoPlayer({ src, className = '' }: VideoPlayerProps) {
  const mp4Url = getMuxMp4Url(src)

  return (
    <video
      src={mp4Url}
      className={`w-full h-full object-cover ${className}`}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
    />
  )
})

export default VideoPlayer
