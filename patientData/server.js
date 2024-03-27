const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;
const connection = require("../database/database_connection");
const crypto = require("crypto");

app.use(express.json());

//app.post("/send-message", (req, res) => {
  const { message, selectedDoctor } = req.body;

  // Fetch the public key of the selected doctor from the database
  const sqlQuery = "SELECT rsaPublicKey FROM doctorUser WHERE username = ?";

  connection.query(sqlQuery, [selectedDoctor], (error, results) => {
    if (error) {
      console.error("Error fetching public key:", error);
      return res.status(500).send("Error fetching public key");
    }

    if (results.length === 0 || !results[0].rsaPublicKey) {
      return res
        .status(404)
        .send("Public key not found for the selected doctor");
    }

    const publicKey = results[0].rsaPublicKey;

    // Encrypt the message using the public key
    const encryptedMessage = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(message, "utf-8")
    );

    // Write the encrypted message to the file
    fs.appendFile(
      "/home/tmadmin/message.txt",
      encryptedMessage.toString("base64") + "\n",
      (err) => {
        if (err) {
          console.error("Error writing encrypted message to file:", err);
          return res
            .status(500)
            .send("Error writing encrypted message to file");
        }
        console.log(
          `Encrypted message for ${selectedDoctor} received and written to file successfully`
        );

        // Save the encrypted message in the database under the recipient user's entry
        const sqlUpdate =
          "UPDATE doctorUser SET receivedMessage = ? WHERE username = ?";
        connection.query(
          sqlUpdate,
          [encryptedMessage.toString("base64"), selectedDoctor],
          (error, results) => {
            if (error) {
              console.error(
                "Error updating database with encrypted message:",
                error
              );
              return res
                .status(500)
                .send("Error updating database with encrypted message");
            }
            console.log(
              `Encrypted message saved in the database for ${selectedDoctor}`
            );
            res.send(
              "Encrypted message received, written to file, and saved in the database successfully"
            );
          }
        );
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
