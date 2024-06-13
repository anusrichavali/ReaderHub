import './App.css';
import React, { useState, useEffect } from "react"
import AppBar from '@mui/material/AppBar';
import { Header, Menu, Box, Button, IconButton } from '@mui/material';
import { MenuItem } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Input, TextField, Drawer, Grid, iconButtonClasses } from '@mui/material';
import { FormControl, FormLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function NewEntry({ setShowEntryForm, fetchEntries, currentEntry }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (currentEntry) {
      setTitle(currentEntry.title);
      setAuthor(currentEntry.author);
      setGenre(currentEntry.genre);
      setNotes(currentEntry.notes);
    }
  }, [currentEntry]);

  console.log('Rendering NewEntry component'); // Debug log to ensure component is rendering

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    console.log('handleSubmit called'); // Debug log to verify function is called
    const entry = { title, author, genre, notes };
    console.log('Submitting entry:', entry); // Log the entry data

    try {
      let url;
      let method;

      if (currentEntry) {
        url = `http://localhost:3000/api/entries/${currentEntry.id}`;
        method = 'PUT';
      } else {
        url = 'http://localhost:3000/api/entries';
        method = 'POST';
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });

      if (response.ok) {
        setShowEntryForm(false);
        console.log("Success");
        fetchEntries();
      } else {
        console.error('Failed to submit entry');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: '#374785', width: '100%', height: '10%', justifyContent: 'space-between', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Typography variant="h1" component="div" sx={{ fontSize: '30px', color: '#fffeed', paddingTop: '10px', paddingLeft: '20px' }}>
          {currentEntry ? 'Edit Book' : 'Add A Book'}
        </Typography>
        <Box sx={{ flexGrow: 1 }}></Box> {/* This will push the MenuItem to the right */}
        <MenuItem sx={{ color: 'cream' }} onClick={() => setShowEntryForm(false)}>X</MenuItem>
      </AppBar>
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ width: '100%', padding: '20px' }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormLabel>Title</FormLabel>
              <Box sx={{ paddingRight: '40px' }}>
                <TextField fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Author</FormLabel>
              <Box sx={{ paddingRight: '40px' }}>
                <TextField fullWidth value={author} onChange={(e) => setAuthor(e.target.value)} />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Genre</FormLabel>
              <Box sx={{ paddingRight: '40px' }}>
                <TextField fullWidth value={genre} onChange={(e) => setGenre(e.target.value)} />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Notes</FormLabel>
              <Box sx={{ paddingRight: '40px' }}>
                <TextField fullWidth multiline rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </Box>
            </Grid>
            <Grid item xs={12}></Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '20px' }}>
              <Button sx={{ backgroundColor: '#374785', color: '#fffeed', width: '100px' }} type="submit">Submit</Button>
            </Box>
          </Grid>
        </FormControl>
      </form>
    </Box>
  );
}

function App() {
  const [entries, setEntries] = useState([]);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);

  const toggleDrawer = (open) => () => {
    setShowEntryForm(open);
  };

  const fetchEntries = async () => {
    try {
      const response = await fetch('http://localhost:3000/');
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const deleteEntry = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/delete/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchEntries();
      } else {
        console.error("Failed to delete entry");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const editEntry = (entry) => {
    setCurrentEntry(entry);
    setShowEntryForm(true);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="body">
      <AppBar sx={{ backgroundColor: '#374785'}}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h1" component="div" sx={{ fontSize: '30px', color: '#fffeed'}}>
            ReaderHub
          </Typography>
          <div style={{ display: 'flex', gap: '20px' }}>
            <MenuItem sx={{ color: 'cream' }}>Home</MenuItem>
            <MenuItem sx={{ color: 'cream' }}>Profile</MenuItem>
          </div>
        </Toolbar>
      </AppBar>
      <div className="reader-home">
      </div>
      <Drawer anchor="right" open={showEntryForm} onClose={toggleDrawer(false)}>
        <NewEntry setShowEntryForm={setShowEntryForm} fetchEntries={fetchEntries} currentEntry={currentEntry} />
      </Drawer>
      <Box className="reader-home" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
        <Typography sx={{ fontSize: '30px', color: '#AA336A', paddingTop: '10px' }}>What You've Read</Typography>
        <Button sx={{ backgroundColor: '#374785', color: '#fffeed' }} onClick={() => { setCurrentEntry(null); setShowEntryForm(true); }}>
          + New Entry
        </Button>
      </Box>
      <Box sx={{ padding: '10px' }}>
        <Grid container spacing={2} className='scrollable-container'>
          {entries.map((entry) => (
            <Grid item xs={6} key={entry.id}>
              <Box sx={{ border: '1px solid #ccc', padding: '3px', borderRadius: '4px', backgroundColor: '#e3e7ff', display: 'flex' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{entry.title}</Typography>
                  <Typography variant="body1">Author: {entry.author}</Typography>
                  <Typography variant="body1">Genre: {entry.genre}</Typography>
                  <Typography variant="body2">Notes: {entry.notes}</Typography>
                </Box>
                <IconButton onClick={() => deleteEntry(entry.id)}>
                  <DeleteIcon></DeleteIcon>
                </IconButton>
                <IconButton onClick={() => editEntry(entry)}>
                  <EditIcon></EditIcon>
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}

export default App;