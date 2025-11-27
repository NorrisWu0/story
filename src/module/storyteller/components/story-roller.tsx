'use client'

import React, { useEffect, useRef, useState } from 'react'

const TEXT_ANIMATION_OFFSET_IN_SECONDS = 20

type StoryRollerProps = {
  narrative: string
  audioFilePath: string
}
export function StoryRoller(props: StoryRollerProps) {
  const { narrative, audioFilePath } = props

  const [refresh, setRefresh] = useState(false)

  const audioRef = useRef<React.ComponentRef<'audio'>>(null)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const narrativeRef = useRef<React.ComponentRef<'p'>>(null)
  const [narrativeTextHeight, setNarrativeHeight] = useState(0)

  const containerRef = useRef<React.ComponentRef<'div'>>(null)
  const [containerHeight, setContainerHeight] = useState(0)

  // Total animation duration = audio duration + X extra seconds
  const animationDurationRef = useRef(0)

  // Initialize animation duration when audio metadata loads
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      // Set total animation duration = audio duration + X seconds
      animationDurationRef.current =
        audio.duration + TEXT_ANIMATION_OFFSET_IN_SECONDS
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    return () =>
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
  }, [refresh])

  // Measure text height on mount and window resize
  useEffect(() => {
    const container = containerRef.current
    const narrative = narrativeRef.current

    if (!container || !narrative) return

    setContainerHeight(container.offsetHeight)

    const updateNarrativeHeight = () => {
      setNarrativeHeight(narrative.offsetHeight)
    }

    updateNarrativeHeight()
    window.addEventListener('resize', updateNarrativeHeight)

    return () => {
      window.removeEventListener('resize', updateNarrativeHeight)
    }
  }, [refresh])

  // Independent animation loop that controls both audio and text scrolling
  useEffect(() => {
    if (!isPlaying) return

    const audio = audioRef.current
    if (!audio || animationDurationRef.current === 0) return

    let animationFrameId: number
    let startTime: number | null = null

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp

      const elapsed = (timestamp - startTime) / 1000 // Convert to seconds
      const totalDuration = animationDurationRef.current

      // Calculate progress (0-100)
      const currentProgress = Math.min((elapsed / totalDuration) * 100, 100)
      setProgress(currentProgress)

      // Sync audio playback
      const targetAudioTime = Math.min(elapsed, audio.duration)
      if (Math.abs(audio.currentTime - targetAudioTime) > 0.1) {
        audio.currentTime = targetAudioTime
      }

      // Continue animation until we reach 100%
      if (currentProgress < 100) {
        animationFrameId = requestAnimationFrame(animate)
      } else {
        setIsPlaying(false)
      }
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isPlaying, refresh])

  // Calculate vertical position based on progress
  // At 0%: text starts below viewport
  // At 100%: text exits above viewport (completely hidden)
  const getVerticalPosition = () => {
    const startPosition = containerHeight // Start below viewport
    const endPosition = -narrativeTextHeight // End above viewport (negative text height)
    const currentPosition =
      startPosition - (progress / 100) * (startPosition - endPosition)
    return `${currentPosition}px`
  }

  const handlePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }

  const handleReset = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.pause()
    audio.currentTime = 0
    setProgress(0)
    setIsPlaying(false)
    setRefresh((s) => !s)
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={containerRef} className="relative flex-1 overflow-hidden">
        <p
          ref={narrativeRef}
          className="absolute inset-x-0 px-8 text-center text-5xl leading-normal font-bold"
          style={{
            top: getVerticalPosition(),
          }}
        >
          {narrative}
        </p>
      </div>

      {/* Hidden audio element (controlled programmatically) */}
      <audio ref={audioRef} className="hidden" src={audioFilePath}>
        Your browser does not support the audio element.
      </audio>

      {/* Custom controls */}
      <div className="flex gap-4 p-4">
        <button
          onClick={handlePlayPause}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={handleReset}
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        >
          Reset
        </button>
        <div className="flex items-center">
          Progress: {Math.round(progress)}%
        </div>
      </div>
    </div>
  )
}
