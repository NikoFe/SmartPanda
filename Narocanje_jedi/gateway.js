// gateway.js

const express = require('express');
const cors = require("cors");
require('dotenv').config();
const mysql = require('mysql2/promise');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');


//const PROTO_PATH = path.join(__dirname, 'external_proto/pending_order.proto');
const PROTO_PATH = path.join(__dirname, '../Odobrenje_Narocila/proto/pending_order.proto')

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const grpcObject = grpc.loadPackageDefinition(packageDef);
const pendingorder = grpcObject.pendingorder;

// Default client instance
const defaultClient = new pendingorder.PendingOrderService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// Create app with dependency injection
function createApp(client = defaultClient) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    decimalNumbers: true // <<< ADD THIS
  };

  //1
  app.post('/user_has_meal', async (req, res) => {
    try {
      const { user_id, meal_id, amount } = req.body;

      client.InsertOrder({ user_id, meal_id, amount }, (err, response) => {
        if (err) {
          console.error('gRPC Insert Order Error:', err);
          return res.status(500).json({ error: 'gRPC call failed' });
        }

        if (response.result !== "SUCCESS") {
          return res.status(500).json({ error: response.message });
        }

        return res.json({ message: "inserting order success" });
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

//2.
app.put('/updateZaloga',async (req, res) => {
  try {
 const {user_id, meal_id,amount } = req.body;

  client.UpdateZaloga({ user_id:parseInt(user_id), meal_id:  parseInt(meal_id), amount: parseInt(amount) }, (err, response) => {
 
  console.log("UpdateZaloga user_id: ",parseInt(user_id) )
  console.log("UpdateZaloga meal_id: ", parseInt(meal_id) )
  console.log("UpdateZaloga amount: ",parseInt(amount) )

    if (err) {
      console.error('grpc updateZaloga Error:', err);
      return res.status(500).json({ error: 'gRPC call failed' });
    }
    if (!response.result =="SUCCESS") {
      console.error('grpc updateZaloga FAIL:', err);
      return res.status(500).json({ error: response.message });
    }

    return res.json({ message: "update zaloga success" });
  });
  } catch (error) {
    console.error("Error updating zaloga:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  })

  //3
app.delete('/user_has_meal/:user_id/:meal_id', async(req, res) => {
  console.log("delete gateway")
  try {

  console.log(req.params)
 const {user_id,meal_id } = req.params;

  const userId = parseInt(user_id.trim() , 10);
  const mealId = parseInt(meal_id.trim() , 10)

  client.DeleteTimer({ user_id: userId, meal_id: mealId }, (err, response) => {

  console.log("UpdateZaloga user_id: ",userId )
  console.log("UpdateZaloga mealId: ", mealId )

    console.log("TIMER RESPONSE: ", response)
    if (err) {
      console.error('grpc deleteTimerError Error:', err);
      return res.status(500).json({ error: 'gRPC call failed' });
    }
    if (!response.result =="SUCCESS") {
      return res.status(500).json({ error: response.message });
    }
    return res.status(200).json({ message: "delete timer success" });

   // return res.json({ message: response.message });
  });
  } catch (error) {
    console.error("Error in delete timer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

  app.get('/meals', async (req, res) => {
    const db = await mysql.createConnection(dbConfig);
    try {
      const [rows] = await db.execute("SELECT * FROM jed");
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      await db.end();
    }
  });


app.get('/users/:username/:password', async(req, res) => {
  console.log("FLOWERS")
  const db = await mysql.createConnection(dbConfig);
    try {
  let {username,password}=req.params

 const [rows] = await db.execute("SELECT id FROM uporabnik WHERE ime= ? AND geslo= ?",
        [username,password]);
      console.log("RESULT : "+rows)
      res.status(200).json(rows);
  /*
    client.getIdByUsername({username,password}, (err, response) => {
 */
    } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  finally {
    await db.end(); 
  }
})
  return app;
}
module.exports = createApp;
if (require.main === module) {
  const app = createApp();
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Gateway server listening on port ${PORT}`);
  });
}
