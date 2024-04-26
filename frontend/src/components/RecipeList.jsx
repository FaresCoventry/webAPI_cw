import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './recipelist.css'

function RecipeList() {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/recipes');
                setRecipes(data);
            } catch (error) {
                console.error('Failed to fetch recipes:', error);
            }
        };

        fetchRecipes();
    }, []);

    const calculateAverageRating = (ratings) => {
        if (ratings.length === 0) return 'No ratings yet';
        const total = ratings.reduce((acc, curr) => acc + curr.rating, 0);
        return (total / ratings.length).toFixed(1);
    };

    return (
        <div className='RecipeList'>
            <h1>Recipe List</h1>
            <ul>
                {recipes.map(recipe => (
                    <li key={recipe._id}>
                        <strong>{recipe.title}</strong> - {recipe.cuisines.join(', ')}
                        <div>Average Rating: {calculateAverageRating(recipe.ratings)}</div>
                        <ul>
                            {recipe.ratings.map((rating, index) => (
                                <li key={index}>
                                    Rating: {rating.rating}
                                    <br/>
                                    Review: {rating.review}
                                </li>
                            ))}
                        </ul>
                        <Link to={`/ratings/${recipe._id}`}>Rate this Recipe</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RecipeList;
