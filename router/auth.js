const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('../db/conn')
const User = require('../models/userSchema')

// CREATING A NEW USER
router.post('/register', async(req,res)=>{
    const {name, email, username, password, gender} = req.body
    // TO VALIDATE IF A FIELD IS EMPTY OR NOT
    if(!name || !email || !username || !password || !gender){
        return res.status(400).json({error: "Please fill the field"})
        
    }
    // CHECKING IF A USER EXIST WITH ENTERED EMAIL OR USERNAME
    try{        
        const emailExist = await User.findOne({email: email})
        const usernameExist = await User.findOne({username: username})
        if(emailExist){
            return res.status(400).json({"error":'Email Already Exists'});
        }
        if(usernameExist){
            return res.status(400).json({error:'Username Already Exists'});
        }
        else{
                    // TO REGISTER USER IF IT DOESN'T exists
            const user = new User({name, email, username, password, gender})
            const userId= user._id
            const userRegister = await user.save()
    
            if(userRegister){
                return res.status(200).json({message: 'User Registered', userId: userId})
            }
        }
    }
    catch(err){
        console.log(err)
    }
})

// SIGNING IN A REGISTERED USER
router.post('/login', async(req,res)=>{
    try{
        // let token
        const {username, password} = req.body
        // IF A FIELD IS EMPTY OR NOT
        if(!username || !password){
            return res.status(400).json({error: "Please fill the data"})
        }

        const userFound = await User.findOne({username: username}) 

        if(userFound){
             // TO CHECK IF PASSWORDS MATCH
            // THE REASON WE DID IT LIKE THIS WAS BECAUSE OF ENCRYPTION

            const isMatch = await bcrypt.compare(password, userFound.password)
            
            // To process tokens
            /* token = await userFound.generateAuthToken()
            res.cookie('jwtoken',token,{
                expires: new Date(Date.now()+25892000000),
                httpOnly: true
            })
            */ 

            if(!isMatch){
                 res.status(400).json({error: 'USER Error'})
            }
            else{
                res.status(200).send(userFound)
            }
        }
        else{
            res.status(400).json({error: 'Invalid Credientials'})
        }


    }
    catch(err){
        console.log(err)
    }
})

module.exports = router