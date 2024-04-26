import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './recipedetail.css'

function RecipeDetail() {
  const { id } = useParams();
  const [recipeCard, setRecipeCard] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/recipes/details/${id}`);
        setRecipeCard(response.data);
      } catch (error) {
        console.error('Failed to fetch recipe details:', error);
      }
    };

    const fetchRecipeInformation = async () => {
      const infoResponse = await axios.get(`http://localhost:5000/api/recipes/information/${id}`);
      setRecipeDetails(infoResponse.data);
    };

    fetchRecipeDetails();
    fetchRecipeInformation();
  }, [id]);

  if (!recipeCard) {
    return <div>Loading...</div>;
  }

  return (
    <div className='RecipeDetail'>
      <h1>{recipeDetails.title}</h1>
      <h4>Recipe Card</h4>
      <img src={recipeCard.url} alt="Recipe Card" />

      <div dangerouslySetInnerHTML={{ __html: recipeDetails.summary }}></div>
      <h2>Difficulty: {recipeDetails.veryHealthy ? 'Hard' : 'Easy'}</h2>
      <h2>Nutritional Information:</h2>
      <ul>
        {recipeDetails.nutrition.nutrients.map(nutrient => (
          <li key={nutrient.name}>{nutrient.name}: {nutrient.amount} {nutrient.unit}</li>
        ))}
      </ul>
      <h2>Shopping List:</h2>
      <ul>
        {recipeDetails.extendedIngredients.map(ing => (
          <li key={ing.id}>{ing.name} (Quantity: {ing.amount} {ing.unit})</li>
        ))}
      </ul>
    </div>
  );
}

export default RecipeDetail;