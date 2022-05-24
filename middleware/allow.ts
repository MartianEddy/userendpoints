import { RequestHandler } from "express";


export const Allow :RequestHandler = (req, res, next) => {
    
    const token = req.headers['token']
    if(!token){
        console.log("======>" + token);
        
        return res.json({error: 'Not authorized to access this route'})
    }
    next()
}