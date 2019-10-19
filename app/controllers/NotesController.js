const express=require('express')
const router= express.Router()
const {Note}= require('../models/note.js')


//note taking manager//
router.get('/',function(req,res){
    Note.find()
    .then(function(notes){
        res.send(notes)
    })
    .catch(function(err){
        res.send(err)
    })
})

router.post('/',function(req,res){
    const body=req.body
    const note=new Note(body)
    note.save()
    .then(function(note){
        res.send(note)
    })
    .catch(function(err){
        res.send(err)
    })
})

router.get('/:id',function(req,res){
    const id=req.params.id
    Note.findById(id)
    .then(function(note){
        if(note){
            res.send(note)
        }
        else{
            res.send({})
        } 
    })
    .catch(function(err){
        res.send(err)
    })
})

router.delete('/:id',function(req,res){
    const id=req.params.id
    Note.findByIdAndDelete(id)
    .then(function(note){
        res.send(note)
    })
    .catch(function(err){
        res.send(err)
    })
})


router.put('/:id',function(req,res){
    const id=req.params.id
    const body=req.body
    Note.findByIdAndUpdate(id,{$set:body},{new:true,runValidators:true})
    .then(function(note){
        res.send(note)
    })
    .catch(function(err){
        res.send(err)
    })
})

module.exports={
    notesRouter: router
}