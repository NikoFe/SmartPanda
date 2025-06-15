const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());

// Create and connect to DB

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "artholus6",
  database: "smartpanda"
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Closing MySQL connection');
  connection.end(err => {
    if (err) console.error('Error during disconnection:', err);
    process.exit();
  });
});

module.exports = app;
