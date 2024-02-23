const express = require('express');


const {getController,aliasGirls,aliasBoys, aliasChildren } = require('../controller/productController')

const router = express.Router();


router.route('/girl')
        .get(aliasGirls,getController)
router.route('/men')
        .get(aliasBoys,getController)
router.route('/children')
        .get( aliasChildren ,getController )

router.route('/')
        .get(getController)



module.exports=router
