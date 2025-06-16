const express = require('express')
const app = express()
const port = 3001
const cors = require("cors");
const mysql = require("mysql2/promise");
require('dotenv').config();

app.use(express.json());

app.use(cors())
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "artholus6*Databa5e",
  database: "smartpanda",
};

app.get('/', (req, res) => {
  res.send('Hello World!')
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/meals',async (req, res) => {
 console.log("FETCHING MEALS!:")
try {

    const connection = (await mysql.createConnection(dbConfig));
    //const [rows] = await connection.execute("SHOW TABLES");
    const [rows] = await connection.execute("SELECT * FROM jed");
    //await connection.end();
    console.log("ROWS: ",rows)
    res.json(rows);
  } catch (error) {
    console.error("Error inserting post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  })
/////////////////////////////////////////////////////////////////////////////////////////////////////////
app.put('/meals',async (req, res) => {
 console.log("UPDATING MEALS!:")
try {
    //"UPDATE jed SET zaloga = 10 WHERE id = 1;"
    const id= req.body.id
    const amount= req.body.amount
    const connection = (await mysql.createConnection(dbConfig));
    const [rows] = await connection.execute(`UPDATE jed SET zaloga = ${amount} WHERE id = ${id};`);


    console.log("UPDATE RESULT: ",rows)
    res.json(rows);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  })
/////////////////////////////////////////////////////////////////////////////////////////////////////////

  app.get('/meals/:id', async (req, res) => {

    id= parseInt(req.params.id)
    console.log("URL id: ||", id,"||")

    try {
      const connection =(await mysql.createConnection(dbConfig));
      const [rows] =  await connection.execute(
        "SELECT * FROM jed WHERE id = ?",
        [id]
      );
      console.log("ROWS: ",rows)
      res.json(rows);
    } catch (error) {
      console.error("Error getting meal post:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }

  })
  app.get('/ingredients/:id', async(req, res) => {

    id=  parseInt(req.params.id)
    console.log("URL id: ||", id,"||")

    //let queryString = `SELECT sestavina.ime,kalorije FROM sestavina JOIN jed_has_sestavina ON Sestavina_id = sestavina.id  JOIN jed ON jed.id=Jed_id WHERE Jed_id =${id}`;

    try {
      const connection =(await mysql.createConnection(dbConfig));
      const [rows] =  await connection.execute(
        "SELECT sestavina.ime,kalorije FROM sestavina JOIN jed_has_sestavina ON Sestavina_id = sestavina.id  JOIN jed ON jed.id=Jed_id WHERE Jed_id = ?",
        [id]
      );
      console.log("ROWS: ",rows)
      res.json(rows);
    } catch (error) {
      console.error("Error getting meal post:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }

  })

process.on('SIGINT', () => {
   console.log('Closing MySQL connection');
   connection.end(err => {
     if (err) console.error('Error during disconnection:', err);
     process.exit();
   });
 });

module.exports = app;

if (require.main === module) {
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
}
//module.exports = { app, connection };
