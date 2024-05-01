


const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' }, // Tham chiếu đến schema sản phẩm
    name: String,
    quantity: Number,
    price: Number,
    size:String
  });



const CustomerPurchaseSchema = new mongoose.Schema({
    orderDate:Date,
    status:{
        type:String,
        emun:['Đang xử lý','Xác nhận thành công','Đang giao hàng'],
        default:'Đang xử lý'
    },
    customer:{
        name:String,
        address:String,
        email:String,
    },
    products:[productSchema],
    paymentMethod:{
        type:String,
        emun:['COD','Chuyển khoản'],
        default:'COD'
    },
    Total:Number,
    
   
    shippingAddress:String
})

CustomerPurchaseSchema.pre('save', function(next){
    this.Total = this.products.reduce((prev,next)=>{
        return prev + (next.quantity * next.price)
    },0)
    this.orderDate=Date.now()
    next()
})

// CustomerPurchaseSchema.pre('save', function(next) {
//     this.Total = this.RetailPrice * this.Quantity;
//     next();
// });
const CustomerPurchase = mongoose.model('CustomerPurchase',CustomerPurchaseSchema)



module.exports = CustomerPurchase