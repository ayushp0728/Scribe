import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import AddBookPage from './components/AddBook';
import BookSettingsPage from './components/BookSettings';
import Header from './components/Header';
import './App.css';


function App() {
  return (
    <Router>
      <div className="pt-16"> {/* This padding ensures the page content is below the fixed header */}
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-book" element={<AddBookPage />} />
          <Route path="/book-settings" element={<BookSettingsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
