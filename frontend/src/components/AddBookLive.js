import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db, collection, addDoc } from '../firebase';
import './AddBookLive.css';

function AddBookLive() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract data passed from AddBook.js
  const { title, description, bookType, analyzeAI } = location.state || {};

  const [pdfReceived, setPdfReceived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]); // State to store received images

  useEffect(() => {
    // Simulate a backend PDF retrieval process (e.g., fetching PDF or processing)
    setTimeout(() => {
      setPdfReceived(true); // Simulate receiving the PDF
      setLoading(false); // Stop loading after the PDF is ready
    }, 3000); // Simulating 3 seconds delay

    // Set up WebSocket connection to receive images
    const socket = new WebSocket('ws://your-backend-websocket-url'); // Replace with actual WebSocket URL

    socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    socket.onmessage = (event) => {
      const image = event.data; // Assuming the backend sends image data
      setImages((prevImages) => [...prevImages, image]); // Append new image to the list
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Cleanup WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, []);

  const handleSubmit = async () => {
    if (!pdfReceived) {
      alert("Waiting for PDF before submitting!");
      return;
    }

    try {
      // Save to the database once the PDF is ready
      await addDoc(collection(db, 'books'), {
        name: title,
        description,
        book_type: bookType,
        analyzeAI,
        pdf_url: 'path_to_pdf_here', // Example placeholder for actual PDF URL
      });

      alert("Book successfully added!");
      navigate('/');
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book.");
    }
  };

  return (
    <div className="add-book-live-container">
      <div className="book-details-container">
        <h3>Review Your Collection</h3>

        {/* Display loading screen */}
        {loading ? (
          <div className="loader">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : (
          <div>
            <div className="book-details">
              <h4>Title: {title}</h4>
              <p>Description: {description}</p>
              <p>Book Type: {bookType}</p>
              <p>Analyze with AI: {analyzeAI ? 'Yes' : 'No'}</p>
            </div>

            {/* Simulated PDF upload button */}
            <div className="pdf-status">
              {pdfReceived ? (
                <p>PDF has been received. Ready to submit!</p>
              ) : (
                <p>Waiting for PDF...</p>
              )}
            </div>

            {/* Submit button for final submission */}
            <button
              onClick={handleSubmit}
              disabled={!pdfReceived}
              className="submit-button"
            >
              Submit to Database
            </button>
          </div>
        )}
      </div>

      {/* Display images received from WebSocket on the right side */}
      <div className="image-gallery">
        <h3>Received Images</h3>
        {images.length === 0 ? (
          <p>No images received yet.</p>
        ) : (
          <div className="image-grid">
            {images.map((image, index) => (
              <img
                key={index}
                src={`data:image/jpeg;base64,${image}`} // Assuming image is sent as a base64 string
                alt={`Received Image ${index}`}
                className="received-image"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddBookLive;
