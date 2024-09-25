import axios from 'axios'
import { google } from 'googleapis';
import authController from './authController.js';
import User from '../model/user.js';
const fetchPlayListId=(url)=>{
    const regex=/playlist\/([a-zA-Z0-9]+)/;
    const match=url.match(regex);
    return match?match[1]:null;
}
const fetchSpotifyPlayListTracks=async (accessToken,playlistId)=>{
    try{
    const response=await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,{
        headers:{
            Authorization:`Bearer ${accessToken}`
        }
    })
    
    return response.data.items;  
    }catch(error){
        throw error;
    }
}


const createYoutubePlayList=async (auth,title,description)=>{
    try{
    const youtube=google.youtube('v3');
    const response=await youtube.playlists.insert({
        part:'snippet,status',
        auth:auth,
        requestBody:{
            snippet:{
                title:title,
                description:description,
                defaultLanguage:'en'
            },
            status:{
                privacyStatus:'private'
            }
        }
    })

    return response.data.id;
}catch(error){
    throw error;
}
}   

const searchYoutubeTracks=async (auth,query)=>{
    try{

    
    const youtube=google.youtube('v3');
    const response=await youtube.search.list({
        part:'snippet',
        auth:auth,
        q:query,
        type:'video',
        maxResults:1
    });
    console.log(response);
    return response.data.items[0] ? response.data.items[0].id.videoId  :null;
}catch(error){
    throw error;
}
}

const addVideoToYoutubePlayList = async (auth, videoId, playListId, maxRetries = 3) => {
    const youtube = google.youtube('v3');
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await youtube.playlistItems.insert({
          part: 'snippet',
          auth: auth,
          requestBody: {
            snippet: {
              playlistId: playListId,
              resourceId: {
                kind: 'youtube#video',
                videoId: videoId
              }
            }
          }
        });
        console.log(`Video ${videoId} added successfully to playlist.`);
        return;  // Exit function if successful
      } catch (error) {
        if (error.code === 409 && error.errors[0].reason === 'SERVICE_UNAVAILABLE') {
          console.error(`Service unavailable while adding video ${videoId}. Attempt ${attempt}/${maxRetries}.`);
          if (attempt < maxRetries) {
            await new Promise(res => setTimeout(res, 1000));  // Wait 5 seconds before retrying
          } else {
            console.error(`Failed to add video ${videoId} after ${maxRetries} attempts.`);
            throw error;  // Re-throw error after max retries
          }
        } else {
          console.error(`Error adding video ${videoId}:`, error.message);
          throw error;  // Re-throw other errors
        }
      }
    }
  };

const generateYoutubePlayList=(playListId)=>{
    return `https://www.youtube.com/playlist?list=${playListId}`; 
}

const isTokenExpired = (expiryDate) => {
  return Date.now() > expiryDate;
};

const fetchYoutubeAccessToken=async(userId)=>{
  try{
    const user=await User.findOne({_id:userId});
    if(isTokenExpired(user.youtubeTokenExpiry)){
      console.log("Refreshing the youtube access token");
    authController.youtubeOAuth2Client.setCredentials({
    access_token: user.youtubeAccessToken,
    refresh_token: user.youtubeRefreshToken,
    expiry_date: user.youtubeTokenExpiry
    })
    const { access_token, expiry_date  } = await authController.youtubeOAuth2Client.refreshAccessToken();
    user.youtubeAccessToken=access_token;
    user.youtubeTokenExpiry=Date.now() + 3600*1000;
    await user.save();
  }

  return {
    youtubeAccessToken:user.youtubeAccessToken,
    youtubeRefreshToken:user.youtubeRefreshToken
  }
  }catch(error){
    console.error(`Error fetching youtubeToken`, error.message);
    throw error;
  }

}

const fetchSpotifyAccessToken=async(userId,clientId,clientSecret)=>{
  try{
    const user=await User.findOne({_id:userId});
    if(isTokenExpired(user.spotifyTokenExpiry)){
      console.log('Spotify access token expired, refreshing...');

      const params = new URLSearchParams();
      params.append('grant_type', 'refresh_token');
      params.append('refresh_token', user.spotifyRefreshToken);
  
      const response = await axios.post('https://accounts.spotify.com/api/token', params, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      const { access_token, expires_in } = response.data;

    user.spotifyAccessToken=access_token;
    user.spotifyTokenExpiry=Date.now() + 3600*1000;
    await user.save();
  }
  console.log(user);
  console.log(user.spotifyAccessToken);
  return user.spotifyAccessToken;
  }catch(error){
    console.error(`Error fetching youtubeToken`, error.message);
    throw error;
  }

}

export default {
    generateYoutubePlayList,
    addVideoToYoutubePlayList,
    searchYoutubeTracks,
    createYoutubePlayList,
    fetchSpotifyPlayListTracks,
    fetchPlayListId,
    fetchYoutubeAccessToken,
    fetchSpotifyAccessToken
} 