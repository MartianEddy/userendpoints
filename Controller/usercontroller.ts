
import { v1 as uid} from 'uuid'
import { NextFunction, Request, RequestHandler, Response } from "express";
import mssql from 'mssql'
import sqlConfig from '../Config/config';
import bcyrpt from 'bcrypt'
import { Registerschema } from '../helpers/registervalidator';
import {LoginSchema} from '../helpers/loginvalidator'
import { resetPasswordSchema } from '../helpers/resetpasswordvalidator'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

interface RequestExtended extends Request{
    users?:any
}
export const createUser=async(req:Request,res:Response)=>{
    try {
        const id=uid()
        const{fullname,email,password}= req.body as {fullname:string, email:string, password:string}
        let pool= await mssql.connect(sqlConfig)
        const { error}= Registerschema.validate(req.body)

        if(error){
            return res.json({error:error.details[0].message})
        }
        
        const hashedPassword= await bcyrpt.hash(password,10)

        await pool.request()
        .input('id' ,mssql.VarChar , id)
        .input('fullname' ,mssql.VarChar , fullname)
        .input('email' ,mssql.VarChar , email)
        .input('password' ,mssql.VarChar , hashedPassword)
        .execute('insertUser')
        res.status(200).json({message: 'USer Created Successfully'})
    } catch (error:any) {
        res.json({error:error.message})
    }
}


// get all registeres users

export const getUsers:RequestHandler=async(req,res,next)=>{
 try {
    let pool= await mssql.connect(sqlConfig)
    const users= await pool.request().execute('getUsers')
        res.json(users.recordset)
 } catch (error:any) {
    res.json({error:error.message})
 }
}


// get by registered username
export const getUserByUsername: RequestHandler<{email:string}> = async (req, res, next) => {
    try{
        const email = req.params.email
        let pool = await mssql.connect(sqlConfig)
        const user = await pool.request()
        .input('email', mssql.VarChar, email)
        .execute('getUsersByUserName')
        if(!user.recordset[0]){ 
            return res.json({message: `User -test with username : ${email} does not exist`})
        }
        return res.json(user.recordset)
    } catch (error : any){
        res.json({ error: error.message })
    }
}
// reset pwd?/
export const resetPassword : RequestHandler = async (req, res) => {
    try{
        const id = req.params.id
        const {password} = req.body as {password: string}
        let pool = await mssql.connect(sqlConfig)
        const user = await pool.request()
        .input('id', mssql.VarChar, id)
        .execute('getUserById')
        // check if userId exists
        if (!user.recordset[0]) {
            return res.json({ message: `User with id: ${id} does not exist` })
        }
        
        // validation
        const {error} = resetPasswordSchema.validate(req.body)
        if(error){
            return res.json({error: error.details[0].message})
        }

        // hashin
        const hashedPassword = await bcyrpt.hash(password, 15)
        await pool.request()
        .input('id', mssql.VarChar, id)
        .input('password', mssql.VarChar, hashedPassword)
        .execute('resetNewPassword')
        res.status(200).json({"message": "Password reset successfully"});

    } catch (error:any){
        res.json({error: error.message})
    }
}

// delete registered user

   




export const loginUser:RequestHandler=async(req,res)=>{
    try {
        let pool= await mssql.connect(sqlConfig)
        const{email,password}= req.body as { email:string, password:string}
        const { error}= LoginSchema.validate(req.body)

        if(error){
            return res.json({error:error.details[0].message})
        }
        const user= await pool.request().query(
            ` SELECT fullname,email,password FROM Users
            WHERE email='${email}'
            `
        )
        if(!user.recordset[0]){
            return res.json({message:`Invalid Credentials`})
        }
        const validpassword= await bcyrpt.compare(password,user.recordset[0].password)
        if(!validpassword){
            return res.json({message:`Invalid Credentials`})
        }
        const data=user.recordset.map(record=>{
                const{password, ...rest} =record
                return rest
        })

        let payload= await pool.request().query(
            ` SELECT fullname,email FROM Users
            WHERE email='${email}'
            `
        )

        payload =payload.recordset[0]


        const token= jwt.sign(payload,process.env.SECRET_KEY as string, {expiresIn:'30m'})
        res.json({message:"Login Success",
            data, token })  

    } catch (error:any) {
         res.json(error.message)
    }
}
     
export const homepage:RequestHandler=(req,res)=>{
    res.json({message:'Hello! Eddy Welcome'})
}

// Update Registry
export const updateUser:RequestHandler<{id:string}>=async(req,res)=>{
    try {
     const id =req.params.id
     let pool= await mssql.connect(sqlConfig)
     const{fullname,email}= req.body as {fullname:string, email:string}
     const user= await pool.request()
     .input('id' ,mssql.VarChar , id)
     .execute('getUser')
         if(!user.recordset[0]){
             return res.json({message:`User with id : ${id} Does Not exist`})
         }
 
     await pool.request()
     .input('id' ,mssql.VarChar , id)
     .input('fullname' ,mssql.VarChar , fullname)
     .input('email' ,mssql.VarChar , email)
     .execute('updateUser')
     res.json({message:"User Successfully Updated"})
    } catch (error:any) {
        res.json({error:error.message})
    }
 }

//  deleting user

export const deleteUser = async (req:RequestExtended, res:Response) => {
    try{
        const id = req.params.id
        let pool = await mssql.connect(sqlConfig)
        const user = await pool.request()
        .input('id', mssql.VarChar, id)
        .execute('getUserById')
        if (!user.recordset[0]) { 
            return res.json({ message: `User id : ${id} is not available` })
        }
        await pool.request()
        .input('id', mssql.VarChar, id)
        .execute('deleteUsers')
        res.json({ message: "User removed ", deletedBy: req.body.users.fullname})
        
    } catch(error: any){
        res.json({ error: error.message })
    }
}