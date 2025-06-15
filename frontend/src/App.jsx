import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './Home'
import Details from './Details'
import Menu from './Menu'
import StockList from './StockList'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import KeyHandler from './KeyHandler'

const API_URL = "http://localhost:3000";

function App() {
//  const [count, setCount] = useState(0)
const [stockMeals, setStockMeals] = useState([]);
const [meals, setMeals] = useState([]);
const [mealId, setMealId] = useState(0);

  return (
    <>
      <BrowserRouter>
       <KeyHandler />
        <Routes> 
          <Route
            path="/"
            element={
              <Home
                 meals={meals}
                 setMeals={setMeals}
                 setMealId={setMealId}
              />
            }
          />
          <Route
            path="/menu"
            element={
              <Menu
                meals={meals}
                setMeals={setMeals}
                setMealId={setMealId}
              />
            }
          />


          <Route
            path="/details/:id"
            element={
              <Details
                 id={mealId}
           
              />
            }
          />
          <Route
            path="/stock/"
            element={
              <StockList
                meals={stockMeals}
                setMeals={setStockMeals}
                setMealId={setMealId}
           
              />
            }
          />
        </Routes>
        <></>
      </BrowserRouter>
    </>

  )
}
export default App
