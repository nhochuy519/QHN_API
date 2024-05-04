const crypto = require('crypto');

const mongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcrypt');


const cart = mongoose.Schema({
    productId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Products'
    },
    quantity:{
        type:Number,
        default:1
    },
    price:Number,
})


const userSchema = mongoose.Schema(
    {
        userName :{
            type:String,
            required:[true,'please tell us your name'],
            unique:true, 
        },
        email :{
            type:String,
            required:[true,'Please provide tour email'],
            unique:true, 
            lowercase:true,
            validate:[validator.isEmail,'Please provide a valid email']
        },
        photo :String,
        role:{
            type:String,
            enum:['user','admin'],
            default:'user'
        },
        password :{
            type:String ,
            require:[true,'Please provide a password'],
            unique:true,
            minlength:10,
            select:false // để không bao h trường dữ liệu này xuất hiện khi truy vấn
        },
        passwordConfirm :{
            type:String,
            require:[true,'Please confirm your password'],
            validate:{
                // chỉ xảy ra khi save
                validator:function(value) {
                    return  value === this.password
                },
                message:'Passwords are not duplicates'
            }
        },
        gender:{
            type:String,
            enum:['male','female']
        },
        Address:{
            type:String,
            default:''
        },
        Phone:{
            type:String,
        },
        products :[String],

        cart:[cart],
        
        passwordResetCode:String,
        passwordResetExpires:Date,// đặt lại mật khẩu hết hạn


        passwordChangeAt :Date,
        paymentMethod:{
            type:String,
            emun:['COD','Chuyển khoản'],
            default:'COD'
        },
    }
    
    
)

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) {
        return next()
    }
    this.password=await bcrypt.hash(this.password,12)
    this.passwordConfirm=undefined
    next()
})
userSchema.pre('save',async function(next){
    if(!this.isModified('password') || this.isNew) {
        return next()
    }
    this.passwordChangeAt =Date.now()
    next()
})


userSchema.methods.correctPassword = async function(candidatePassword,userPasword) {
    // candidatePassword : mật khẩu này đến từ người dùng, khi đăng nhập
    // userPasword : mật khẩu đã được giải mã
    return await bcrypt.compare(candidatePassword,userPasword)
}

userSchema.methods.changedPasswordAfter=  function(JWTtimeToken) {
   if(this.passwordChangeAt) {
        const PasswordChangeTime = +this.passwordChangeAt.getTime()/1000;
        console.log(JWTtimeToken , PasswordChangeTime)
        return JWTtimeToken < PasswordChangeTime 
   }
   return false
}

userSchema.methods.createPasswordResetCode = function() {
    const resetCode = crypto.randomBytes(5).toString('hex');

    this.passwordResetCode= crypto.createHash('sha256').update(resetCode).digest('hex');



    this.passwordResetExpires = Date.now()+10 * 60 * 1000; // hết hạn sao 10 phút

    return resetCode
}

const User = mongoose.model('User',userSchema);

module.exports=User