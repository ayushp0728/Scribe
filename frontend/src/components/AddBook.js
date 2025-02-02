import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, collection, addDoc } from '../firebase';
import './AddBook.css';

function AddBookPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bookType, setBookType] = useState('');
  const [analyzeAI, setAnalyzeAI] = useState(false);
  const [loading, setLoading] = useState(true); // Start with loading as true
  const navigate = useNavigate();

  // Use effect to simulate delay before rendering the form
  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // Stop loading after 2 seconds
    }, 2000); // 2-second delay for loader animation
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !bookType) {
      alert("Please fill out all fields!");
      return;
    }

    setLoading(true); // Set loading to true when the form is being submitted

    // Simulate a delay before actually submitting the data (for the loader effect)
    setTimeout(async () => {
      try {
        await addDoc(collection(db, "books"), {
          name: title,
          description,
          book_type: bookType,
          analyzeAI,
        });

        alert("Book successfully added!");
        navigate('/');
      } catch (error) {
        console.error("Error adding book:", error);
        alert("Failed to add book.");
      } finally {
        setLoading(false); // Set loading to false after the operation completes
      }
    }, 2000); // Set the delay here (2000 ms = 2 seconds)
  };

  return (
    <div className="add-book-container">
      <h3>Create Your Collection</h3>

      {/* Show loader while the form is being processed */}
      {loading ? (
        <div className="loader">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      ) : (
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

          {/* Book Type Buttons */}
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
      )}
    </div>
  );
}

export default AddBookPage;
