const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Products = require('./modules/productModule');
const fs = require('fs')


const productRouter = require('./routes/productRoute') 

require('dotenv').config()

const data = JSON.parse(fs.readFileSync('./product.json','utf-8'))

mongoose.connect(process.env.DATABASE)
    .then(()=>{
        console.log('kết nối thành công')
    })


app.use('/product',productRouter)



const run = async()=>{
    const products = await Products.create(data);

}

const deletePd = async()=>{
    const products = await Products.deleteMany();
    
}

app.use((req,res,next)=>{{
    res.status(400).send('không tìm thấy')
}})


app.listen(process.env.PORT,()=>{
    
})

