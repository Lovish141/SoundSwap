import axios from 'axios';

const baseUrl=import.meta.env.VITE_API_URL;
const signUpUrl=baseUrl+"auth/signUp"
const signInUrl=baseUrl+"auth/signIn"
const spotifyLoginUrl=baseUrl+"auth/spotify/login"
const spotifyCallbackUrl=baseUrl+"auth/spotify/callback"
const youtubeLoginUrl=baseUrl+"auth/youtube/login"
const youtubeCallbackUrl=baseUrl+"auth/youtube/callback"
const getUserAllSessionsUrl=baseUrl+"session/getSessions";
const getUniqueSessionUrl=baseUrl+"session/getUserSession";
const createSessionUrl=baseUrl+"session/createSession";
const convertPlayListUrl=baseUrl+"playlist/convertPlayList"

export const invokeSignUp=async(firstName:string,lastName:string,email:string,password:string)=>{
    try{
        const response=await axios.post(signUpUrl,{
            firstName:firstName,
            lastName:lastName,
            email:email,
            password:password
        })

        return response.data;
    }catch(error)
    {
        console.log(error);
        throw error;
    }
}

export const invokeSignIn=async(email:string,password:string)=>{
try{
    const response=await axios.post(signInUrl,{
        email:email,
        password:password
    })
    return response.data;
}catch(error){
    console.log(error);
    throw error;
}
}

export const invokeSpotifyLogin=async()=>{
try{
    const response=await axios.get(spotifyLoginUrl);
    return response.data;
}catch(error){
    console.log(error);
    throw error;
}
}

export const invokeSpotifyCallback=async(code:string,token:string)=>{
    try{
        const response=await axios.get(spotifyCallbackUrl,{
            params:{
                code:code
            },
            headers:{
                Authorization:`Bearer ${token}`
            }

        })

        return response.data;
    }catch(error){
        console.log(error);
        throw error;
    }
}

export const invokeYoutubeLogin=async()=>{
    try{
        const response=await axios.get(youtubeLoginUrl);
        return response.data;
    }catch(error){
        console.log(error);
        throw error;
    }
    }
    
export const invokeYoutubeCallback=async(code:string,token:string)=>{
        try{
            const response=await axios.get(youtubeCallbackUrl,{
                params:{
                    code:code
                },
                headers:{
                    Authorization:`Bearer ${token}`
                },
                
            })
    
            return response.data;
        }catch(error){
            console.log(error);
            throw error;
        }
    }


export const getAllSessions=async(token:string)=>{
    try {
        const response =await axios.get(getUserAllSessionsUrl,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        return (response).data;
    } catch (error) {
        console.log(error);
            throw error;
    }
}
export const getUniqueSession=async(sessionId:string)=>{
    try {
        const response=await axios.get(getUniqueSessionUrl,{
            params:{
                sessionId:sessionId
            }
        })
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const createSession=async(token:string,sessionName:string,spotifyPlaylistLink:string)=>{
    try {
        console.log(token);
        const response=await axios.post(createSessionUrl,{
            sessionName,
            spotifyPlaylistLink
        },{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const convertPlayList=async(token:string,sessionId:string,spotifyPlayListUrl:string,playListTitle:string,playListDescription:string)=>{
    try {
        console.log(sessionId);
        const response=await axios.get(convertPlayListUrl,{
            params:{
                sessionId,
                spotifyPlayListUrl,
                playListTitle,
                playListDescription
            },
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    )
        return response.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}