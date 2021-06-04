const express = require('express')
const router = express.Router()

require('../db/conn')
const Stream = require('../models/streamSchema')

router.post('/streams/new', async(req, res)=>{
    const {title, description, userId} = req.body

    if(!title || !description || !userId ){
        return res.status(422).json({error: "Invalid Data"})
    }
    try{        
         // TO SAVE STREAM
            const stream = new Stream({title, description, userId})
            const streamStore = await stream.save()
            
            if(streamStore){
                return res.status(200).send(streamStore)
             }
    }
    catch(err){
        console.log(err)
    }
})

router.get('/streams', async(req,res)=>{
    try{
        const streamData = await Stream.find()
        res.status(200).send(streamData)
    }
    catch(e){
        console.log(e)
    }
})

router.get('/streams/:_id', async(req,res)=>{
    try{
        const streamId = req.params._id
        const streamData = await Stream.find({_id:streamId})
        if(!streamData){
            return res.status(404)
        }else{
            res.status(200).send(streamData)
        }
    }
    catch(err){
        res.send(err)
    }
})

router.patch("/streams/edit/:_id", async(req,res)=>{
    try{
        const streamId = req.params._id
        const updatedStream = await Stream.findOneAndUpdate({_id:streamId}, req.body,  {new: true})
        res.status(200).send(updatedStream)
    }catch(e){
        res.status(404).send(e)
    }
})
router.delete("/streams/delete/:_id", async(req,res)=>{
    try{
        const streamId = req.params._id
        if(!streamId){
            return res.status(404).send()
        }
        const deleteStream = await Stream.findOneAndDelete({_id:streamId},req.body)
        res.status(200)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router