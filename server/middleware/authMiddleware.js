import jwt from 'jsonwebtoken';

const authMiddleWare=(req,res,next)=>{
    const token=req.header('Authorization');

    if(!token){
        return res.status(401).json({message:"No token,Authorization denied"});
    }
    try{
        const decoded=jwt.verify(token.replace('Bearer ',''),process.env.JWT_SECRET);
        req.id=decoded.id;
        next();
    }catch(error){
        res.status(400).json({message:"Token is not valid"});
    }
}

export default authMiddleWare;