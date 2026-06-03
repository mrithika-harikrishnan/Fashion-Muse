import React, { useEffect, useState } from "react";

function DirectShoppingPage() {
  const [links, setLinks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/shopping-links")
      .then((res) => res.json())
      .then((data) => setLinks(data))
      .catch((err) => {
        setError("Failed to load shopping links.");
        console.error("Fetch error:", err);
      });
  }, []);

  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-bold mb-3">Costume Shopping Links</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid gap-4 justify-center">
        {links.map((item, idx) => (
          <a
            key={idx}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white shadow-md p-3 rounded hover:underline text-blue-600"
          >
            {item.title}
          </a>
        ))}
      </div>
    </div>
  );
}

export default DirectShoppingPage;
