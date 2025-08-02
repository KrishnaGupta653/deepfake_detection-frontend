'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Image as ImageIcon, X, Loader2, Shield, AlertCircle, CheckCircle, Camera, Zap } from 'lucide-react'

interface UploadFormProps {
  onPrediction: (result: any, imageUrl: string) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

export default function UploadForm({ onPrediction, loading, setLoading }: UploadFormProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile) {
      // Validate file size (16MB limit)
      if (selectedFile.size > 16 * 1024 * 1024) {
        setError('File size must be less than 16MB')
        return
      }

      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Please upload a PNG, JPG, JPEG, or WEBP image')
        return
      }

      setFile(selectedFile)
      setError(null)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    onDropRejected: () => setDragActive(false)
  })

  const removeFile = () => {
    setFile(null)
    setPreview(null)
    setError(null)
    setDragActive(false)
  }

  const handleSubmit = async () => {
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze image')
      }

      const result = await response.json()
      onPrediction(result, preview!)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-effect rounded-3xl p-8 max-w-3xl mx-auto shadow-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 animate-float">
          <Camera className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-3 gradient-text">Upload Image for Analysis</h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Drag & drop an image or click to browse • Powered by AI
        </p>
      </div>

      {!preview ? (
        <>
          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 group ${
              isDragActive 
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-105' 
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
            }`}
          >
            <input {...getInputProps()} />
            
            {/* Animated background */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-3xl animate-gradient"></div>
            </div>
            
            <div className="relative z-10 space-y-6">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto transition-all duration-300 ${
                isDragActive 
                  ? 'bg-blue-500 scale-110' 
                  : 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 group-hover:scale-110'
              }`}>
                <Upload className={`w-10 h-10 transition-colors duration-300 ${
                  isDragActive ? 'text-white' : 'text-blue-600 dark:text-blue-400'
                }`} />
              </div>
              
              {isDragActive ? (
                <div className="space-y-2">
                  <p className="text-blue-600 font-semibold text-xl">Drop your image here!</p>
                  <p className="text-blue-500">Release to upload</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-700 dark:text-gray-300 text-xl mb-2">
                      Choose an image or drag it here
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      PNG, JPG, JPEG, WEBP up to 16MB
                    </p>
                  </div>
                  
                  {/* Quick features */}
                  <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span>Fast Analysis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>98% Accurate</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      <span>Secure</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sample Images */}
          {/* <div className="mt-8">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
              Or try with these sample images:
            </p>
            <div className="flex justify-center space-x-4">
              {['sample1', 'sample2', 'sample3'].map((sample, index) => (
                <button
                  key={sample}
                  className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl hover:scale-105 transition-transform flex items-center justify-center text-xs text-gray-500 dark:text-gray-400"
                  onClick={() => {
                    // Handle sample image selection
                    console.log(`Selected ${sample}`)
                  }}
                >
                  Sample {index + 1}
                </button>
              ))}
            </div>
          </div> */}
        </>
      ) : (
        <div className="space-y-6">
          {/* Image Preview */}
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-80 object-cover rounded-2xl shadow-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
              <div className="text-center text-white">
                <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Ready for analysis</p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* File Info */}
          <div className="flex items-center space-x-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-700 dark:text-gray-300">{file?.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {file ? (file.size / 1024 / 1024).toFixed(2) : 0} MB • Ready for analysis
              </p>
            </div>
            <div className="text-green-500">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3 text-lg shadow-xl"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Analyzing<span className="loading-dots"></span></span>
              </>
            ) : (
              <>
                <Shield className="w-6 h-6" />
                <span>Analyze Image with AI</span>
                <Zap className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Processing Info */}
          {loading && (
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI is analyzing your image for deepfake detection...
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Info Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Your images are processed securely and not stored on our servers
        </p>
      </div>
    </div>
  )
}