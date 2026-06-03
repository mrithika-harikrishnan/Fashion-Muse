import React from 'react';
import { useNavigate } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';

function HomePage() {
  const navigate = useNavigate();

  const features = [
    { title: "AI-Powered Chatbot", route: "/chat" },
    { title: "Virtual Muscat Assistant", route: "/virtual-assistant" },
    { title: "Customizable Avatar", route: "/avatar" },
    { title: "Photo Upload & Fit", route: "/photo-upload" },
    { title: "Seasonal Fashion Guides", route: "/seasonal-fashion" },
    { title: "Outfit & Cosmetics Matching", route: "/outfit-cosmetics" },
    { title: "Expert Tips & Articles", route: "/expert-tips" },
    { title: "Direct Shopping Links", route: "/direct-shopping" },
    { title: "Customizable Profiles", route: "/profile" },
  ];

  return (
    <div>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Welcome to Fashion Muse!</h2>
        <p>Select a feature below to explore:</p>
      </div>
      <div className="feature-grid">
        {features.map((feat) => (
          <FeatureCard
            key={feat.title}
            title={feat.title}
            onClick={() => navigate(feat.route)}
          />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
