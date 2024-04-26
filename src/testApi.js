require('dotenv').config(); // Make sure to load the environment variables
const { fetchRecipes } = require('./api/Api');

// Testing the API with sample data
fetchRecipes(['chicken', 'onion'], 'gluten-free')
    .then(data => console.log(data))
    .catch(err => console.error('Error testing API:', err));
