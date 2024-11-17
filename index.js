const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
require('dotenv').config()

const port = process.env.port || 8080
const mongo_url = process.env.mongo_url
const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(mongo_url)
.then((req,res)=>{
    console.log('database is connected')
}).catch((err)=>{
    console.log('there is an error',err)
})

const salesSchema = new mongoose.Schema({
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
        default:Date.now,
    }
})

const sales = mongoose.model('sales',salesSchema)

app.get('/findall',async(req,res)=>{
    try{
        const salesdata = await sales.find();
        res.status(200).json(salesdata)
    }catch(err){
        res.status(500).json({message:'error in fetching',err})
    }
})

app.delete('/delete/:id',async(req,res)=>{
    try{
        const deleteitem = await sales.findByIdAndDelete(req.params.id);
        if(!deleteitem){
            return res.status(404).json({message:'data not found'})
        }
        res.status(200).json({message:'done!'})
    }catch(err){
        res.status(500).json({message:'error in deleting',err})
    }
})

app.post('/add',async(req,res)=>{
    try{
        const newsale = new sales(req.body);
        const savedsale = await newsale.save()
        res.status(200).json(savedsale)
    }catch(err){
        res.status(400).json({message:'error in saving',err})
    }
})

app.put('/update/:id',async(req,res)=>{
    try{
        const updatedsale = await sales.findByIdAndUpdate(req.params.id, req.body,{
            new:true,
        })
        if(!updatedsale){
            return res.status(404).json({message:'sale not found'});
        }
        res.status(200).json(updatedsale);
    }catch(err){
        res.status(400).json({message:'error in updating', err})
    }
})

app.listen(port,()=>{
    console.log("server is running")
})