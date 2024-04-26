import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RecipeSearch from './components/Search';
import RecipeDetail from './components/RecipeDetail';
import RecipeList from './components/RecipeList';
import RateRecipe from './components/RateRecipe';
import AuthForm from './components/AuthForm';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RecipeSearch />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/ratings" element={<RecipeList />} />
        <Route path="/ratings/:id" element={<RateRecipe />} />
        <Route path="/auth" element={<AuthForm />} />
      </Routes>
    </Router>
  );
}

export default App;
