const express = require('express');
const app = express();
const connection = require('../database/database_connection');

const PORT = 1100;

app.use(express.json());

app.post('/patient/login', (req, res) => {
  const { userName, password } = req.body;
  const query = `SELECT * FROM patientUser WHERE userName = ? AND password = ?`;

  connection.query(query, [userName, password], (err, results) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    if (results.length > 0) {
      res.status(200).json({ message: 'Login successful', user: results[0] });
      console.log("Patient Successfully logged in");
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

//module.exports = router;

app.listen(PORT, () => {
  console.log(`Patient Login Server is running on port ${PORT}`);
});
