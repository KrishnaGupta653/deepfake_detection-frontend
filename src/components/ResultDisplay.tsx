'use client'

import { useState } from 'react'
import { 
  ArrowLeft, 
  Shield, 
  AlertTriangle, 
  Eye, 
  Download, 
  Share2, 
  Clock, 
  Cpu, 
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart3,
  Zap,
  Brain,
  Award,
  Copy,
  ExternalLink
} from 'lucide-react'

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
  const [copied, setCopied] = useState(false)

  const isReal = result.prediction === 'Real'
  const confidenceLevel = result.confidence > 90 ? 'high' : result.confidence > 70 ? 'medium' : 'low'
  
  const getConfidenceColor = () => {
    if (confidenceLevel === 'high') return isReal ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
    if (confidenceLevel === 'medium') return 'text-yellow-600 dark:text-yellow-400'
    return 'text-orange-600 dark:text-orange-400'
  }

  const getConfidenceBg = () => {
    if (confidenceLevel === 'high') return isReal ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
    if (confidenceLevel === 'medium') return 'bg-yellow-50 dark:bg-yellow-900/20'
    return 'bg-orange-50 dark:bg-orange-900/20'
  }

  const getConfidenceBorder = () => {
    if (confidenceLevel === 'high') return isReal ? 'border-green-200 dark:border-green-700' : 'border-red-200 dark:border-red-700'
    if (confidenceLevel === 'medium') return 'border-yellow-200 dark:border-yellow-700'
    return 'border-orange-200 dark:border-orange-700'
  }

  const downloadResult = () => {
    const dataStr = JSON.stringify({
      ...result,
      analysis_timestamp: new Date().toISOString(),
      export_format: "JSON"
    }, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `deepfake_analysis_${new Date().getTime()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const shareResult = async () => {
    const shareText = `DeepfakeGuard Analysis Result:\n${result.prediction} (${result.confidence.toFixed(1)}% confidence)\n\nAnalyzed with ${result.model_info.name} AI model\n\n🔗 Try it yourself: ${window.location.origin}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'DeepfakeGuard Analysis Result',
          text: shareText,
          url: window.location.href,
        })
      } catch (err) {
        console.error('Error sharing:', err)
        copyToClipboard(shareText)
      }
    } else {
      copyToClipboard(shareText)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const getReliabilityMessage = () => {
    if (confidenceLevel === 'high') {
      return isReal 
        ? "High confidence: This image appears to be authentic with no signs of artificial generation."
        : "High confidence: This image shows strong indicators of being artificially generated or manipulated."
    } else if (confidenceLevel === 'medium') {
      return "Medium confidence: Some indicators present, but results should be verified through additional means."
    } else {
      return "Lower confidence: Results are uncertain. Consider using higher quality images or additional verification methods."
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
        <button
          onClick={onReset}
          className="flex items-center space-x-3 px-6 py-3 rounded-2xl hover:bg-white/20 dark:hover:bg-gray-800/50 transition-all duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform text-gray-800 dark:text-gray-200" />
          <span className="font-medium text-gray-800 dark:text-gray-200">Analyze Another Image</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={shareResult}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-white/20 dark:hover:bg-gray-800/50 transition-all duration-300 group text-gray-800 dark:text-gray-200"
          >
            <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="font-medium">{copied ? 'Copied!' : 'Share'}</span>
          </button>
          
          <button
            onClick={downloadResult}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-white/20 dark:hover:bg-gray-800/50 transition-all duration-300 group text-gray-800 dark:text-gray-200"
          >
            <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            <span className="font-medium">Export</span>
          </button>
        </div>
      </div>

      {/* Main Result Card */}
      <div className="glass-effect rounded-3xl p-8 md:p-10 shadow-2xl">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Image Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Analysis Input</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{new Date(result.timestamp).toLocaleString()}</span>
              </div>
            </div>
            
            {uploadedImage && (
              <div className="relative group">
                <img
                  src={uploadedImage}
                  alt="Analyzed image"
                  className="w-full h-72 object-cover rounded-2xl shadow-lg"
                />
                
                {/* Prediction Badge */}
                <div className={`absolute top-4 left-4 px-4 py-2 rounded-xl ${getConfidenceBg()} ${getConfidenceBorder()} border-2 backdrop-blur-sm`}>
                  <div className="flex items-center space-x-2">
                    {isReal ? (
                      <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                    <div>
                      <span className={`font-bold text-sm ${getConfidenceColor()}`}>
                        {result.prediction}
                      </span>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {result.confidence.toFixed(1)}% confidence
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confidence Level Indicator */}
                <div className="absolute top-4 right-4">
                  <div className={`w-3 h-3 rounded-full ${
                    confidenceLevel === 'high' ? 'bg-green-500' : 
                    confidenceLevel === 'medium' ? 'bg-yellow-500' : 'bg-orange-500'
                  } animate-pulse`}></div>
                </div>
              </div>
            )}
            
            {/* Grad-CAM Section */}
            {result.gradcam && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-800 dark:text-white">AI Focus Analysis</h4>
                  <button
                    onClick={() => setShowGradCAM(!showGradCAM)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-300"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{showGradCAM ? 'Hide' : 'Show'} Heat Map</span>
                  </button>
                </div>
                
                {showGradCAM && (
                  <div className="space-y-3 animate-slide-down">
                    <img
                      src={`data:image/png;base64,${result.gradcam}`}
                      alt="Grad-CAM visualization"
                      className="w-full h-72 object-cover rounded-2xl border-2 border-blue-200 dark:border-blue-700 shadow-lg"
                    />
                    <div className="glass-effect rounded-xl p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Heat Map Legend:</span> Red and yellow areas indicate regions where the AI model focused most attention when making its prediction. Higher intensity suggests greater influence on the decision.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Detection Results</h3>
              
              {/* Main Prediction Card */}
              <div className={`p-8 rounded-3xl ${getConfidenceBg()} ${getConfidenceBorder()} border-2 mb-6 relative overflow-hidden`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-current to-transparent"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-2xl ${isReal ? 'bg-green-500' : 'bg-red-500'} shadow-lg`}>
                        {isReal ? (
                          <Shield className="w-8 h-8 text-white" />
                        ) : (
                          <AlertTriangle className="w-8 h-8 text-white" />
                        )}
                      </div>
                      <div>
                        <h4 className={`text-3xl font-bold ${getConfidenceColor()}`}>
                          {result.prediction}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          {result.confidence.toFixed(1)}% confidence • {confidenceLevel.toUpperCase()} reliability
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-4xl font-bold ${getConfidenceColor()}`}>
                        {result.confidence.toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Certainty</div>
                    </div>
                  </div>

                  {/* Confidence Progress Bar */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                      <span>Confidence Level</span>
                      <span>{confidenceLevel.charAt(0).toUpperCase() + confidenceLevel.slice(1)}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-4 rounded-full transition-all duration-1000 ease-out ${
                          confidenceLevel === 'high' 
                            ? (isReal ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600')
                            : confidenceLevel === 'medium'
                            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                            : 'bg-gradient-to-r from-orange-500 to-orange-600'
                        }`}
                        style={{ width: `${result.confidence}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Reliability Message */}
                  <div className="mt-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {getReliabilityMessage()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Probability Breakdown */}
              <div className="glass-effect rounded-2xl p-6 mb-6">
                <h5 className="font-bold mb-4 text-gray-800 dark:text-white flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Probability Analysis</span>
                </h5>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Authentic Image</span>
                      </span>
                      <span className="text-sm font-bold text-gray-800 dark:text-white">
                        {result.probabilities.real.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${result.probabilities.real}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span>AI Generated/Fake</span>
                      </span>
                      <span className="text-sm font-bold text-gray-800 dark:text-white">
                        {result.probabilities.fake.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${result.probabilities.fake}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Summary */}
              <div className="glass-effect rounded-2xl p-6 mb-6">
                <h5 className="font-bold mb-4 text-gray-800 dark:text-white flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>AI Analysis Summary</span>
                </h5>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {result.analysis}
                  </p>
                </div>
              </div>

              {/* Model Performance Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass-effect rounded-xl p-4 text-center">
                  <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-800 dark:text-white">
                    {result.model_info.accuracy}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Model Accuracy</div>
                </div>
                <div className="glass-effect rounded-xl p-4 text-center">
                  <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-800 dark:text-white">
                    &lt; 3s
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Processing Time</div>
                </div>
              </div>
            </div>

            {/* Technical Details Toggle */}
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
            >
              <Cpu className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-medium">
                {showTechnicalDetails ? 'Hide' : 'Show'} Technical Details
              </span>
            </button>

            {/* Technical Details Panel */}
            {showTechnicalDetails && (
              <div className="glass-effect rounded-2xl p-6 space-y-4 animate-slide-down">
                <h5 className="font-bold text-gray-800 dark:text-white flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Model Information</span>
                </h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Model Architecture', value: result.model_info.name },
                    { label: 'Model Version', value: result.model_info.version },
                    { label: 'Training Accuracy', value: result.model_info.accuracy },
                    { label: 'Processing Time', value: `${((Date.now() - new Date(result.timestamp).getTime()) / 1000).toFixed(2)}s` },
                    { label: 'Input Resolution', value: 'Auto-scaled' },
                    { label: 'Analysis Method', value: 'Deep Neural Network' }
                  ].map((item, index) => (
                    <div key={index} className="bg-white/30 dark:bg-gray-800/30 rounded-xl p-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {item.label}
                      </div>
                      <div className="font-semibold text-gray-800 dark:text-white">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* API Information */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h6 className="font-semibold text-gray-800 dark:text-white mb-3">API Integration</h6>
                  <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-4 text-sm">
                    <code className="text-green-400">
                      <div className="text-gray-400"># Example API call</div>
                      <div className="text-blue-400">curl</div> <span className="text-yellow-300">-X POST</span> \<br/>
                      &nbsp;&nbsp;<span className="text-yellow-300">-F</span> <span className="text-green-300">"file=@image.jpg"</span> \<br/>
                      &nbsp;&nbsp;<span className="text-purple-300">https://api.deepfakeguard.com/predict</span>
                    </code>
                  </div>
                  <button
                    onClick={() => copyToClipboard('curl -X POST -F "file=@image.jpg" https://api.deepfakeguard.com/predict')}
                    className="mt-2 flex items-center space-x-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy API Example</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Disclaimer */}
      <div className="glass-effect rounded-2xl p-8 border-l-4 border-amber-500">
        <div className="flex items-start space-x-4">
          <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-gray-800 dark:text-white mb-3">Important Usage Guidelines</h4>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <strong>AI Prediction Accuracy:</strong> This system provides AI-based predictions with {result.model_info.accuracy} accuracy. 
                Results should be used as guidance and verified through additional means for critical decisions.
              </p>
              <p>
                <strong>Best Performance:</strong> The model performs optimally on high-quality, uncompressed images. 
                Low-resolution or heavily compressed images may yield less accurate results.
              </p>
              <p>
                <strong>Continuous Learning:</strong> Our models are regularly updated with new training data to improve 
                detection capabilities against evolving deepfake techniques.
              </p>
            </div>
            <div className="mt-4 flex items-center space-x-4">
              <a 
                href="#" 
                className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Learn More About Our Technology</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
