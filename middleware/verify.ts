import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
 import dotenv from 'dotenv'
 dotenv.config()

 interface RequestExtended extends Request{
     users?:any
 }
export const VerifyToken=(req:RequestExtended,res:Response,next:NextFunction)=>{

try {
    const token = req.headers['token'] as string
    if(!token){
        return res.json({ error: 'Not authorized to access ! token not found!' });
    }
    
    const decoded= jwt.verify(token,process.env.SECRET_KEY as string)
    req.users=decoded;
    req.body.users=decoded

} catch (error) {
    return res.json({ error: 'Invalid Token' });
}
next()

}