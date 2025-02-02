import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore';
import './AddBookLive.css';

function AddBookLive() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract data passed from AddBook.js
  const { title, description, bookType, analyzeAI, documentId } = location.state || {};

  const [pdfReceived, setPdfReceived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]); // State to store received images
  const [summaries, setSummaries] = useState([]); // State to store received summaries
  const [pdfLink, setPdfLink] = useState(null); // State to store the PDF link
  const [tableOfContents, setTableOfContents] = useState([]); // Expecting an array of strings

  useEffect(() => {
    // Simulate a backend PDF retrieval process (e.g., fetching PDF or processing)
    setTimeout(() => {
      setPdfReceived(true); // Simulate receiving the PDF
      setLoading(false); // Stop loading after the PDF is ready
    }, 3000); // Simulating 3 seconds delay

    // Get the doc_id from local storage
    const doc_id = localStorage.getItem("currentBookDocId");

    // Set up WebSocket connection to receive images, summaries, and status
    const socket = new WebSocket(`wss://84c5-2600-1001-b030-e154-3440-c998-c7df-4074.ngrok-free.app/ws?doc_id=${encodeURIComponent(doc_id)}`);

    socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data); // Parse the incoming JSON data

        // Extract image data (base64), summary (message in this case), status, and toc
        const { image_data: imageData, summary, status, table_of_content } = data;

        // Handle "continuing" status - replace images and summaries instead of appending
        if (status === "continuing") {
            setImages([imageData]); // Replace images
            setSummaries([summary]); // Replace summaries
        }
  
        // Handle "ended" status - render table of contents (toc)
        if (status === "ended") {
          setImages([]);  // Clear images
          setSummaries([]);  // Clear summaries
          setTableOfContents(table_of_content || []);  // Set table of contents (ensure it's an array)
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
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

  const handleViewPdf = async () => {
    try {
      if (!documentId) {
        alert("Invalid document ID.");
        return;
      }
  
      const docRef = doc(db, 'books', documentId); 
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
        const bucketLink = data.bucket_link; 
        if (bucketLink) {
          console.log("PDF Link:", bucketLink);
          setPdfLink(bucketLink);
          window.open(bucketLink, '_blank'); 
        } else {
          alert('No PDF link available.');
        }
      } else {
        alert('Document not found.');
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      alert('Failed to fetch the PDF link.');
    }
  };

  return (
    <div className="add-book-live-container">
      <div className="book-details-container">
        <h3>Review Your Collection</h3>

        {loading ? (
          <div className="loader">
            {/* Loading Animation */}
          </div>
        ) : (
          <div>
            <div className="book-details">
              <p>Title: {title}</p>
              <p>Description: {description}</p>
              <p>Book Type: {bookType}</p>
              <p>Analyze with AI: {analyzeAI ? 'Yes' : 'No'}</p>
            </div>

            <div className="pdf-status">
              {pdfReceived ? (
                <p>PDF has been received. Ready to submit!</p>
              ) : (
                <p>Waiting for PDF...</p>
              )}
            </div>

            <button
              onClick={handleViewPdf}
              disabled={!pdfReceived}
              className="submit-button"
            >
              View PDF
            </button>
          </div>
        )}
      </div>

      <div className="image-gallery-container">
        {/* Image Gallery */}
        <div className="image-gallery">
          <h3>Received Images</h3>
          {images.length === 0 ? (
            <p>No images received yet.</p>
          ) : (
            <div className="image-grid">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={`data:image/jpeg;base64,${image}`}
                  alt={`Received Image ${index}`}
                  className="received-image"
                />
              ))}
            </div>
          )}
        </div>

        {/* Summaries or Table of Contents */}
        <div className="summary-section">
          <h3>{tableOfContents.length > 0 ? "Table of Contents" : "Summaries"}</h3>
          {tableOfContents.length > 0 ? (
            <ul>
              {tableOfContents.map((toc, index) => (
                <li key={index}>{toc}</li> // Render table of contents items
              ))}
            </ul>
          ) : (
            summaries.length === 0 ? (
              <p>No summaries received yet.</p>
            ) : (
              summaries.map((summary, index) => (
                <p key={index}>{summary}</p>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default AddBookLive;
