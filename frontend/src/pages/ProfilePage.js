import React, { useState } from 'react';

function UserProfilePage() {
  const [step, setStep] = useState(1);

  // All profile fields
  const [userId, setUserId] = useState("demoUser123");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [bodySize, setBodySize] = useState("");
  const [skinTone, setSkinTone] = useState("");
  const [styleGoals, setStyleGoals] = useState("");
  const [preferredColors, setPreferredColors] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [aiAdvice, setAiAdvice] = useState("");

  // Move to next step
  const nextStep = () => {
    setError("");
    setStep(step + 1);
  };

  // Move to previous step
  const prevStep = () => {
    setError("");
    setStep(step - 1);
  };

  // Save profile to backend
  const saveProfile = async () => {
    setError("");
    setMessage("");
    setAiAdvice("");

    const profileData = {
      userId,
      name,
      gender,
      bodySize,
      skinTone,
      styleGoals,
      preferredColors,
      height: parseInt(height) || 0,
      weight: parseInt(weight) || 0
    };

    try {
      const res = await fetch("http://127.0.0.1:3000/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setMessage("Profile saved successfully!");
      }
    } catch (err) {
      setError("Failed to save profile. Check console for details.");
      console.error(err);
    }
  };

  // Call AI advice
  const getAiAdvice = async () => {
    setError("");
    setAiAdvice("");

    try {
      const res = await fetch("http://127.0.0.1:5000/profile/ai-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else if (data.personalizedAdvice) {
        setAiAdvice(data.personalizedAdvice);
      } else {
        setError("No advice returned from AI.");
      }
    } catch (err) {
      setError("Failed to fetch AI advice. Check console.");
      console.error(err);
    }
  };

  // Render steps
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="profile-step">
            <h3>Step 1: Basic Info</h3>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
            <label>Gender:</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="non-binary">Non-binary</option>
            </select>
            <div style={{ marginTop: '1rem' }}>
              <button onClick={nextStep}>Next</button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="profile-step">
            <h3>Step 2: Body & Skin</h3>
            <label>Body Size (S, M, L, etc.):</label>
            <input
              type="text"
              value={bodySize}
              onChange={(e) => setBodySize(e.target.value)}
              placeholder="e.g. M"
            />
            <label>Skin Tone:</label>
            <select value={skinTone} onChange={(e) => setSkinTone(e.target.value)}>
              <option value="">Select</option>
              <option value="fair">Fair</option>
              <option value="medium">Medium</option>
              <option value="deep">Deep</option>
            </select>
            <label>Height (cm):</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
            <label>Weight (kg):</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <div style={{ marginTop: '1rem' }}>
              <button onClick={prevStep} style={{ marginRight: '0.5rem' }}>Back</button>
              <button onClick={nextStep}>Next</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="profile-step">
            <h3>Step 3: Style Goals</h3>
            <label>Style Goals (e.g. casual, sporty, chic):</label>
            <input
              type="text"
              value={styleGoals}
              onChange={(e) => setStyleGoals(e.target.value)}
              placeholder="casual, comfortable, etc."
            />
            <label>Preferred Colors:</label>
            <input
              type="text"
              value={preferredColors}
              onChange={(e) => setPreferredColors(e.target.value)}
              placeholder="pastels, neutrals, bold"
            />
            <div style={{ marginTop: '1rem' }}>
              <button onClick={prevStep} style={{ marginRight: '0.5rem' }}>Back</button>
              <button onClick={nextStep}>Next</button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="profile-step">
            <h3>Step 4: Review & Save</h3>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Gender:</strong> {gender}</p>
            <p><strong>Body Size:</strong> {bodySize}</p>
            <p><strong>Skin Tone:</strong> {skinTone}</p>
            <p><strong>Height:</strong> {height} cm</p>
            <p><strong>Weight:</strong> {weight} kg</p>
            <p><strong>Style Goals:</strong> {styleGoals}</p>
            <p><strong>Preferred Colors:</strong> {preferredColors}</p>

            <div style={{ marginTop: '1rem' }}>
              <button onClick={prevStep} style={{ marginRight: '0.5rem' }}>Back</button>
              <button onClick={saveProfile}>Save Profile</button>
            </div>
          </div>
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="page-container">
      <h2>Customizable Profiles</h2>
      <p>Personal user preferences, sizes, style goals for personalized advice.</p>
      <div className="profile-wizard">
        {renderStep()}
      </div>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      {/* Button to get AI Advice after saving profile */}
      <div style={{ marginTop: '1rem' }}>
        <button onClick={getAiAdvice}>Get AI Fashion Advice</button>
      </div>
      {aiAdvice && (
        <div className="ai-advice-box">
          <h4>AI Advice:</h4>
          <p>{aiAdvice}</p>
        </div>
      )}
    </div>
  );
}

export default UserProfilePage;
