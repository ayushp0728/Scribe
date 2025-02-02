import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./Library.css"; // Assuming your custom styles are here

const Library = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Simulate a delay of 3 seconds for the loader animation
    const timer = setTimeout(async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "books"));
        const booksList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBooks(booksList);
        setLoading(false); // Set loading to false once the data is fetched
      } catch (error) {
        console.error("Error fetching books: ", error);
        setLoading(false); // Even if there's an error, stop loading
      }
    }, 2000); // Delay for 3 seconds (3000 ms)

    // Clean up the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="library-container">
      <h1>Welcome to your Library</h1>

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
              <h2>{book.name}</h2>
              <p><strong>Type:</strong> {book.book_type}</p>
              <p>{book.description}</p>
              <a href={book.bucket_link} target="_blank" rel="noopener noreferrer">
                View PDF
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p>No books available.</p>
      )}
    </div>
  );
};

export default Library;
