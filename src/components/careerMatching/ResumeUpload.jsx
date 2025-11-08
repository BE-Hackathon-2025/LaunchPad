/**
 * Resume Upload Component
 * Allows users to upload and parse their resume (PDF/TXT)
 */

import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { parseResumeFile } from '../../utils/resumeParser'
import Button from '../Button'
import Card from '../Card'
import Badge from '../Badge'
import { FiUpload, FiFile, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi'

const ResumeUpload = ({ onParseComplete, showCompact = false }) => {
  const { resumeData, setResumeData, profile, setProfile, settings } = useStore()
  const [uploading, setUploading] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [error, setError] = useState(null)
  const [previewSkills, setPreviewSkills] = useState([])
  const [selectedSkills, setSelectedSkills] = useState(new Set())

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)
    setUploading(true)
    setParsing(true)

    try {
      // Parse the resume with settings (for API key)
      const parsedData = await parseResumeFile(file, settings)

      // Store in state
      setResumeData(parsedData)

      // Show skills preview
      const skills = parsedData.parsed.normalizedSkills || []
      setPreviewSkills(skills)
      setSelectedSkills(new Set(skills)) // All selected by default

      setParsing(false)

      // Callback if provided
      if (onParseComplete) {
        onParseComplete(parsedData)
      }
    } catch (err) {
      console.error('Resume parsing error:', err)
      setError(err.message || 'Failed to parse resume')
      setParsing(false)
    } finally {
      setUploading(false)
    }
  }

  const toggleSkill = (skill) => {
    const newSelected = new Set(selectedSkills)
    if (newSelected.has(skill)) {
      newSelected.delete(skill)
    } else {
      newSelected.add(skill)
    }
    setSelectedSkills(newSelected)
  }

  const handleConfirmSkills = () => {
    // Merge selected skills with profile
    const confirmedSkills = Array.from(selectedSkills)

    // If profile doesn't exist yet (during onboarding), just call callback and clear
    if (!profile) {
      if (onParseComplete) {
        onParseComplete({ ...resumeData, confirmed: true })
      }
      setPreviewSkills([])
      setSelectedSkills(new Set())
      alert('Skills saved! They will be added to your profile.')
      return
    }

    // Update profile with combined skills
    const updatedProfile = {
      ...profile,
      currentSkills: [
        ...new Set([...(profile.currentSkills || []), ...confirmedSkills])
      ]
    }

    setProfile(updatedProfile)

    // Clear preview
    setPreviewSkills([])
    setSelectedSkills(new Set())

    alert('Skills successfully added to your profile!')
  }

  const handleClearResume = () => {
    if (confirm('Are you sure you want to remove your resume?')) {
      setResumeData(null)
      setPreviewSkills([])
      setSelectedSkills(new Set())
      setError(null)
    }
  }

  // Compact view for Settings or smaller spaces
  if (showCompact) {
    return (
      <div className="space-y-4">
        {resumeData ? (
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <FiCheck className="text-green-600 text-xl" />
              <div>
                <p className="font-medium text-gray-900">{resumeData.fileName}</p>
                <p className="text-sm text-gray-600">
                  {resumeData.parsed.normalizedSkills?.length || 0} skills extracted
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClearResume}>
              <FiX className="mr-1" /> Remove
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="block">
              <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <div className="text-center">
                  <FiUpload className="mx-auto text-3xl text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    {uploading ? 'Uploading...' : 'Upload Resume'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PDF or TXT</p>
                </div>
              </div>
            </label>
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                <FiAlertCircle />
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // Full view for dedicated upload page
  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Upload Your Resume
          </h3>
          <p className="text-gray-600">
            Upload your resume to automatically extract skills and experience.
            This helps us provide better role matches.
          </p>
        </div>

        {/* Upload Area */}
        {!resumeData && (
          <label className="block">
            <div className="flex items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <FiUpload className="text-3xl text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {uploading ? 'Processing...' : 'Choose a file or drag it here'}
                </h4>
                <p className="text-gray-600 mb-4">
                  PDF or TXT format, up to 5MB
                </p>
                <Button disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Browse Files'}
                </Button>
              </div>
            </div>
          </label>
        )}

        {/* Parsing Status */}
        {parsing && (
          <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <p className="text-blue-900 font-medium">Analyzing your resume...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <FiAlertCircle className="text-red-600 text-xl flex-shrink-0" />
            <div>
              <p className="font-medium text-red-900">Upload Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Resume Preview */}
        {resumeData && !parsing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <FiFile className="text-green-600 text-2xl" />
                <div>
                  <p className="font-semibold text-gray-900">{resumeData.fileName}</p>
                  <p className="text-sm text-gray-600">
                    Uploaded {new Date(resumeData.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button variant="ghost" onClick={handleClearResume}>
                <FiX className="mr-1" /> Remove
              </Button>
            </div>

            {/* Extracted Data Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {resumeData.parsed.normalizedSkills?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Skills Found</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {resumeData.parsed.experiences?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Experiences</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {resumeData.parsed.projects?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Projects</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {resumeData.parsed.education?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Education</p>
              </div>
            </div>
          </div>
        )}

        {/* Skills Preview & Selection */}
        {previewSkills.length > 0 && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Extracted Skills ({selectedSkills.size} selected)
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Review and deselect any skills that don't apply to you.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {previewSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedSkills.has(skill)
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-600 line-through'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button onClick={handleConfirmSkills}>
                <FiCheck className="mr-2" />
                Add {selectedSkills.size} Skills to Profile
              </Button>
              <Button variant="outline" onClick={() => setPreviewSkills([])}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default ResumeUpload
