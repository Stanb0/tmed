const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const connection = require('../database/database_connection');

const app = express();
const port = 3001;

app.use(bodyParser.json());

app.get('/doctors-list', (req, res) => {
  const query = 'SELECT username FROM doctorUser WHERE rsaPublicKey is not NULL'; // Adjust the query according to your database schema
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching doctors:', err);
      res.status(500).send('Error fetching doctors list');
      return;
    }
    res.json(results);
    console.log(results);
  });
});

// Endpoint to handle incoming messages
app.post('/send-message', (req, res) => {
  const { message,selectedDoctor} = req.body;

  // Write the message to the file
  fs.appendFile('/home/tmadmin/message.txt', 'DoctorName: ' + selectedDoctor + '\n' + 'content:' +  message + '\n', (err) => {
    if (err) {
      console.error('Error writing message to file:', err);
      res.status(500).send('Error writing message to file');
    } else {
      console.log(`Message for ${selectedDoctor} received: ${message}`);
      console.log('Message written to file successfully');
      res.send('Message received and written to file successfully');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

