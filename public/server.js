const express = require('express')
const app = express()
const port = 3000
const cors = require("cors");
const mysql = require("mysql2/promise");
require('dotenv').config();

app.use(express.json());
app.use(cors())
const dbConfig = {
   
  host:  `${process.env.DB_HOST}`,
  user:  `${process.env.DB_USER}`,
  password:  `${process.env.DB_PASSWORD}` ,
  database:  `${process.env.DB_NAME}` ,

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


//module.exports = { app, connection };
/////////////////////////////////////////////////////OTHER:
  app.get('/users', async(req, res) => {
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
  
  app.get('/users/:username/:password', async(req, res) => {
    let {username,password}=req.params
    console.log("USERNAME : ", username)
    //let queryString = `SELECT sestavina.ime,kalorije FROM sestavina JOIN jed_has_sestavina ON Sestavina_id = sestavina.id  JOIN jed ON jed.id=Jed_id WHERE Jed_id =${id}`;
    try {
      const connection =(await mysql.createConnection(dbConfig));
      const [rows] =  await connection.execute(
        "SELECT id FROM uporabnik WHERE ime  =  ?",
        [username]
      );
      console.log("ROWS: ",rows)
      res.json(rows);
    } catch (error) {
      console.error("Error getting meal post:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }

  })

  app.post('/users', async(req, res) => {
   console.log("POSTING USERS!")
   console.log("req.body: "+req.body )
   const {username, location, password} = req.body
    //let queryString = `SELECT sestavina.ime,kalorije FROM sestavina JOIN jed_has_sestavina ON Sestavina_id = sestavina.id  JOIN jed ON jed.id=Jed_id WHERE Jed_id =${id}`;
    try {
      const connection =(await mysql.createConnection(dbConfig));
      const [rows] =  await connection.execute(
     "INSERT INTO uporabnik VALUES ("+Math.floor( Math.random()*100000)+", \""+username+"\",\""+location+"\", \""+password+"\","+0+")"
      );
      console.log("POST USER result: ",rows)
      res.json(rows);
    } catch (error) {
      console.error("Error posting user post:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })


  app.get('/validateUser/:username/:password', async(req, res) => {
   console.log( "host: "+process.env.DB_HOST+" user "+  process.env.DB_USER+
     " password: "+ process.env.DB_PASSWORD+" database: "+ process.env.DB_NAME )
   console.log("VALIDATING USER!")
   const {username, password} = req.params
   const querry=  "SELECT * FROM uporabnik WHERE ime=\""+username+"\" AND geslo =\""+password+"\""
   console.log("QUERRY: ",querry)
    //let queryString = `SELECT sestavina.ime,kalorije FROM sestavina JOIN jed_has_sestavina ON Sestavina_id = sestavina.id  JOIN jed ON jed.id=Jed_id WHERE Jed_id =${id}`;
    try {
      const connection =(await mysql.createConnection(dbConfig));
      const [rows] =  await connection.execute(
      "SELECT * FROM uporabnik WHERE ime=\""+username+"\" AND geslo =\""+password+"\"");

      console.log("validateUser result: ",rows)
      res.json(rows);
    } catch (error) {
      console.error("Error validating user post:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })

/*
if (require.main === module) {
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
}*/
  module.exports = app;