// Import required modules
const express = require('express');
const crypto = require('crypto');

// Create an Express app
const app = express();

// Define a route to generate RSA keys
app.get('/doctor/keygen', (req, res) => {
  const { username } = req.query;
  // Generate RSA key pair
  crypto.generateKeyPair('rsa', {
    modulusLength: 2048, // You can adjust the key size as needed
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    }
  }, (err, publicKey, privateKey) => {
    if (err) {
      console.error('Error generating RSA keys:', err);
      return res.status(500).send('Error generating RSA keys');
    }
    console.log('Public Key:', publicKey);
    console.log('Private Key:', privateKey);

    console.log("Doctor Name is ", username);
    if(res.status(200)){
      console.log("Successfully Doctor keys are generated.");
    }
  });
});

// Start the server
const PORT = process.env.PORT || 2222;
app.listen(PORT, () => {
  console.log(`Generate Key Server for Doctor is running on port ${PORT}`);
});
