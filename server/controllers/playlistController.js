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

// Add function to check YouTube channel and provide better error handling
const checkYoutubeChannel = async (auth) => {
    try {
        const youtube = google.youtube({
            version: 'v3',
            auth: auth
        });
        
        // Check if user has a YouTube channel
        const channelResponse = await youtube.channels.list({
            part: ['snippet'],
            mine: true
        });
        
        if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
            throw new Error('No YouTube channel found. Please create a YouTube channel first by visiting youtube.com and clicking "Create a channel" under profile section.');
        }
        
        return channelResponse.data.items[0];
    } catch (error) {
        console.error('YouTube channel check error:', error.message);
        throw error;
    }
};

const createYoutubePlayList=async (auth,title,description)=>{
    try{
        // First check if user has a YouTube channel
        await checkYoutubeChannel(auth);
        
        const youtube=google.youtube({
            version: 'v3',
            auth: auth
        });
        
        const response=await youtube.playlists.insert({
            part: ['snippet', 'status'],
            requestBody:{
                snippet:{
                    title: title,
                    description: description,
                    defaultLanguage: 'en'
                },
                status:{
                    privacyStatus: 'private'
                }
            }
        });

        return response.data.id;
    }catch(error){
        console.error('YouTube API Error:', error.response?.data || error.message);
        
        // Provide specific error messages for common issues
        if (error.message.includes('youtubeSignupRequired') || error.message.includes('No YouTube channel found')) {
            throw new Error('YouTube channel required. Please create a YouTube channel first by visiting youtube.com and clicking "Create a channel".');
        }
        
        throw error;
    }
}

const searchYoutubeTracks=async (auth,query)=>{
    try{
        const youtube=google.youtube({
            version: 'v3',
            auth: auth
        });
        
        const response=await youtube.search.list({
            part: ['snippet'],
            q: query,
            type: 'video',
            maxResults: 1
        });
        
        console.log(response);
        return response.data.items[0] ? response.data.items[0].id.videoId : null;
    }catch(error){
        console.error('YouTube Search Error:', error.response?.data || error.message);
        throw error;
    }
}

const addVideoToYoutubePlayList = async (auth, videoId, playListId, maxRetries = 3) => {
    const youtube = google.youtube({
        version: 'v3',
        auth: auth
    });
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await youtube.playlistItems.insert({
          part: ['snippet'],
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
            await new Promise(res => setTimeout(res, 1000));  // Wait 1 second before retrying
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
    
    if(!user) {
      throw new Error('User not found');
    }
    
    if(!user.youtubeAccessToken || !user.youtubeRefreshToken) {
      throw new Error('YouTube authentication required. Please authenticate with YouTube first.');
    }
    
    // Check if token is expired (add 5 minute buffer)
    const isExpired = user.youtubeTokenExpiry && (Date.now() + 5 * 60 * 1000) > user.youtubeTokenExpiry;
    
    if(isExpired || !user.youtubeTokenExpiry){
      console.log("Refreshing the youtube access token");
      
      // Create a fresh OAuth2 client for token refresh
      const refreshClient = new google.auth.OAuth2(
        process.env.YOUTUBE_CLIENT_ID,
        process.env.YOUTUBE_CLIENT_SECRET,
        process.env.YOUTUBE_REDIRECT_URI
      );
      
      refreshClient.setCredentials({
        refresh_token: user.youtubeRefreshToken,
      });
      
      try {
        const { credentials } = await refreshClient.refreshAccessToken();
        
        // Update user with new tokens
        user.youtubeAccessToken = credentials.access_token;
        user.youtubeTokenExpiry = credentials.expiry_date || (Date.now() + 3600*1000);
        
        // Update refresh token if provided
        if (credentials.refresh_token) {
          user.youtubeRefreshToken = credentials.refresh_token;
        }
        
        await user.save();
        console.log("YouTube token refreshed successfully");
      } catch (refreshError) {
        console.error("Failed to refresh YouTube token:", refreshError.message);
        throw new Error('Failed to refresh YouTube token. Please re-authenticate with YouTube.');
      }
    }

    return {
      youtubeAccessToken: user.youtubeAccessToken,
      youtubeRefreshToken: user.youtubeRefreshToken,
      youtubeTokenExpiry: user.youtubeTokenExpiry
    }
  }catch(error){
    console.error(`Error fetching youtubeToken`, error.message);
    throw error;
  }
}

const fetchSpotifyAccessToken=async(userId,clientId,clientSecret)=>{
  try{
    const user=await User.findOne({_id:userId});
    
    if(!user) {
      throw new Error('User not found');
    }
    
    if(!user.spotifyAccessToken || !user.spotifyRefreshToken) {
      throw new Error('Spotify authentication required. Please authenticate with Spotify first.');
    }
    
    if(isTokenExpired(user.spotifyTokenExpiry)){
      console.log('Spotify access token expired, refreshing...');

      const params = new URLSearchParams();
      params.append('grant_type', 'refresh_token');
      params.append('refresh_token', user.spotifyRefreshToken);
  
      try {
        const response = await axios.post('https://accounts.spotify.com/api/token', params, {
          headers: {
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
    
        const { access_token, expires_in } = response.data;

        user.spotifyAccessToken = access_token;
        user.spotifyTokenExpiry = Date.now() + (expires_in * 1000); // Convert seconds to milliseconds
        await user.save();
        console.log("Spotify token refreshed successfully");
      } catch (refreshError) {
        console.error("Failed to refresh Spotify token:", refreshError.message);
        throw new Error('Failed to refresh Spotify token. Please re-authenticate with Spotify.');
      }
    }
    
    console.log("Using Spotify access token:", user.spotifyAccessToken);
    return user.spotifyAccessToken;
  }catch(error){
    console.error(`Error fetching Spotify token:`, error.message);
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