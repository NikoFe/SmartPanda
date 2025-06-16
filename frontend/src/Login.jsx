import React from "react";
import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { useNavigate } from "react-router-dom";
import "./App.css";
import Meal from "./Meal";
import axios from "axios";
//import { set } from "../Meni/server";
const API_URL = "http://localhost:3000";

const Login = ({username, setUsername, password, setPassword, setIsAdmin}) => {
  const navigate = useNavigate();

  const toggleAdmin =async (state)=>{
    alert("STATE: "+state)
    setIsAdmin(state)
  }

  const handleSubmit = async (event) => {

    event.preventDefault();
     console.log("||||||: username: ",username +" password: "+password )
     console.log("URL: ", "/validateUser/"+username+"/"+password )


     if(username!="",password!="",location!="" ){
          try {
        const response = await axios.get(API_URL + "/validateUser/"+username+"/"+password 
      );

       console.log("USER postRESPONSE: ",JSON.stringify(response.data))
       
       if(response.data.length==0){
        console.log("FAIL")
        alert("Invalid username or password")
       }
       else {
      console.log(".............. ", response.data[0].admin)
      if(response.data[0].admin=="1" || response.data[0].admin==1)
      {
        await toggleAdmin(true) 
       }
       else {
        await toggleAdmin(false) 
       }

        navigate("/")
      }

      } catch (error) {
        console.log("ERROR: ", error.message);
      }
     }
     else {
      alert("Please fill in all fields!")
    }
  };

  return (
        <>
      <div>Login</div>

      <form onSubmit={handleSubmit} className= "flex-form">
        <strong>Username:</strong>
        <input
          onChange={
          (e) => setUsername(e.target.value)
          }
          className="buy-input"
        />
        <strong>Password:</strong>
        <input
          onChange={
            (e) => setPassword(e.target.value)
          }
          className="buy-input"
        />

       <input type="submit"  value="LOGIN"/>
      </form>

        <button
          onClick={() => {
           navigate("/")
          }}
        >
          BACK
        </button>
    </>
  )
}

export default Login