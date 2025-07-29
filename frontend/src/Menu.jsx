import React from 'react'
import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { useNavigate } from "react-router-dom";
import './App.css'
import Meal from './Meal'
import axios from "axios";
const API_URL = "http://localhost:3000";

const Menu = ({meals, setMeals, setMealId}) => {

 useEffect(() => {
   const getEntry = async () => {
     try {
       const response = await axios.get(API_URL + "/meals");
       const mealsFromDB = response.data.map((meal) => ({
         id: meal.id,
         ime: meal.ime,
         cena: meal.cena,
         opis: meal.opis,
         tip: meal.tip,
         zaloga: meal.zaloga
       }));
 
       setMeals(mealsFromDB); // <- replaces instead of adding
     } catch (error) {
       console.log("ERROR: ", error.message);
     }
   };
   getEntry();
 }, []);
 
 useEffect(() => {
 //console.log("meals changed: ",JSON.stringify(meals))
 //console.log("meals length: ",JSON.stringify(meals.length))
 }, [meals]);

  return (
    <div className="main-div">
    <h1>Menu:</h1>

   {
  meals.map((meal, index) => (      
   <Meal
    meal={meal}
    setMealId={setMealId}
   ></Meal>
  ))
  }
    </div>
  )
}

export default Menu