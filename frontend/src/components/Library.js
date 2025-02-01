import React from "react";
import { Link } from "react-router-dom"; // to navigate to the "Add Book" page
import './Library.css'; // Import the CSS file for styling

const Library = () => {
  // Dummy data for collections, can be replaced with actual data from backend
  const collections = [
    { id: 1, name: "Collection 1" },
    { id: 2, name: "Collection 2" },
    { id: 3, name: "Collection 3" },
    { id: 4, name: "Collection 4" },
    // Add more collections here
  ];

  return (
    <div className="library-container">
      <h1>My Collections</h1>

      {/* Display all collections */}
      <div className="collections">
        {collections.map((collection) => (
          <div className="collection" key={collection.id}>
            <h2>{collection.name}</h2>
            {/* Add more details or links for each collection */}
          </div>
        ))}
      </div>

      {/* Button to add a new collection */}
      <div className="add-book-button">
        <Link to="/add-book">
          <button>Add Book</button>
        </Link>
      </div>
    </div>
  );
};

export default Library;
