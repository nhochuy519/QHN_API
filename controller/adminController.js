


const User = require('../modules/userModule');
const AppError = require('../utils/appError');
const catchAsync= require('../utils/catchAsync')
const jwt = require('jsonwebtoken');


const signToken = (id) => jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})

const signupAdmin =catchAsync(async (req,res,next)=>{
    const newUser = await User.create(req.body)
    const token = signToken(newUser._id)
    
    res.status(200).json({
        status:'Successfully registered for admin ',
        token,
        data:{
            newUser,
        }
    })

}) 

const loginAdmin =catchAsync(async (req,res,next)=>{
    const {userName,password}=req.body;

    if(!userName || !password) {
        return next(new AppError('Please provide email and password!',400));
    }

    const user = await User.findOne({"userName":userName}).select('+password');
    const corrent = await  user.correctPassword(password,user.password)

    if(user.role ==="user"){
        return next(new AppError('Cannot access',401))
    }
    
    if(!user || !corrent) {
        return next(new AppError('Incorrect email or password',401))
    }

    const token = signToken(user._id);
    res.status(200).json({
        status:'success',
        token,

    })

}) 

module.exports = {signupAdmin,loginAdmin}