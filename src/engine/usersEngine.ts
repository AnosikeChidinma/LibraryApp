import express, {Request, Response, NextFunction} from 'express';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';
import {v4} from 'uuid';
import jwt from 'jsonwebtoken';

//create database dynamically

let databaseFolder = path.join(__dirname,"../../src/userDatabase")
let databaseFile = path.join(databaseFolder, "userDatabase.json")

export const createUser = async(req:Request, res:Response, next:NextFunction)=>{
    try{
       if(!fs.existsSync(databaseFolder)){
        fs.mkdirSync(databaseFolder)
       }
       if(!fs.existsSync(databaseFile)){
        fs.writeFileSync(databaseFile, " ")
       }

       //read from data
       let databaseRead:any[] = [];
       try{
        const data = fs.readFileSync(databaseFile, 'utf-8')
        if(!data){
            return res.status(404).json({
                message: `Error reading from database`
            })
        }else{
            databaseRead = JSON.parse(data)
        }
       }catch(parseError){
           databaseRead = [];
       }

       //read from frontend
        const { userName, email, password } = req.body;

        //check if user's email exists
        const existingUserEmail = databaseRead.find((user:any)=> user.email === email)
        if(existingUserEmail){
            return res.status(404).json({
                message:`The email already exists`
            })
        }
        //bcrypt
        const saltLength = 9;
        const salt = await bcrypt.genSalt(saltLength);
        const hash = await bcrypt.hash(password, salt);

        //create user
         const newUser = {
            "id": v4(),
            "email": email,
            "password": hash,
            "createdAt": new Date(),
            "updatedAt": new Date(),
         }

         databaseRead.push(newUser);

         fs.writeFileSync(databaseFile, JSON.stringify(databaseRead, null, 2), 'utf-8')

          res.status(200).send({
            message: 'newUser has successfully been created',
            newUser
         })
         return
    

    }catch(err){
        console.log(err);
        
    }
}

export const login = async(req:Request, res:Response, next:NextFunction)=>{
    try{
        let databaseRead:any[] = [];
        const data = fs.readFileSync(databaseFile, 'utf-8')
        if(!data){
            return res.status(404).json({
                message: `Error reading from database`
            })
        }else{
            databaseRead  = JSON.parse(data);
        }

       const {email, password} = req.body;
       const thisUser = databaseRead.find((user:any)=> user.email === email) 
       if(!thisUser){
        return res.status(404).json({
            message: `This user does not exist`
        })
    } 
    if(thisUser){
        const validate = await bcrypt.compare(password, thisUser.password)
           if(validate){
               const generatedToken = jwt.sign(thisUser, `${process.env.APP_SECRETE}`)
               return res.status(200).json({
                message: 'successfully logged in',
                email: thisUser.email,
                generatedToken
             })
        }else{
            return res.send({
                message: "you are not a validated user"
            })
        }
    }  
    }catch(err){
        console.log(err);
        
    }
}
