import React from "react";
import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { useNavigate } from "react-router-dom";
import "./App.css";
import Meal from "./Meal";
import axios from "axios";

const API_URL = "http://localhost:3003";

const ApprovalEntry = ({
  id,
  uporabnik_id,
  jed_id,
  kolicina,
  getBetween
  //user
}) => {
  const [location, setLocation] = "";
  const [approvalUsername, setApprovalUsername] = "";
   const Complete = async ()=>{
     try {
       const response = await axios.delete(API_URL + "/user_has_meal/"+id);
       /*
       const usersHaveMealFromDB = response.data.map((uhm) => ({
         id: uhm.id,
         uporabnik_id:uhm.uporabnik_id,
         jed_id: uhm.jed_id,
         kolicina: uhm.kolicina
       }));
 
       setUsersHaveMeals(usersHaveMealFromDB); // <- replaces instead of adding*/
       console.log("DELETE response: ", response)
       getBetween()
     } catch (error) {
       console.log("ERROR: ", error.message);
     }
   }




  const getUserByUserId = async () => {
    try {
      const response = await axios.get(gRPC_URL + "/user/" + id);
      console.log("MMMMMMMMMMMMMMMM: ", JSON.stringify(response[0].data));

      setLocation(response[0].data.lokacija);
      setApprovalUsername(response[0].data.ime);
    } catch (error) {
      console.log("ERROR: ", error.message);
    }
  };

  useEffect(() => {
    getUserByUserId();
  }, []);

  return (
    <>
      <div className="approval-entry-div">
        <p>Id: {id}</p>
        <p>Uporabnik id: {uporabnik_id}</p>
        <p>Jed id: {jed_id}</p>
        <p>Kolicina: {kolicina}</p>
        <p>Lokacija: {location}</p>
        <p>Ime uporabnika: {approvalUsername}</p>
        <button
          onClick={() => {
            Complete();
          }}
        >
          COMPLETE
        </button>
      </div>
    </>
  );
};

export default ApprovalEntry;
