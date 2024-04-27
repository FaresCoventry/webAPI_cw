const cors = require('cors');
const axios = require('axios');
const express = require('express');
const router = express.Router();
const { fetchRecipes } = require('C:/Users/PC/Desktop/webAPI_cw/src/api/Api');
const Recipe = require('../models/Recipe')

/**
 * @swagger
 * components:
 *   schemas:
 *     Recipe:
 *       type: object
 *       required:
 *         - title
 *         - cuisines
 *       properties:
 *         title:
 *           type: string
 *         cuisines:
 *           type: array
 *           items:
 *             type: string
 *         dietaryPreferences:
 *           type: array
 *           items:
 *             type: string
 *         ingredients:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: string
 *         cookingTime:
 *           type: integer
 *         difficulty:
 *           type: string
 *           enum: [Easy, Hard]
 *         nutritionalInfo:
 *           type: object
 *           properties:
 *             calories:
 *               type: number
 *             protein:
 *               type: number
 *             carbs:
 *               type: number
 *             fats:
 *               type: number
 *         healthBenefits:
 *           type: string
 *         shoppingList:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               item:
 *                 type: string
 *               price:
 *                 type: number
 *         ratings:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Rating'
 *     Rating:
 *       type: object
 *       properties:
 *         rating:
 *           type: number
 *         user:
 *           type: string
 *         review:
 *           type: string
 */

/**
 * @swagger
 * /api/recipes/search:
 *   get:
 *     summary: Search recipes based on a query
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: The search query for recipes
 *     responses:
 *       200:
 *         description: A list of recipes matching the query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: No recipes found
 *       500:
 *         description: Server error
 */
router.get('/search', async (req, res) => {  //Route for the search bar/home page
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    const { query } = req.query;  // This captures the natural language query from the frontend

    try {
        const recipes = await fetchRecipes({ query });  // Pass the query as part of the params
        if (!recipes || recipes.results.length === 0) {
            return res.status(404).send({ message: 'No recipes found' });
        }
        res.json(recipes.results);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).send({ message: 'Failed to fetch recipes', error: error.toString() });
    }
});

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 
};

/**
 * @swagger
 * /api/recipes:
 *   post:
 *     summary: Save multiple recipes
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Recipe'
 *     responses:
 *       201:
 *         description: Recipes saved successfully
 *       404:
 *         description: No recipes provided
 *       500:
 *         description: Server error
 */
router.post('/', cors(corsOptions), async (req, res) => {  //Route that puts recipes in the database
    const recipes = req.body;  // Expect an array of recipe objects

    if (!recipes || recipes.length === 0) {
        return res.status(404).send({ message: 'No recipes provided' });
    }

    try {
        const savedRecipes = await Promise.all(recipes.map(async (apiRecipe) => {
            const newRecipe = new Recipe({
                title: apiRecipe.title,
                cuisines: apiRecipe.cuisines,
                dietaryPreferences: apiRecipe.diets,
                ingredients: apiRecipe.extendedIngredients?.map(ing => ({
                    name: ing.name,
                    quantity: `${ing.amount} ${ing.unit}`
                })),
                cookingTime: apiRecipe.readyInMinutes,
                difficulty: apiRecipe.veryHealthy ? 'Hard' : 'Easy', 
                nutritionalInfo: {
                    calories: apiRecipe.nutrition?.nutrients.find(n => n.title === 'Calories')?.amount,
                    protein: apiRecipe.nutrition?.nutrients.find(n => n.title === 'Protein')?.amount,
                    carbs: apiRecipe.nutrition?.nutrients.find(n => n.title === 'Carbohydrates')?.amount,
                    fats: apiRecipe.nutrition?.nutrients.find(n => n.title === 'Fat')?.amount
                },
                healthBenefits: apiRecipe.healthScore,
                shoppingList: apiRecipe.extendedIngredients?.map(ing => ({
                    item: ing.name,
                    price: null  
                })),
                ratings: []
            });
            return await newRecipe.save();
        }));

        res.status(201).send(savedRecipes);
    } catch (error) {
        console.error('Error saving recipes:', error);
        res.status(500).send({ error: error.message });
    }
});


/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Get a recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the recipe to retrieve
 *     responses:
 *       200:
 *         description: Recipe retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Server error
 */
router.get('/:id', cors(corsOptions), async (req, res) => {  // Get specific recipe using ID
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).send({ message: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).send({ message: 'Error fetching recipe', error });
    }
});

router.put('/:id', (req, res) => {
    res.send(`Update a recipe with ID: ${req.params.id}`);
});

router.delete('/:id', (req, res) => {
    res.send(`Delete a recipe with ID: ${req.params.id}`);
});

/**
 * @swagger
 * /api/recipes/{id}/ratings:
 *   post:
 *     summary: Add a rating to a recipe
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the recipe to rate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rating'
 *     responses:
 *       201:
 *         description: Rating added successfully
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Server error
 */
router.post('/:id/ratings', cors(corsOptions), async (req, res) => {  //Route to post a rating for a recipe by ID
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).send({ message: 'Recipe not found' });
        }

        // Add a new rating
        const { rating, user, review } = req.body;
        recipe.ratings.push({
            rating, 
            user,   
            review 
        });

        await recipe.save();
        res.status(201).send(recipe);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


// Get recipe by ID
/**
 * @swagger
 * /api/recipes/details/{id}:
 *   get:
 *     summary: Get detailed card of a recipe
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the recipe to get details for
 *     responses:
 *       200:
 *         description: Recipe card fetched successfully
 *       500:
 *         description: Failed to fetch recipe details
 */
router.get('/details/:id', cors(corsOptions), async (req, res) => {  //Route to get details of the recipe from the API
    const { id } = req.params; // Get the recipe ID from the URL parameter
    const apiKey = process.env.SPOONACULAR_API_KEY; 

    try {
        const url = `https://api.spoonacular.com/recipes/${id}/card?apiKey=${apiKey}`;
        const response = await axios.get(url);
        res.send(response.data);
    } catch (error) {
        console.error('Failed to fetch recipe details:', error);
        res.status(500).send({ message: 'Failed to fetch recipe details', error: error.toString() });
    }
});

// Fetch detailed recipe information including nutrition

/**
 * @swagger
 * /api/recipes/information/{id}:
 *   get:
 *     summary: Get detailed information of a recipe, including nutrition
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the recipe to get information for
 *     responses:
 *       200:
 *         description: Recipe information fetched successfully
 *       500:
 *         description: Failed to fetch recipe information
 */
router.get('/information/:id', cors(corsOptions), async (req, res) => {  //Route to get information of the recipe from API
    const { id } = req.params;
    const apiKey = process.env.SPOONACULAR_API_KEY; 

    try {
        const url = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${apiKey}`;
        const response = await axios.get(url);
        res.send(response.data);
    } catch (error) {
        console.error('Failed to fetch recipe information:', error);
        res.status(500).send({ message: 'Failed to fetch recipe information', error: error.toString() });
    }
});


// Rating GET

router.get('/', cors(corsOptions), async (req, res) => {  //Route to get all the recipes in the database
    try {
        const recipes = await Recipe.find(); // Finds all recipes in the database
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Failed to fetch recipes' });
    }
});


module.exports = router;
