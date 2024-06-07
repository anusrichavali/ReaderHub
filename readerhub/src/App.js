import './App.css';
import React, {useState} from "react"
import AppBar from '@mui/material/AppBar';
import { Button, Header, Menu, Box } from '@mui/material';
import { MenuItem } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Input, TextField, Drawer, Grid } from '@mui/material';
import { FormControl, FormLabel } from '@mui/material';

function NewEntry({ setShowEntryForm }) {
  return (
    <Box>
         <AppBar position="static" sx={{ backgroundColor: '#374785', width: '100%', height: '10%' }}>
        <Typography variant="h1" component="div" sx={{ fontSize: '30px', color: '#fffeed', paddingTop: '10px', paddingLeft: '20px'}}>
          Add A Book
        </Typography>
      </AppBar>
        <FormControl sx={{ width: '100%', padding: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormLabel>Title</FormLabel>
            <Box sx={{paddingRight: '40px' }}>
              <TextField fullWidth />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <FormLabel>Author</FormLabel>
            <Box sx={{paddingRight: '40px' }}>
              <TextField fullWidth />
            </Box>
          </Grid>
          <Grid item xs={12}>
          <Grid item xs={12}>
            <FormLabel>Notes</FormLabel>
            <Box sx={{paddingRight: '40px' }}>
              <TextField fullWidth multiline rows={4}/>
            </Box>
          </Grid>
          <Grid item xs={12}></Grid>
          <Box sx={{paddingTop: '30px', paddingRight: '40px' }}>
            <Button onClick={()=> setShowEntryForm(false)} fullWidth sx={{ backgroundColor: '#374785', color: '#fffeed' }}>Submit</Button>
          </Box>
          </Grid>
        </Grid>
      </FormControl>
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
