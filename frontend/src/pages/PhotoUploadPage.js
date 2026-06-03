import React, { useState } from 'react';

function PhotoUploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadImage = async () => {
    if (!selectedFile) {
      setResult("Please select a file first.");
      return;
    }

    setLoading(true);
    setResult("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("http://127.0.0.1:5000/photo-upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setLoading(false);

      if (data.error) {
        setResult(`Error: ${data.error}`);
      } else if (data.suggestions) {
        setResult(data.suggestions);
      } else {
        setResult("No suggestions returned.");
      }
    } catch (error) {
      setLoading(false);
      setResult("Error uploading or fetching suggestions.");
      console.error("Upload Error:", error);
    }
  };

  return (
    <div className="page-container">
      <h2>Photo Upload & Fit Suggestions</h2>
      <p>Upload an image to receive tailored outfit and cosmetic recommendations.</p>

      <div className="upload-area">
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          accept="image/*"
        />
        <button onClick={uploadImage} style={{ marginLeft: '10px' }}>
          Upload
        </button>
      </div>

      {loading && <p>Analyzing your photo, please wait...</p>}

      {result && (
        <div style={{ marginTop: '1rem', background: '#fff', padding: '1rem', borderRadius: '8px' }}>
          <h4>AI Suggestions:</h4>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

export default PhotoUploadPage;
