import React from 'react';
import { Link } from 'react-router-dom';

function FeaturesSection() {
  const features = [
    { title: "AI-Powered Chatbot", route: "/ai-chatbot" },
    { title: "Virtual Muscat Assistant", route: "/virtual-muscat" },
    { title: "Customizable Avatar", route: "/custom-avatar" },
    { title: "Photo Upload & Fit Suggestions", route: "/photo-upload" },
    { title: "Seasonal Fashion Guides", route: "/seasonal-guides" },
    { title: "Outfit & Cosmetics Matching", route: "/outfit-cosmetics" },
    { title: "Expert Tips & Articles", route: "/expert-tips" },
    { title: "Direct Shopping Links", route: "/direct-shopping" },
    { title: "Customizable Profiles", route: "/profiles" },
  ];

  return (
    <div className="features-section">
      <h3>Our Features</h3>
      <p>Explore what Fashion Muse offers:</p>
      <div className="feature-grid">
        {features.map((feat) => (
          <div key={feat.title} className="feature-card">
            <Link to={feat.route}>
              <h4>{feat.title}</h4>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturesSection;
