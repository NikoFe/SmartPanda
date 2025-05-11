import React from 'react'
import Meal from './Meal'
import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import axios from "axios";
import Ingredient from './Ingredient';

const API_URL = "http://localhost:3000";

const Details = ({id}) => {

    const [ingredients, setIngredients] = useState([]);
    const [alergens, setAlergens] = useState([]);
    const [totalCalories, setTotalCalories] = useState(0);

  ( { id } = useParams());
  const [selected, setSelected] = useState(null);
  useEffect(() => {
      
   const getSingle = async ()=> {
  if(id!=0) {
    const response = await axios.get(API_URL + `/meals/${id}`);
    
    console.log("id: ", id)
    console.log("response: ", response)
    console.log("DATA: ", response.data)
    console.log("ROWS: ", response.data.rows)
    console.log("rows1: ", response.data.rows[0])
    let selectedArray=response.data.rows[0]
    setSelected(selectedArray)

   }else {
    console.log("ID STILL ZERO!!!")
   }
   }

   getSingle();
       }, [id])
    

       /////////////////////////////////////////////////////////////////////////////////////////
       useEffect(() => {
        const getIngredients = async () => {
          try {
            const response = await axios.get(API_URL + `/ingredients/${id}`);
            const ingredientsFromDB = response.data.rows.map((ingredient) => ({
              ime: ingredient.ime,
              kalorije: ingredient.kalorije,
         
            }));
      
            setIngredients(ingredientsFromDB); 
          } catch (error) {
            console.log("ERROR: ", error.message);
          }
        };

        getIngredients();
      }, []);
       /////////////////////////////////////////////////////////////////////////////////////////

      useEffect(() => {

        const getTotalCalories = async () => {
            let sum=0;
            for(let i=0; i<ingredients.length;i++){
                sum+=ingredients[i].kalorije ;
            }
            console.log("TOTAL CALORIE SUM: ", sum)
            setTotalCalories(sum)
          };

       console.log("INGREDIENTS: ", ingredients)
       console.log("INGREDIENTS[0]: ", ingredients[0])
       getTotalCalories()
      }, [ingredients]);

  return (

    <div className="details">
    <img src={selected ?  `/src/images/${selected.ime}.png` : "/"} alt=""  className="icon" />
    <strong>{selected ? selected.id : ""}</strong>
    <strong>{selected ? selected.ime : ""}</strong>
    <div className="description">
    <strong>{selected ? selected.opis : ""}</strong>
    </div>
    <strong>Calorie count {totalCalories}</strong>

    <strong>INGREDIENTS:</strong>
    <div classname= "ingredients">
    {
    ingredients.map((ingredient, index) => (      
    <Ingredient
        ime={ingredient.ime}
        kalorije={ingredient.kalorije}
    ></Ingredient>
    ))
    }
    </div>
    </div>
   

  )
}

export default Details