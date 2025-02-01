import React from "react";
import { Link } from "react-router-dom"; // to navigate to the "Add Book" page
import './Library.css'; // Import the CSS file for styling

const Library = () => {
  // Dummy data for collections, can be replaced with actual data from backend
  const collections = [
    { id: 1, name: "Collection 1", link: "/collection1" },
    { id: 2, name: "Collection 2", link: "/collection2" },
    { id: 3, name: "Collection 3", link: "/collection3" },
    { id: 4, name: "Collection 4", link: "/collection4" },
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
          </div>
        ))}
      </div>

      {/* Custom button to trigger sub-buttons */}
      <div className="wrapper">
        {/* Hidden trigger input to control the animation */}
        <input type="checkbox" id="toogle" className="hidden-trigger" />
        <label htmlFor="toogle" className="circle">
          <svg
            className="svg"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="48"
            height="48"
            version="1.1"
            viewBox="0 0 48 48"
          >
            <image
              width="48"
              height="48"
              xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAAbElEQVR4Ae3XwQnFQAiE4eVVsGAP1mkPFjwvQvYSWCQYCYGZv4Dv5MGB5ghcIiDQI+kCftCzNsAR8y5gYu2rwCBAgMBTgEC3rek2yQEtAZoDjso8AyaKexmIDJUZD40AAQIE0gwx449GgMC9/t0b7GTsa7J+AAAAAElFTkSuQmCC"
            ></image>
          </svg>
        </label>

        <div className="subs">
          <Link to="/" className="sub-circle">
            <button className="sub-circle">
              <label htmlFor="sub1">Add Book</label>
            </button>
          </Link>

          <Link to="/" className="sub-circle">
            <button className="sub-circle">
              <label htmlFor="sub2">View Books</label>
            </button>
          </Link>

          <Link to="/" className="sub-circle">
            <button className="sub-circle">
              <label htmlFor="sub3">My Collections</label>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Library;
