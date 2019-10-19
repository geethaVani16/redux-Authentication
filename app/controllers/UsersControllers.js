const express=require('express')
const _ =require('lodash')
const router=express.Router()
const { User }=require('../models/User')
const { authenticateUser } = require('../middlewares/authentication.js')

//localhost:3000/users/register
router.post("/register", function(req,res){
    const body=req.body
    const user = new User(body)
    //console.log(user.isNew)//true 
    //before saving the record user is new so it returns true
    user.save()
    .then(function(user){
        //console.log(user.isNew) //false
        //after saving the record is old so it returns false
        res.send(user)
    })
    .catch(function(err){
        res.send(err)
    })
    
})


//localhost:3000/users/login
router.post('/login',function(req,res){
    console.log("hii")
     const body=req.body
     let user
     User.findByCredentials(body.email,body.password)
     .then(function(userFound){
         user = userFound
         return user.generateToken() //it will instance method 
     })
     .then(function(token){
        user =_.pick (user,["_id","username","email"])
         console.log(token,"token")
         res.json({token,user})
     })
     .catch(function(err){
         res.send(err)
     })
})

//localhost:3000/users/account
router.get('/account',authenticateUser, function(req,res){
    const { user }= req
    res.send(_.pick (user,["_id","username","email"]))
})


//localhost:3000/users/logout
router.delete('/logout',authenticateUser,function(req,res){
    const { user, token } = req
    User.findByIdAndUpdate(user._id, { $pull: { tokens: {token: token }}})
    .then(function(){
        res.send({notice:"successfully logged out"})
    })
    .catch(function(err){
        res.send(err)
    })
})



module.exports={
    usersRouter:router
} 