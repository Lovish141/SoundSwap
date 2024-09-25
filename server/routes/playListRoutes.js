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
        const {youtubeAccessToken,youtubeRefreshToken}=await playlistController.fetchYoutubeAccessToken(req.id);
        const spotifyAccessToken=await playlistController.fetchSpotifyAccessToken(req.id,spotifyClientId,spotifyClientSecret);
        const youtubeOAuth2Client=authController.youtubeOAuth2Client;
        youtubeOAuth2Client.setCredentials({
            access_token:youtubeAccessToken,
            refresh_token:youtubeRefreshToken
        })
        console.log(spotifyAccessToken);
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
        res.status(500).json({
            message:"An error occcured"
            ,error
        })
    }
})
export default router;