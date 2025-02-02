import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddBook.css';

function AddBookPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bookType, setBookType] = useState('');
  const [analyzeAI, setAnalyzeAI] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description || !bookType) {
      alert('Please fill out all fields!');
      return;
    }

    // Pass the data to the AddBookLive page through state
    navigate('/addbooklive', {
      state: {
        title,
        description,
        bookType,
        analyzeAI
      }
    });
  };

  return (
    <div className="add-book-container">
      <h3>Create Your Collection</h3>
      <form onSubmit={handleSubmit} className="add-book-form">
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

        <div className="input-group book-type-group">
          <label>Book Type:</label>
          <div className="book-type-buttons">
            <button
              type="button"
              className={bookType === 'notebook' ? 'active' : ''}
              onClick={() => setBookType('notebook')}
            >
              Notebook
            </button>
            <button
              type="button"
              className={bookType === 'photobook' ? 'active' : ''}
              onClick={() => setBookType('photobook')}
            >
              Photobook
            </button>
            <button
              type="button"
              className={bookType === 'general' ? 'active' : ''}
              onClick={() => setBookType('general')}
            >
              General
            </button>
          </div>
        </div>

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
