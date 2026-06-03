import React, { useState } from 'react';

function OutfitCosmeticsPage() {
  const [style, setStyle] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [occasion, setOccasion] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getRecommendations = async () => {
    setError("");
    setRecommendations("");

    // Validate user input
    if (!style && !bodyType && !occasion) {
      setError("Please provide at least one detail (style, body type, or occasion).");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/outfit-cosmetics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ style, bodyType, occasion })
      });
      const data = await res.json();
      setLoading(false);

      if (data.error) {
        setError(`Error: ${data.error}`);
      } else if (data.recommendations) {
        setRecommendations(data.recommendations);
      } else {
        setError("No recommendations returned from AI.");
      }
    } catch (err) {
      setLoading(false);
      setError("Failed to fetch recommendations. Check console for details.");
      console.error("Outfit & Cosmetics error:", err);
    }
  };

  return (
    <div className="page-container">
      <h2>Outfit & Cosmetics Matching</h2>
      <p>Enter your style preferences, body type, and occasion to get complete looks with clothing, accessories, and makeup.</p>

      <div style={{ margin: '1rem 0' }}>
        <label style={{ display: 'block', marginBottom: '0.3rem' }}>Style Preference:</label>
        <input
          type="text"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          placeholder="e.g. casual, chic, bohemian"
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <div style={{ margin: '1rem 0' }}>
        <label style={{ display: 'block', marginBottom: '0.3rem' }}>Body Type:</label>
        <input
          type="text"
          value={bodyType}
          onChange={(e) => setBodyType(e.target.value)}
          placeholder="e.g. slender, curvy, athletic"
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <div style={{ margin: '1rem 0' }}>
        <label style={{ display: 'block', marginBottom: '0.3rem' }}>Occasion:</label>
        <input
          type="text"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
          placeholder="e.g. wedding, office, party"
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <button onClick={getRecommendations} style={{ marginTop: '1rem', padding: '0.6rem 1rem' }}>
        Get Recommendations
      </button>

      {loading && <p>Loading AI suggestions...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {recommendations && (
        <div style={{ marginTop: '1rem', background: '#fff', padding: '1rem', borderRadius: '8px' }}>
          <h4>AI Recommendations:</h4>
          <p>{recommendations}</p>
        </div>
      )}
    </div>
  );
}

export default OutfitCosmeticsPage;
