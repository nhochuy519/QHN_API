
const mongoose = require('mongoose')


const commentSchema = new mongoose.Schema({
    userName:String,
    comment:String,
    commentCreateAt:Date,
    img:String,
    star:{
        type:Number,
        default:5,
        enum:[1,2,3,4,5]
    }
})
const  productSize = new mongoose.Schema({
    nameSize:{
        type:String,
        required:[true,"Clothes must be size"]
    },
    quantitySize:{
        type:Number,
        default:0

    }

})

const productSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true,"Product must have a name"],
        trim:true,
        unique:false
        
       
    },
    classify: {
        type:String,
        required:[true,"Products must have classification"]
    },
    price: {
        type:Number,
        required:[true,"Products must have a price"],
        trim:true
    },
    ratings:{
        type:Number,
        default:4.5
    },
    description: {
        type:String,
        trim:true
    },
    size:{
        type:[productSize],
        default:2
    },
    images:[String],
    imageCover:{
        type:String,
        required:[true,'Product must have a name']
    },
    comments:[commentSchema]
    

})


const Products = mongoose.model('Products',productSchema)
productSchema.pre('save', async function(next) {
    this.comments.sort((a, b) => a.commentCreateAt - b.commentCreateAt);
    next();
});

module.exports=Products