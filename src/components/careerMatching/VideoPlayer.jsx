/**
 * Video Player Component
 * Displays role explainer videos with controls
 */

import { useState } from 'react'
import { FiX, FiPlay, FiAlertCircle } from 'react-icons/fi'
import Card from '../Card'
import Button from '../Button'

const VideoPlayer = ({ videoData, roleName, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasError, setHasError] = useState(false)

  if (!videoData) {
    return (
      <Card className="text-center p-8">
        <FiAlertCircle className="mx-auto text-5xl text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No video available
        </h3>
        <p className="text-gray-600">
          The video hasn't been generated yet.
        </p>
      </Card>
    )
  }

  const { videoUrl, thumbnailUrl, status } = videoData

  if (status === 'processing') {
    return (
      <Card className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Generating your video...
        </h3>
        <p className="text-gray-600">
          This may take a few moments. We're creating a personalized explainer for {roleName}.
        </p>
      </Card>
    )
  }

  if (status === 'failed' || hasError) {
    return (
      <Card className="text-center p-8 border-2 border-red-200">
        <FiAlertCircle className="mx-auto text-5xl text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Video generation failed
        </h3>
        <p className="text-gray-600 mb-4">
          We encountered an error while generating the video. Please try again later.
        </p>
        {onClose && (
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        )}
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-0 overflow-hidden">
        {/* Video Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {roleName} - Role Explainer
            </h3>
            <p className="text-sm text-gray-600">
              AI-generated career overview
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="text-xl text-gray-600" />
            </button>
          )}
        </div>

        {/* Video Player */}
        <div className="relative bg-black aspect-video">
          {videoUrl ? (
            <video
              className="w-full h-full"
              controls
              poster={thumbnailUrl}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={() => setHasError(true)}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              {thumbnailUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={thumbnailUrl}
                    alt={`${roleName} thumbnail`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors"
                    onClick={() => setIsPlaying(true)}
                  >
                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center">
                      <FiPlay className="text-4xl text-primary ml-1" />
                    </div>
                  </button>
                </div>
              ) : (
                <div className="text-white text-center p-8">
                  <FiAlertCircle className="mx-auto text-5xl mb-4" />
                  <p>Video unavailable</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Video Info */}
        {videoData._mockData && (
          <div className="p-4 bg-blue-50 border-t border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Demo Mode:</strong> This is a sample video. In production, this would be a personalized AI-generated explainer video for {roleName}.
            </p>
          </div>
        )}
      </Card>

      {/* Additional Info */}
      <Card className="p-4">
        <h4 className="font-semibold text-gray-900 mb-2">About this video</h4>
        <p className="text-sm text-gray-600">
          This AI-generated video provides an overview of the {roleName} role, including typical responsibilities, required skills, and career trajectory. It's personalized based on your profile.
        </p>
      </Card>
    </div>
  )
}

export default VideoPlayer
