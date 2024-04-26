import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './raterecipe.css'

function RateRecipe() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [rating, setRating] = useState('');
    const [review, setReview] = useState('');

    const fetchRecipe = useCallback(async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/recipes/${id}`);
            setRecipe(data);
        } catch (error) {
            console.error('Error fetching recipe:', error);
        }
    }, [id]); 

    useEffect(() => {
        fetchRecipe();
    }, [fetchRecipe]); 

    const submitRating = async () => {
        try {
            await axios.post(`http://localhost:5000/api/recipes/${id}/ratings`, {
                rating: parseInt(rating, 10),
                user: 'newuser',
                review
            });
            alert('Rating submitted!');
            setRating('');
            setReview('');
            fetchRecipe();
        } catch (error) {
            console.error('Error submitting rating:', error);
            alert('Failed to submit rating');
        }
    };

    if (!recipe) {
        return <div>Loading...</div>;
    }

    return (
        <div className='RateRecipe'>
            <h1>Rate {recipe.title}</h1>
            <p>{recipe.description}</p>
            <div>
                <label>Rating: </label>
                <input type="number" value={rating} onChange={e => setRating(e.target.value)} min="1" max="5" />
                <label>Review: </label>
                <textarea value={review} onChange={e => setReview(e.target.value)} />
                <button onClick={submitRating}>Submit Rating</button>
            </div>
        </div>
    );
}

export default RateRecipe;
