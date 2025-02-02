import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Library.css"; // Assuming your custom styles are here

const Library = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "books"));
        const booksList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBooks(booksList);
        setLoading(false); // Set loading to false once the data is fetched
      } catch (error) {
        console.error("Error fetching books: ", error);
        setLoading(false); // Even if there's an error, stop loading
      }
    }, 2000); // Delay for 2 seconds (2000 ms)

    return () => clearTimeout(timer);
  }, []);

  const handleAddBook = () => {
    navigate("/add-book"); // Navigate to AddBookPage
  };

  // Function to render the icon based on book type
  const renderIcon = (bookType) => {
    switch (bookType) {
      case "notebook":
        return <i className="fas fa-book-open"></i>; // Font Awesome "book-open" icon for fiction
      case "test":
        return <i className="fas fa-book-reader"></i>; // Font Awesome "book-reader" icon for non-fiction
      case "photobook":
        return <i className="fa-solid fa-camera-retro"></i> 
      case "test2":
        return <i className="fa-regular fa-bookmark"></i>; // Font Awesome "history" icon for history
      default:
        return <i className="fas fa-question-circle"></i>; // Default "question-circle" icon for unknown types
    }
  };

  return (
    <div className="library-container">
      <h3>Welcome to your Library</h3>

      {/* Show loader while fetching data */}
      {loading ? (
        <div className="loader">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      ) : books.length > 0 ? (
        <div className="book-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              <div className="book-icon">{renderIcon(book.book_type)}</div>
              <h4>{book.name}</h4>
              <p><strong>Type:</strong> {book.book_type}</p>
              <p>{book.description}</p>
              <a href={book.bucket_link} target="_blank" rel="noopener noreferrer">
                <i className="fas fa-file-pdf"></i> View PDF {/* Font Awesome PDF icon */}
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p>No books available.</p>
      )}

      {/* Add Book Button with Font Awesome Icon */}
      <button className="add-book-button" onClick={handleAddBook}>
        <i className="fas fa-plus-circle"></i> 
      </button>
    </div>
  );
};

export default Library;
