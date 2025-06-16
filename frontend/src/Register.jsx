import React from "react";
import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { useNavigate } from "react-router-dom";
import "./App.css";
import Meal from "./Meal";
import axios from "axios";
const API_URL = "http://localhost:3000";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

     if(username!="",password!="",location!="" ){
          try {
        const response = await axios.post(API_URL + "/users", {
          username: username,
          password: password,
          location:location
        });

       console.log("USER postRESPONSE: ",JSON.stringify(response))
       //await getUpdatedStock()
       navigate("/")
      } catch (error) {
        console.log("ERROR: ", error.message);
      }
     }
     else {
      alert("Please fill in all fields!")
    }
    // alert(`The name you entered was: ${name}`)
  };

  return (
    <>
      <div>Register</div>

      <form onSubmit={handleSubmit} className= "flex-form">
        <strong>Username:</strong>
        <input
          onChange={
            handleUsernameChange
            //handleCountChange;
          }
          className="buy-input"
        />
        <strong>Password:</strong>
        <input
          onChange={
            handlePasswordChange
            //handleCountChange;
          }
          className="buy-input"
        />
        <strong>Location:</strong>
        <input
          // onChange={(e) => setName(e.target.value)}
          onChange={
            handleLocationChange
            //handleCountChange;
          }
          className="buy-input"
        />
        <input type="submit" value="REGISTER" />
      </form>

        <button
          onClick={() => {
           navigate("/")
          }}
        >
          BACK
        </button>
     

    </>
  );
};

export default Register;
