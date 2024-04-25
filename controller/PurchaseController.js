

const CustomerPurchase = require('../modules/CustomerPurchaseModule');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');




const createOrder = catchAsync(async(req,res,next)=>{
    const order =await CustomerPurchase.create({
        customer:{
            name:req.user.userName,
            address:req.user.Address,
            email:req.user.email
        },

        ...req.body

    })

    res.status(200).json({
        status:'success',
        message:'Order created successfully'
        
    })
})

const orderPlaced = catchAsync(async(req,res,next)=>{
    const order = await CustomerPurchase.find({name:req.user.name});

    
    res.status(200).json({
        status:'success',
        data:order
    })

})

const deleteOrder = catchAsync(async(req,res,next)=>{
    const order = await CustomerPurchase.find({name:req.user.name});

    if(order[req.body.index].status === 'Đang xử lý') {
        await CustomerPurchase.findByIdAndDelete(order[req.body.index]._id);
        res.status(200).json({
            status:'success',
            message:'Order deleted successfully'
        })
    }
    return new AppError('Order cannot be deleted',400)
    
})
// const viewInvoice = catchAsync(async(req,res,next) =>{
//     const arrange = await CustomerPurchase.aggregate([
//         {
//             $match:{name:{$eq:req.user.nameUser}}
//         },
//         {
//             $group:{
//                 _id: { 
//                     year: { $year: "$createdAt" }, 
//                     month: { $month: "$createdAt" },
//                     day: { $dayOfMonth: "$createdAt" },
//                     hour: { $hour: "$createdAt" },
//                     minute: { $minute: "$createdAt" },
//                     second: { $second: "$createdAt" },
//                     user:"$nameUser"
//                      // Thêm ngày vào _id
//                 }, 

//                 Total:{$sum:"$Total"},
//                 products: { $push: "$nameProduct" } ,
//                 listIdProduct :{$push: "$idProduct"},
//                 listId:{$push:"$_id"}


                
                
//             }
//         },
        
//     ])
//     res.status(200).json({
//         status:'Order list',
//         data:arrange
//     })

// })
// const orderPlaced =catchAsync(async(req,res,next) =>{
//     console.log(req.user.userName)
//     const arrange = await CustomerPurchase.aggregate([
//         {
//             $match:{nameUser:{$eq:req.user.userName}}
//         },
//         {
//             $group:{
//                 _id: { 
//                     year: { $year: "$createdAt" }, 
//                     month: { $month: "$createdAt" },
//                     day: { $dayOfMonth: "$createdAt" },
//                     hour: { $hour: "$createdAt" },
//                     minute: { $minute: "$createdAt" },
//                     second: { $second: "$createdAt" },
//                     user:"$nameUser"

//                      // Thêm ngày vào _id
//                 }, 
//                 Total:{$sum:"$Total"},
//                 products: { $push: "$nameProduct" } ,
//                 listIdProduct :{$push: "$idProduct"},
//                 listId:{$push:"$_id"},



                
                
//             }
//         },
       
        
//     ])
   
//     res.status(200).json({
//         status:' success',
//         data:arrange
//     })

// })

// const deleteOrder = catchAsync(async(req,res,next) =>{
//     const arrange = await CustomerPurchase.aggregate([
//         {
//             $match:{name:{$eq:req.user.nameUser}}
//         },
//         {
//             $group:{
//                 _id: { 
//                     year: { $year: "$createdAt" }, 
//                     month: { $month: "$createdAt" },
//                     day: { $dayOfMonth: "$createdAt" },
//                     hour: { $hour: "$createdAt" },
//                     minute: { $minute: "$createdAt" },
//                     second: { $second: "$createdAt" },

//                      // Thêm ngày vào _id
//                 }, 
//                 Total:{$sum:"$Total"},
//                 products: { $push: "$nameProduct" } ,
//                 listIdProduct :{$push: "$idProduct"},
//                 listId:{$push:"$_id"},



                
                
//             }
//         },
       
        
//     ])
//     const listIdOr = arrange[req.body.orderCount].listId
//     console.log("list còn lại",listIdOr)
//     const deleteOr =await CustomerPurchase.deleteMany({_id:{$in:listIdOr}})
//     res.status(200).json({
//         status:'Cancellation successful',
//     })

// })


// const transferMoney = catchAsync(async(req,res,next)=>{
    
// })

// const submitOrder = catchAsync(async(req,res,next)=>{
//     console.log('Thực hiện submit')
//     console.log(req.user.userName)
//     const orderWithName = req.body.map((item)=>{
//         item.nameUser = req.user.userName
//         return item
//     })
//     console.log(orderWithName)

//     const Order = await CustomerPurchase.create(orderWithName);

//     res.status(200).json({
//         status:'Order created successfully',
//         data:Order
//     })
// })


module.exports={
    createOrder ,
    orderPlaced,
    deleteOrder




 
}