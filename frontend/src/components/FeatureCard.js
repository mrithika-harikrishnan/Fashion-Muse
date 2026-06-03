import React from 'react';

function FeatureCard({ title, icon, onClick }) {
  return (
    <div className="feature-card" onClick={onClick}>
      {icon && <img src={icon} alt="icon" />}
      <h2>{title}</h2>
    </div>
  );
}

export default FeatureCard;
