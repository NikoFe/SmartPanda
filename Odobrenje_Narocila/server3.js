const express = require('express')
const app = express()
const port = 3003
const cors = require("cors");
const mysql = require("mysql2/promise");
//require('dotenv').config();

app.use(express.json());
app.use(cors())
const dbConfig = {
  //host: process.env.DB_HOST || "localhost",
  //user: process.env.DB_USER || "root",
  //password: process.env.DB_PASSWORD || "artholus6*Databa5e",
  //database: process.env.DB_NAME || "smartpanda",
  host: "localhost",
  user: "root",
  password: "artholus6*Databa5e",
  database: "smartpanda",
};

app.get('/', (req, res) => {
  res.send('Hello World!')
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/user_has_meal',async (req, res) => {
 console.log("FETCHING MEALS!:")
try {

    const connection = (await mysql.createConnection(dbConfig));
    //const [rows] = await connection.execute("SHOW TABLES");
    const [rows] = await connection.execute("SELECT * FROM uporabnik_has_jed");
    //await connection.end();
    console.log("ROWS: ",rows)
    res.json(rows);
  } catch (error) {
    console.error("Error inserting post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  })

  app.get('/users/:id', async(req, res) => {
    let {id}=req.params
    console.log("ididididid : ",id)
    //let queryString = `SELECT sestavina.ime,kalorije FROM sestavina JOIN jed_has_sestavina ON Sestavina_id = sestavina.id  JOIN jed ON jed.id=Jed_id WHERE Jed_id =${id}`;
    try {
      const connection =(await mysql.createConnection(dbConfig));
      const [rows] =  await connection.execute(
        "SELECT * FROM uporabnik WHERE id  =  ?",
        [id]
      );
      console.log("ROWS: ",rows)
      res.json(rows);
    } catch (error) {
      console.error("Error getting meal post:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })

  app.delete('/user_has_meal/:id', async(req, res) => {
    let {id}=req.params

    try {
      const connection =(await mysql.createConnection(dbConfig));
      const [rows] =  await connection.execute(
        "DELETE  FROM uporabnik_has_jed WHERE id  =  ?",
        [id]
      );
      console.log("SUCCESSFUL DELETE!")
      console.log("ROWS: ",rows)
      res.json(rows);
    } catch (error) {
      console.error("Error getting meal post:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
/*
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
  })*/
 if (require.main === module) {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
    }