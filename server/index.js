
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import  cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import playlistRoutes from './routes/playListRoutes.js'
import sessionRoutes from './routes/sessionRoutes.js'
const app=express();
const allowedDomains = ['https://sound-swap-frontend.vercel.app'];

const corsOptions=(origin,callback)=>{
    
        if (!origin) return callback(null, true); // Allow non-browser requests (Postman, etc.)
        
        if (allowedDomains.indexOf(origin) !== -1) {
          callback(null, true); // Allow requests from allowed domains
        } else {
          callback(new Error('Not allowed by CORS')); // Block other domains
        }
      }

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/playlist',playlistRoutes);
app.use('/api/session',sessionRoutes);



const PORT=process.env.PORT

app.listen(PORT,()=>{
    try{
        mongoose.connect(process.env.MONGO_CONNECTION_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));
    console.log(`Server is connected at port`+PORT);
    }catch(error){
        console.log(error);
    }
})
