import React, { useEffect,useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent,  CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {  Plus, History, AlertCircle } from 'lucide-react';
import { getAllSessions } from '@/services/DataService';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Dashboard: React.FC  = () => {
    const navigate=useNavigate();
    const [sessions,setSessions]=useState([]);
    const [newSessionName, setNewSessionName] = useState("");
    const [isAuth,setIsAuth]=useState(false);
    useEffect(() => {


      const userData : string | null= localStorage.getItem("soundSwapUser");
      if (!userData) {
        navigate('/signIn')
      }
      if (userData) {
        const userDataJson = JSON.parse(userData);
        if(userDataJson.isSpotifyAuth && userDataJson.isYoutubeAuth){
          setIsAuth(true);
        }
        getAllSessions(userDataJson.token)
        .then((data)=>{
          setSessions(data);
          console.log(data)
        })
        .catch((err)=>{
          console.log(err);
        });
      } else {
        console.log("No user data found in localStorage");
      }
      
      
    },[]);
   
  
    const handleCreateSession = () => {
      
      navigate(`/create-session?sessionName=${newSessionName}`);
    };
  
    const viewDetails=(id:string)=>{
      navigate(`/session/${id}`)
    }
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Dashboard</h1>
          
          {/* Create New Session */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <Plus className="w-5 h-5 mr-2 text-purple-600" />
                Create New Session
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
              <Input
                placeholder="Enter session name"
                value={newSessionName}
                onChange={(e) => setNewSessionName(e.target.value)}
                className="mr-4 flex-grow"
              />
              <Button onClick={handleCreateSession} disabled={newSessionName.length==0 || isAuth == false} className="bg-purple-600 text-white hover:bg-purple-700">
                Create Session
              </Button>
            </CardContent>
            {!isAuth &&
              (
                <CardContent>
                <Alert variant={"destructive"}>
                  <AlertDescription className='flex items-center align-middle'>
                  <AlertCircle className='w-4 h-4'/>
                  <span className='ml-2'>Head to the <Link to={"/profile"} className='underline underline-offset-2'>Profile</Link> section to complete authorizations.
                  </span>
                  </AlertDescription>
                </Alert>
                </CardContent>
              )}
          </Card>
          
          {/* Session History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <History className="w-5 h-5 mr-2 text-purple-600" />
                Session History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sessions.length==0 &&
              (
                <Card>
                  <CardHeader>
                    No Session History
                  </CardHeader>
                </Card>
              )}
              <div className="space-y-4">
                {sessions.map((session:any) => (
                  <Card key={session._id} className="bg-white shadow hover:shadow-md transition-shadow duration-300">
                    <CardContent className="flex justify-between items-center p-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{session.sessionName}</h3>
                        <p className="text-sm text-gray-600">Created: {session.createdAt}</p>
                      </div>
                      {/* <div className="flex items-center">
                        <Music className="w-4 h-4 mr-2 text-purple-600" />
                        <span className="text-sm text-gray-600">{session.tracks} tracks</span>
                      </div> */}
                      
                      <Button onClick={()=>viewDetails(session._id)} variant="outline" className="text-purple-600 hover:bg-purple-50" >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  
}

export default Dashboard
