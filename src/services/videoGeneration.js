/**
 * Video Generation Service
 * OpenAI Sora 2 Integration for AI-powered role explainer videos
 *
 * Generates 5-second professional videos explaining tech career roles
 */

import OpenAI from 'openai'
import { getRoleProfile } from '../config/roleProfiles'

// Global OpenAI client instance
let openaiClient = null

/**
 * Initialize OpenAI client for video generation
 * @param {string} apiKey - OpenAI API key
 */
export function initializeVideoService(apiKey) {
  if (apiKey && apiKey.trim()) {
    openaiClient = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    })
    console.log('✅ Video Generation Service: Initialized with API key')
  } else {
    console.warn('⚠️ Video Generation Service: No API key provided, using mock mode')
    openaiClient = null
  }
}

/**
 * Generate a role explainer video request using OpenAI Sora 2
 *
 * @param {string} roleId - Role identifier
 * @param {Object} userProfile - User profile for personalization
 * @returns {Promise<Object>} - Video generation result
 */
export async function requestRoleExplainerVideo(roleId, userProfile) {
  const roleProfile = getRoleProfile(roleId)

  if (!roleProfile) {
    throw new Error(`Role not found: ${roleId}`)
  }

  // Build video generation prompt (5 seconds, concise)
  const prompt = generateVideoPrompt(roleProfile, userProfile)

  console.log('🎥 Video Generation Request:', {
    roleId,
    roleName: roleProfile.name,
    userName: userProfile?.name || 'Student',
    prompt: prompt.substring(0, 200) + '...'
  })

  // If no API key, use mock implementation
  if (!openaiClient) {
    console.log('⚠️ Using mock video generation (no API key)')
    return await mockVideoGeneration(roleId, roleProfile, prompt)
  }

  // Use real OpenAI Sora 2 API
  try {
    console.log('📡 Attempting to call OpenAI Sora 2 API...')

    // Check if videos API exists (Sora might not be released yet)
    if (!openaiClient.videos || typeof openaiClient.videos.generate !== 'function') {
      console.log('⚠️ Sora 2 API not available yet (videos.generate not found)')
      console.log('⚠️ Using mock video generation as fallback')
      return await mockVideoGeneration(roleId, roleProfile, prompt)
    }

    // NOTE: Sora API endpoint structure (based on OpenAI patterns)
    // This will work when Sora is publicly available
    const response = await openaiClient.videos.generate({
      model: 'sora-2',
      prompt: prompt,
      duration: 5, // 5 seconds as requested
      size: '1280x720', // 720p HD
      quality: 'standard',
      // Optional: voice_over, background_music
    })

    console.log('✅ Sora 2 video generation initiated:', response.id)

    return {
      status: 'processing',
      requestId: response.id,
      videoUrl: response.url || null, // May be null if still processing
      thumbnailUrl: response.thumbnail_url || null,
      progress: response.url ? 100 : 0,
      createdAt: new Date().toISOString(),
      estimatedCompletionTime: response.estimated_completion_time || null,
      error: null
    }
  } catch (error) {
    console.error('❌ Sora 2 API Error:', error.message)

    // Always fall back to mock for now since Sora isn't released
    console.log('⚠️ Using mock video generation as fallback')
    return await mockVideoGeneration(roleId, roleProfile, prompt)
  }
}

/**
 * Generate video prompt for 5-second role explanation
 * @param {Object} roleProfile - Role profile
 * @param {Object} userProfile - User profile
 * @returns {string} - Video generation prompt
 */
function generateVideoPrompt(roleProfile, userProfile) {
  // 5-second video prompt - concise and impactful
  return `Create a 5-second professional video explaining the ${roleProfile.name} role.

VISUAL CONTENT:
- Show a confident ${roleProfile.name} working with modern technology
- Display key tools/technologies in action (${roleProfile.requiredSkills.slice(0, 3).join(', ')})
- Professional, tech-forward aesthetic with smooth transitions
- Dynamic, engaging visuals showing the role in action

TEXT OVERLAY (appears gradually):
"${roleProfile.name}"
"${roleProfile.summary}"

STYLE:
- Modern, cinematic look with professional lighting
- Tech startup/innovation vibe
- Inspiring and aspirational
- High energy, fast-paced but clear
- Vibrant colors, sleek design
- 16:9 aspect ratio, HD quality

TARGET AUDIENCE: College students exploring tech careers

Keep it short, impactful, and inspiring. 5 seconds only.`
}

/**
 * Check video generation status (for async generation)
 * @param {string} requestId - Video generation request ID
 * @returns {Promise<Object>} - Current status
 */
export async function checkVideoStatus(requestId) {
  console.log('🎥 Checking video status:', requestId)

  if (!openaiClient) {
    // Mock implementation for demo mode
    return {
      status: 'ready',
      videoUrl: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
      thumbnailUrl: `https://via.placeholder.com/640x360/4F46E5/FFFFFF?text=Video`,
      progress: 100,
      error: null
    }
  }

  try {
    // Poll the OpenAI API for video status
    const response = await openaiClient.videos.retrieve(requestId)

    return {
      status: response.status, // 'pending' | 'processing' | 'completed' | 'failed'
      videoUrl: response.url,
      thumbnailUrl: response.thumbnail_url,
      progress: response.status === 'completed' ? 100 : (response.progress || 0),
      error: response.error
    }
  } catch (error) {
    console.error('Error checking video status:', error)
    return {
      status: 'failed',
      videoUrl: null,
      thumbnailUrl: null,
      progress: 0,
      error: error.message
    }
  }
}

/**
 * Mock video generation using local video file
 * @param {string} roleId - Role ID
 * @param {Object} roleProfile - Role profile
 * @param {string} prompt - Generation prompt
 * @returns {Promise<Object>} - Mock result
 */
async function mockVideoGeneration(roleId, roleProfile, prompt) {
  // Simulate network delay (video generation takes time)
  console.log('🎬 Using local video for', roleProfile.name)
  await new Promise(resolve => setTimeout(resolve, 1000))

  const requestId = `local_video_${roleId}_${Date.now()}`

  // Use local video file from public folder
  // Vite serves files from /public at the root URL
  const localVideoUrl = '/videos/Cartoon_Software_Engineering_Video_Creation.mp4'

  // Return video data pointing to local file
  return {
    status: 'ready',
    requestId,
    videoUrl: localVideoUrl,
    thumbnailUrl: `https://via.placeholder.com/1280x720/4F46E5/FFFFFF?text=${encodeURIComponent(roleProfile.name)}`,
    progress: 100,
    createdAt: new Date().toISOString(),
    error: null,
    // Development mode indicators
    _localVideo: true,
    _prompt: prompt,
    _note: 'Using local video file. Will switch to Sora 2 when available.'
  }
}

/**
 * Generate all videos for top role matches (batch request)
 * @param {Array} topMatches - Top role matches
 * @param {Object} userProfile - User profile
 * @returns {Promise<Array>} - Array of video generation results
 */
export async function generateMatchVideos(topMatches, userProfile) {
  const requests = topMatches.slice(0, 3).map(match =>
    requestRoleExplainerVideo(match.roleId, userProfile)
  )

  return Promise.all(requests)
}

/**
 * Get sample video for demonstration
 * @param {string} roleId - Role ID
 * @returns {Object} - Sample video object
 */
export function getSampleVideo(roleId) {
  const roleProfile = getRoleProfile(roleId)

  if (!roleProfile) {
    return null
  }

  return {
    status: 'ready',
    requestId: `sample_${roleId}`,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: `https://via.placeholder.com/640x360/4F46E5/FFFFFF?text=${encodeURIComponent(roleProfile.name)}+Video`,
    progress: 100,
    createdAt: new Date().toISOString(),
    error: null,
    _sampleVideo: true
  }
}
