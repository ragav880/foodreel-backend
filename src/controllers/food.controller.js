const foodModel = require('../models/food.model')
const storageService = require('../services/storage.service')
const { v4: uuidv4 } = require('uuid');
const likeModel = require('../models/likes.model')
const saveModel = require('../models/save.model')

async function createFood(req,res){
   try {
    
       const fileUpload = await storageService.uploadFile(req.file.buffer,uuidv4())

       const foodItem = await foodModel.create({
        name:req.body.name,
        description:req.body.description,
        video:fileUpload.url,
        foodPartner:req.foodPartner._id
       })

       res.status(201).json({
        message:'food created successfully',
        food:foodItem
       })
   
   } catch (error) {
    console.log(error)
    res.status(500).json({
        message:'internal server error'
    })
   }

}

async function getFoodItems(req, res) {
  try {
    const userId = req.user?._id;
    const foodItems = await foodModel.find({}).sort({ createdAt: -1 });

    let likedFoodIds = [];
    let savedFoodIds = [];

    if (userId) {
      const likedFoods = await likeModel.find({ user: userId }).select('food');
      likedFoodIds = likedFoods.map(like => like.food.toString());

      const savedFoods = await saveModel.find({ user: userId }).select('food');
      savedFoodIds = savedFoods.map(save => save.food.toString());
    }

    const enrichedFoods = foodItems.map(food => ({
      ...food._doc,
      likedByUser: likedFoodIds.includes(food._id.toString()),
      savedByUser: savedFoodIds.includes(food._id.toString())
    }));

    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    return res.status(200).json({
      message: 'Food items fetched successfully',
      foodItems: enrichedFoods
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch food items' });
  }
}

async function likeFood(req,res){
    const { foodId } = req.body
    const user = req.user
    console.log(foodId)
    console.log(user)
    const isAlreadyLiked = await likeModel.findOne({
        food: foodId,
        user: user._id
    })
    
    console.log(isAlreadyLiked)
    if(isAlreadyLiked){
        console.log('already liked')
        await likeModel.deleteOne({
            food: foodId,
            user: user._id
        })
        console.log('deleted')
        await foodModel.findByIdAndUpdate(foodId,{
            $inc: {likeCount: -1}
        })
        console.log('found food and decreased like count')

        return res.status(200).json({
            message:'food unliked successfully',
            
            
        })
    }

    const like = await likeModel.create({
        food: foodId,
        user: user._id
    })
    await foodModel.findByIdAndUpdate(foodId,{
        $inc: {likeCount: 1}
    })
    res.status(201).json({
        message:'food liked successfully',
        like,
        
    })
}

async function saveFood(req,res){
    const { foodId } = req.body
    const user = req.user
    
    const isSaved = await saveModel.findOne({
        food: foodId,
        user: user._id
    })
    if(isSaved){
        await saveModel.deleteOne({
            food: foodId,
            user: user._id
        })
        await foodModel.findByIdAndUpdate(foodId,{
            $inc: {saveCount: -1}
        })
        return res.status(200).json({
            message:'food unsaved successfully'
        })
    }

    const save = await saveModel.create({
        food: foodId,
        user: user._id
    })
    await foodModel.findByIdAndUpdate(foodId,{
        $inc: {saveCount: 1}
    })
    res.status(201).json({
        message:'food saved successfully',
        save
    })
}

async function getSavedFoods(req,res){
    const user = req.user
    const savedFoods = await saveModel.find({user:user._id}).populate('food')
    return res.status(200).json({
        message:'saved foods fetched successfully',
        savedFoods
    })

}


module.exports = {createFood,getFoodItems,likeFood,saveFood,getSavedFoods}

