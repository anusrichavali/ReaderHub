import React, { useState } from 'react';
import axios from 'axios';
import { TextField, List, ListItem, ListItemText, Box } from '@mui/material';

const BookSearch = ({ onSelectBook }) => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);

  const searchBooks = async (query) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}`
      );
      setBooks(response.data.items || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleInputChange = (event) => {
    const query = event.target.value;
    setQuery(query);
    if (query.length > 2) {
      searchBooks(query);
    } else {
      setBooks([]);
    }
  };

  const handleBookSelect = (book) => {
    onSelectBook(book);
    setQuery('');
    setBooks([]);
  };

  return (
    <div>
      <TextField
        fullWidth
        value={query}
        onChange={handleInputChange}
        placeholder="Search for books..."
      />
      {books.length > 0 && (
        <Box sx={{ position: 'relative' }}>
          <List sx={{ position: 'absolute', width: '100%', maxHeight: 200, overflowY: 'auto', zIndex: 1, backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px' }}>
            {books.map((book) => (
              <ListItem
                button
                key={book.id}
                onClick={() => handleBookSelect(book)}
              >
                <ListItemText primary={book.volumeInfo.title} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </div>
  );
};

export default BookSearch;