
const User = require('../modules/userModule');
const AppError = require('../utils/appError');
const catchAsync= require('../utils/catchAsync')
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const signToken = (id) => jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})

const signup =catchAsync(async (req,res,next)=>{
    const newUser = await User.create({
        userName:req.body.userName,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm
    })
    const token = signToken(newUser._id)
    
    res.status(200).json({
        status:'success',
        token,
        data:{
            newUser,
        }
    })

}) 

const login = catchAsync(async(req,res,next)=>{
    const {userName,password}=req.body;

    if(!userName || !password) {
        return next(new AppError('Please provide email and password!',400));
    }

    const user = await User.findOne({"userName":userName}).select('+password');
    const corrent = await  user.correctPassword(password,user.password)

    if(!user || !corrent) {
        return next(new AppError('Incorrect email or password',401))
    }

    const token = signToken(user._id);
    res.status(200).json({
        status:'success',
        token,
        user,

    })


})

const protect = catchAsync(async(req,res,next) =>{
    let token;
    
    console.log(req.headers.Authorization)
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    console.log(token)
    if(!token) {
        return next(new AppError('Your are not logged in! Please log in to get access'),401)
    }

    const decoded =await jwt.verify(token,process.env.JWT_SECRET);
    console.log(decoded)
    const user =await User.findById(decoded.id);
    
    if(!user) {
        return next(new AppError('The user belonging to this token does no longer',401))
    }
    if(user.changedPasswordAfter(decoded.iat)) {
   
        return next(new AppError('You do not have permission to perform this action',401))
    }
    
    req.user=user
    next()
}
)

const restrictTo = (role)=>{
        return (req,res,next) =>{
            if(!req.user.role === role) {
                console.log('thuc hien loi restrictTo')
                return next(new AppError('You do not have permission to perform this action',403))
            }
            next()
        }
    }


const editUser = catchAsync(async(req,res,next)=>{
        let {oldPassWord,password}=req.body;
        console.log("edit",req.user)
        // kiểm tra mật khẩu cũ 
        const user = await User.findById(req.user.id).select('+password')
        const checkPassWord = await user.correctPassword(oldPassWord,user.password)
        if(!checkPassWord) {
            return next(new AppError('Incorrect password',401))
        }
        password=await bcrypt.hash(password,12)
        const newUserPass =await User.findByIdAndUpdate(req.user.id,{
            password,
        },{
            new:true,
            runValidators:true // do thiết lập true nên trình xác nhận được chạy
        })
        res.status(200).json({
            status:'success',
            data:user
        })
})


const deleteUser = catchAsync(async(req,res,next)=>{
    const product =await User.findByIdAndDelete(req.user.id);
    res.status(200).json({
        message:'Xoá thành công',

    })
})


module.exports={
    signup,
    login,
    protect,
    restrictTo,
    deleteUser,
    editUser
}