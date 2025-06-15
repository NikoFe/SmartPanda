import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { useNavigate } from "react-router-dom";
import './App.css'
import Meal from './Meal'
import axios from "axios";
const API_URL = "http://localhost:3000";

function Home({meals, setMeals, setMealId}) {
const navigate = useNavigate();

 
  return (
  <>
  <button onClick={()=>{navigate("menu")}}  >MENU</button> 
  <button onClick={()=>{navigate("stock")}} >STOCK</button> 
  <button>ORDERS</button> 
  </>


  )
}

export default Home
