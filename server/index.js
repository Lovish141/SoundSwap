
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import  cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import playlistRoutes from './routes/playListRoutes.js'
import sessionRoutes from './routes/sessionRoutes.js'
const app=express();

app.use(cors(
    {
        origin: 'https://sound-swap-frontend.vercel.app', // Allow requests from this origin
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
        allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
      }
));
app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/playlist',playlistRoutes);
app.use('/api/session',sessionRoutes);

app.get("/demoEndpoint",(req,res)=>{
    return res.json({
        message:"Sent!"
    })
})
mongoose.connect(process.env.MONGO_CONNECTION_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));
const PORT=process.env.PORT

app.listen(PORT,()=>{
    try{
    
    console.log(`Server is connected at port`+PORT);
    }catch(error){
        console.log(error);
    }
})
