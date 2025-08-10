const express = require('express')
const app = express()
const cors = require("cors");
const mysql = require("mysql2/promise");
const swaggerJsdoc = require ("swagger-jsdoc")
const swaggerUi =require ("swagger-ui-express")

//require('dotenv').config();
// Conditionally load .env based on NODE_ENV
if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: './.env.test' });
} else {
  require('dotenv').config();
}
const dbConfig = {
  host:  `${process.env.DB_HOST}`,
  user:  `${process.env.DB_USER}`,
  password:  `${process.env.DB_PASSWORD}` ,
  database:  `${process.env.DB_NAME}` ,
  decimalNumbers: true // <<< ADD THIS
};
app.use(express.json());
app.use(cors())

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Meni API',
    version: '1.0.0',
    description: 'API documentation for my Express app'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server for Meni'
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ['./Meni.js'] 
};

const swaggerSpec = swaggerJsdoc(options);

// Swagger UI endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Root endpoint
 *     responses:
 *       200:
 *         description: Returns a Hello World message
 */

app.get('/', (req, res) => {
  res.send('Hello World!')
})
/**
 * @swagger
 * /meals:
 *   get:
 *     summary: Get all meals
 *     responses:
 *       200:
 *         description: List of meals
 */

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
module.exports = app;
if (require.main === module) {
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
 * @swagger
 * /meals/{id}:
 *   get:
 *     summary: Get a meal by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Meal detailss
 */

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

/**
 * @swagger
 * /ingredients/{id}:
 *   get:
 *     summary: Get ingredients for a meal
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of ingredients
 */
  app.get('/ingredients/:id', async(req, res) => {
    id=  parseInt(req.params.id)
    console.log("URL id: ||", id,"||")
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

/////////////////////////////////////////////////////OTHER:
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 */
  app.get('/users', async(req, res) => {
    //let queryString = `SELECT sestavina.ime,kalorije FROM sestavina JOIN jed_has_sestavina ON Sestavina_id = sestavina.id  JOIN jed ON jed.id=Jed_id WHERE Jed_id =${id}`;
    try {
      const connection =(await mysql.createConnection(dbConfig));
      const [rows] =  await connection.execute(
        "SELECT * FROM uporabnik"
      );
      console.log("ROWS: ",rows)
      res.json(rows);
    } catch (error) {
      console.error("Error getting meal post:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })

/**
 * @swagger
 * /users/{username}/{password}:
 *   get:
 *     summary: Get user by username and password
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: password
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User ID
 */
  app.get('/users/:username/:password', async(req, res) => {
    let {username,password}=req.params
    console.log("USERNAME : ", username)
    //let queryString = `SELECT sestavina.ime,kalorije FROM sestavina JOIN jed_has_sestavina ON Sestavina_id = sestavina.id  JOIN jed ON jed.id=Jed_id WHERE Jed_id =${id}`;
    try {
      const connection =(await mysql.createConnection(dbConfig));
      const [rows] =  await connection.execute(
        "SELECT id FROM uporabnik WHERE ime  =  ? and geslo =?",
        [username,password ]
      );
      console.log("ROWS: ",rows)
      res.json(rows);
    } catch (error) {
      console.error("Error getting meal post:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }

  })
  
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               location:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created
 */
  app.post('/users', async(req, res) => {
   console.log("POSTING USERS!")
   console.log("req.body: "+req.body )
   const {username, location, password} = req.body
    try {
      const connection =(await mysql.createConnection(dbConfig));
      const userId = Math.floor(Math.random() * 100000);
      const [rows] = await connection.execute(
      //  "INSERT INTO uporabnik (id, ime, lokacija, geslo, odobreno) VALUES (?, ?, ?, ?, ?)",
        "INSERT INTO uporabnik (id, ime, lokacija, geslo) VALUES (?, ?, ?, ?)",
        [userId, username, location, password]
      );
      console.log("POST USER result: ",rows)
      res.json(rows);
    } catch (error) {
      console.error("Error posting user post:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })


/**
 * @swagger
 * /validateUser/{username}/{password}:
 *   get:
 *     summary: Validate a user
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: password
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Validation result
 */
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
      `SELECT * FROM uporabnik WHERE ime= ?  AND geslo=?`,[username,password]);
      console.log("validateUser result: ",rows)
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error validating user post:", error);
      res.status(500).json({ error: "Internal Server Error: "+error });
    }
  })
module.exports = app;
if (require.main === module) {
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
}
