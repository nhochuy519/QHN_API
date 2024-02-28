const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Products = require('./modules/productModule');



const productRouter = require('./routes/productRoute') 
app.use(express.json())


require('dotenv').config()



mongoose.connect(process.env.DATABASE)
    .then(()=>{
        console.log('kết nối thành công')
    })


app.use('/product',productRouter)




app.use((req,res,next)=>{{
    res.status(400).send('không tìm thấy')
}})


app.listen(process.env.PORT,()=>{
    console.log('đang lắng nghe trên cổng 8000')
})

