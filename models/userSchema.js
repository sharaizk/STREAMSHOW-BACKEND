const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    tokens:[
        {
            token:{
                type:String,
                required: true
            }
        }
    ]
}, {
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 1000
    }
  })


// PASSWORD HASHING
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        console.log('Hi')
        this.password = await bcrypt.hash(this.password, 12)
    }
    next()
})

// GENERATING AUTHENTICATION TOKEN
userSchema.methods.generateAuthToken = async function(){
    try{
        let generatedToken = jwt.sign({_id:this._id}, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token:generatedToken})
        await this.save()
        return generatedToken
    }catch(e){
        console.log(e)
    }
}

const User = mongoose.model('USER',userSchema)
module.exports = User