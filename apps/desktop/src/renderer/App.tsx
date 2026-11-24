import React, { useEffect, useState } from 'react';
import FloatingIsland from './FloatingIsland.js';
import CursorCompanion from './CursorCompanion.js';
import CanvasDrawingOverlay from './CanvasDrawingOverlay.js';
import SidebarWindow from './SidebarWindow.js';
import SettingsView from './SettingsView.js';
import OnboardingTour from './OnboardingTour.js';

export default function App() {
  const [hash, setHash] = useState(window.location.hash || '#island');

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || '#island');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (hash.startsWith('#overlay')) {
    return (
      <div className="relative w-screen h-screen overflow-hidden pointer-events-none">
        <CanvasDrawingOverlay />
        <CursorCompanion />
      </div>
    );
  }

  if (hash.startsWith('#sidebar')) {
    const urlParams = new URLSearchParams(hash.split('?')[1] || '');
    const tab = urlParams.get('tab') || 'chat';
    if (tab === 'onboarding') {
      return <OnboardingTour onFinish={() => (window.location.hash = '#sidebar?tab=chat')} />;
    }
    return <SidebarWindow initialTab={tab} />;
  }

  // Default: Floating Island
  return <FloatingIsland />;
}
