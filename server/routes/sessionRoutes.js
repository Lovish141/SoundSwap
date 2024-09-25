import express  from "express";
import { createSession, getAllSessions,getSession } from "../controllers/sessionController.js";
import authMiddleWare from "../middleware/authMiddleware.js";

const router=express.Router();

router.get("/getSessions",authMiddleWare,getAllSessions);
router.get("/getUserSession",getSession)

router.post("/createSession",authMiddleWare,createSession);

export default router;