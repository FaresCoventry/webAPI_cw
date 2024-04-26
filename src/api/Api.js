const axios = require('axios');

const fetchRecipes = async (params) => {
    try {
        const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
            params: {
                ...params,
                apiKey: process.env.SPOONACULAR_API_KEY,
                number: 10,
                addRecipeInformation: true,  // fetch detailed information
                fillIngredients: true,       // detailed ingredient list
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return null;
    }
};



module.exports = { fetchRecipes };
