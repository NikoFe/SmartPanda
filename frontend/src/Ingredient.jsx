import React from 'react'

const Ingredient = ({ime, kalorije}) => {
  return (

     <div className="ingredient-div">
       <strong>Name: {ime}</strong>
       <strong>Kalorije: {kalorije}</strong>
    </div>


  )
}

export default Ingredient