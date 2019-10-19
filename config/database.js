const mongoose=require('mongoose')

//DB configuraton 
mongoose.Promise=global.Promise
mongoose.connect('mongodb://localhost:27017/authentication', { useNewUrlParser: true })
.then(function(){
    console.log('connected to DB')
})
.catch(function(){
    console.log('oops!!! Something went wrong in DB connection')
}) 

module.exports={
    mongoose
}