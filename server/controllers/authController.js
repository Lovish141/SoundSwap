import axios from 'axios';
import querystring from 'querystring';
import { google } from 'googleapis';
import User from '../model/user.js';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

const spotifyRedirectUri=process.env.SPOTIFY_REDIRECT_URI;
const spotifyClientId=process.env.SPOTIFY_CLIENT_ID;
const spotifyClientSecret=process.env.SPOTIFY_CLIENT_SECRET;
const youtubeRedirectUri=process.env.YOUTUBE_REDIRECT_URI;
const youtubeClientId=process.env.YOUTUBE_CLIENT_ID;
const youtubeClientSecret=process.env.YOUTUBE_CLIENT_SECRET;
const jwtSecret=process.env.JWT_SECRET;

const youtubeOAuth2Client = new google.auth.OAuth2(
    youtubeClientId,
    youtubeClientSecret,
    youtubeRedirectUri
);

const spotifyLogin=(req,res)=>{
    const scope='playlist-read-private playlist-modify-private';

    res.json({redirectUrl:'https://accounts.spotify.com/authorize?'+
        querystring.stringify({
            response_type: 'code',
            client_id: spotifyClientId,
            scope: scope,
            redirect_uri: spotifyRedirectUri,
        })});
}

const spotifyCallback=async(req,res)=>{
    const code=req.query.code || null;

    if(!code) {
        return res.status(400).json({error: 'Authorization code is required'});
    }

    try{
        const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
            code: code,
            redirect_uri: spotifyRedirectUri,
            grant_type: 'authorization_code',
        }), {
            headers: {
                'Authorization': 'Basic ' + (Buffer.from(spotifyClientId + ':' + spotifyClientSecret).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const { access_token, refresh_token, expires_in } = tokenResponse.data;
        
        if(!access_token || !refresh_token) {
            throw new Error('Invalid token response from Spotify');
        }

        const user = await User.findOneAndUpdate({ _id: req.id }, {
            isSpotifyAuth: true,
            spotifyAccessToken: access_token,
            spotifyRefreshToken: refresh_token,
            spotifyTokenExpiry: Date.now() + (expires_in * 1000) // Convert seconds to milliseconds
        }, { upsert: true, new: true });

        console.log('Spotify tokens saved successfully for user:', req.id);
        res.json({ 
            access_token, 
            refresh_token,
            expires_in,
            message: 'Spotify authentication successful'
        });
    }catch(error)
    {
        console.error("Error fetching spotify tokens",error.response?.data || error.message);
        res.status(500).json({error:'Failed to authenticate with Spotify', details: error.message});
    }
}

const youtubeLogin = (req, res) => {
    const scopes = [
        'https://www.googleapis.com/auth/youtube'
    ];
    
    const url = youtubeOAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent',
        include_granted_scopes: true
    });
    
    res.json({redirectUrl:url});
};

const youtubeCallback = async (req, res) => {
    const code = req.query.code || null;

    if(!code) {
        return res.status(400).json({error: 'Authorization code is required'});
    }

    try {
        const { tokens } = await youtubeOAuth2Client.getToken(code);
        
        if(!tokens.access_token || !tokens.refresh_token) {
            throw new Error('Invalid token response from YouTube');
        }

        // Calculate proper expiry time from token response
        const expiryTime = tokens.expiry_date || (Date.now() + 3600*1000);

        const user = await User.findOneAndUpdate({ _id: req.id }, {
            isYoutubeAuth: true,
            youtubeAccessToken: tokens.access_token,
            youtubeRefreshToken: tokens.refresh_token,
            youtubeTokenExpiry: expiryTime
        }, { upsert: true, new: true });

        console.log('YouTube tokens saved successfully for user:', req.id);
        res.json({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_in: tokens.expiry_date ? Math.floor((tokens.expiry_date - Date.now()) / 1000) : 3600,
            message: 'YouTube authentication successful'
        });

    } catch (error) {
        console.error('Error fetching YouTube tokens:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Failed to authenticate with YouTube',
            details: error.message 
        });
    }
};

const signUp=async(req,res)=>{
    const {firstName,lastName,email,password}=req.body;
    try{
        let user=await User.findOne({email});
        if(user){
            return res.status(400).json({
                message:"User already exists"
            })
        }

        user=new User({firstName,lastName,email,password});
        user.save();

        const token=jwt.sign({id:user._id},jwtSecret,{expiresIn:'7d'});

        return res.json({
            message:"User registered successfully!",
            token,
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            isYoutubeAuth:user.isYoutubeAuth,
            isSpotifyAuth:user.isSpotifyAuth
        })
    }catch(error){
        res.status(500).json({
            message:"Error in registering the user",
            error:error.message
        })
    }
}

const signIn=async(req,res)=>{
    const {email,password}=req.body

    try{
        let user=await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"No user exist with this email"
            });
        }
        
        const isMatch=await user.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({
                message:"Invalid password entered"
            })
        }
        const token=jwt.sign({id:user._id},jwtSecret,{expiresIn:'7d'});
        return res.status(200).json({
            token,
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            isYoutubeAuth:user.isYoutubeAuth,
            isSpotifyAuth:user.isSpotifyAuth,
            message:"Successfully signed in."
        })
    }catch(error){
        return res.status(500).json({
            message:"Error in signing in the user.",
            error:error.message
        })
    }
}


export default {
    spotifyLogin,
    spotifyCallback,
    youtubeLogin,
    youtubeCallback,
    youtubeOAuth2Client,
    signUp,
    signIn
};
