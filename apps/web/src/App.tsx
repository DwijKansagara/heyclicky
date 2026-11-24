import React from 'react';
import { Navbar } from './components/Navbar';
import { DesktopHero } from './components/DesktopHero';
import { FeaturesSection } from './components/FeaturesSection';
import { FeedbackWall } from './components/FeedbackWall';
import { PricingSection } from './components/PricingSection';
import { TrustSection } from './components/TrustSection';
import { ChangelogSection } from './components/ChangelogSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#000000] flex flex-col font-sans selection:bg-[#6FB3F6]/30">
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
