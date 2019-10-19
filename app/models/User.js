const mongoose=require('mongoose')
const validator=require('validator')
const jwt=require('jsonwebtoken')
const bcryptjs=require('bcryptjs')


const Schema=mongoose.Schema


const userSchema =new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        minlength:5
    },
    email:{
        type:String,
        required:true,
        unique:true,
        //how to check the format of email
        validate:{
            validator:function(value){
                return validator.isEmail(value)
            },
            message:function(){
                return "invalid email format "
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        maxlength:128
    },
    tokens:[
        {
            token:{
                type:String
            },
            createdAt:{
                type:Date,
                default:Date.now
            }
        }
    ]
})

//own static method
userSchema.statics.findByCredentials = function(email,password){
    const User=this
    //console.log(User,'User')
    return User.findOne({email}) 
                .then(function(user){
                    if(!user){//i.e user is null or doesnt exit
                        return Promise.reject({
                            errors:'invalid email / password'
                        }) //when email itself doent found
                    }

                    return bcryptjs.compare(password,user.password)
                            .then(function(result){
                                if(result){ //return boolean
                                    return Promise.resolve(user) //when email and password found
                                } else {
                                    return Promise.reject({
                                        errors:'invalid password / email'
                                    }) //when password not found 
                                }
                            })
                })
                .catch(function(err){
                    return Promise.reject(err)
                        //return new Promise(function (resolve,reject){
                        //reject(err)
                        //})
                }) 
}

userSchema.statics.findByToken=function(token){
    const User=this
    let tokenData
    try {
        tokenData=jwt.verify(token,"jwt@123")
    } 
    catch(err){
        return Promise.reject(err)
    }

    return User.findOne({
        _id:tokenData._id,
        "tokens.token":token
    })
}


//own instance methods
userSchema.methods.generateToken=function(){
    const user=this
    const tokenData={
        _id:user._id,
        username:user.username,
        createdAt:Number(new Date())//it will return milliseconds
    }
    const token=jwt.sign(tokenData,"jwt@123")
    user.tokens.push({
        token
    })

    return user.save()
        .then(function(user){
            return Promise.resolve(token)
        })
        .catch(function(err){
            return Promise.reject(err)
        })
}


//pre hooks-Model middlewares
userSchema.pre('save',function(next){
    const user=this
    if(user.isNew){
        bcryptjs.genSalt(10) //it will generate salt value with length 10
        .then(function(salt){
            bcryptjs.hash(user.password,salt) //it will take user password and combine with the salt value
                .then(function(encryptedPassword){
                    user.password=encryptedPassword //we seting encrypted password to user.password in order to save in database
                    next()//it will  continue next procedure
                })
        })
    } else{
        next()//it will continue next procedure
    }
})






const User=mongoose.model('User',userSchema)

module.exports={
    User
}