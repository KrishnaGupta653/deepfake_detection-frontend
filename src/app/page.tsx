'use client'

import { useState } from 'react'
import { Upload, Shield, Brain, Zap, CheckCircle, AlertTriangle, Star, Users, Award, Globe, ArrowRight, Play } from 'lucide-react'
import UploadForm from '@/components/UploadForm'
import ResultDisplay from '@/components/ResultDisplay'
import Navbar from '@/components/Navbar'

interface PredictionResult {
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

export default function Home() {
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const handlePrediction = (predictionResult: PredictionResult, imageUrl: string) => {
    setResult(predictionResult)
    setUploadedImage(imageUrl)
  }

  const handleReset = () => {
    setResult(null)
    setUploadedImage(null)
  }

  const stats = [
    // { icon: Users, label: 'Active Users', value: '10K+' },
    { icon: Users, label: 'Detections Completed', value: '1K+' },
    { icon: Shield, label: 'Accuracy Rate', value: '98.5%' },
    { icon: Zap, label: 'Avg. Processing', value: '2.3s' },
    { icon: Globe, label: 'Images Analyzed', value: '10K+' },
  ]

  const features = [
    {
      icon: Brain,
      title: 'Advanced AI Detection',
      description: 'State-of-the-art ResNet50 neural network trained on millions of images',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get results in under 3 seconds with our optimized processing pipeline',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: Shield,
      title: 'Industry Leading Accuracy',
      description: '98.5% accuracy rate with continuous model improvements',
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: Award,
      title: 'Visual Explanations',
      description: 'Grad-CAM heatmaps show exactly what the AI is looking at',
      color: 'from-purple-500 to-pink-600'
    }
  ]

  return (
    <div className="min-h-screen gradient-bg dark:gradient-bg-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden pt-24 pb-20 px-4">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full animate-pulse-slow"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-purple-600/10 to-pink-600/10 rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          {!result ? (
            <>
              {/* Hero Content */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl mb-8 animate-float shadow-2xl">
                  <Brain className="w-12 h-12 text-white" />
                </div>
                
                <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
                  <span className="gradient-text animate-gradient">AI Deepfake</span>
                  <br />
                  <span className="text-gray-800 dark:text-white">Detection System</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Upload any image to detect if it's real or artificially generated using our 
                  advanced <span className="font-semibold text-blue-600">ResNet50 AI model</span> with 98.5%+ accuracy
                </p>
                
                {/* CTA Buttons */}
                {/* <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
                  <button className="btn-primary text-lg px-8 py-4 flex items-center space-x-3">
                    <Upload className="w-5 h-5" />
                    <span>Try It Now - Free</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button className="btn-secondary text-lg px-8 py-4 flex items-center space-x-3">
                    <Play className="w-5 h-5" />
                    <span>Watch Demo</span>
                  </button>
                </div> */}

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
                  {stats.map((stat, index) => (
                    <div key={stat.label} className="glass-effect rounded-2xl p-6 card-hover">
                      <stat.icon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 max-w-6xl mx-auto">
                  {features.map((feature, index) => (
                    <div key={feature.title} className="glass-effect rounded-3xl p-8 card-hover text-center">
                      <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400 mb-8">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Secure & Private</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>Research Backed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span>No Registration</span>
                  </div>
                </div>
              </div>
            </>
          ) : null}
          
          {/* Upload Form or Results */}
          <div className="max-w-5xl mx-auto">
            {!result ? (
              <UploadForm 
                onPrediction={handlePrediction}
                loading={loading}
                setLoading={setLoading}
              />
            ) : (
              <ResultDisplay 
                result={result}
                uploadedImage={uploadedImage}
                onReset={handleReset}
              />
            )}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      {!result && (
        <section id="how-it-works" className="py-20 px-4 bg-white/30 dark:bg-gray-900/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Our advanced AI system uses deep learning to detect deepfakes with industry-leading accuracy
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  step: "01",
                  icon: Upload,
                  title: "Upload Image",
                  description: "Upload any image in PNG, JPG, JPEG, or WEBP format (max 16MB). Our system supports various image qualities.",
                  color: "from-blue-500 to-purple-600"
                },
                {
                  step: "02",
                  icon: Brain,
                  title: "AI Analysis",
                  description: "Our ResNet50 model analyzes 2048 unique features to detect deepfake patterns and inconsistencies.",
                  color: "from-purple-500 to-pink-600"
                },
                {
                  step: "03",
                  icon: CheckCircle,
                  title: "Get Results",
                  description: "Receive detailed analysis with confidence scores, visual explanations, and downloadable reports.",
                  color: "from-green-500 to-teal-600"
                }
              ].map((step, index) => (
                <div key={step.step} className="relative">
                  {/* Connection Line */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600 z-0"></div>
                  )}
                  
                  <div className="glass-effect rounded-3xl p-8 text-center card-hover relative z-10">
                    <div className="text-6xl font-bold text-gray-200 dark:text-gray-700 mb-4">
                      {step.step}
                    </div>
                    <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-xl mb-4 text-gray-800 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Technical Details */}
            <div className="glass-effect rounded-3xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold mb-6 gradient-text">
                    Advanced Technology
                  </h3>
                  <div className="space-y-4">
                    {[
                      "ResNet50 architecture with custom classification head",
                      "Trained on 500K+ verified real and fake images",
                      "Grad-CAM visualization for explainable AI",
                      "Real-time processing with GPU acceleration",
                      "Continuous model updates and improvements"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div className="glass-effect rounded-2xl p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                        <Brain className="w-12 h-12 text-white" />
                      </div>
                      <h4 className="font-bold text-xl mb-2 text-gray-800 dark:text-white">
                        Neural Network
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        25M+ parameters processing your image through 50 deep layers
                      </p>
                    </div>
                  </div>
                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-ping"></div>
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* API Section */}
      {!result && (
        <section id="api" className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 gradient-text">
              Developer API
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
              Integrate deepfake detection into your applications with our simple REST API
            </p>
            
            <div className="glass-effect rounded-3xl p-8 text-left">
              <div className="bg-gray-900 rounded-2xl p-6 overflow-x-auto">
                <code className="text-green-400 text-sm">
                  <div className="text-gray-400"># Example API call</div>
                  <div className="text-blue-400">curl</div> <span className="text-yellow-300">-X POST</span> \<br/>
                  &nbsp;&nbsp;<span className="text-yellow-300">-F</span> <span className="text-green-300">"file=@image.jpg"</span> \<br/>
                  &nbsp;&nbsp;<span className="text-purple-300">https://api.deepfakeguard.com/predict</span>
                </code>
              </div>
              <div className="mt-6 flex items-center justify-center">
                <button className="btn-primary">
                  Get API Key - Free
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Footer */}
      <footer className="py-12 px-4 bg-white/50 dark:bg-gray-900/50 border-t border-white/20 dark:border-gray-700/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg gradient-text">DeepfakeGuard</h3>
                  <p className="text-xs text-gray-500">AI Detection System</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Advanced AI-powered deepfake detection with industry-leading accuracy. 
                Protecting digital media authenticity through cutting-edge technology.
              </p>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Powered by:</span>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span>PyTorch</span> • <span>ResNet50</span> • <span>Flask</span> • <span>Next.js</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-gray-800 dark:text-white">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Model Details</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Research Paper</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-gray-800 dark:text-white">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 DeepfakeGuard. All rights reserved. | 
              <span className="ml-2 font-semibold text-green-600">98.5% Accuracy Rate</span>
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>System Online</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}