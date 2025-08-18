import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Music, Youtube, Info, Sparkles, ExternalLink, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { convertPlayList, createSession } from '@/services/DataService';

const CreateSession: React.FC = () => {
  const navigate = useNavigate();
  const [sessionName, setSessionName] = useState('');
  const [spotifyLink, setSpotifyLink] = useState('');
  const [playListTitle, setPlayListTitle] = useState('');
  const [playListDesc, setPlayListDesc] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'creating' | 'converting' | 'success'>('form');
  const [conversionProgress, setConversionProgress] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const session = searchParams.get("sessionName");
    if (session != null) {
      setSessionName(session);
      setPlayListTitle(session); // Set default playlist title
    }
  }, []);

  const validateSpotifyLink = (link: string) => {
    const spotifyRegex = /^https:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]+/;
    return spotifyRegex.test(link);
  };

  const handleCreateSession = async () => {
    if (!validateSpotifyLink(spotifyLink)) {
      setError('Please enter a valid Spotify playlist link (e.g., https://open.spotify.com/playlist/...)');
      return;
    }

    let sessionId = '';
    setIsLoading(true);
    setError('');
    setYoutubeLink('');
    setStep('creating');

    try {
      const userData: string | null = localStorage.getItem("soundSwapUser");
      if (!userData) {
        navigate('/signIn');
        return;
      }

      const userDataJson = JSON.parse(userData);
      console.log(userDataJson);

      // Step 1: Create session in the database
      setConversionProgress('Creating session...');
      const sessionData = await createSession(userDataJson.token, sessionName, spotifyLink);
      sessionId = sessionData.id;

      // Step 2: Convert Spotify playlist to YouTube
      setStep('converting');
      setConversionProgress('Converting playlist to YouTube...');
      
      const conversionResult = await convertPlayList(
        userDataJson.token,
        sessionId,
        spotifyLink,
        playListTitle,
        playListDesc
      );
      
      console.log('Conversion result:', conversionResult);
      setYoutubeLink(conversionResult.youtubePlaylistLink);
      setStep('success');
      
      // Auto-redirect after 5 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 5000);

    } catch (err: any) {
      console.error('Error:', err);
      // Extract meaningful error message
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setStep('form');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading screen for conversion process
  if (isLoading && (step === 'creating' || step === 'converting')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <Card variant="glass" className="p-8 max-w-md text-center backdrop-blur-xl">
          <div className="animate-spin w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-6"></div>
          <h3 className="text-2xl font-bold mb-4">
            {step === 'creating' ? 'Creating Session' : 'Converting Playlist'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{conversionProgress}</p>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            This may take a few moments...
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Create New <span className="gradient-text">Session</span>
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Convert your Spotify playlist to YouTube with ease
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {step === 'success' ? (
            /* Success State */
            <Card variant="modern" className="animate-scale-in text-center">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-2xl">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">Conversion Successful!</CardTitle>
                <CardDescription className="text-green-100">
                  Your Spotify playlist has been converted to YouTube
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <AlertTitle className="text-green-800 dark:text-green-300">YouTube Playlist Ready</AlertTitle>
                    <AlertDescription className="text-green-700 dark:text-green-400">
                      <p className="mb-2">Your playlist has been successfully created on YouTube:</p>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
                        <a 
                          href={youtubeLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-500 font-medium flex items-center gap-2 transition-colors"
                        >
                          <Youtube className="w-4 h-4" />
                          Open YouTube Playlist
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex gap-4 justify-center">
                    <Button variant="outline" onClick={() => navigate('/dashboard')}>
                      View All Sessions
                    </Button>
                    <Button variant="modern" onClick={() => window.location.reload()}>
                      Create Another
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Automatically redirecting to dashboard in 5 seconds...
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Form State */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2">
                <Card variant="modern" className="animate-slide-up">
                  <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-2xl">
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                      <Sparkles className="w-6 h-6" />
                      Playlist Conversion
                    </CardTitle>
                    <CardDescription className="text-purple-100">
                      Fill in the details to convert your Spotify playlist
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    {/* Session Name */}
                    <div className="space-y-2">
                      <Label htmlFor="session-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Session Name *
                      </Label>
                      <Input
                        id="session-name"
                        placeholder="Enter a memorable session name"
                        value={sessionName}
                        onChange={(e) => setSessionName(e.target.value)}
                        className="h-12 border-2 focus:border-purple-500 transition-colors duration-200"
                      />
                    </div>

                    {/* Spotify Link */}
                    <div className="space-y-2">
                      <Label htmlFor="spotify-link" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Spotify Playlist Link *
                      </Label>
                      <Input
                        id="spotify-link"
                        placeholder="https://open.spotify.com/playlist/..."
                        value={spotifyLink}
                        onChange={(e) => setSpotifyLink(e.target.value)}
                        className="h-12 border-2 focus:border-purple-500 transition-colors duration-200"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Make sure your Spotify playlist is public or unlisted
                      </p>
                    </div>

                    {/* YouTube Playlist Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="playlist-title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          YouTube Playlist Title *
                        </Label>
                        <Input
                          id="playlist-title"
                          placeholder="Enter playlist title"
                          value={playListTitle}
                          onChange={(e) => setPlayListTitle(e.target.value)}
                          className="h-12 border-2 focus:border-purple-500 transition-colors duration-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="playlist-desc" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Playlist Description *
                        </Label>
                        <Input
                          id="playlist-desc"
                          placeholder="Enter playlist description"
                          value={playListDesc}
                          onChange={(e) => setPlayListDesc(e.target.value)}
                          className="h-12 border-2 focus:border-purple-500 transition-colors duration-200"
                        />
                      </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                      <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 animate-slide-up">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Conversion Failed</AlertTitle>
                        <AlertDescription className="mt-2">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Submit Button */}
                    <Button 
                      onClick={handleCreateSession} 
                      variant="modern"
                      size="lg"
                      className="w-full group font-semibold"
                      disabled={isLoading || !spotifyLink || !sessionName || !playListTitle || !playListDesc}
                    >
                      {isLoading ? (
                        <>
                          <Clock className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Music className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                          Create Session & Convert
                          <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar with Warnings and Info */}
              <div className="space-y-6">
                {/* YouTube Quota Warning */}
                <Card variant="gradient" className="animate-slide-in-right">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      {/* <Warning className="w-5 h-5 text-orange-600" /> */}
                      YouTube Quota Limit
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Alert className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
                      <Info className="w-4 h-4 text-orange-600" />
                      <AlertDescription className="text-orange-800 dark:text-orange-300">
                        <strong>Important:</strong> Due to YouTube's daily API quota limits, only a percentage of your songs may be added to the playlist.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                {/* YouTube Channel Requirement */}
                <Card variant="modern" className="animate-slide-in-right animate-delay-100">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Youtube className="w-5 h-5 text-red-600" />
                      Channel Required
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                      <AlertCircle className="w-4 h-4 text-blue-600" />
                      <AlertDescription className="text-blue-800 dark:text-blue-300">
                        <p className="mb-3">
                          <strong>YouTube Channel Required:</strong> Make sure you have a YouTube channel created for your account before starting the conversion.
                        </p>
                        <a 
                          href="https://www.youtube.com/create_channel" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-500 font-medium transition-colors"
                        >
                          <Youtube className="w-4 h-4" />
                          Create YouTube Channel
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateSession;
