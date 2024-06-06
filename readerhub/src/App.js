import logo from './logo.svg';
import './App.css';
import React from "react"
import AppBar from '@mui/material/AppBar';
import { Button, Header, Menu } from '@mui/material';
import { MenuItem } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


function App() {
  return (
    <div className="body">
      <AppBar sx={{ backgroundColor: '#374785', boxShadow:'none'}}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h1" component="div" className="custom-h1" sx={{ fontSize: '30px', color: '#fffeed'}}>
          ReaderHub
        </Typography>
        <div style={{ display: 'flex', gap: '20px' }}>
          <MenuItem sx={{ color: 'cream' }}>Home</MenuItem>
          <MenuItem sx={{ color: 'cream' }}>Profile</MenuItem>
        </div>
      </Toolbar>
      </AppBar>
      <form className="reader-home">
        <Button sx={{color: '#f132c0'}}>+ New Entry</Button>
      </form>
    </div>
  );
}

export default App;
