const mongoose = require('mongoose')

const streamSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    userId:{
        type: String,
        required: true
    },
},{
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 1000
    }
  })
const Stream = mongoose.model('STREAM', streamSchema)
module.exports = Stream