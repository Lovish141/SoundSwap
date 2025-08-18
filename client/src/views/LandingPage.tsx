import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Youtube, Repeat, Sparkles, ArrowRight, Play, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC  = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
    
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-indigo-600/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-purple-700 dark:text-purple-300 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Transform Your Music Experience</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
              <span className="gradient-text bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome to
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">SoundSwap</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed animate-slide-up animate-delay-100">
              Seamlessly convert your <span className="text-green-600 font-semibold">Spotify</span> playlists to{' '}
              <span className="text-red-600 font-semibold">YouTube</span> with our intelligent matching algorithm
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up animate-delay-200">
              <Link to="/dashboard">
                <Button variant="modern" size="xl" className="group">
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in animate-delay-300">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">100+</div>
                <div className="text-gray-600 dark:text-gray-400">Playlists Converted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600 dark:text-gray-400">Songs Matched</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">99.2%</div>
                <div className="text-gray-600 dark:text-gray-400">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Transform your music library in three simple steps with our advanced technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card variant="modern" className="group hover-glow animate-slide-up">
              <CardHeader className="text-center pb-8">
                <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                  <Music className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold mb-3">Connect Spotify</CardTitle>
                <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-green-500 mx-auto rounded-full"></div>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  Securely link your Spotify account and browse your personal playlists with our encrypted connection
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card variant="modern" className="group hover-glow animate-slide-up animate-delay-100">
              <CardHeader className="text-center pb-8">
                <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                  <Repeat className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold mb-3">Smart Convert</CardTitle>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  Our  algorithm intelligently matches your tracks with the highest quality YouTube videos available
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card variant="modern" className="group hover-glow animate-slide-up animate-delay-200">
              <CardHeader className="text-center pb-8">
                <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                  <Youtube className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold mb-3">Enjoy on YouTube</CardTitle>
                <div className="w-12 h-1 bg-gradient-to-r from-red-500 to-purple-500 mx-auto rounded-full"></div>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  Access your converted playlists on YouTube Music anytime, anywhere, on any device
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="animate-slide-in-left">
                <h3 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                  Why Choose <span className="gradient-text">SoundSwap</span>?
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Experience the future of playlist conversion with our cutting-edge technology and user-focused design.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Lightning Fast</h4>
                      <p className="text-gray-600 dark:text-gray-400">Convert entire playlists in seconds, not minutes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Secure & Private</h4>
                      <p className="text-gray-600 dark:text-gray-400">Your data is encrypted and never stored permanently</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Smart Matching</h4>
                      <p className="text-gray-600 dark:text-gray-400">Our smart matching algorithm ensures 99%+ accuracy</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="animate-slide-in-right">
                <Card variant="glass" className="p-8">
                  <div className="text-center">
                    <div className="animate-float">
                      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shadow-glow">
                        <Music className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <h4 className="text-2xl font-bold mb-4">Ready to Transform?</h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Join thousands of music lovers who've already made the switch
                    </p>
                    <Link to="/dashboard">
                      <Button variant="gradient" size="lg" className="group">
                        Start Converting
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>

  </div>
  );
};

export default LandingPage;