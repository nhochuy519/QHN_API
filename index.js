const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Products = require('./modules/productModule');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errController')
const cors = require('cors')



app.use(cors())
const productRouter = require('./routes/productRoutes') ;
const userRouter = require('./routes/userRoutes')
const adminRouter = require('./routes/adminRoutes')
app.use(express.json())


require('dotenv').config()



mongoose.connect(process.env.DATABASE)
    .then(()=>{
        console.log('kết nối thành công')
    })


app.use('/product',productRouter)
app.use('/user',userRouter)
app.use('/admin',adminRouter)




app.all('*',(req,res,next)=>{
    next(new AppError(`Can't find ${req.originalUrl} on this server`,404))
})



app.use(globalErrorHandler)



app.listen(process.env.PORT,()=>{ 
    console.log('đang lắng nghe trên cổng 8000')
})

