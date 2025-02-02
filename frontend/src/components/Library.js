import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Library.css"; // Assuming your custom styles are here
import { Link } from "react-router-dom";
import 'font-awesome/css/font-awesome.min.css';


const Library = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate(); // Initialize navigate function

  // Fetch books from Firebase
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "books"));
        const booksList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBooks(booksList);
        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        console.error("Error fetching books: ", error);
        setLoading(false); // Stop loading even if there's an error
      }
    };

    const timer = setTimeout(() => {
      fetchBooks();
    }, 2000); // Delay for 2 seconds (2000 ms)

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  // Navigate to add book page
  const handleAddBook = () => {
    navigate("/add-book"); // Navigate to AddBookPage
  };

  // Function to render the icon based on book type
  const renderIcon = (bookType) => {
    switch (bookType) {
      case "notebook":
        return <i className="fas fa-book-open"></i>; // Font Awesome "book-open" icon for notebook
      case "test":
        return <i className="fas fa-book-reader"></i>; // Font Awesome "book-reader" icon for test
      case "photobook":
        return <i class="fa-solid fa-camera-retro"></i>; // Font Awesome "camera-retro" for photobook
      case "test2":
        return <i className="fa-regular fa-bookmark"></i>; // Font Awesome "bookmark" for test2
      default:
        return <i className="fas fa-question-circle"></i>; // Default "question-circle" for unknown types
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
              <Link to={`/book/${book.id}`} className="book-link">
                <div className="book-icon">{renderIcon(book.book_type)}</div>
                <h4>{book.name}</h4>
                <p>
                  <strong>Type:</strong> {book.book_type}
                </p>
                <p>{book.description}</p>
                <i className="fas fa-arrow-right"></i> {/* Icon to indicate it's clickable */}
              </Link>
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
