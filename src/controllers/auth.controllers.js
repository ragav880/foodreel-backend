const userModel = require('../models/user.model')
const foodPartnerModel = require('../models/foodpartner.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//user controllers
async function registerUser(req,res){
    const{fullName,email,password} = req.body

    const isuserAlreadyExists = await userModel.findOne({
        email
    })
    if(isuserAlreadyExists){
        return res.status(400).json({
            message:'user already exists'
        })
    }
    const hashedPassword = await bcrypt.hash(password,10)

    const user = await userModel.create({
        fullName,
        email,
        password:hashedPassword
    })

    const token = jwt.sign({
        _id:user._id
    },process.env.JWT_SECRET)

    res.cookie('token',token)

    res.status(201).json({
        message:'user registerd successfully',
        user:{
            id:user._id,
            fullName:user.fullName,
            email:user.email
        }
    })

    
}

async function loginUser(req,res){
    console.log('login user entered')
    const {email,password} = req.body

    const user = await userModel.findOne({
        email
    })

    if(!user){
        return res.status(400).json({
            message:'invalid password or email'
        })
    }

    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
        return res.status(400).json({
            message:'invalid password or email'
        })
    }
     const token = jwt.sign({
        _id:user._id
    },process.env.JWT_SECRET)
    console.log('login user token',token)
    console.log('setting cookie')
    await res.cookie('token',token)
    console.log('cookie set')
    res.status(200).json({
        message:'user logged in successfully',
        user:{
            id:user._id,
            fullName:user.fullName,
            email:user.email
        }
    })

}

function logoutUser(req,res){
    console.log('clearing cookie')
    res.clearCookie('token')
    res.status(200).json({
        message:'user logged out successfully'
    })
}


//food partner controllers

async function registerFoodPartner(req,res){
    const{businessName,email,password,phone,address,contactName} = req.body

    const isFoodPartnerAlreadyExists = await foodPartnerModel.findOne({
        email
    })

    if(isFoodPartnerAlreadyExists){
        return res.status(400).json({
            message:'food partner already exists'
        })
    }
    const hashedPassword = await bcrypt.hash(password,10)

    const foodPartner = await foodPartnerModel.create({
        businessName,
        email,
        phone,
        address,
        contactName,
        password:hashedPassword
    })

    const token = jwt.sign({
        id:foodPartner._id
    },process.env.JWT_SECRET)

    res.cookie('token',token)

    res.status(201).json({
        message:"food partner registered successfully",
        foodPartner:{
            _id:foodPartner._id,
            name:foodPartner.name,
            email:foodPartner.email,
            address:foodPartner.address,
            phone:foodPartner.phone,
            contactName:foodPartner.contactName
        }
    })


}

async function loginFoodPartner(req,res){
    
    const {email,password} = req.body

    const foodPartner = await foodPartnerModel.findOne({
        email
    })

    if(!foodPartner){
        return res.status(400).json({
            message:'invalid email or password'
        })
    }

    const isPasswordValid = await bcrypt.compare(password,foodPartner.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message:'invalid email or password'
        })
    }

    const token = jwt.sign({
        id:foodPartner._id
    },process.env.JWT_SECRET)

    res.cookie('token',token)
    res.status(200).json({
        message:'food partner logged in successfully',
        foodPartner:{
            _id:foodPartner._id,
            name:foodPartner.name,
            email:foodPartner.email
        }
    })
}

function logoutFoodPartner(req,res){
    res.clearCookie('token')
    res.status(200).json({
        message:'food partner logged out successfully'
    })
}





module.exports = {registerUser,loginUser,logoutUser,registerFoodPartner,loginFoodPartner,logoutFoodPartner}