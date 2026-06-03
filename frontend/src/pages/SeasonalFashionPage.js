import React, { useState } from 'react';

function SeasonalFashionPage() {
  const [season, setSeason] = useState("");
  const [preferences, setPreferences] = useState("");
  const [guide, setGuide] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSeasonSelect = (chosenSeason) => {
    setSeason(chosenSeason);
  };

  const fetchGuide = async () => {
    if (!season) {
      setError("Please select a season first.");
      return;
    }
    setError("");
    setGuide("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/seasonal-guides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ season, preferences })
      });
      const data = await res.json();
      setLoading(false);

      if (data.error) {
        setError(`Error: ${data.error}`);
      } else if (data.guide) {
        setGuide(data.guide);
      } else {
        setError("No guide returned from AI.");
      }
    } catch (err) {
      setLoading(false);
      setError("Failed to fetch guide. Check console for details.");
      console.error("Seasonal guides error:", err);
    }
  };

  return (
    <div className="page-container">
      <h2>Seasonal Fashion Guides</h2>
      <p>Select a season and optionally provide your style preferences. Then click "Get Guide".</p>

      <div style={{ margin: '1rem 0' }}>
        <label style={{ marginRight: '0.5rem' }}>Season:</label>
        <button onClick={() => handleSeasonSelect("summer")} style={{ marginRight: '0.5rem' }}>Summer</button>
        <button onClick={() => handleSeasonSelect("winter")} style={{ marginRight: '0.5rem' }}>Winter</button>
        <button onClick={() => handleSeasonSelect("rainy")} style={{ marginRight: '0.5rem' }}>Rainy</button>
      </div>

      <p>Selected season: <strong>{season || "(none)"}</strong></p>

      <div style={{ margin: '1rem 0' }}>
        <label>Preferences:</label>
        <textarea
          style={{ display: 'block', width: '100%', marginTop: '0.5rem' }}
          rows={3}
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          placeholder="e.g. I prefer bright colors, I like casual dresses, etc."
        />
      </div>

      <button onClick={fetchGuide}>Get Guide</button>

      {loading && <p>Loading AI suggestions...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {guide && (
        <div style={{ marginTop: '1rem', background: '#fff', padding: '1rem', borderRadius: '8px' }}>
          <h4>AI Seasonal Guide:</h4>
          <p>{guide}</p>
        </div>
      )}
    </div>
  );
}

export default SeasonalFashionPage;

