const exprees = require('express')
const Router = exprees.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Usermodel = require('../models/user')


const jwt = require('jsonwebtoken')



Router.post('/signup',(req,res,next)=>{

//     Users.find({email:req.body.email})
//     .exec()
//     .then(userss => {

//         if(userss.length >= 1){

//             return res.status(409).json({
// message:"mail exeisn"

//             })


//         }


//     })

//   bcrypt.hash(req.body.password,10,(err,hash)=>{

//         if(err){
//         return res.status(500).json({
        
//         error:err
        
//         })
        
//         }else{
        
//             const user = new Users({

//                 _id: new mongoose.Types.ObjectId(),
//                 email:req.body.email,
//                 password:hash
//             })
//             user.save()
//             .then(result => {
// console.log(result);

//                 res.status(201).json({

//                     message:'users created'


//                 })


//             })
//             .catch(err => {



//                 console.log(err);

//                 res.status(500).json({
          
//                   error: err
          
//                 })

//             })
//         }
        
//             })



Usermodel.find({email:req.body.email})

.exec()
.then(respo => {
// verifay email name
if(respo.length >= 1){

    return res.status(422).json({

meassge:'mail exisetdnd '

    })


}else{




bcrypt.hash(req.body.password,10, (err,hash)=>{


    if(err){ 

return res.status(500).json({
error:err
})

    }else{

const user = new Usermodel({

_id:new mongoose.Types.ObjectId(),
email:req.body.email,
password:hash

})

user.save()
.then(result => {
console.log(result);

 res.status(201).json({

meassge:'user created'

 })

})
.catch(err => {

    res.status(500).json({ 
        error: err
       })

})

    }





})





}

})

})



Router.post('/login',(req,res,next)=>{

Usermodel.find({email:req.body.email})
.exec()

.then(doc => {

if(doc.length < 1){

    return res.status(404).json({

error:'error 404 not find emaill'

    })

}

bcrypt.compare(req.body.password, doc[0].password, (err,result)=>{

    if(err){

        return res.status(401).json({

            meassge:'auto failde'

        })
 }


   else if(result){

const token = jwt.sign({
    email: doc[0].email,
    // add me 
  //  password:doc[0].password,
    userId:doc[0]._id
}, 'secret',


{
expiresIn:"1h"

}




)
        return res.status(200).json({

meassge:'auto succsusful',
tokens:token
        })
    }

    res.status(401).json({

        meassge:'auto failde'

    })


})

})


.catch(err => {
console.log(err);

    res.status(500).json({ 
        error: err
       })


})


})


Router.delete('/del:id',(req,res,next)=>{


    Usermodel.remove({_id:req.params.id})

    .exec()
    .then(doc => {

        res.status(200).json({

            meassge:'users deleted'


        })

    })
    .catch(err => {

console.log(err);

        res.status(500).json({ 
            error: err
           })


    })


})

module.exports = Router