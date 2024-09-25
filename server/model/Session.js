import mongoose, { Schema } from 'mongoose';

const sessionSchema=mongoose.Schema({
        userId:{
            type:Schema.Types.ObjectId,
            required:true,
            ref:'User'
        },
        sessionName:{
            type:String,
            required:true
        },
        spotifyPlaylistLink:{
            type:String,
            required:true
        },
        youtubePlaylistLink:{
            type:String,
            required:false,
        },
        createdAt:{
            type:Date,
            default:Date.now
        }
});

const Session=mongoose.model('Session',sessionSchema);

export default  Session;

