const express=require('express')
const router=express.Router()
const { User }=require('../models/User')
const { authenticateUser } = require('../middlewares/authentication.js')

//localhost:3000/users/register
const userExistsInDB = async (body) => {
    return new Promise((resolve, reject) => {
        User.findOne({email: body.email})
        .then((user) => {
          if (user) {
              reject((409,"user already exists"))
          }
          else {
              resolve(false)
          }
           
        })
        .catch((err) => {
          reject((422, err.message))
        });
    })
  }


  const createUserInDB = async (body) => {
    return new Promise((resolve, reject) => {
        const user = new User(body)
        user.save()
        .then((user) => {
            resolve(user)
            //   console.log(user,"llllllllllll")
        })
        .catch((err) => {
            console.log(err)
          reject((422, err))
        });
    })
  }



router.post("/register", async function(req,res){
    try{
        const body=req.body
        const userExists= await userExistsInDB(body)
        if(!userExists) {
            const createUser =createUserInDB(body)
            console.log('liii')
            res.status("200").json(createUser)
        }
    }
    catch (error) {
        console.log(res, error)
      }
   
})


//localhost:3000/users/login
router.post('/login',function(req,res){
     const body=req.body
     User.findByCredentials(body.email,body.password)
     .then(function(user){
         return user.generateToken() //it will instance method 
     })
     .then(function(token){
         res.send({token})
     })
     .catch(function(err){
         res.status(404).send(err)
     })

//     User.findOne({ email: body.email })
//     .then(function(user){
//         //console.log(user)
//         if(!user){
//             res.status("404").send('invalid email/invalid password')
//         }
//         bcryptjs.compare(body.password,user.password)
//         .then(function(result){
//             if(result){ //return boolen value
//                 res.send(user)//return user data when match with password and username
//             } else{
//                 res.status('404').send('invalid password/invalid password')
//             }
//         })
//     })
//     .catch(function(err){
//         res.send(err)
//     })
})

//localhost:3000/users/account
router.get('/account',authenticateUser, function(req,res){
    const { user }= req
    res.send(user)
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