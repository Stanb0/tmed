// Import required modules
const express = require('express');
const crypto = require('crypto');
const connection = require('../database/database_connection');

// Create an Express app
const app = express();

// Define a route to generate RSA keys
app.get('/doctor/keygen', (req, res) => {
  const { username } = req.query;

  const sqlCheck = 'SELECT rsaPublicKey, rsaPrivateKey FROM doctorUser WHERE username = ?';

  connection.query(sqlCheck, [username], (error, results) =>{
  if(error){
    console.error('Error Executing SQL query: ',error);
    return res.status(500).send('Error Executing SQL query.');
  }
  if(results.length > 0 && results[0].rsaPrivateKey){
    console.log(username, " already has Public and Private Keys");
    return -1;
  }else{
    console.log(username, ' does not have Public and Private Keys, Starting to Generate');
  // Generate RSA key pair
   
  crypto.generateKeyPair('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  }, (err, publicKey, privateKey) => {
    if (err) {
      console.error('Error generating RSA keys:', err);
      return res.status(500).send('Error generating RSA keys');
    }
    console.log('Public Key:', publicKey);
    console.log('Private Key:', privateKey);
    console.log('Updating DataBase');
    const sql = 'UPDATE doctorUser SET rsaPublicKey = ?, rsaPrivateKey = ? WHERE username = ?';
    connection.query(sql, [publicKey, privateKey, username], (err, result) => {
      if(err){
        console.error('Error Updating DataBase: ', err);
        return res.status(500).send('Error Updating DataBase');
      }
      console.log('Successfully Updated DataBase with RSA Keys for', username);
      res.status(200).send('RSA Keys Generated and Saved in DataBase');
    });
  });

  }
 });
});

// Start the server
const PORT = process.env.PORT || 2222;
app.listen(PORT, () => {
  console.log(`Generate Key Server is running on port ${PORT}`);
});
