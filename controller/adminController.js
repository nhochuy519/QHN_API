


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

module.exports = signupAdmin