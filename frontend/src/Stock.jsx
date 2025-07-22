import React from "react";
import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { useNavigate } from "react-router-dom";
import "./App.css";
import Meal from "./Meal";
import axios from "axios";
const API_URL = "http://localhost:3001";

const Stock = ({ meal, setMealId, getUpdatedStock ,username, password}) => {
  const navigate = useNavigate();
  const [boughtCount, setBoughtCount] = useState(0);


  const createInBetween = async (userId) => {
   const id=Math.floor(Math.random()*10000)
   const meal_id = meal.id

      try {
        const response1 = await axios.post(API_URL + "/user_has_meal/",{
      //  id:id,
        user_id:userId,
        meal_id:meal_id,
        amount:parseInt(boughtCount)

        });

       //const currentUserId=response1.data[0].id
      } catch (error) {
        console.log("ERROR: ", error.message);
      }
  }


  const Buy = async (name) => {
    console.log("BUY COUNT: "+parseInt(boughtCount));
    console.log("meal zaloga: "+parseInt( meal.zaloga));
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
      
     // alert("password: "+password)
      try {
        const response1 = await axios.get(API_URL + "/users/"+username+"/"+password);
        //alert("STOCKLIST: "+JSON.stringify(response1.data[0].id))
        const currentUserId=response1.data[0].id
        /* Should be done in Odobrenje
        try {
          const response2 = await axios.put(API_URL + "/meals", {
            id: meal.id,
            amount: amount,
          });
          console.log("UPDATE ZALOGA RESPONSE: ",JSON.stringify(response2.data))
        } catch (error) {
          console.log("UPDATE ZALOGA ERROR: ", error.message);
        }*/
        await createInBetween(currentUserId);
        //await getUpdatedStock();


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
