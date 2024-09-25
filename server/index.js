
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import  cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import playlistRoutes from './routes/playListRoutes.js'
import sessionRoutes from './routes/sessionRoutes.js'
const app=express();

app.use(cors());
app.use(express.json());

app.use('/auth',authRoutes);
app.use('/playlist',playlistRoutes);
app.use('/session',sessionRoutes);



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
