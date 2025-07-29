const express = require('express')
const app = express()
//const port = 3000
const cors = require("cors");
const mysql = require("mysql2/promise");
//require('dotenv').config();

// Conditionally load .env based on NODE_ENV
if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: './.env.test' });
} else {
  require('dotenv').config();
}

app.use(express.json());
app.use(cors())


app.get('/', (req, res) => {
  res.send('Hello World!')
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/meals',async (req, res) => {
 console.log("FETCHING MEALS!:")

const dbConfig = {
  host:  `${process.env.DB_HOST}`,
  user:  `${process.env.DB_USER}`,
  password:  `${process.env.DB_PASSWORD}` ,
  database:  `${process.env.DB_NAME}` ,
};

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

module.exports = app;
if (require.main === module) {
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
}
