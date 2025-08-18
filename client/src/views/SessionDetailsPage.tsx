import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Music, Youtube, RefreshCw, Calendar, ExternalLink, AlertCircle, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUniqueSession, convertPlayList } from '@/services/DataService';
import Loader from '@/components/global/Loader';

interface SessionData {
  _id: { $oid: string };
  userId: { $oid: string };
  sessionName: string;
  spotifyPlaylistLink: string;
  youtubePlaylistLink?: string;
  createdAt: string | number | Date | { $date: string | { $numberLong: string } };
  __v: { $numberInt: string };
}

const SessionDetailsPage: React.FC = () => {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [retryLoading, setRetryLoading] = useState(false);
  const [playlistTitle, setPlaylistTitle] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [retryError, setRetryError] = useState<string | null>(null);
  const [retrySuccess, setRetrySuccess] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      if (id) {
        try {
          setLoading(true);
          const data = await getUniqueSession(id);
          setSession(data);
          // Set default playlist title and description
          if (data.sessionName) {
            setPlaylistTitle(data.sessionName);
            setPlaylistDescription(`Converted from Spotify playlist: ${data.sessionName}`);
          }
          console.log(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchSession();
  }, [id]);

  const handleRetryConversion = async () => {
    if (!session || !id) return;
    
    const userData = localStorage.getItem('soundSwapUser');
    if (!userData) {
      navigate('/signIn');
      return;
    }

    const userDataJson = JSON.parse(userData);
    
    setRetryLoading(true);
    setRetryError(null);
    setRetrySuccess(false);

    try {
      const result = await convertPlayList(
        userDataJson.token,
        id,
        session.spotifyPlaylistLink,
        playlistTitle,
        playlistDescription
      );
      
      // Refresh session data to get the new YouTube playlist link
      const updatedSession = await getUniqueSession(id);
      setSession(updatedSession);
      setRetrySuccess(true);
      
      console.log('Conversion result:', result);
    } catch (error: unknown) {
      console.error('Conversion failed:', error);
      setRetryError('Failed to convert playlist. Please try again.');
    } finally {
      setRetryLoading(false);
    }
  };

  const formatDate = (dateValue: string | number | Date | { $date: string | { $numberLong: string } }) => {
    let date: Date;
    if (typeof dateValue === 'string' || typeof dateValue === 'number') {
      date = new Date(dateValue);
    } else if (dateValue instanceof Date) {
      date = dateValue;
    } else if (typeof dateValue === 'object' && dateValue !== null) {
      if ('$date' in dateValue) {
        if (typeof dateValue.$date === 'string') {
          date = new Date(dateValue.$date);
        } else if (typeof dateValue.$date === 'object' && '$numberLong' in dateValue.$date) {
          date = new Date(parseInt(dateValue.$date.$numberLong));
        } else {
          return 'Invalid Date';
        }
      } else {
        return 'Invalid Date';
      }
    } else {
      return 'Invalid Date';
    }

    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <Card variant="glass" className="p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Session Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The session you're looking for doesn't exist.</p>
          <Button variant="modern" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Session Details
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Manage your playlist conversion
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session Info Card */}
            <Card variant="modern" className="animate-slide-up">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-2xl">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  {session.sessionName}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-5 h-5" />
                  <span>Created on {formatDate(session.createdAt)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Playlist Status Card */}
            <Card variant="modern" className="animate-slide-up animate-delay-100">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                    <Music className="w-4 h-4 text-white" />
                  </div>
                  Playlist Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Spotify Playlist */}
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                      <Music className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-700 dark:text-green-300">Spotify Playlist</h3>
                      <p className="text-sm text-green-600 dark:text-green-400">Source playlist connected</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-green-500 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"
                    onClick={() => window.open(session.spotifyPlaylistLink, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open
                  </Button>
                </div>

                {/* YouTube Playlist */}
                {session.youtubePlaylistLink ? (
                  <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                        <Youtube className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-red-700 dark:text-red-300">YouTube Playlist</h3>
                        <p className="text-sm text-red-600 dark:text-red-400">Conversion completed successfully</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-red-500 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                      onClick={() => window.open(session.youtubePlaylistLink, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open
                    </Button>
                  </div>
                ) : (
                  <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-orange-700 dark:text-orange-300">YouTube Conversion Pending</h3>
                        <p className="text-sm text-orange-600 dark:text-orange-400">This playlist hasn't been converted to YouTube yet</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-orange-100 dark:border-orange-700">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-4">Convert to YouTube Playlist</h4>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="playlist-title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Playlist Title
                          </Label>
                          <Input
                            id="playlist-title"
                            value={playlistTitle}
                            onChange={(e) => setPlaylistTitle(e.target.value)}
                            placeholder="Enter YouTube playlist title"
                            className="mt-1 h-10 border-2 focus:border-orange-500 transition-colors duration-200"
                          />
                        </div>
                        <div>
                          <Label htmlFor="playlist-description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Playlist Description
                          </Label>
                          <Input
                            id="playlist-description"
                            value={playlistDescription}
                            onChange={(e) => setPlaylistDescription(e.target.value)}
                            placeholder="Enter YouTube playlist description"
                            className="mt-1 h-10 border-2 focus:border-orange-500 transition-colors duration-200"
                          />
                        </div>
                        
                        {retryError && (
                          <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20">
                            <AlertCircle className="w-4 h-4" />
                            <AlertDescription>{retryError}</AlertDescription>
                          </Alert>
                        )}
                        
                        {retrySuccess && (
                          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <AlertDescription className="text-green-700 dark:text-green-300">
                              Playlist converted successfully! Check the YouTube playlist link above.
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        <Button 
                          variant="modern" 
                          className="w-full group"
                          onClick={handleRetryConversion}
                          disabled={retryLoading || !playlistTitle.trim()}
                        >
                          {retryLoading ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Converting...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
                              Convert to YouTube
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card variant="gradient" className="animate-slide-in-right">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:-translate-y-0.5 transition-all duration-200"
                  onClick={() => navigate('/dashboard')}
                >
                  <ExternalLink className="w-4 h-4 mr-3" />
                  Back to Dashboard
                </Button>
                <Button 
                  variant="glass" 
                  className="w-full justify-start hover:-translate-y-0.5 transition-all duration-200"
                  onClick={() => navigate('/create-session')}
                >
                  <Music className="w-4 h-4 mr-3" />
                  Create New Session
                </Button>
              </CardContent>
            </Card>

            {/* Session Stats */}
            <Card variant="modern" className="animate-slide-in-right animate-delay-100">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Session Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <div className="flex items-center gap-2">
                    {session.youtubePlaylistLink ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 font-medium">Completed</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span className="text-orange-600 font-medium">Pending</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Playlists</span>
                  <span className="font-medium">
                    {session.youtubePlaylistLink ? '2/2' : '1/2'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Created</span>
                  <span className="font-medium text-sm">
                    {new Date(session.createdAt as any).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailsPage;