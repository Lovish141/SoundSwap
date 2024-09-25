import mongoose from 'mongoose';

import bcryptjs from 'bcryptjs';
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isYoutubeAuth:{
        type:Boolean,
        default:false,
        required:false
    },
    isSpotifyAuth:{
        type:Boolean,
        default:false,
        required:false
    },
    youtubeAccessToken:{
        type:String,
        required:false
    },
    youtubeRefreshToken:{
        type:String,
        required:false
    },
    youtubeTokenExpiry:{
        type:String,
        required:false
    },
    spotifyAccessToken:{
        type:String,
        required:false
    },
    spotifyRefreshToken:{
        type:String,
        required:false
    },
    spotifyTokenExpiry:{
        type:String,
        required:false
    }
})


userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next()
    }

    const salt=await bcryptjs.genSalt(10);
    this.password=await bcryptjs.hash(this.password,salt);
    next();
})

userSchema.methods.matchPassword=async function(enteredPassword){
    return await bcryptjs.compare(enteredPassword,this.password)
}

const User=mongoose.model('User',userSchema);

export default User;