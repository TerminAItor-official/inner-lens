import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext.jsx';
import LandingPage from './screens/LandingPage.jsx';
import JournalEntry from './screens/JournalEntry.jsx';
import RoutingTransition from './screens/RoutingTransition.jsx';
import PhilosopherReveal from './screens/PhilosopherReveal.jsx';
import AIReflection from './screens/AIReflection.jsx';
import CrisisIntervention from './screens/CrisisIntervention.jsx';
import JournalHistory from './screens/JournalHistory.jsx';
import PhilosopherProfile from './screens/PhilosopherProfile.jsx';
import InsightsScreen from './screens/InsightsScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import UpgradeScreen from './screens/UpgradeScreen.jsx';
import PrivacyScreen from './screens/PrivacyScreen.jsx';

function InnerApp() {
  const { setPhilosopher } = useTheme();

  const [screen, setScreen] = useState('landing');
  const [entry, setEntry] = useState('');
  const [routingResult, setRoutingResult] = useState(null);
  const [aiReflection, setAiReflection] = useState(null);
  const [aiReflectionLoading, setAiReflectionLoading] = useState(false);
  const [selectedPhilosopher, setSelectedPhilosopher] = useState(null);
  const [profileOrigin, setProfileOrigin] = useState('landing');
  const [upgradeOrigin, setUpgradeOrigin] = useState('landing');

  // Stub — wire to Supabase auth in Phase 2
  const isPaid = false;

  const goTo = useCallback((s) => setScreen(s), []);

  const handleUpgradeClick = useCallback(() => {
    setUpgradeOrigin(screen);
    goTo('upgrade');
  }, [screen, goTo]);

  // Target selector to scroll to after the next screen transition.
  // If null, default to top-of-page.
  const scrollTargetRef = useRef(null);

  useEffect(() => {
    const selector = scrollTargetRef.current;
    scrollTargetRef.current = null; // consume immediately

    if (selector) {
      const el = document.querySelector(selector);
      if (el) {
        el.scrollIntoView({ behavior: 'instant' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [screen]);

  const handleStartJournaling = useCallback(() => {
    setPhilosopher('brand');
    goTo('journal');
  }, [setPhilosopher, goTo]);

  const handlePhilosopherClick = useCallback((philosopher) => {
    setSelectedPhilosopher(philosopher);
    setProfileOrigin(screen);
    goTo('philosopher_profile');
  }, [goTo, screen]);

  const handleBeginWithPhilosopher = useCallback(() => {
    setPhilosopher('brand');
    setSelectedPhilosopher(null);
    goTo('journal');
  }, [setPhilosopher, goTo]);

  const handleBackFromProfile = useCallback(() => {
    setPhilosopher('brand');
    setSelectedPhilosopher(null);
    // Return to the philosopher grid, not the top of the page
    if (profileOrigin === 'landing') scrollTargetRef.current = '#thinkers';
    goTo(profileOrigin);
  }, [setPhilosopher, goTo, profileOrigin]);

  const handleLogoClick = useCallback(() => {
    setPhilosopher('brand');
    goTo('landing');
  }, [setPhilosopher, goTo]);

  const handleTabChange = useCallback((tab) => {
    const tabToScreen = {
      reflect:  'journal',
      library:  'history',
      insights: 'insights',
      profile:  'profile',
    };
    const target = tabToScreen[tab];
    if (target) goTo(target);
  }, [goTo]);

  const handleSubmitEntry = useCallback(async (entryText) => {
    setEntry(entryText);
    goTo('routing');

    try {
      const res = await fetch('/api/route-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry: entryText }),
      });
      const data = await res.json();

      if (data.crisis) {
        goTo('crisis');
      } else {
        setRoutingResult(data);
        setPhilosopher(data.philosopher);
        goTo('reveal');
      }
    } catch (err) {
      console.error('[route-entry]', err);
      goTo('journal');
    }
  }, [goTo, setPhilosopher]);

  const handleSaveReflection = useCallback(async (reflectionText) => {
    if (!isPaid) {
      // Free tier: acknowledge save, reset to journal
      setPhilosopher('brand');
      setRoutingResult(null);
      setEntry('');
      goTo('journal');
      return;
    }

    setAiReflectionLoading(true);
    goTo('ai_reflection');

    try {
      const res = await fetch('/api/generate-reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          philosopher: routingResult?.philosopher,
          philosopher_name: routingResult?.philosopher_data?.name,
          question: routingResult?.question_text,
          entry,
          reflection: reflectionText,
        }),
      });
      const data = await res.json();
      setAiReflection(data.reflection);
    } catch (err) {
      console.error('[generate-reflection]', err);
      setAiReflection(null);
    } finally {
      setAiReflectionLoading(false);
    }
  }, [isPaid, routingResult, entry, goTo, setPhilosopher]);

  const handleCloseSession = useCallback(() => {
    setPhilosopher('brand');
    setEntry('');
    setRoutingResult(null);
    setAiReflection(null);
    goTo('journal');
  }, [setPhilosopher, goTo]);

  const handleBackFromReveal = useCallback(() => {
    setPhilosopher('brand');
    setRoutingResult(null);
    goTo('journal');
  }, [setPhilosopher, goTo]);

  const screens = {
    landing: (
      <LandingPage
        onStartJournaling={handleStartJournaling}
        onPhilosopherClick={handlePhilosopherClick}
        onUpgradeClick={handleUpgradeClick}
      />
    ),
    philosopher_profile: selectedPhilosopher ? (
      <PhilosopherProfile
        philosopher={selectedPhilosopher}
        onBegin={handleBeginWithPhilosopher}
        onBack={handleBackFromProfile}
      />
    ) : null,
    journal: (
      <JournalEntry
        onSubmit={handleSubmitEntry}
        onHistoryClick={() => goTo('history')}
        isPaid={isPaid}
        onPhilosopherClick={handlePhilosopherClick}
        onTabChange={handleTabChange}
        onLogoClick={handleLogoClick}
        onUpgradeClick={handleUpgradeClick}
      />
    ),
    routing: <RoutingTransition />,
    reveal: routingResult ? (
      <PhilosopherReveal
        routingResult={routingResult}
        entry={entry}
        onSave={handleSaveReflection}
        onBack={handleBackFromReveal}
        isPaid={isPaid}
        onUpgradeClick={handleUpgradeClick}
      />
    ) : null,
    ai_reflection: (
      <AIReflection
        philosopherData={routingResult?.philosopher_data}
        reflection={aiReflection}
        loading={aiReflectionLoading}
        onClose={handleCloseSession}
      />
    ),
    crisis: <CrisisIntervention onReturn={() => goTo('journal')} />,
    history: (
      <JournalHistory
        onBack={() => goTo('journal')}
        onTabChange={handleTabChange}
      />
    ),
    insights: (
      <InsightsScreen
        isPaid={isPaid}
        onTabChange={handleTabChange}
        onUpgradeClick={handleUpgradeClick}
      />
    ),
    profile: (
      <ProfileScreen
        isPaid={isPaid}
        onTabChange={handleTabChange}
        onUpgradeClick={handleUpgradeClick}
        onPrivacyClick={() => goTo('privacy')}
        onLogoClick={handleLogoClick}
      />
    ),
    upgrade: <UpgradeScreen onBack={() => goTo(upgradeOrigin)} />,
    privacy: <PrivacyScreen onBack={() => goTo('profile')} />,
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}
    >
      {screens[screen] ?? screens.landing}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <InnerApp />
    </ThemeProvider>
  );
}
