import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, History, AlertCircle, Sparkles, Calendar, ArrowRight, Music, ExternalLink } from 'lucide-react';
import { getAllSessions } from '@/services/DataService';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [newSessionName, setNewSessionName] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [userName, setUserName] = useState("");
  
  useEffect(() => {
    const userData: string | null = localStorage.getItem("soundSwapUser");
    if (!userData) {
      navigate('/signIn')
    }
    if (userData) {
      const userDataJson = JSON.parse(userData);
      setUserName(userDataJson.firstName + ' ' +userDataJson.lastName || "User");
      if (userDataJson.isSpotifyAuth && userDataJson.isYoutubeAuth) {
        setIsAuth(true);
      }
      getAllSessions(userDataJson.token)
        .then((data) => {
          setSessions(data);
          console.log(data)
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("No user data found in localStorage");
    }
  }, []);

  const handleCreateSession = () => {
    navigate(`/create-session?sessionName=${newSessionName}`);
  };

  const viewDetails = (id: string) => {
    navigate(`/session/${id}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12">
        {/* Welcome Header */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Welcome back, <span className="gradient-text">{userName}</span>!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Ready to convert some playlists today?
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Create New Session */}
            <Card variant="modern" className="hover-glow animate-slide-up">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  Create New Session
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Start converting your Spotify playlists to YouTube
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    placeholder="Enter a memorable session name..."
                    value={newSessionName}
                    onChange={(e) => setNewSessionName(e.target.value)}
                    className="flex-grow h-12 text-base border-2 focus:border-purple-500 transition-colors duration-200"
                  />
                  <Button 
                    onClick={handleCreateSession} 
                    disabled={newSessionName.length === 0 || !isAuth} 
                    variant="modern"
                    size="lg"
                    className="group min-w-fit"
                  >
                    Create Session
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
                
                {!isAuth && (
                  <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription className="flex items-center">
                      <span>Complete your account setup by visiting your </span>
                      <Link 
                        to="/profile" 
                        className="font-semibold underline underline-offset-2 hover:text-red-700 mx-1 transition-colors"
                      >
                        Profile
                      </Link>
                      <span>to authorize both Spotify and YouTube.</span>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Session History */}
            <Card variant="modern" className="animate-slide-up animate-delay-100">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <History className="w-5 h-5 text-white" />
                  </div>
                  Session History
                  {sessions.length > 0 && (
                    <span className="ml-auto text-sm bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full">
                      {sessions.length} session{sessions.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  View and manage your previous conversion sessions
                </p>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <Card variant="glass" className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mx-auto mb-4">
                      <Music className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      No Sessions Yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Create your first session to start converting playlists
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((session:any, index: number) => (
                      <Card 
                        key={session._id} 
                        variant="glass" 
                        className={`group hover-glow cursor-pointer transition-all duration-300 animate-slide-up`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 transition-colors">
                                {session.sessionName}
                              </h3>
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">
                                  Created: {formatDate(session.createdAt)}
                                </span>
                              </div>
                            </div>
                            
                            <Button 
                              onClick={() => viewDetails(session._id)} 
                              variant="glass" 
                              className="group/btn hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-200"
                            >
                              View Details
                              <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:scale-110 transition-transform" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card variant="gradient" className="animate-slide-in-right">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {sessions.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Sessions
                  </div>
                </div>
                <div className="border-t border-white/20 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {isAuth ? '✅' : '⚠️'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Account Status
                    </div>
                    <div className="text-xs mt-1">
                      {isAuth ? 'Fully Authorized' : 'Setup Required'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card variant="modern" className="animate-slide-in-right animate-delay-100">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/profile">
                  <Button variant="outline" className="w-full justify-start hover:-translate-y-0.5 transition-all duration-200">
                    <ExternalLink className="w-4 h-4 mr-3" />
                    View Profile
                  </Button>
                </Link>
                
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard
