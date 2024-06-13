const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database'); // Import the database connection
const app = express();
const port = 3000;
const cors = require('cors')

app.use(bodyParser.json());
app.use(cors());

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

//API endpoint to show all reader entries
app.get('/', (req, res) => {
    const fetch = 'Select * from entries';
    db.all(fetch, [], (err, rows) => {
    if (err) {
        console.error('Error fetching entries:', err.message);
        return res.status(500).json({ message: 'Error fetching entries' });
    } else {
        res.status(200).json(rows);
    }
    });
})

app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const del = 'Delete from entries where id = ?'

    db.run(del, id, function(err) {
        if(err) {
            console.error("Error deleting entry", err.message);
            return res.status(500).json({ message: 'Error deleting entry' });
        } else if (this.changes === 0) {
            return res.status(404).json({ message: 'Entry not found' });
        } else 
        {
            console.log("Successfully deleted entry");
            return res.status(200).json({message: 'Successfully deleted entry'});
        }
    });
}) 

app.put('/api/entries/:id', (req, res) => {
    const { id } = req.params;
    const { title, author, genre, notes } = req.body;
    const sql = 'UPDATE entries SET title = ?, author = ?, genre = ?, notes = ? WHERE id = ?';
    
    db.run(sql, [title, author, genre, notes, id], function (err) {
      if (err) {
        console.error('Error updating entry:', err.message);
        return res.status(500).json({ message: 'Error updating entry' });
      } else {
        console.log('Entry successfully updated:', this.changes);
        res.status(200).json({ id: this.changes, message: 'Entry successfully updated' });
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