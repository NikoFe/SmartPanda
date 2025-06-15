const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = __dirname + '/proto/data.proto';
const PORT = 3001
const packageDef = protoLoader.loadSync(PROTO_PATH, {});
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
    // console.log("GET ERROR!")
      //console.log( err.message)
      return res.status(500).json({ error: err.message });
    }
    console.log("RESPONSE : ",JSON.stringify(response.meals) )
    res.json(response.meals);
  });
});

app.listen(PORT, () => {
  console.log('HTTP Gateway listening on http://localhost:');
});

