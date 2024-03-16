const connection = require('../database/database_connection');
const express = require('express');
const app = express();

const PORT = 2200;

const datetime = new Date();
const  options = { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'};
const  formattedDate = datetime.toLocaleString('en-GB', options);


app.use(express.json()); //without this it was not working idk why, i added and it's working

app.post('/doctor/login', (req, res) => {
  const { userName, password } = req.body;
  const query = `SELECT * FROM doctorUser WHERE userName = ? AND password = ?`;

  connection.query(query, [userName, password], (err, results) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    if (results.length > 0) {
      res.status(200).json({ message: 'Login successful', user: results[0] });
	console.log("Doctor successfully logged in");
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

//module.exports = router;

app.listen(PORT, () => {
  console.log(formattedDate + ` Doctor Login Server is running on port ${PORT}`);
});
