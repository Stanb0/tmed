const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const connection = require('../database/database_connection');

const app = express();
const port = 4001;

app.use(bodyParser.json());

app.get('/patient-list', (req, res) => {
  const query = 'SELECT username FROM patientUser WHERE rsaPublicKey is not NULL';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching doctors:', err);
      res.status(500).send('Error fetching doctors list');
      return;
    }
    res.json(results);
   // console.log(results);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

