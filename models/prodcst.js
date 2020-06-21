const mongoose = require('mongoose')

const producstSchema = mongoose.Schema({

    _id:mongoose.Schema.Types.ObjectId,

    name:{type : String, required:true},
    price:{type : Number, required:true},
    producstImage:{type : String, required:true}

})
console.log('arro');

module.exports = mongoose.model('prodcst',producstSchema)

