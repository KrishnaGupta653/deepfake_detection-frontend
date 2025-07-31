'use client'

import { useState } from 'react'
import { ArrowLeft, Shield, AlertTriangle, Eye, Download, Share2, Clock, Cpu } from 'lucide-react'

interface ResultDisplayProps {
  result: {
    success: boolean
    prediction: string
    confidence: number
    probabilities: {
      fake: number
      real: number
    }
    analysis: string
    gradcam?: string
    image_url?: string
    timestamp: string
    model_info: {
      name: string
      version: string
      accuracy: string
    }
  }
  uploadedImage: string | null
  onReset: () => void
}

export default function ResultDisplay({ result, uploadedImage, onReset }: ResultDisplayProps) {
  const [showGradCAM, setShowGradCAM] = useState(false)
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false)

  const isReal = result.prediction === 'Real'
  const confidenceColor = result.confidence > 80 ? (isReal ? 'text-green-600' : 'text-red-600') : 'text-yellow-600'
  const bgColor = result.confidence > 80 ? (isReal ? 'bg-green-50' : 'bg-red-50') : 'bg-yellow-50'
  const borderColor = result.confidence > 80 ? (isReal ? 'border-green-200' : 'border-red-200') : 'border-yellow-200'

  const downloadResult = () => {
    const dataStr = JSON.stringify(result, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `deepfake_analysis_${new Date().getTime()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const shareResult = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Deepfake Detection Result',
          text: `Image analysis: ${result.prediction} (${result.confidence.toFixed(1)}% confidence)`,
          url: window.location.href,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      const text = `Deepfake Detection Result:\n${result.prediction} (${result.confidence.toFixed(1)}% confidence)\n\nAnalyzed with EfficientNet-B0 AI model`
      navigator.clipboard.writeText(text)
      alert('Result copied to clipboard!')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Analyze Another Image</span>
        </button>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={shareResult}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-white/20 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          
          <button
            onClick={downloadResult}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-white/20 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Main Result Card */}
      <div className="glass-effect rounded-3xl p-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Original Image</h3>
            {uploadedImage && (
              <div className="relative">
                <img
                  src={uploadedImage}
                  alt="Analyzed image"
                  className="w-full h-64 object-cover rounded-2xl"
                />
                
                {/* Overlay with prediction */}
                <div className={`absolute top-4 left-4 px-3 py-2 rounded-lg ${bgColor} ${borderColor} border`}>
                  <div className="flex items-center space-x-2">
                    {isReal ? (
                      <Shield className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`font-semibold text-sm ${confidenceColor}`}>
                      {result.prediction}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Grad-CAM Toggle */}
            {result.gradcam && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowGradCAM(!showGradCAM)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>{showGradCAM ? 'Hide' : 'Show'} AI Focus Areas</span>
                </button>
              </div>
            )}
            
            {/* Grad-CAM Visualization */}
            {showGradCAM && result.gradcam && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">AI Attention Map</h4>
                <img
                  src={`data:image/png;base64,${result.gradcam}`}
                  alt="Grad-CAM visualization"
                  className="w-full h-64 object-cover rounded-2xl border-2 border-blue-200"
                />
                <p className="text-xs text-gray-500">
                  Red areas show regions the AI focused on when making its decision
                </p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>
              
              {/* Main Prediction */}
              <div className={`p-6 rounded-2xl ${bgColor} ${borderColor} border-2 mb-4`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {isReal ? (
                      <Shield className="w-8 h-8 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                    )}
                    <div>
                      <h4 className={`text-2xl font-bold ${confidenceColor}`}>
                        {result.prediction}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {result.confidence.toFixed(1)}% confidence
                      </p>
                    </div>
                  </div>
                </div>

                {/* Confidence Meter */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Confidence Level</span>
                    <span className={confidenceColor}>{result.confidence.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        result.confidence > 80 
                          ? (isReal ? 'bg-green-500' : 'bg-red-500')
                          : 'bg-yellow-500'
                      }`}
                      style={{ width: `${result.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Probability Breakdown */}
              <div className="space-y-3">
                <h5 className="font-medium">Probability Breakdown</h5>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Real Image</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-green-500 rounded-full"
                          style={{ width: `${result.probabilities.real}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {result.probabilities.real.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Fake/AI Generated</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-red-500 rounded-full"
                          style={{ width: `${result.probabilities.fake}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {result.probabilities.fake.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="space-y-4">
              <h5 className="font-medium">Detailed Analysis</h5>
              <div className="p-4 bg-white/50 rounded-xl">
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {result.analysis}
                </p>
              </div>
            </div>

            {/* Technical Details Toggle */}
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Cpu className="w-4 h-4" />
              <span className="text-sm font-medium">
                {showTechnicalDetails ? 'Hide' : 'Show'} Technical Details
              </span>
            </button>

            {/* Technical Details */}
            {showTechnicalDetails && (
              <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Model:</span>
                    <p className="font-medium">{result.model_info.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Version:</span>
                    <p className="font-medium">{result.model_info.version}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Accuracy:</span>
                    <p className="font-medium">{result.model_info.accuracy}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Processed:</span>
                    <p className="font-medium">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">Important Disclaimer</p>
            <p>
              This AI model provides predictions based on learned patterns and may not be 100% accurate. 
              Results should be used as guidance and verified through additional means when making important decisions. 
              The model performs best on high-quality images and may have reduced accuracy on heavily compressed or low-resolution images.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}