const Products = require('../modules/productModule');

const AppError = require('../utils/appError')

const mongoose = require('mongoose')

const catchAsync = require('../utils/catchAsync')


const aliasGirls = (req,res,next) =>{
    req.query.classify = "girl";
    next()
}   
const aliasBoys = (req,res,next) =>{
    req.query.classify = "men";
    next()
}
const aliasChildren = (req,res,next) =>{
    req.query.classify = "children";
    next()
}


class ApiFeatures {
    constructor(query,queryString){
        this.query = query;
        this.queryString =queryString;
    }

    filter() {
        let queryObj = { ...this.queryString };
        console.log(this.queryString)
        if(this.queryString.q) {
            queryObj ={ name: { $regex: this.queryString.q, $options: 'i' } }
        }
        this.query= this.query.find(queryObj)
        if(this.queryString.limit) {
            this.query=this.query.limit(this.queryString.limit);
        }
        return this
        
    }

    // filterPart() {
        
    //     if (this.queryString.q) {
    //         this.query = this.query.find({ name: { $regex: this.queryString.q, $options: 'i' } });
    //         // options khong phan biet hoa thuong
    //         console.log(this.query)
    //     }
    //     return this;
    // }
}



const getProduct =catchAsync( async(req,res,next) =>{

        const apiProducts = new ApiFeatures(Products.find(),req.query)
        
        apiProducts.filter()
        
        const products = await apiProducts.query
        console.log(products)
        res.status(200).json({
           status:"success",
           resultLenght:products.length,
           data:{
            products,
           }
        })
    

    
})
const postProduct = catchAsync(async(req,res,next)=>{
        const product =await Products.create(req.body);
        res.status(200).json({
            status:'success',
            data:{
                product,
            }

        })


})

const UpdateProduct =catchAsync(async(req,res,next)=>{
    const _id = req.params.id;
    // hàm kiểm tra id có hợp lệ hay không
    const isValidId = mongoose.Types.ObjectId.isValid(_id)
    
    if(!isValidId) {
        return next(new AppError('No tour found',404))
    }
    
    const product =await Products.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true // thiết lập cho trình xác thực chạy
    });
    res.status(200).json({
        status:'success',
        data:{
            product,
        }

    })


})
const DeleteProduct =catchAsync(async(req,res,next)=>{
    console.log('thực hiện delete');
    const _id = req.params.id;
    // hàm kiểm tra id có hợp lệ hay không
    const isValidId = mongoose.Types.ObjectId.isValid(_id)
    
    if(!isValidId) {
        return next(new AppError('No user found',404))
    }
    

    const product =await Products.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status:'success',
        data:{
            product,
        }

    })


})

const createComment = catchAsync(async(req,res,next)=>{
    
    const product =await Products.findById(req.params.id);
    
    product.comments.push({
        commentCreateAt:Date.now(),
        ...req.body
    }
    )
    await product.save()
    res.status(200).json({
        status:'success'
    })
})

const upDateCmt = catchAsync(async(req,res,next)=>{
    const userName = req.body.userName;
    const newCmt = req.body.comment;
    const cmtId = req.body.commentId;

    const product = await Products.findById(req.params.id);
    const comment = product.comments.id(cmtId);

    
    if(comment && req.user.userName === userName) {
        console.log('thực hiện')
        comment.comment =newCmt;
        comment.commentCreateAt=Date.now();
        await product.save()
        res.status(200).json({
            status:'success',
            message:'Comment Update successfully'
            
        })
    }
    else  {
        return next(new AppError('Not found comment',404))
    }
    
    
})

const deleteCmt = catchAsync(async(req,res,next)=>{
    
    const userName = req.body.userName;
const cmtId = req.body.commentId;



if ( req.user.userName === userName) {
    const product = await Products.findByIdAndUpdate(req.params.id,
        { $pull: { 'comments': { _id: cmtId } } });
    
    res.status(200).json({
        status: 'success',
        message: 'Comment deleted successfully',
    });
    
    
} else {
    return next(new AppError('Not found comment', 404));
}
})



module.exports={
    getProduct,
    aliasGirls,
    aliasBoys,
    aliasChildren ,
    postProduct,
    UpdateProduct,
    DeleteProduct,
    createComment,
    deleteCmt,
    upDateCmt
}