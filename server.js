const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

var datetime = new Date();
var options = { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'};
var formattedDate = datetime.toLocaleString('en-GB', options);
console.log(formattedDate);

app.use(bodyParser.json());

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
  console.log(formattedDate + ` Patient.js file is running on port ${port}`);
});
