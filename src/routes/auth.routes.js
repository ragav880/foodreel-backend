const express = require('express');
const authController = require('../controllers/auth.controllers');
const authMiddleware = require('../middlewares/auth.middleware')

const router = express.Router();

router.post('/user/register', authController.registerUser);
router.post('/user/login',authController.loginUser)
router.get('/user/logout',authController.logoutUser)


router.post('/foodpartner/register',authController.registerFoodPartner)
router.post('/foodpartner/login',authController.loginFoodPartner)
router.get('/foodpartner/logout',authController.logoutFoodPartner)
router.get('/foodpartner/checkin', 
    authMiddleware.authFoodPartnerMiddleware,
    (req,res)=>{
        console.log(req.foodPartner)
       res.status(200).json({message:'food partner checked in successfully',
        foodPartner:req.foodPartner
       })
    } )



module.exports = router;