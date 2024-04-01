

const mongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcrypt');



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
            type:'String',
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
        products :[String],
        passwordChangeAt :Date
    }
    
    
)

userSchema.pre('save',async function(next){
    this.password=await bcrypt.hash(this.password,12)
    this.passwordConfirm=undefined
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

const User = mongoose.model('User',userSchema);

module.exports=User