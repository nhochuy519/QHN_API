


const mongoose = require('mongoose');

const CustomerPurchaseSchema = mongoose.Schema({
    nameUser: {
        type:String,
        required:[true,"Must include buyer's name"],
        trim:true,
       
        
    },
    idProduct:{
        type:String,
        required:true
    },
    nameProduct:{
        type:String,
        required:[true,"Product must have a name"],
        trim:true,
    },
    RetailPrice :{
        type:Number,
    },
    Quantity:{
        type:Number,
        default:1
    },
    Total:{
        type:Number,
        
    },
    
    createdAt:{
        type:Date,
        default:Date.now(),
        
    },
})

CustomerPurchaseSchema.pre('save', function(next){
    this.Total = this.RetailPrice * this.Quantity;
    next()
})

// CustomerPurchaseSchema.pre('save', function(next) {
//     this.Total = this.RetailPrice * this.Quantity;
//     next();
// });
const CustomerPurchase = mongoose.model('CustomerPurchase',CustomerPurchaseSchema)



module.exports = CustomerPurchase