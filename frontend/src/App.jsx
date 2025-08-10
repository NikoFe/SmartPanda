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
import Register from "./Register"
import Login from "./Login"
import KeyHandler from './KeyHandler'
import Approval from "./Approval"
import Admin from './Admin'

const API_URL = "http://localhost:3000";

function App() {
//  const [count, setCount] = useState(0)
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [location, setLocation] = useState("");
const [stockMeals, setStockMeals] = useState([]);
const [meals, setMeals] = useState([]);
const [mealId, setMealId] = useState(0);
const [isAdmin, setIsAdmin] = useState(false);
const [usersHaveMeals, setUsersHaveMeals] = useState([]);

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
                 username={username}
                 password={password}
                 isAdmin={isAdmin}
                 setIsAdmin={setIsAdmin}
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
            path="/admin"
            element={
              <Admin
                 username={username}
                 password={password}
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
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                location={location}
                setLocation={setLocation}
              />
            }
          />
          <Route
            path="/register/"
            element={
              <Register
              />
            }
          />
          <Route
            path="/login/"
            element={
              <Login
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                setIsAdmin={setIsAdmin}
              />
            }
          />
          <Route
            path="/approval/"
            element={
              <Approval
              usersHaveMeals ={usersHaveMeals}
              setUsersHaveMeals ={setUsersHaveMeals}
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
