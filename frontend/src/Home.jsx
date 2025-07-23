import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { useNavigate } from "react-router-dom";
import './App.css'
import Meal from './Meal'
import axios from "axios";
const API_URL = "http://localhost:3000";

function Home({meals, setMeals, setMealId, username, password, isAdmin, setIsAdmin}) {
const navigate = useNavigate();



const checkLogin = (navigationString) => {
  if (username !== "" && password !== "") {
    navigate(navigationString);
  } else {
    alert("Please login first!");
  }
};

  return (
  <>
  <button onClick={()=>{navigate("register")}} >REGISTER</button> 
  <button onClick={()=>{navigate("login")}} >LOGIN</button> 
  <button onClick={()=>{navigate("menu")}}  >MENU</button> 
  <button onClick={/*checkLogin("stock") */ ()=>{navigate("stock")}} >ORDER</button> 
  <button onClick={()=>{navigate("approval")}}  >APPROVAL</button> 
  
  {/*isAdmin?  <button onClick={()=>{navigate("approval")}}  >APPROVAL</button> : ""   */}
  </>

  )
}

export default Home
