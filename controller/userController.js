
const User = require('../modules/userModule');
const AppError = require('../utils/appError');
const catchAsync= require('../utils/catchAsync')
const jwt = require('jsonwebtoken');
const mongoose =require('mongoose')
const bcrypt = require('bcrypt');
const crypto = require('crypto')

const signToken = (id) => jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})

const sendEmailWithGoogle= require('../utils/email');
const { findById, findByIdAndUpdate } = require('../modules/CustomerPurchaseModule');
const Products = require('../modules/productModule');

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

    })



})

const protect = catchAsync(async(req,res,next) =>{
    let token;
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token) {
        return next(new AppError('Your are not logged in! Please log in to get access'),401)
    }

    const decoded =await jwt.verify(token,process.env.JWT_SECRET);

    const user =await User.findById(decoded.id);
    
    if(!user) {
        return next(new AppError('The user belonging to this token does no longer',401))
    }
    if(user.changedPasswordAfter(decoded.iat)) {
   
        return next(new AppError('You do not have permission to perform this action',401))
    }
    
    req.user=user
    // console.log(req.user.userName)
    next()
}
)

const restrictTo = (roleAmin)=>{
        return (req,res,next) =>{
            if(req.user.role !== roleAmin) {
                return next(new AppError('You do not have permission to perform this action',403))
            }
            next()
        }
    }


const editUserPass = catchAsync(async(req,res,next)=>{
        let {oldPassWord,password}=req.body;

        // kiểm tra mật khẩu cũ 
        const user = await User.findById(req.user._id).select('+password')
        const checkPassWord = await user.correctPassword(oldPassWord,user.password)
        if(!checkPassWord) {
            return next(new AppError('Incorrect password',401))
        }
        password=await bcrypt.hash(password,12)
        const newUserPass =await User.findByIdAndUpdate(req.user.id,{
            password,
            passwordChangeAt:Date.now()
            
        },{
            new:true,
            runValidators:true // do thiết lập true nên trình xác nhận được chạy
        })
        res.status(200).json({
            status:'success',
            message:'Changed password successfully'
        })
})



const deleteUser = catchAsync(async(req,res,next)=>{
    const product =await User.findByIdAndDelete(req.user.id);
    res.status(200).json({
        status:'success',
        message:'Delete successfully',

    })
})

const sendProfile = catchAsync(async(req,res,next)=>{
    const userProfile = await User.find({"userName":req.user.userName});

    res.status(200).json({
        status:"success",
        data:userProfile
    })

})


const profileUpdate = catchAsync(async(req,res,next)=>{
    const userUpdate =await User.findByIdAndUpdate(req.user.id,req.body,{
        new:true,
        runValidators:true // do thiết lập true nên trình xác nhận được chạy
    })

    res.status(200).json({
        status:'success',
        user:req.user,
        data:userUpdate,
        
    })

})


const forgotPassword = catchAsync(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email})
    if(!user) {
        return next(new AppError('There is no user with email address',404))
    }

    const createCode = user.createPasswordResetCode();
    await user.save();

    const message =createCode;

    try {
        await sendEmailWithGoogle({
            email:user.email,
            subject:'Your password reset token(valid for 10 min)',
            message,    
        })
        res.status(200).json({
            status:'success',
            message:'TOken sent to email',
        })
    } catch (error) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires=undefined;
        await user.save();

        return next(new AppError('There was an error sending the email. Try again later'),500)
    }
   
})

const resetPassword = catchAsync(async(req,res,next)=>{
    const hashedCode = crypto.createHash('sha256').update(req.body.token).digest('hex');

    const user = await User.findOne({passwordResetCode:hashedCode,passwordResetExpires:{$gte:Date.now()}})
    if(!user) {
        return next(new AppError('Code is invalid or has expired',400))
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    const token = signToken(user._id);
    res.status(200).json({
        status:'success',
        token,
    })

})

// cart
const addCart = catchAsync(async(req,res,next)=>{
    const user = await User.findById(req.user._id);
   
    const productExists = user.cart.products.some((item)=>item.product.equals(new mongoose.Types.ObjectId(req.body.productId)))
    const sizeExists = user.cart.products.some((item)=>item.size === req.body.size)
    if(productExists && sizeExists) {
        const index = user.cart.products.findIndex(item=> item.product.equals(new mongoose.Types.ObjectId(req.body.productId)))

        user.cart.products[index].quantity= user.cart.products[index].quantity + req.body.quantity;
        await user.save()
        await user.updateCartTotal(req.user._id)
    }
    else {
        console.log('thực hiện')
        const updateCart = await User.findByIdAndUpdate(req.user._id,{
            $push:{
                'cart.products':{
                       product:req.body.productId,
                        quantity:req.body.quantity,
                        price:req.body.price,
                        size:req.body.size

                }
            },
            
        },{
            new:true,
            runValidators:true 
        })
        await user.updateCartTotal(req.user._id)
    }
    


    res.status(200).json({
        status:'success',
        message:'Added to cart successfully'
    })

})


const getUsercart = catchAsync(async(req,res,next)=>{
    const cart = await User.findOne({ userName: req.user.userName }).populate('cart.products.product').exec();;
    res.status(200).json({
        status: 'success',
        length: cart.length,
        data: cart
    });
})


const upDateQuantity = catchAsync(async(req,res,next)=>{

    const user =await User.findById(req.user._id);
    const indexQuantity = req.body.quantity
    console.log('số lượng quan',indexQuantity)

    if(indexQuantity < 1) {
        user.cart.products.splice(req.body.cartIndex,1);
        await user.save();
        await user.updateCartTotal(req.user._id);
        
    }
    else {
        console.log('thực hiện upDateCart');
        user.cart.products[req.body.cartIndex].quantity = indexQuantity  ;
        await user.save();
        await user.updateCartTotal(req.user._id);
    }

        


        

        
    


    res.status(200).json({
        status:'success',
        message:'Update cart successfully'
    })
    
})


const deleteAllCart = catchAsync(async(req,res,next)=>{
    //$unset là một trong các toán tử cập nhật được sử dụng để xóa một trường (field) hoặc nhiều trường khỏi một tài liệu (document). Khi được sử dụng trong một câu lệnh cập nhật, 
    const user = await User.updateOne({ _id: req.user._id }, { $unset: { cart: 1 } }); ;
 
    res.status(200).json({
        status: 'success',
        message:'Delete cart successfully',
    })
})


// favorites
const getFavorites = catchAsync(async(req,res,next)=>{
    const favorites = await User.findOne({ userName: req.user.userName }).populate('favorite.products');

    res.status(200).json({
        status:'success',
        length:favorites.length,
        data:favorites
        
    })
})

const addFavorites = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, {
        $push: {
            'favorite': { products: req.body.productId }
        }
    });

    res.status(200).json({
        status: 'success',
        message: 'Added to favorites successfully'
    });
});

const removeFavorite =  catchAsync(async(req,res,next)=>{
     await User.findByIdAndUpdate(req.user._id,{
        $pull:{
            'favorite':{'products':req.body.productId}
        }
    }, {
        new:true,
        runValidators:true 
    })
   
    res.status(200).json({
        status:'success',
        message:'Removed from favorites successfully'
        
    })
})

module.exports={
    signup,
    login,
    protect,
    restrictTo,
    deleteUser,
    editUserPass,
    sendProfile,
    profileUpdate,
    forgotPassword,
    resetPassword,
    addCart,
    getUsercart,
    upDateQuantity ,
    deleteAllCart,
    getFavorites,
    addFavorites,
    removeFavorite

}