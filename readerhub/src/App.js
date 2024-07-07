import './App.css';
import React, { useState, useEffect } from "react"
import AppBar from '@mui/material/AppBar';
import {Box, Button, IconButton, MenuItem, TextField, Drawer, Grid, FormControl, FormLabel, colors, useColorScheme} from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {Chart} from 'react-google-charts';
import {Select} from '@mui/material';
import Card from '@mui/material/Card';
import { BarChart } from '@mui/x-charts/BarChart';
import {mangoFusionPalette} from '@mui/x-charts/colorPalettes';
import { legendClasses } from '@mui/x-charts';
//import { Rating } from '@smastrom/react-rating'
//import '@smastrom/react-rating/style.css'

function NewEntry({ setShowEntryForm, fetchEntries, currentEntry }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(null);

  useEffect(() => {
    if (currentEntry) {
      setTitle(currentEntry.title);
      setAuthor(currentEntry.author);
      setGenre(currentEntry.genre);
      setNotes(currentEntry.notes);
      setRating(currentEntry.rating);
    }
  }, [currentEntry]);

  console.log('Rendering NewEntry component'); // Debug log to ensure component is rendering

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    console.log('handleSubmit called'); // Debug log to verify function is called
    const entry = { title, author, genre, notes, rating };
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
            <Grid item xs={12}>
              <FormLabel>Rating</FormLabel>
              <Box sx={{ paddingRight: '40px' }}>
                <Select fullWidth value={rating} onChange={(e) => setRating(e.target.value)}>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                </Select>
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

  const genreCounts = entries.reduce((acc, entry) => {
    acc[entry.genre] = (acc[entry.genre] || 0) + 1;
    return acc;
  }, {});

  const ratingCounts = entries.reduce((acc, entry) => {
    acc[entry.rating] = (acc[entry.rating] || 0) + 1;
    return acc;
  }, {});

  const dateCounts = entries.reduce((acc, entry) => {
    acc[entry.date] = (acc[entry.date] || 0) + 1;
    return acc;
  }, {});

  const data = [
    ['Count', 'Genres'],...
    Object.entries(genreCounts)
  ];

  const dataRatings = [
    ['Count', 'Ratings'],...
    Object.entries(ratingCounts)
  ];

  const dataDates = [
    ['Date', 'Entries Per Day'],
    ...Object.entries(dateCounts)
  ];

  const optionsGenres = {
    chartArea: {
      width: '100%',
      height: '100%',
    },
    colors: ["#D32F2F",
      "#C2185B",
      "#0097A7",
      "#7B1FA2",
      "#512DA8",
      "#303F9F",
      "#1976D2",
      "#0288D1",
      "#00796B",
      "#388E3C",
      "#AFB42B",
      "#FFA000"
    ],
  };

  const optionsRatings = {
    hAxis: {
      title: 'Count',
      titleTextStyle: {
        fontSize: 14,
        bold: true,
        italic: false,
      },
      ticks: Array.from({ length: Math.max(...Object.values(ratingCounts)) + 1 }, (_, i) => i),
    },
    vAxis: {
      title: 'Ratings',
      titleTextStyle: {
        fontSize: 14,
        bold: true,
        italic: false,
      },
    },
    chartArea: {
      width: '60%',
      height: '70%',
    },
    bars: 'horizontal',
    colors: ["#5A5AA5"],
    legend: {
      position: 'none'
    }
  };

  const optionsDates = {
    vAxis: {
      title: 'Entries Per Day',
      titleTextStyle: {
        fontSize: 14,
        bold: true,
        italic: false,
      },
    },
    hAxis: {
      title: 'Date',
      titleTextStyle: {
        fontSize: 14,
        bold: true,
        italic: false,
      },
      format: 'yyyy-MM-dd',
      gridlines: { count: 15 }
    },
    chartArea: {
      width: '70%',
      height: '60%',
    },
  }

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
      <div className="reader-home"></div>
      <Drawer anchor="right" open={showEntryForm} onClose={toggleDrawer(false)}>
        <NewEntry setShowEntryForm={setShowEntryForm} fetchEntries={fetchEntries} currentEntry={currentEntry} />
      </Drawer>
      <Box className="reader-home" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
        <Typography variant="h4"sx={{color: '#CD5B45', paddingTop: '10px' }}>Your Reading Journey</Typography>
        <Button sx={{ backgroundColor: '#374785', color: '#fffeed' }} onClick={() => { setCurrentEntry(null); setShowEntryForm(true); }}>
          + New Entry
        </Button>
      </Box>
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', padding: '10px' }}>
        <Box sx={{ flex: 1, overflowY: 'auto', paddingRight: '10px', height: '80vh' }}>
          <Grid container spacing={2} className='scrollable-container'>
            {entries.map((entry) => (
              <Grid item xs={12} key={entry.id}>
                  <Card sx={{boxShadow: 3, paddingLeft: '20px'}}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" sx={{paddingTop: '10px'}}>{entry.title}</Typography>
                    <Typography variant='body2' sx={{paddingRight: '10px'}}>Date of Entry: {entry.date}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'left', marginTop: '5px' }}>
                    <Typography variant="body1">Rating: {entry.rating}</Typography>
                    <Typography variant="body1">Author: {entry.author}</Typography>
                    <Typography variant="body1">Genre: {entry.genre}</Typography>
                    <Typography variant="body1">Notes: {entry.notes}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                    <IconButton onClick={() => deleteEntry(entry.id)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => editEntry(entry)}>
                      <EditIcon />
                    </IconButton>
                  </Box>
                  </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Card sx={{padding: '5%', flexBasis: '50%' }}>
          <Chart
            chartType="PieChart"
            height='100%'
            width='100%'
            data={data}
            options={optionsGenres}
          />
          </Card>
          <Card sx={{padding: '10%', flexBasis: '50%' }}>
          <Chart
            chartType="BarChart"
            width= '100%'
            height='100%'
            data={dataRatings}
            options={optionsRatings}
          />
        </Card>
        <Card sx={{padding: '5%', flexBasis: '50%' }}>
          <Chart
            chartType="LineChart"
            width= '100%'
            height='100%'
            data={dataDates}
            options={optionsDates}
          />
        </Card>
        </Box>
      </Box>
    </div>
  );
}

export default App;