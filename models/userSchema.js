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
    }
}, {
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 1000
    }
  })

//   To use jwt put this in the schema
// tokens:[
//     {
//         token:{
//             type: String,
//             required: true
//         }
//     }
// ]

// PASSWORD HASHING
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12)
    }
    next()
})


// Generating Tokens
// userSchema.methods.generateAuthToken = async function(){
//     try{
//         let genToken = jwt.sign({_id:this._id}, process.env.SECRET_KEY)
//         this.tokens = this.tokens.concat({token: genToken})
//         await this.save()
//         return token
//     }
//     catch(e){
//         console.log(err)
//     }
// }

const User = mongoose.model('USER',userSchema)
module.exports = User