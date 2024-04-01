

const CustomerPurchase = require('../modules/CustomerPurchaseModule')
const catchAsync = require('../utils/catchAsync');





const viewInvoice = catchAsync(async(req,res,next) =>{
    const arrange = await CustomerPurchase.aggregate([
        {
            $match:{name:{$eq:req.user.nameUser}}
        },
        {
            $group:{
                _id: { 
                    year: { $year: "$createdAt" }, 
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" },
                    hour: { $hour: "$createdAt" },
                    minute: { $minute: "$createdAt" },
                    second: { $second: "$createdAt" },

                     // Thêm ngày vào _id
                }, 
                Total:{$sum:"$Total"},
                products: { $push: "$nameProduct" } ,
                listIdProduct :{$push: "$idProduct"},
                listId:{$push:"$_id"}


                
                
            }
        },
        
    ])
    res.status(200).json({
        status:'Order list',
        data:arrange
    })

})

const deleteOrder = catchAsync(async(req,res,next) =>{
    const arrange = await CustomerPurchase.aggregate([
        {
            $match:{name:{$eq:req.user.nameUser}}
        },
        {
            $group:{
                _id: { 
                    year: { $year: "$createdAt" }, 
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" },
                    hour: { $hour: "$createdAt" },
                    minute: { $minute: "$createdAt" },
                    second: { $second: "$createdAt" },

                     // Thêm ngày vào _id
                }, 
                Total:{$sum:"$Total"},
                products: { $push: "$nameProduct" } ,
                listIdProduct :{$push: "$idProduct"},
                listId:{$push:"$_id"},



                
                
            }
        },
       
        
    ])
    const listIdOr = arrange[req.body.orderCount].listId
    console.log("list còn lại",listIdOr)
    const deleteOr =await CustomerPurchase.deleteMany({_id:{$in:listIdOr}})
    res.status(200).json({
        status:'Cancellation successful',
    })

})




const submitOrder = catchAsync(async(req,res,next)=>{
    console.log('Thực hiện submit')
    console.log(req.user.userName)
    const orderWithName = req.body.map((item)=>{
        item.nameUser = req.user.userName
        return item
    })
    console.log(orderWithName)

    const Order = await CustomerPurchase.create(orderWithName);

    res.status(200).json({
        status:'Order created successfully',
        data:Order
    })
})


module.exports={
    submitOrder,
    viewInvoice,
    deleteOrder
}