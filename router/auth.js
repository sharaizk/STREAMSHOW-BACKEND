const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authenticate = require('../middleware/authenticate')
require('../db/conn')
const User = require('../models/userSchema')
router.get('/home',authenticate,(req,res)=>{
    // res.send("Hello  from router")
    res.status(200).send(req.rootUser)
})


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
            // TO STORE TOKEN IN COOKIE
            const token = await userFound.generateAuthToken()
            res.cookie("jwtoken", token,{
                expires: new Date(Date.now()+ 25292000000),
                secure: false,
                httpOnly: false
            })


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

// LOGOUT THE USER
router.get('/logout', (req,res)=>{
    res.clearCookie('jwtoken', {path:'/'})
    res.status(200).send('user')
})

module.exports = router