//npm install --save express
const express=require('express')
const cors=require('cors')
//npm install --save mongoose
const { mongoose }=require('./config/database')

const {contactsRouter}=require('./app/controllers/ContactsController')
const {notesRouter} = require('./app/controllers/NotesController')
const {usersRouter}=require('./app/controllers/UsersControllers')
const app=express()

const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors())

app.get('/',function(req,res){
    res.send('<h2> welcome to contact manager</h2>')
})

app.use('/contacts',contactsRouter)
app.use('/users',usersRouter)

app.use('/notes',notesRouter)

app.listen(port,function(){
    console.log('listing on port',port)
})