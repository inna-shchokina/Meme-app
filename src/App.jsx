import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import { MemeProvider } from "./MemeContext";
import Gallery from "./pages/Gallery";
import Nav from './components/Nav';

function App() {
  return (
    <MemeProvider>
      <Router>
      <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </Router>
    </MemeProvider>
  );
}

export default App;