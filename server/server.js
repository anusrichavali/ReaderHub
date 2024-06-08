const express = require('express');
const app = express();
const port = 3000; // You can choose any port
var sql = require('mysql')

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "a"
  });
  
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.get('/', (req, res) => {
  res.send('Hello from the Node.js backend!');
});

app.listen(port, () => {
  console.log(`Server is running on port number ${port}`);
});