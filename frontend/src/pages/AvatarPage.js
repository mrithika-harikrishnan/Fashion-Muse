import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./AvatarPage.js";
AvatarPage.propTypes = {
  scrollToHome: PropTypes.func.isRequired
};

function AvatarPage({ scrollToHome }) {
  const iframeRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    window.addEventListener("message", (event) => {
      if (event.origin === "https://readyplayer.me") {
        const { type, data } = event.data;
        if (type === "avatar:created") {
          setAvatarUrl(data.url); // This stores the avatar URL
          console.log("Avatar Created:", data.url);
        }
      }
    });
  }, []);

  return (
    <div className="avatar-page">
      <h2>Create Your 3D Avatar</h2>

      {!avatarUrl ? (
        <iframe
          ref={iframeRef}
          title="Ready Player Me Avatar Creator"
          src="https://readyplayer.me/avatar?frameApi"
          style={{ width: "100%", height: "600px", border: "none" }}
          allow="camera *; microphone *"
        />
      ) : (
        <div>
          <h3>Your Avatar is Ready!</h3>
          <img src={avatarUrl} alt="3D Avatar" style={{ width: "200px", borderRadius: "50%" }}/>
          <p>
            Copy your avatar URL: <span>{avatarUrl}</span>
          </p>
          <button className="exit-avatar" onClick={scrollToHome}>
            Exit
          </button>
        </div>
      )}
    </div>
  );
}

AvatarPage.propTypes = {
  scrollToHome: PropTypes.func.isRequired,
};

export default AvatarPage;
