import React from 'react'
import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { useNavigate } from "react-router-dom";
import './App.css'
import Meal from './Meal'
import Stock from './Stock'
import axios from "axios";
const gRPC_URL = "http://localhost:3001";

const StockList = ({meals, setMeals, setMealId, username, setUsername, password, setPassword,location, setLocation}) => {
const navigate = useNavigate();

   const getMeals = async () => {
     try {
       const response = await axios.get(gRPC_URL + "/meals");
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

 useEffect(() => {
   getMeals();
 console.log("meals changed: ",JSON.stringify(meals))
 console.log("meals length: ",JSON.stringify(meals.length))
 }, []);

  return (
     <div className="meals-div">

   {
  meals.map((meal, index) => (      

   <Stock
    meal={meal}
    setMealId={setMealId}
    getUpdatedStock= {getMeals}
    username={username}
    password={password}
    
   ></Stock>
  ))
  }
 {/*
  <Meal
   v-for="meal in meals"
  :key="meal.id"
  :meal="meal"
    />
*/}
</div>
  )
}

export default StockList