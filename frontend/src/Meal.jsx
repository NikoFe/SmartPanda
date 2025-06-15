import React from 'react'
import { useNavigate } from "react-router-dom";


const Meal = ({meal,setMealId, imagepath}) => {

  const navigate = useNavigate();

  return (
  <>
    <div className="meal-div"> 
    
    <img src={`/src/images/${meal.ime}.png`} alt={`Meal image`} className="icon" />
      <strong> {meal.ime} </strong>

      {/*meal.ingredients.map((ing, index) => (
        <p>
          {" "}
          {ing.name + " " + ing.amount + "g " + ing.calories + "cal"}{" "}
        </p>
      ))*/}
        <strong>MEAL ID: {meal.id} </strong>
        <button
          onClick={() => {
      
            navigate(`/details/${meal.id}`)
          }}
        >
          DETAILS
        </button>

    </div>
    </>
  )
}

export default Meal