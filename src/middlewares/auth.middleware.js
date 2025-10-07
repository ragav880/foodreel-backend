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
    console.log('checking auth user middleware')
    const token = req.cookies.token
    if(!token){
        console.log('no token')
        return res.status(401).json({
            message:'please login first'
        })
    }

    try {
        console.log('token verification started')
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        console.log('finding user in db')
        const user = await userModel.findById(decoded._id)
        console.log('found user in db')
    
        req.user = user
        console.log('token verification done')
        next()
        
    } catch (error) {
        console.log('token verification failed')
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