const express = require('express')
const morgan = require('morgan')
const bodyparser = require('body-parser')
const mongose = require('mongoose')
const app = express()

//mongodb+srv://dbtest:dbtest1234@cluster0-wvooh.mongodb.net/test?retryWrites=true&w=majority

mongose.connect('mongodb://localhost:27017/test',{

    useNewUrlParser: true ,
    useUnifiedTopology:true


})
.then(()=>{
    console.log('connect mongo');
    
})

const produst = require('./router_test/produst')
const usersRouter = require('./router_test/user')

app.use(morgan('dev'))

app.use(express.static('uplodes'))

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())


app.use((req, res, next) => {

    res.header("Access-Control-Allow-Origin", "*")
    res.header(

        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With, Content-Type , Access , Authorization"

    )
    if (req.method === 'OPTIONS') {

        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE')
        return res.status(200).json({})
    }

    next()

})






app.use('/produst', produst)

app.use('/users',usersRouter)

app.use((req, res, next) => {

    const error = new Error('Not fined page')
    error.status(404)
    next(error)


})


app.use((error, req, res, next) => {


    res.status(error.status || 500)
    res.json({
        error: {

            message: 'is api adres flase '

        }


    })

})

// app.use((req,res,next)=>{

// res.status(200).json({
// message:'is server run'

// })

// })

app.listen(3000)