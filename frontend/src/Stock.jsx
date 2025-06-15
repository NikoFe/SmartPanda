import React from "react";
import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { useNavigate } from "react-router-dom";
import "./App.css";
import Meal from "./Meal";
import axios from "axios";
const API_URL = "http://localhost:3001";

const Stock = ({ meal, setMealId, imagepath, getUpdatedStock }) => {
  const navigate = useNavigate();
  const [boughtCount, setBoughtCount] = useState(0);

  const Buy = async (name) => {
    console.log(parseInt(boughtCount));
    if (
      meal.zaloga > parseInt(boughtCount) &&
      parseInt(boughtCount) < 6 && parseInt(boughtCount) > 0
    ) {
      console.log("OK");
      const amount = meal.zaloga - boughtCount;
      console.log("meal.zaloga: " + meal.zaloga);
      console.log("boughtCount: " + boughtCount);
      console.log("meal.id: " + meal.id);
      console.log("update.amount: " + amount);
      try {
        const response = await axios.put(API_URL + "/meals", {
          id: meal.id,
          amount: amount,
        });

      await getUpdatedStock()

      } catch (error) {
        console.log("ERROR: ", error.message);
      }
    } else {
      alert("value too high or too low!");
    }
  };

  const handleCountChange = (event) => {
    setBoughtCount(event.target.value);
  };

  return (
    <>
      <div className="meal-div">
        <img
          src={`/src/images/${meal.ime}.png`}
          alt={`Meal image`}
          className="icon"
        />
        <strong> {meal.ime} </strong>

        <strong>MEAL ID: {meal.id} </strong>

        <p>Price: {meal.cena}</p>
        <p>Description: {meal.opis}</p>
        <p>Type: {meal.tip}</p>
        <p>Zaloga: {meal.zaloga}</p>

        <strong>Input buy amount</strong>
        <input
          onChange={ 
            handleCountChange
            //handleCountChange;
          }
          className="buy-input"
          min="0"
        />

        <button
          onClick={() => {
            Buy(meal.ime);
          }}
        >
          BUY
        </button>

        <button
          onClick={() => {
            navigate(`/details/${meal.id}`);
          }}
        >
          DETAILS
        </button>
      </div>
    </>
  );
};

export default Stock;
