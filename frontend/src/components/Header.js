// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <nav className="nav-container">
        <h1 className="logo">
          <Link to="/" className="nav-link">Scribe</Link>
        </h1>
        <div className="nav-links">
          <Link to="/add-book" className="nav-link">Add Collection</Link>
          <Link to="/library" className="nav-link">Library</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
