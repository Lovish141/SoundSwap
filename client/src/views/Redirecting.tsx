import { invokeSpotifyCallback, invokeYoutubeCallback } from '@/services/DataService';
import React, { useEffect, useRef } from 'react'
import {useNavigate, useSearchParams} from 'react-router-dom'

const Redirecting: React.FC  = () => {
  const  [searchParams]=useSearchParams();
  const navigate=useNavigate();
  const hasProcessedCallback = useRef(false); // Prevent double processing

  useEffect(() => {
    // Prevent double execution
    if (hasProcessedCallback.current) return;
    
    let isMounted = true;
    
    const processCallback = () => {
      const userData : string | null= localStorage.getItem("soundSwapUser");
      if (!userData) {
        if (isMounted) {
          navigate('/signIn');
        }
        return;
      }
      
      const userDataJson = JSON.parse(userData); 
      const srcValue = searchParams.get('src');
      const code = searchParams.get('code');
      
      if (!code) return;

      // Mark as processed to prevent double execution
      hasProcessedCallback.current = true;

      if (srcValue === "spotify") {
        invokeSpotifyCallback(code, userDataJson.token)
        .then(() => {
          if (isMounted) {
            userDataJson.isSpotifyAuth = true;
            localStorage.setItem("soundSwapUser", JSON.stringify(userDataJson));
            navigate("/profile");
          }
        })
        .catch((err) => {
          console.log(err);
          hasProcessedCallback.current = false; // Reset on error
        });
      } else if (srcValue === "youtube") {
        invokeYoutubeCallback(code, userDataJson.token)
        .then((data) => {
          if (isMounted) {
            userDataJson.isYoutubeAuth = true;
            localStorage.setItem("soundSwapUser", JSON.stringify(userDataJson));
            navigate("/profile");
            console.log(data);
          }
        })
        .catch((err) => {
          console.log(err);
          hasProcessedCallback.current = false; // Reset on error
        });
      }
    };

    processCallback();

    return () => {
      isMounted = false;
    };
  }, [navigate, searchParams]);

  return (
    <div className='w-full h-screen text-center flex align-center items-center'>
     <p className='w-full'>Redirecting....</p>
    </div>
  )
}

export default Redirecting
