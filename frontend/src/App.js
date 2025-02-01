import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Example API call to FastAPI backend
    axios.get('http://localhost:8000/')
      .then(response => setMessage(response.data.message))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="App">
      <h1>Book Scanner App</h1>
      <p>Backend says: {message}</p>
    </div>
  );
}

export default App;