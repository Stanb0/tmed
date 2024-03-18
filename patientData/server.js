// Import required modules
const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const connection = require('../database/database_connection');
const bodyParser = require('body-parser');

// Create an Express app
const app = express();

app.use(bodyParser.json());

// Define a route to handle incoming messages
app.post('/send-message', (req, res) => {
  const { message, selectedDoctor } = req.body;

  // Fetch the public key of the selected doctor from the database
  const sqlQuery = 'SELECT rsaPublicKey FROM doctorUser WHERE username = ?';

  connection.query(sqlQuery, [selectedDoctor], (error, results) => {
    if (error) {
      console.error('Error fetching public key:', error);
      return res.status(500).send('Error fetching public key');
    }

    if (results.length === 0 || !results[0].rsaPublicKey) {
      return res.status(404).send('Public key not found for the selected doctor');
    }

    const publicKey = results[0].rsaPublicKey;

    // Encrypt the message using the public key
    const encryptedMessage = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(message, 'utf-8')
    );

    // Write the encrypted message to the file
    fs.appendFile('/home/tmadmin/message.txt', encryptedMessage.toString('base64') + '\n', (err) => {
      if (err) {
        console.error('Error writing encrypted message to file:', err);
        return res.status(500).send('Error writing encrypted message to file');
      }
      console.log(`Encrypted message for ${selectedDoctor} received and written to file successfully`);
      res.send('Encrypted message received and written to file successfully');
    });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
