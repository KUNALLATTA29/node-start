const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()


const app = express();
const PORT = 8080;
const mongo_url = process.env.mongo_url

app.use(express.json())

mongoose.connect(mongo_url)
.then(()=>{
    console.log('connected to database')
}).catch((err)=>{
    console.log("ther is an error in database",err)
})

const salesschema = new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        required:true,
        default:Date.now
    }
},{timestamps:true})

const sales = mongoose.model('sales',salesschema)

app.get('/findall',async(req,res)=>{
    try{
        const mysalesdata = await sales.find()
        res.status(200).json(mysalesdata)
    }catch(err){
        console.log("there is error",err)
        res.status(500).send("error in fetching")
    }
    
})

app.post('/addsale',async(req,res)=>{
    try{
        const{productName,amount,quantity}=req.body;
        if(!productName || !amount){
            return res.status(400).json({message:'data is missing'})
        }
        const newsale = new sales({
            productName,
            amount,
            quantity
        })
        const savesale = await newsale.save();
        res.status(201).json(savesale);
    }catch(err){
        console.log('error adding sale',err)
        res.status(500).send('error')
    }
})



app.listen(PORT,()=>{
    console.log(`port is running on ${PORT}`)
})