const foodPartnerModel = require('../models/foodpartner.model');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');


async function authFoodPartnerMiddleware(req, res, next) {
    console.log('checking authmiddleware')
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message:'please login first'

        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const foodPartner = await foodPartnerModel.findById(decoded.id);
        req.foodPartner = foodPartner;
        
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Invalid token'
        })
    }
}

async function authUserMiddleware(req, res, next) {
    
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({
            message:'please login first'
        })
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await userModel.findById(decoded._id)
    
        req.user = user
        next()
        
    } catch (error) {
        console.log(error)
        res.status(401).json({
            message:'Invalid user '
        })
        
    }



}

module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware
}