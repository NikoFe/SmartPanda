import React from 'react'

const Meal = ({meal}) => {
  return (
  <>
    <div className="meal-div"> 
    
    <img src={`/src/images/${meal.ime}.png`} alt={`Meal image`} height={100} width={100}  />
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
          }}
        >
          DETAILS
        </button>

    </div>
    </>
  )
}

export default Meal