const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    rating: Number,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    review: String
}, { timestamps: true });

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    cuisines: {
        type: Array,
        required: true,
        trim: true
    },
    ingredients: [{
        name: String,
        quantity: String
    }],
    dietaryPreferences: [{
        type: String
    }],
    cookingTime: {
        type: Number, // minutes
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard']
    },
    nutritionalInfo: {
        calories: Number,
        protein: Number,
        carbs: Number,
        fats: Number
    },
    healthBenefits: String,
    ratings: [ratingSchema], // Use the defined ratingSchema
    shoppingList: [{
        item: String,
        price: Number
    }]
});


const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
