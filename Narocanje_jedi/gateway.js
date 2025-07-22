const express = require('express');
require('dotenv').config();
const mysql = require('mysql2/promise');
const PORT = 3001


const dbConfig = {
  host:  `${process.env.DB_HOST}`,
  user:  `${process.env.DB_USER}`,
  password:  `${process.env.DB_PASSWORD}` ,
  database:  `${process.env.DB_NAME}` ,
};

/*
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const grpcObject = grpc.loadPackageDefinition(packageDef);
const dataPackage = grpcObject.data;
const client = new dataPackage.DataService(
  //'localhost:50051',
  'localhost:3002',
  grpc.credentials.createInsecure()
);
*/

const cors = require("cors");
const app = express();
app.use(cors())
app.use(express.json());

app.get('/rows', async (req, res) => {
      try {
        const db = await mysql.createConnection(dbConfig);
        const [rows] = await db.execute('SELECT id, name, email FROM users');
        console.log("RESULT : "+rows)
        res.json(rows);
      } catch (err) {
              return res.status(500).json({ error: err.message });
      }
  /*
  client.GetAllRows({}, (err, response) => {
*/
});
////
app.post('/users', async (req, res) => {
    try {
  const db = await mysql.createConnection(dbConfig);
  const { id, name, email } = req.body;

  await db.execute('INSERT INTO users (id, name, email) VALUES (?, ?, ?)', [id, name, email]);
  console.log("RESULT : "+rows)
   res.json(rows);
      } catch (err) {
          return res.status(500).json({ error: err.message });
   }
// 
   /*client.CreateUser({ id, name, email }, (err, response) => {
  */
  
});
////////////////////
app.put('/meals',async (req, res) => {
  try {
 const db = await mysql.createConnection(dbConfig);
 console.log("UPDATING MEALS!:")
 

    const {id,amount } = req.body;

      await db.execute(`UPDATE jed SET zaloga = ${amount} WHERE id = ${id};`);
      
     res.json("successfuly updated zaloga");
     // callback(null, { message: 'Jed updated successfully' });

   /*
    client.updateZaloga({ id, amount}, (err, response) => {*/

  } catch (error) {
    console.error("Error updating zaloga:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  })

app.get('/meals', async (req, res) => {
  //console.log("GET MEALS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

  try {
      const db = await mysql.createConnection(dbConfig);
    console.log("CALLING MEALS")

     const [rows] = await db.execute("SELECT * FROM jed");
     console.log("RESULT : "+rows)
     res.json(rows);

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

  /*
  client.getAllMeals({}, (err, response) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    console.log("RESPONSE : ",JSON.stringify(response.meals) )
    res.json(response.meals);
  });*/
});
///users/"+username+"/"+password
app.get('/users/:username/:password', async(req, res) => {
    try {
  const db = await mysql.createConnection(dbConfig);
  console.log("INTERIOR")
  let {username,password}=req.params
  console.log("INTERIOR  username: ", username, " INTERIOR PASSWORD: ", password)

 const [rows] = await db.execute(  "SELECT id FROM uporabnik WHERE ime  =  ? AND geslo= ?",
        [username,password]);
      console.log("RESULT : "+rows)
      res.json(rows);
  /*
    client.getIdByUsername({username,password}, (err, response) => {
 */
    } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})
/////////////////////////////////////////////////////////////////////////

app.post('/user_has_meal', async(req, res) => {
      try {
  const db = await mysql.createConnection(dbConfig);
  console.log("INTERIOR")
  let {/*id,*/user_id,meal_id, amount}=req.body
  console.log("INBETWEEN")
//  console.log("id: ", id)
  console.log("user_id: ", user_id)
  console.log("meal_id: ", meal_id)
  console.log("amount: ", amount)
  //console.log("Gateway payload: ", { id, user_id, meal_id, amount });

  for (const [key, value] of Object.entries({ /*id,*/ user_id, meal_id, amount })) {
    if (value === undefined || isNaN(parseInt(value))) {
      console.warn(`⚠️ WARNING: ${key} is invalid or not a number!`);
    }
  }

       const [rows2] = await db.execute( "SELECT * FROM uporabnik_has_jed WHERE  uporabnik_id = ? and  jed_id = ? ",
         [user_id, meal_id]);
      
       console.log("ROWS2: ", rows2)
       console.log("ROWS2 length: ", rows2.length)
      // console.log("ROWS2.json: ", json.stringify(rows2))

       if(rows2.length>0){
        console.log("DELETING !!!!!!!!!!!!!!!!!!!")
         const [rows3] = await db.execute( "DELETE FROM  uporabnik_has_jed WHERE uporabnik_id= ? and jed_id =?",
         [user_id, meal_id]);
       }

        const [rows] = await db.execute( "INSERT INTO uporabnik_has_jed VALUES (?,?,?,?)",
         [user_id, meal_id,amount,0]);
     res.json("succesfull!!!");

    } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
   /*
    client.createInBetween
;*/
})

app.listen(PORT, () => {
  console.log('HTTP Gateway listening on http://localhost:');
});

