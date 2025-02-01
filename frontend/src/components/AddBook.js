import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddBook.css';

function AddBookPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [analyzeAI, setAnalyzeAI] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send data to backend (make sure to adjust backend to handle description and analyzeAI)
    axios.post('http://localhost:8000/books', { title, description, analyzeAI })
      .then(() => navigate('/'))
      .catch(error => console.error('Error adding book:', error));
  };

  return (
    <div className="add-book-container">
      <h1>Add a Book</h1>
      <form onSubmit={handleSubmit} className="add-book-form">
        {/* Title Input */}
        <div className="input-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description Input */}
        <div className="input-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Enter book description"
          />
        </div>

        {/* Checkbox for analyzing images with AI */}
        <div className="input-group checkbox-group">
          <label htmlFor="analyzeAI">Analyze Images with AI:</label>
          <input
            type="checkbox"
            id="analyzeAI"
            checked={analyzeAI}
            onChange={() => setAnalyzeAI(!analyzeAI)}
          />
        </div>

        <button type="submit" className="submit-button">Create</button>
      </form>
    </div>
  );
}

export default AddBookPage;
