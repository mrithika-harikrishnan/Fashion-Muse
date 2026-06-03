import React, { useState } from 'react';

function ExpertTipsPage() {
  const [topic, setTopic] = useState("");
  const [article, setArticle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getExpertTips = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic or question first.");
      return;
    }
    setError("");
    setArticle("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/expert-tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      setLoading(false);

      if (data.error) {
        setError(`Error: ${data.error}`);
      } else if (data.article) {
        setArticle(data.article);
      } else {
        setError("No article returned from AI.");
      }
    } catch (err) {
      setLoading(false);
      setError("Failed to fetch article. Check console for details.");
      console.error("Expert tips error:", err);
    }
  };

  return (
    <div className="page-container">
      <h2>Expert Tips & Articles</h2>
      <p>Ask a seasoned fashion professional about pairing outfits and cosmetics.</p>

      <div className="expert-form">
        <label>Topic or Question:</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Pairing bold lipstick with evening wear"
        />
        <button onClick={getExpertTips}>Get Tips</button>
      </div>

      {loading && <p>Loading expert advice...</p>}
      {error && <p className="error-message">{error}</p>}
      {article && (
        <div className="expert-article">
          <h4>Expert Advice:</h4>
          <p>{article}</p>
        </div>
      )}
    </div>
  );
}

export default ExpertTipsPage;
