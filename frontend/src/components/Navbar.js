import React, { useState } from 'react';
import { Link } from 'react-router-dom';


function Navbar() {
  const [dropdown, setDropdown] = useState(false);

  return (
    <div className="navbar">
      <h1>Fashion Muse</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <div className="dropdown">
          <button onClick={() => setDropdown(!dropdown)} className="dropdown-btn">
            Features
          </button>
          {dropdown && (
            <div className="dropdown-content">
              <Link to="/ai-chatbot">AI-Powered Chatbot</Link>
              <Link to="/virtual-muscat">Virtual Muscat Assistant</Link>
              <Link to="/custom-avatar">Customizable Avatar</Link>
              <Link to="/photo-upload">Photo Upload & Fit Suggestions</Link>
              <Link to="/seasonal-guides">Seasonal Fashion Guides</Link>
              <Link to="/outfit-cosmetics">Outfit & Cosmetics Matching</Link>
              <Link to="/expert-tips">Expert Tips & Articles</Link>
              <Link to="/direct-shopping">Direct Shopping Links</Link>
              <Link to="/profiles">Customizable Profiles</Link>
            </div>
          )}
        </div>
      </div>
      <div className="login-btn">
        <Link to="#">Login with Google</Link>
      </div>
    </div>
  );
}

export default Navbar;
