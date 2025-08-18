import  { useEffect, useState } from 'react';
import { User, Music, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { invokeSpotifyLogin, invokeYoutubeLogin } from '@/services/DataService';

const ProfilePage: React.FC  = () => {
    const navigate=useNavigate();
  const [userFirstName, setUserFirstName] = useState();
  const [userLastName, setUserLastName] = useState();
  const [userEmail, setUserEmail] = useState();


  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [isYouTubeConnected, setIsYouTubeConnected] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initializeProfile = () => {
      const userData: string | null = localStorage.getItem("soundSwapUser");
      
      if (!userData) {
        if (isMounted) {
          navigate('/signIn');
        }
        return;
      }

      if (isMounted) {
        try {
          const userDataJson = JSON.parse(userData);
          setUserFirstName(userDataJson.firstName);
          setUserLastName(userDataJson.lastName);
          setUserEmail(userDataJson.email);
          setIsSpotifyConnected(userDataJson.isSpotifyAuth);
          setIsYouTubeConnected(userDataJson.isYoutubeAuth);
        } catch (error) {
          console.error("Error parsing user data:", error);
          navigate("/signIn");
        }
      }
    };

    initializeProfile();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleSpotifyAuth = () => {
    // Implement Spotify authentication logic here
    invokeSpotifyLogin()
    .then((data)=>{
      window.location.href = data.redirectUrl;
    })
    .catch((error)=>{
      console.log(error)
    }
    );

  };

  const handleYouTubeAuth = () => {
    // Implement YouTube authentication logic here
    invokeYoutubeLogin()
    .then((data)=>{
      window.location.href = data.redirectUrl;
    })
    .catch((error)=>{
      console.log(error)
    });

  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-6 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Your Profile</h1>
        
        <Card className="mb-8 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800 flex items-center">
              <User className="mr-2 text-purple-600" /> Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col space-y-1">
                <label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={userFirstName}
                  disabled={true}
                  className="border-gray-300 focus:border-purple-500"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={userLastName}
                  disabled={true}
                  className="border-gray-300 focus:border-purple-500"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                <Input
                  id="email"
                  name="email"
                  value={userEmail}
                  disabled={true}
                  className="border-gray-300 focus:border-purple-500"
                />
              </div>
              
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800 flex items-center">
              <Music className="mr-2 text-purple-600" /> Connected Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Music className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Spotify</span>
                </div>
                <Button 
                  onClick={handleSpotifyAuth} 
                  variant={isSpotifyConnected ? "outline" : "default"}
                  className={isSpotifyConnected ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200" : "bg-purple-100 text-purple-700 hover:bg-purple-200"}
                  disabled={isSpotifyConnected}
                >
                  {isSpotifyConnected ? 'Connected' : 'Connect'}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Youtube className="h-5 w-5 text-red-600" />
                  <span className="text-gray-700">YouTube</span>
                </div>
                <Button 
                  onClick={handleYouTubeAuth} 
                  variant={isYouTubeConnected ? "outline" : "default"}
                  disabled={isYouTubeConnected}
                  className={isYouTubeConnected ? "bg-red-100 text-red-700 border-red-300 hover:bg-red-200" : "bg-purple-100 text-purple-700 hover:bg-purple-200"}
                >
                  {isYouTubeConnected ? 'Connected' : 'Connect'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProfilePage;