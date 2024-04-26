const cors = require('cors');
require('dotenv').config();
console.log(process.env.MONGODB_URI);  
console.log(process.env.SPOONACULAR_API_KEY); 

const recipeRoutes = require('./routes/recipeRoutes');
const userRoutes = require('./routes/userRoutes')

const express = require('express');
const mongoose = require('mongoose');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 
};

const app = express();
const PORT = process.env.PORT || 5000;
app.options('*', cors(corsOptions)); 

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Recipe and User API',
            version: '1.0.0',
            description: 'API for managing recipes and user authentication',
        }
    },
    apis: ['C:/Users/PC/Desktop/webAPI_cw/src/routes/recipeRoutes.js', 'C:/Users/PC/Desktop/webAPI_cw/src/routes/userRoutes.js'], // files containing annotations as per Swagger
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware to parse JSON bodies
app.use(express.json());
app.use('/api/recipes', recipeRoutes); // Use the recipe routes
app.use('/api/users', userRoutes);
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    credentials: true 
}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Basic route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Listen on the configured port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
