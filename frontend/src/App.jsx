import React from 'react';
import { BrowserRouter as Router, Routes } from "react-router-dom";
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';

import { Toaster } from "react-hot-toast";

import './App.css';
import UserRoutes from './components/routers/userRoutes.jsx';
import AdminRoutes from './components/routers/adminRoutes.jsx';



function App() {
  const userRoutes=UserRoutes();
  const adminRoutes=AdminRoutes();
  return (
    <Router>
      <div className="App">
        <Toaster position="top-center" />
        <Header />
        <div className="container">
          <Routes>
          {userRoutes}
          {adminRoutes}
          
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
