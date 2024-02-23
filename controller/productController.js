const Products = require('../modules/productModule')


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
        if(this.queryString.q) {
            queryObj ={ name: { $regex: this.queryString.q, $options: 'i' } }
        }
        this.query= this.query.find(queryObj)
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



const getController = async(req,res) =>{
    try {
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
    }catch(err) {
        res.status(404).json({
            message:err.message
        })
    }

    
}


module.exports={
    getController,
    aliasGirls,
    aliasBoys,
    aliasChildren 
}