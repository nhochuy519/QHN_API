
const catchAsync = (callback) => (req,res,next) =>{

    callback(req,res,next)
        .catch((err)=>{
            console.log('thực hiện bắt  lõi')
            console.log(err.name)
            next(err)
    })
}

module.exports = catchAsync