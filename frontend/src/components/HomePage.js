import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HomePage.css'

function HomePage() {
    // eslint-disable-next-line
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Fetch the books from the backend
    axios.get('http://localhost:8000/books')
      .then(response => setBooks(response.data))
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  return (
    <div className="home-container">
      {/* Left side: Big Heading */}
      <div className="left-container">
        <h1>Scribe.</h1>
      </div>

      {/* Right side: Instructions */}
      <div className="right-container">
        <p>
          Scribe is a powerful platform for scanning and processing your books.
          To get started, follow these simple steps:
        </p>
        <ol>
          <li>Create a new collection in your library.</li>
          <li>Add settings to customize your collection process.</li>
          <li>Press start to begin flipping the pages and capturing images.</li>
        </ol>
        <p>
          Let's get started by clicking the "Add Collection" button in the menu!
        </p>
      </div>
    </div>
  );
}

export default HomePage;
