import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar({ isOpen, setIsOpen }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', color: 'white', float: 'right' }}>✖</button>
      <h2>Features</h2>
      <ul>
        <li><Link to="/">Chatbot</Link></li>
        <li><Link to="/avatar">Customizable Avatar</Link></li>
        <li><Link to="/upload">Photo Upload</Link></li>
        <li><Link to="/guides">Seasonal Guides</Link></li>
        <li><Link to="/outfit">Outfit Matching</Link></li>
        <li><Link to="/tips">Expert Tips</Link></li>
        <li><Link to="/shop">Direct Shopping</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
