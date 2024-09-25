import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { convertPlayList, createSession } from '@/services/DataService';

const CreateSession: React.FC  = () => {
  const navigate = useNavigate();
  const [sessionName, setSessionName] = useState('');
  const [spotifyLink, setSpotifyLink] = useState('');
  const [playListTitle,setPlayListTitle]=useState('');
  const [playListDesc,setPlayListDesc]=useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams]=useSearchParams();
  useEffect(()=>{
    const session=searchParams.get("sessionName")
    if(session!=null){
    setSessionName(session);
    }
  },[])
  const handleCreateSession = async () => {
    let sessionId='';
    setIsLoading(true);
    setError('');
    setYoutubeLink('');

    try {
      const userData : string | null= localStorage.getItem("soundSwapUser");
      if (!userData) {
        navigate('/signIn')
      }
      if (userData) {
        const userDataJson = JSON.parse(userData);  // Safe to parse when it's not null
        console.log(userDataJson);  
      // Step 1: Create session in the database
      await createSession(userDataJson.token,sessionName,spotifyLink)
      .then((data)=>{
        sessionId=data.id
      })
      .catch((err)=>{
        throw new Error(err);
      })

      // Step 2: Convert Spotify playlist to YouTube
     await convertPlayList(userDataJson.token,sessionId,spotifyLink,playListTitle,playListDesc)
      .then((data)=>{
        console.log(data);
        setYoutubeLink(data.youtubePlaylistLink);
      })
      .catch((err)=>{
        throw new Error(err);
      });

      // Wait a bit before redirecting to allow user to see the success message
      // setTimeout(() => {
      //   navigate('/dashboard');
      // }, 3000);
    }
    } catch (err:any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Session</h1>
        
        <Card>
          
            {youtubeLink?(
              <CardHeader>
               <CardTitle className="text-xl font-semibold">Converted Playlist Link</CardTitle>
               </CardHeader>
            ):(
              <CardHeader>
            <CardTitle className="text-xl font-semibold">Convert Spotify Playlist</CardTitle>
            <CardDescription>Enter the details for your session</CardDescription>
            </CardHeader>
          )
            }
          

          <CardContent>
           {!youtubeLink && <div className="space-y-4">
              <Input
                placeholder="Enter session name"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="mb-4"
              />
              <Input
                placeholder="Enter Spotify playlist link"
                value={spotifyLink}
                onChange={(e) => setSpotifyLink(e.target.value)}
              />
              <Input
                placeholder="Enter youtube playlist title"
                value={playListTitle}
                onChange={(e) => setPlayListTitle(e.target.value)}
              /><Input
              placeholder="Enter youtube playlist description"
              value={playListDesc}
              onChange={(e) => setPlayListDesc(e.target.value)}
            />
              <Button 
                onClick={handleCreateSession} 
                className="w-full bg-purple-600 text-white hover:bg-purple-700"
                disabled={isLoading || !spotifyLink || !sessionName}
              >
                {isLoading ? 'Creating Session...' : 'Create Session and Convert'}
              </Button>
            </div>
            }
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {youtubeLink && (
              <Alert variant="default" className="mt-4 bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Conversion Successful</AlertTitle>
                <AlertDescription>
                  <p className="text-green-700">Your YouTube playlist is ready:</p>
                  <a href={youtubeLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {youtubeLink}
                  </a>
                  <p className="text-green-700 mt-2">Redirecting to dashboard...</p>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateSession;