import React from 'react';
import Navbar from './components/Navbar.js';
import DesktopHero from './components/DesktopHero.js';
import FeaturesSection from './components/FeaturesSection.js';
import FeedbackWall from './components/FeedbackWall.js';
import PricingSection from './components/PricingSection.js';
import TrustSection from './components/TrustSection.js';
import ChangelogSection from './components/ChangelogSection.js';
import FAQSection from './components/FAQSection.js';
import Footer from './components/Footer.js';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <DesktopHero />
        <FeaturesSection />
        <FeedbackWall />
        <PricingSection />
        <TrustSection />
        <ChangelogSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
