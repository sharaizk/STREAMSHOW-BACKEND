const dotenv = require('dotenv')
const mongoose = require('mongoose')
const express = require('express')
const cookies = require("cookie-parser");
const cors = require("cors");
const app = express()

const PORT = process.env.PORT || 5000
// SAVING DATABASE CONNECTION STRINGS AT ONE FILE
dotenv.config({path: './config.env'})
// DATABASE CONNECTION
require('./db/conn')

app.use(express.json())
app.use(cookies());


app.use(cors());

// app.use((req,res,next)=>{
//     res.header('Access-Control-Allow-Origin','*')
//     res.header('Access-Control-Allow-Headers','*')
//     if(req.methdod ==='OPTIONS'){
//         res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET')
//         return res.status(200).json({})
//     }
//     next()
// })
// User authentincation with router
app.use(require('./router/auth'))
// Stream with router
app.use(require('./router/stream'))


app.get('/',(req,res)=>{
    res.send("Hello World")
})

app.listen(PORT,()=>{
    console.log(`${PORT}`)
})