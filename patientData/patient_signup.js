const express = require("express");
const mysql = require("mysql2");
const connection = require('../database/database_connection');

const app = express();
const PORT = 5500;

const datetime = new Date();
const  options = { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'};
const  formattedDate = datetime.toLocaleString('en-GB', options);

// Middleware to parse JSON
app.use(express.json());

// Route for handling user sign-up
app.post("/patientSignup", (req, res) => {
  const { username, email, password } = req.body;

  // Insert new user into the database
  connection.query(
    "INSERT INTO patientUser (username, email, password) VALUES (?, ?, ?)",
    [username, email, password],
    (err, results) => {
      if (err) {
        console.error(formattedDate + " Error signing up user: ", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      console.log(formattedDate + " User signed up successfully");
      res.status(200).json({ message: "User signed up successfully" });
    }
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(formattedDate + ` DoctorsignUp Server is running on port ${PORT}`);
});
