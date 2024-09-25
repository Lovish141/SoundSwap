import { invokeSpotifyCallback, invokeYoutubeCallback } from '@/services/DataService';
import React, { useEffect } from 'react'
import {useNavigate, useSearchParams} from 'react-router-dom'

const Redirecting: React.FC  = () => {
  const  [searchParams]=useSearchParams();
  const navigate=useNavigate();

  //todo :set localstorage
  useEffect(()=>{
    const userData : string | null= localStorage.getItem("soundSwapUser");
    if (!userData) {
      navigate('/signIn')
    }
    if (userData) {
      const userDataJson = JSON.parse(userData); 
    const srcValue=searchParams.get('src');

    if(srcValue=="spotify"){
      const code=searchParams.get('code');
      if(code!=null){
      invokeSpotifyCallback(code,userDataJson.token)
      .then(()=>{
        userDataJson.isSpotifyAuth=true;
        localStorage.setItem("soundSwapUser",JSON.stringify(userDataJson));
        navigate("/profile")
      })
      .catch((err)=>{console.log(err)});

    }

      
    }else if(srcValue=="youtube"){
      const code=searchParams.get('code');
      if(code!=null){
      invokeYoutubeCallback(code,userDataJson.token)
      .then((data)=>{
        userDataJson.isYoutubeAuth=true;
        localStorage.setItem("soundSwapUser",JSON.stringify(userDataJson));
        navigate("/profile")
        console.log(data);
      })
      .catch((err)=>{console.log(err)});
    }
    }
  }
  },[]);
  return (
    <div className='w-full h-screen text-center flex align-center items-center'>
     <p className='w-full'>Redirecting....</p>
    </div>
  )
}

export default Redirecting
