import './App.css';
import React, {useState, useEffect} from "react"
import AppBar from '@mui/material/AppBar';
import {Header, Menu, Box, Button} from '@mui/material';
import { MenuItem } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Input, TextField, Drawer, Grid } from '@mui/material';
import { FormControl, FormLabel } from '@mui/material';

function NewEntry({ setShowEntryForm }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [notes, setNotes] = useState('');

  console.log('Rendering NewEntry component'); // Debug log to ensure component is rendering

  const handleSubmit = async(event) => {
    event.preventDefault(); // Prevent default form submission behavior
    console.log('handleSubmit called'); // Debug log to verify function is called
    const entry = { title, author, genre, notes };
    console.log('Submitting entry:', entry); // Log the entry data

    try {
      const response = await fetch('http://localhost:3000/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });

      if (response.ok) {
        setShowEntryForm(false);
        console.log("Success");
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
          Add A Book
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
            <Box sx={{ paddingTop: '30px', paddingRight: '40px' , paddingLeft: '50px'}}>
              <Button onClick={handleSubmit}>Submit</Button>
            </Box>
          </Grid>
        </FormControl>
      </form>
    </Box>
  );
}

function App() {
  const [showEntryForm, setShowEntryForm] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setShowEntryForm(open);
  };

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
      <Typography sx={{fontSize: '20px', color:'red'}}>Your Entries</Typography>
      <Button
        sx = {{variant: 'contained', backgroundColor:'#374785', color:'#fffeed'}}
        onClick={toggleDrawer(true)}>
        + New Entry
      </Button>
      </div>
      <Drawer anchor="right" open={showEntryForm} onClose={toggleDrawer(false)}>
        <NewEntry setShowEntryForm={setShowEntryForm}/>
      </Drawer>
    </div>
  );
}

export default App;
