import { SchemaType } from "mongoose";
import Session from "../model/Session.js";


export const getAllSessions=async(req,res)=>{
    try{
    const sessions = await Session.find({ userId: req.id });
    res.status(200).json(sessions);
    }catch(error){
        res.status(500).json({message:"Error in fetching the previous sessions for the user",error:error.message})
    }
}

export const createSession=async (req,res)=>{
    try{
    const {sessionName,spotifyPlaylistLink}=req.body;
    const newSession= new Session({
        userId:req.id,
        spotifyPlaylistLink:spotifyPlaylistLink,
        sessionName:sessionName
    })
    await newSession.save();
    res.status(200).json({message:"Session Created Successfully",id:newSession._id});
}catch(error){
    res.status(500).json({message:"Error in creating new Session",error:error.message});
}

}

export const getSession=async(req,res)=>{
    try{
        console.log(req.query.sessionId)
        const session=await Session.findOne({_id:(req.query.sessionId)})
        return res.status(200).json(session);
    }catch(error){
        return res.status(500).json({message:"Error in getting the user session",error:error.message})
    }
}