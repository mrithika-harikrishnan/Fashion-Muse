import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';
import './styles.css';
import ChatbotPage from './pages/ChatBotPage';
import VirtualMuscat from './pages/VirtualMuscat'; 
import AvatarPage from './pages/AvatarPage'; // Import the avatar page
import PhotoUploadPage from './pages/PhotoUploadPage'
import SeasonalFashionPage from './pages/SeasonalFashionPage';
import OutfitCosmeticsPage from './pages/OutfitCosmeticsPage';
import ExpertTipsPage from './pages/ExpertTipsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DirectShoppingPage from './pages/DirectShoppingPage';


// Placeholder pages for each feature

function DirectShopping() {
  return <div className="page-container"><h2>Direct Shopping Links</h2><p>Affiliate store integration coming soon!</p></div>;
}
function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <FeaturesSection />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* HOME ROUTE */}
        <Route path="/" element={<HomePage />} />

        {/* 9 FEATURE ROUTES */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/ai-chatbot" element={<ChatbotPage />} />
        <Route path="/virtual-muscat" element={<VirtualMuscat />} />
        <Route path="/custom-avatar" element={<AvatarPage />} />
        <Route path="/photo-upload" element={<PhotoUploadPage />} />
        <Route path="/seasonal-guides" element={<SeasonalFashionPage />} />
        <Route path="/outfit-cosmetics" element={<OutfitCosmeticsPage />} />
        <Route path="/expert-tips" element={<ExpertTipsPage />} />
        <Route path="/direct-shopping" element={<DirectShoppingPage />} />
        <Route path="/profiles" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
