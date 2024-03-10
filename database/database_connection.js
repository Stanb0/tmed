const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'tmuser',
  password: 'USDT_btc',
  database: 'demo1'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

module.exports = connection;
