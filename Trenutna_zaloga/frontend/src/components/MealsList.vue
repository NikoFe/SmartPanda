<script setup>
import { ref,onMounted} from 'vue'
import axios from 'axios'
import Meal from "./Meal.vue"
const API_URL = "http://localhost:3000";


const meals = ref([])
const mealId =ref(0)
const boughtMeals = ref([])

const getMeals = async()=>{

    try {
      const response = await axios.get(API_URL + "/meals");
      const mealsFromDB = response.data.map((meal) => ({
        id: meal.id,
        ime: meal.ime,
        cena: meal.cena,
        opis: meal.opis,
        tip: meal.tip,
        zaloga:meal.zaloga
      }));

      meals.value = mealsFromDB; // <- replaces instead of adding
    } catch (error) {
      console.log("ERROR: ", error.message);
    }
}

onMounted(async () => {
   await getMeals(); // Fetch badges count first

});
</script>
   <!-- id: meal.id,
        ime: meal.ime,
        cena: meal.cena,
        opis: meal.opis,
        tip: meal.tip,-->

<template>
  <div className="meals-div">


  <Meal
   v-for="meal in meals"
  :key="meal.id"
  :meal="meal"
    />

</div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
.meals-div{
background-color: lightblue;
padding: 5;
}

</style>
