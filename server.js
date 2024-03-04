const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

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
  console.log(`Server is running on port ${port}`);
});
