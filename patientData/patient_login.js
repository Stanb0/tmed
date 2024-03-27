const express = require('express');
const app = express();
const connection = require('../database/database_connection');

const PORT = 1100;

const datetime = new Date();
const  options = { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'};
const  formattedDate = datetime.toLocaleString('en-GB', options);

app.use(express.json());

let name;

//function patientLogin() {
app.post('/patient/login', (req, res) => {
  const { userName, password } = req.body;
  name = userName;
  const query = `SELECT * FROM patientUser WHERE userName = ? AND password = ?`;

  connection.query(query, [userName, password], (err, results) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).json({ message: 'Internal server error' });
      //return name;
    }

    if (results.length > 0) {
      res.status(200).json({message: userName});
      console.log(userName, " Successfully logged in");
      function getName(){
        return userName;
      }
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
//module.exports = getName;
});


//console.log("name isssss", name);


//}
app.listen(PORT, () => {
  console.log(formattedDate + ` Patient Login Server is running `);
});

//function patientLogin() {
//return name;
//}

//module.exports = {getName};
