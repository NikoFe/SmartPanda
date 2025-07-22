const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = __dirname + '/proto/data.proto';
const PORT = 3001
//const packageDef = protoLoader.loadSync(PROTO_PATH, {});
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
const cors = require("cors");
const app = express();
app.use(cors())
app.use(express.json());

app.get('/rows', (req, res) => {
  client.GetAllRows({}, (err, response) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(response.rows);
  });
});

app.post('/users', (req, res) => {
  const { id, name, email } = req.body;

  client.CreateUser({ id, name, email }, (err, response) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(response);
  });
});
////////////////////
app.put('/meals',async (req, res) => {
 console.log("UPDATING MEALS!:")
try {
    const {id,amount } = req.body;

    client.updateZaloga({ id, amount}, (err, response) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      console.log("UPDATE RESPONSE: ",response )
      res.json(response);
    });

 //   console.log("UPDATE RESULT: ",rows)
   // res.json(rows);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  })

app.get('/meals', (req, res) => {
  console.log("CALLING MEALS")
  client.getAllMeals({}, (err, response) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    console.log("RESPONSE : ",JSON.stringify(response.meals) )
    res.json(response.meals);
  });
});
///users/"+username+"/"+password
app.get('/users/:username/:password', async(req, res) => {
  console.log("INTERIOR")
  let {username,password}=req.params
  console.log("INTERIOR  username: ", username, " INTERIOR PASSWORD: ", password)

    client.getIdByUsername({username,password}, (err, response) => {
    if (err) {
      console.log("ERROR USERID: ", err.message  )
      return res.status(500).json({ error: err.message });
    }
    console.log("RESPONSE : ",JSON.stringify(response.meals) )
    res.json(response.meals);
  });

})
/////////////////////////////////////////////////////////////////////////

app.post('/user_has_meal', async(req, res) => {
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


    client.createInBetween({
      //id: parseInt(id),
      user_id: parseInt(user_id),
      meal_id: parseInt(meal_id),
      amount: parseInt(amount),
      odobreno: 0
    }, (err, response) => {
    if (err) {
      console.log("ERROR CREATE BETWEEN: ", err.message  )
      return res.status(500).json({ error: err.message });
    }
    console.log("RESPONSE : ",JSON.stringify(response) )
    res.json(response);
  });

})


app.listen(PORT, () => {
  console.log('HTTP Gateway listening on http://localhost:');
});

