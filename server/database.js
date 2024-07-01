const sqlite3 = require('sqlite3')

// open database in memory
let db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });
  
  // Create a table
db.run(`CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(300) NOT NULL,
    genre VARCHAR(300) NOT NULL,
    rating INTEGER NOT NULL,
    date DATETIME NOT NULL,
    notes VARCHAR(10000)
)`, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Created entries table.');
});

module.exports = db;