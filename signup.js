const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = 5000; // Choose a port number you prefer

// MySQL Connection Configuration
const connection = mysql.createConnection({
  host: "localhost", // Change this if your MySQL server is hosted on a different machine
  user: "tmuser",
  password: "USDT_btc",
  database: "demo",
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: ", err);
    return;
  }
  console.log("Connected to MySQL database...");
});

// Middleware to parse JSON
app.use(express.json());

// Route for handling user sign-up
app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  // Insert new user into the database
  connection.query(
    "INSERT INTO signUp (username, email, password) VALUES (?, ?, ?)",
    [username, email, password],
    (err, results) => {
      if (err) {
        console.error("Error signing up user: ", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      console.log("User signed up successfully");
      res.status(200).json({ message: "User signed up successfully" });
    }
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
