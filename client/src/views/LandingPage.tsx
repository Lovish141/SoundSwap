import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Youtube, Repeat } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC  = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
    
    <main className="flex-grow">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to SoundSwap</h1>
          <p className="text-xl mb-8">Convert your Spotify playlists to YouTube with ease</p>
          <Link to="/dashboard">
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
            Get Started
          </Button>
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <Music className="w-12 h-12 mb-4 text-purple-600" />
              <CardTitle className="text-gray-800">Connect Spotify</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">Link your Spotify account and select the playlist you want to convert</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <Repeat className="w-12 h-12 mb-4 text-purple-600" />
              <CardTitle className="text-gray-800">Convert</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">Our algorithm finds the best matching YouTube videos for your tracks</CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <Youtube className="w-12 h-12 mb-4 text-purple-600" />
              <CardTitle className="text-gray-800">Enjoy on YouTube</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">Access your converted playlist on YouTube anytime, anywhere</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call-to-Action Section */}

    </main>

  </div>
  );
};

export default LandingPage;