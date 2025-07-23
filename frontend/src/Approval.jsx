import React from "react";
import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { useNavigate } from "react-router-dom";
import "./App.css";
import axios from "axios";
import ApprovalEntry from "./ApprovalEntry";
const API_URL = "http://localhost:3003";


const Approval = ({
    usersHaveMeals,
    setUsersHaveMeals
}) => {



  /* useEffect(() => {
     getBetween();

   }, []);*/

  return (
   <>
   <div className="approval-list">
     {

      <div>
     </div>
     }
  </div>
     
  </>
  )
}

export default Approval