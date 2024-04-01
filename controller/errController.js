const AppError = require("../utils/appError");


const handleError =(err,res) =>{
    res.status(err.statusCode).json({
        message:err.message,
        status:err.status,
        err:err
    })
}


const handleCastError =(err)=>{
    const message =`Invalid ${err.path} : ${err.value}`
    return new AppError(message,400)
}
const handleValidatorError=(err) =>{
    const errors = Object.values(err.errors).map((item)=>item.message);
    const message = `Invalid input data ${errors.join(', ')}`
    return new AppError(message,400)
}

const handleErrorDuplicate=(err) =>{;
    const errors = Object.values(err.keyValue);
    console.log(errors)
    const message = `Duplicate field value ${errors.join(', ')}`
    return new AppError(message,400)
}



const globalErrorHandler = (err,req,res,next) =>{


    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error';

    console.log("lỗi là",err.name)

    if(err.name ==='CastError') {
        err=handleCastError(err)
    }
    if(err.name ==='ValidationError') {
        err =handleValidatorError(err)
    }
    if(err.code === 11000) {
        err=handleErrorDuplicate(err)
    }
    
    handleError(err,res)
    



}


module.exports=globalErrorHandler