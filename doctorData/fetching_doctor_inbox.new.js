const express = require("express");
const fs = require("fs");
const crypto = require("crypto");
const app = express();
const PORT = 4000;
const connection = require("../database/database_connection");

const datetime = new Date();
const options = { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'};
const formattedDate = datetime.toLocaleString('en-GB', options);

// Function to decrypt message using RSA private key
function decryptMessage(encryptedMessage, privateKey) {
   // console.log("decryption started");
   // console.log("Enrypted Message: ", encryptedMessage);
   // console.log("Private Key: ", privateKey);
    try{
      const decryptedMessage = crypto.privateDecrypt({
        key: privateKey,
	padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
       // passphrase: '', // Passphrase, if any
      },
      Buffer.from(encryptedMessage, 'base64') // Assuming encryptedMessage is base64 encoded
      );
    //console.log("Dectrypted MEssage: ",decryptedMessage.toString());
    return decryptedMessage.toString();
    }catch(error){
      console.log("Error while decrypting", error);
    }
}

app.get("/inbox", (req, res) => {
    const { doctorName } = req.query;
    //console.log(doctorName);
    const sqlQuery = "SELECT receivedMessage, senderName, rsaPrivateKey FROM doctorUser WHERE username=?";
    connection.query(sqlQuery, [doctorName], (error, results) => {
        if (error) {
            console.error("Error Fetching Messages: ", error);
            res.status(500).send("Error Fetching Messages");
            return;
        }
        if (results.length === 0) {
            res.status(404).send("Doctor not found");
            return;
        }
        // Extract receivedMessage and rsaPrivateKey from the result
        const { receivedMessage, senderName, rsaPrivateKey } = results[0];
	//console.log("result :", results[0].senderName);
        // Decrypt the receivedMessage using the private key
        const decryptedMessage = decryptMessage(receivedMessage, rsaPrivateKey);
	//console.log(decryptMessage);
        //const response = {
	 //   senderName,
         //   decryptedMessage
        //};
	//res.json(message.senderName, message.decryptedMessage);
	//console.log("sender is: ", senderName);
	//console.log("message is: ",decryptedMessage);
        res.json([{senderName, decryptedMessage}]);
        //console.log("typeof: ", typeof decryptedMessage);
    });
});

app.listen(PORT, () => {
    console.log(formattedDate + ` fetch data from message.txt server is running on port ${PORT}`);
});
