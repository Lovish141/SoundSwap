import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import playlistController from "../controllers/playlistController.js"
import authMiddleWare from "../middleware/authMiddleware.js";
import Session from "../model/Session.js";
import authController from "../controllers/authController.js";
const router=express.Router();

const spotifyClientId=process.env.SPOTIFY_CLIENT_ID;
const spotifyClientSecret=process.env.SPOTIFY_CLIENT_SECRET;
router.get('/convertPlayList',authMiddleWare,async (req,res)=>{
    try{
        const {sessionId,spotifyPlayListUrl,playListTitle,playListDescription}=req.query;
        console.log("sessionid"+sessionId)
        if(!spotifyPlayListUrl){
            return res.status(400).json({
                'message':"Please provide a spotify playlist url."
            })
        }
        const spotifyPlayListId=playlistController.fetchPlayListId(spotifyPlayListUrl);
        if(!spotifyPlayListId){
            return res.status(400).json({
                message:"Invalid spotify playlist url"
            })
        }

        // Fetch tokens first
        const {youtubeAccessToken,youtubeRefreshToken,youtubeTokenExpiry}=await playlistController.fetchYoutubeAccessToken(req.id);
        const spotifyAccessToken=await playlistController.fetchSpotifyAccessToken(req.id,spotifyClientId,spotifyClientSecret);
        
        // Verify we have valid tokens for both platforms
        if(!youtubeAccessToken || !youtubeRefreshToken) {
            return res.status(401).json({
                message: "YouTube authentication required. Please authenticate with YouTube first."
            });
        }

        if(!spotifyAccessToken) {
            return res.status(401).json({
                message: "Spotify authentication required. Please authenticate with Spotify first."
            });
        }

        // Create a fresh OAuth2 client instance for this request
        const { google } = await import('googleapis');
        const youtubeOAuth2Client = new google.auth.OAuth2(
            process.env.YOUTUBE_CLIENT_ID,
            process.env.YOUTUBE_CLIENT_SECRET,
            process.env.YOUTUBE_REDIRECT_URI
        );
        
        // Set credentials on the fresh client with the refreshed tokens
        youtubeOAuth2Client.setCredentials({
            access_token: youtubeAccessToken,
            refresh_token: youtubeRefreshToken,
            expiry_date: youtubeTokenExpiry
        });

        console.log("Using access token:", youtubeAccessToken.substring(0, 20) + "...");
        console.log("Token expiry:", new Date(youtubeTokenExpiry));
        console.log("Spotify access token:", spotifyAccessToken);
        
        const tracks=await playlistController.fetchSpotifyPlayListTracks(spotifyAccessToken,spotifyPlayListId);

        const youtubePlayListId=await playlistController.createYoutubePlayList(youtubeOAuth2Client,playListTitle,playListDescription);
        
        for(const track of tracks.slice(0,5)){
            const query=`${track.track.name} ${track.track.artists.map(artist => artist.name).join(' ')}`;
            const youtubeVideoId=await playlistController.searchYoutubeTracks(youtubeOAuth2Client,query);
            if(youtubeVideoId){
                await playlistController.addVideoToYoutubePlayList(youtubeOAuth2Client,youtubeVideoId,youtubePlayListId);
            }
        }

        const youtubePlaylistLink=playlistController.generateYoutubePlayList(youtubePlayListId);

        const session=await Session.findOneAndUpdate({_id:sessionId},{
            youtubePlaylistLink:youtubePlaylistLink
        },{upsert:true})

        return res.json({
            message:'PlayList converted successfully',
            youtubePlaylistLink
        })
    
    }catch(error){
        console.error("An error occured",error);
        
        // Provide more specific error messages
        if(error.code === 401 || error.status === 401) {
            return res.status(401).json({
                message: "YouTube authentication failed. Please re-authenticate with YouTube.",
                error: error.message
            });
        }
        
        // Handle YouTube channel required error
        if(error.message.includes('YouTube channel required') || error.message.includes('youtubeSignupRequired')) {
            return res.status(400).json({
                message: "YouTube channel required. Please create a YouTube channel first by visiting youtube.com and clicking 'Create a channel'.",
                error: error.message,
                action: "create_youtube_channel"
            });
        }
        
        res.status(500).json({
            message:"An error occurred during playlist conversion",
            error: error.message
        })
    }
})
export default router;