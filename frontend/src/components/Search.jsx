import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './search.css'
import img from './pexels-roman-odintsov-4551832.jpg'

function RecipeSearch() {
    const [query, setQuery] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipes, setSelectedRecipes] = useState([]);

    const fetchRecipes = async () => {
        const response = await axios.get(`http://localhost:5000/api/recipes/search?query=${query}`);
        setRecipes(response.data || []);
    };

    const saveRecipes = async () => {
        await axios.post('http://localhost:5000/api/recipes', selectedRecipes);
        alert('Recipes saved!');
    };

    const handleSelectRecipe = (recipe) => {
        setSelectedRecipes(prev => [...prev, recipe]);
    };

    return (
        <div className='RecipeSearch'>
            <div><Link to="/auth">Log in or Register here!</Link></div>

            <br/>
            <br/>

            <img src={img} alt='Recipe'/>
            <h1>Use the search bar to search for any Recipe in the World!</h1>
            <h4>You can search by Ingredients, Diet, Cuisine, or anything you can think of!</h4>
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
            <button onClick={fetchRecipes}>Search</button>
            <ul>
                {recipes.map(recipe => (
                    <li key={recipe.id}>
                        {recipe.title}
                        <br />
                        <button onClick={() => handleSelectRecipe(recipe)}>Save</button>
                        <a href={`/recipe/${recipe.id}`}>See all Details</a>
                    </li>
                ))}
            </ul>
            <button onClick={saveRecipes}>Save Selected Recipes</button>

            <br/>
            <br/>

            <div><Link to="/ratings">View All Ratings</Link></div>
        </div>
    );
}

export default RecipeSearch;
