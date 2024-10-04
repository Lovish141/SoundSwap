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

        const { access_token, refresh_token,expires_in } = tokenResponse.data;
        const user = await User.findOneAndUpdate({ _id: req.id }, {
            isSpotifyAuth:true,
            spotifyAccessToken: access_token,
            spotifyRefreshToken: refresh_token,
            spotifyTokenExpiry:Date.now() + 3600*1000
        }, { upsert: true });
        console.log(tokenResponse.data);
        res.json({ access_token, refresh_token });
    }catch(error)
    {
        console.error("Error fetching spotify tokens",error);
        res.status(500).json({error:'Failed to authenticate with Spotify'});
    }
}

const youtubeLogin = (req, res) => {
    const scopes = [
        'https://www.googleapis.com/auth/youtube',
    ];
    
    const url = youtubeOAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent'
    });
    
    res.json({redirectUrl:url});
};

const youtubeCallback = async (req, res) => {
    const code = req.query.code || null;

    try {
        const { tokens } = await youtubeOAuth2Client.getToken(code);
        const user = await User.findOneAndUpdate({ _id: req.id }, {
            isYoutubeAuth:true,
            youtubeAccessToken: tokens.access_token,
            youtubeRefreshToken: tokens.refresh_token,
            youtubeTokenExpiry:Date.now() +3600*1000
        }, { upsert: true });

        
        res.json(tokens);

    } catch (error) {
        console.error('Error fetching YouTube tokens:', error);
        res.status(500).json({ error: 'Failed to authenticate with YouTube' });
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
