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

   const getBetween = async () => {
     try {
       const response = await axios.get(API_URL + "/user_has_meal");
       const usersHaveMealFromDB = response.data.map((uhm) => ({
         id: uhm.id,
         uporabnik_id:uhm.uporabnik_id,
         jed_id: uhm.jed_id,
         kolicina: uhm.kolicina

       }));
 
       setUsersHaveMeals(usersHaveMealFromDB); // <- replaces instead of adding
     } catch (error) {
       console.log("ERROR: ", error.message);
     }
   };

   useEffect(() => {
     getBetween();

   }, []);

  return (
   <>
   <div className="approval-list">
     {
    usersHaveMeals.map((uhm, index) => (      
      <div>
     <ApprovalEntry
      id= {uhm.id}
      uporabnik_id= {uhm.uporabnik_id}
      jed_id= {uhm.jed_id}
      kolicina={uhm.kolicina}
      getBetween={getBetween}
    //  user={uhm}
     ></ApprovalEntry>
     </div>
    ))
     }
  </div>
     
  </>
  )
}

export default Approval