import express from "express";
import authController from '../controllers/authController.js'
import authMiddleWare from "../middleware/authMiddleware.js";

const router=express.Router();
router.get("/spotify/login",authController.spotifyLogin);

router.get("/spotify/callback",authMiddleWare,authController.spotifyCallback);

router.get("/youtube/login",authController.youtubeLogin);

router.get("/youtube/callback",authMiddleWare,authController.youtubeCallback);

router.post("/signup",authController.signUp);
router.post("/signin",authController.signIn);

export default router