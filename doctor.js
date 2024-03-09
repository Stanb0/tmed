const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 4000;

const datetime = new Date();
const  options = { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'};
const  formattedDate = datetime.toLocaleString('en-GB', options);

app.get("/inbox", (req, res) => {
  fs.readFile("/home/tmadmin/message.txt", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading messages:", err);
      res.status(500).send("Error reading messages");
      return;
    }
    // Split the data into an array of messages
    const messages = data.split("\n").filter(Boolean); // Filter out empty lines
    res.json(messages);
  });
});

app.listen(PORT, () => {
  console.log(formattedDate + ` Server is running on port ${PORT}`);
});
