import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function AddBookPage() {
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/books', { title })
      .then(() => navigate('/'))
      .catch(error => console.error('Error adding book:', error));
  };

  return (
    <div>
      <h1>Add a Book</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default AddBookPage;
