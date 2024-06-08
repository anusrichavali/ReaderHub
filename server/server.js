const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database'); // Import the database connection
const app = express();
const port = 3000;

app.use(bodyParser.json());

// API endpoint to handle form submissions
app.post('/api/entries', (req, res) => {
    const { title, author, genre, notes } = req.body;
  
    // Validation (optional, but recommended)
    if (!title || !author || !genre || !notes) {
      console.error('Validation failed:', { title, author, genre, notes });
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    const stmt = db.prepare(`INSERT INTO entries (title, author, genre, notes) VALUES (?, ?, ?, ?)`);
    stmt.run(title, author, genre, notes, function (err) {
      if (err) {
        console.error('Error inserting entry into the database:', err.message);
        return res.status(500).json({ message: 'Error inserting entry into the database' });
      } else {
        console.log('Entry added successfully with ID:', this.lastID);
        res.status(200).json({ id: this.lastID, message: 'Entry added successfully' });
      }
    });
    stmt.finalize((err) => {
      if (err) {
        console.error('Error finalizing statement:', err.message);
      }
    });
  });
app.listen(port, () => {
  console.log(`Server is running on port number ${port}`);
});

// Close the database connection when the application is exiting
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing the database', err.message);
        } else {
            console.log('Closed the database connection.');
        }
        process.exit(0);
    });
});