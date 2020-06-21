const express = require('express')
const mongoose = require('mongoose')
const Prodcst = require('../models/prodcst')
const multer = require('multer')
// const uploder = multer({dest:'uplodes/'})


const storage = multer.diskStorage({

  destination: (req,file,cb)=>{

    cb(null,'./uplodes/')
},

filename:(req,file,cb)=>{

cb(null,new Date().toISOString() + file.originalname)


}


})

const fileFilter = (req,file,cb)=>{

  if(file.mimetype === 'image/png' || file.mimetype === 'video/mp4'){

    cb(null,true)



  }else{
  cb(null,false)
  }
}


const uploder = multer({storage:storage,
  
  
  limits:{

fileSize:1024 * 1024 * 5

},
fileFilter:fileFilter


})

const router = express.Router()



router.get('/', (req, res, next) => {

  Prodcst.find()
    .select('name price _id producstImage')
    .exec()
    .then(docs => {

      console.log(docs);

      const response = {
        count: docs.length,

        // get url date 
        prodausts: docs.map(doc => {

          return {

            name: doc.name,
            price: doc.price,
            _id: doc._id,
            producstImage:doc.producstImage,
            requset: {

              Type: 'GET',
              url: 'http://localhost:3000/produst/find' + doc._id

            }


          }

        })

      }


      res.status(200).json(response)

    })
    .catch(err => {

      console.log(err);

      res.status(500).json({

        error: err

      })

    })

})




router.post('/', uploder.single('productImage') , (req, res, next) => {


  // const get = req.body.name;

  //   const prodaust = {


  //       name:req.body.name,
  //       price:req.body.price


  //  };
  console.log(req.file);
  
  const prodcst = new Prodcst({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    producstImage:req.file.path


  })

  prodcst
    .save()
    .then(result => {

      console.log(result);

      res.status(200).json({

        message: 'handel router post',
        createProduct: {

          name: result.name,
          price: result.price,
          requset: {
            Types: "POST",
            url: "http://localhost:3000/produst/" + result._id


          }


        }

      })
    })
    .catch(err => {

      console.log(err)

      res.status(500).json({

        error: err


      })
    })





})




router.get('/find:dataID', (req, res, next) => {

  const id = req.params.dataID

  Prodcst.findById(id)
    .exec()
    .then(doc => {
      console.log(doc);

      if (doc) {
        res.status(200).json(doc)

      } else {

        res.status(404).json({

          messageerror: 'falsee'

        })

      }



    })
    .catch(err => {

      console.log(err),
        res.status(500).json({ 
          error: err
         })


    })








})


/*
     router.get('/err:proID',(req,res,next)=>{

      const id = req.params.proID

      if (id === 'spical') {
        
        res.status(200).json({

message:'handling spical ID',
id:id

        })
console.log(id);


      }else{
res.status(200).json({
message:'ypu pass a id'

})

        
      }
        
        
        
         }) */


router.patch('/up:dataID', (req, res, next) => {


  const id = req.params.dataID

  const updateOps = {}

  for (const ops of req.body) {

    updateOps[ops.propName] = ops.value

  }

  Prodcst.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {

      console.log(result);
      res.status(200).json(result)
    })
    .catch(err => {

      console.log(err);

      res.status(404).json({

        error: err


      })


    })





  // res.status(200).json({

  // message:'you res patch'

  // })

})



router.delete('/del:dataID', (req, res, next) => {

  const id = req.params.dataID
  Prodcst.remove({ _id: id })
    .exec()
    .then(deel => {

      console.log(deel);

      res.status(200).json(deel)

    })
    .catch(err => {
      console.log(err);

      res.status(500).json({

        messageerrors: err

      })

    })



})



module.exports = router