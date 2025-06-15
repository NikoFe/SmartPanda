<script setup>
import Image from 'primevue/image';
import { defineProps } from 'vue'
import { ref,onMounted} from 'vue'
import axios from 'axios'
const API_URL = "http://localhost:3000";

const props = defineProps({
  meal: {
    type: Object,
    required: true
  }
})

const getBought =(name)=>{
  const found = boughtMeals.value.find(item => item.ime === name)
  return found.name
}

onMounted(async () => {
 //  alert("PROPS meals: "+ JSON.stringify(props.meal))
});

const boughtCount = ref(0)


const Buy = async (name)=>{
 //alert(JSON.stringify(boughtCount.value))
 console.log(parseInt(boughtCount.value))
 if ( props.meal.zaloga >parseInt(boughtCount.value) &&  parseInt(boughtCount.value)<6){
   console.log("OK")

    const amount= props.meal.zaloga-boughtCount.value
    //alert("props.meal.zaloga: "+ props.meal.zaloga)
    //alert("boughtCount.value: "+ boughtCount.value)
    alert("meal.id: "+ props.meal.id)
    //alert("AMOUNT: "+ amount)
    try {
      const response = await axios.put(API_URL + "/meals",{
        id:props.meal.id,
        amount:amount
      });

    } catch (error) {
      console.log("ERROR: ", error.message);
    }
 }
 else {
    alert("value too high!")
 }
}

</script>
<template>
    <div className="meal-div"> 
    
    <Image :src="`./images/${props.meal.ime}.png`" alt="Meal image" width="100" height="100" className="meal_image"/>      

    <!--meal data displayed here-->
    <p><strong>{{ props.meal.ime }}</strong></p>
    <p>Price: {{ props.meal.cena }}</p>
    <p>Description: {{ props.meal.opis }}</p>
    <p>Type: {{ props.meal.tip }}</p>
    <p>Zaloga: {{ props.meal.zaloga }}</p>
    <strong></strong>
    <!-- prikaz increase-a-->

    <input className="buy-input"
     v-model="boughtCount"
    >

    <button @click="()=>{Buy(props.meal.ime)}"> Kupi</button>

    </div>


</template>
<style scoped>

.read-the-docs {
  color: #888;
}
.meal_image {
  border-radius: 10px;
}
.meal-div{

  border-radius: 2;
  border-color:black;
  border-style: solid;
}
.buy-input{

  display: block;
  width:50px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 5px;
}
</style>