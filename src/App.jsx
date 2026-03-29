import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext.jsx';
import { onAuthChange, getUser } from './lib/auth.js';
import { supabase } from './lib/supabase.js';
import { saveJournalEntry, updateReflection } from './lib/journal.js';
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
import EnglishComingSoon from './screens/EnglishComingSoon.jsx';
import AuthScreen from './screens/AuthScreen.jsx';
import SavePromptScreen from './screens/SavePromptScreen.jsx';
import WelcomeModal, { hasBeenWelcomed, markWelcomed } from './components/WelcomeModal.jsx';
import questionsData from '../lib/questions.json';

const PENDING_ENTRY_KEY      = 'il_pending_entry';
const PENDING_MARKETING_KEY  = 'il_pending_marketing_opt_in';

/** Build a valid routingResult locally when /api/route-entry is unreachable. */
function buildLocalFallback() {
  const keys = Object.keys(questionsData.philosophers);
  const key = keys[Math.floor(Math.random() * keys.length)];
  const p = questionsData.philosophers[key];
  const q = p.questions[Math.floor(Math.random() * p.questions.length)];
  console.warn(
    '[route-entry] API unavailable — using local fallback. Philosopher:',
    key,
  );
  return {
    philosopher: key,
    confidence: 0.5,
    runner_up: null,
    reasoning: 'Local fallback: API not reachable.',
    question_id: q.id,
    question_text: q.text,
    philosopher_data: {
      name: p.name,
      emoji: p.emoji,
      tagline: p.tagline,
      colors: p.colors,
      intro: p.intro,
    },
  };
}

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
  const [autoStreakQuestion, setAutoStreakQuestion] = useState(false);
  const [user, setUser] = useState(null);
  const [authOrigin, setAuthOrigin] = useState('landing');
  const [currentEntryId, setCurrentEntryId] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);

  // Auth — any logged-in user is free tier for now; paid check added in Phase 2
  useEffect(() => {
    // Show welcome modal once for first-time visitors (wait a beat so landing renders first)
    if (!hasBeenWelcomed()) {
      setTimeout(() => setShowWelcome(true), 600);
    }

    getUser().then((u) => {
      setUser(u);
      // Restore pending entry if user just returned from magic-link auth
      if (u) {
        try {
          const raw = localStorage.getItem(PENDING_ENTRY_KEY);
          if (raw) {
            const { entryText, routingResult: pending } = JSON.parse(raw);
            localStorage.removeItem(PENDING_ENTRY_KEY);
            if (entryText && pending) {
              setEntry(entryText);
              setRoutingResult(pending);
              setPhilosopher(pending.philosopher);
              // Save to DB now that we have a user
              saveJournalEntry({
                userId:       u.id,
                entryText,
                philosopher:  pending.philosopher,
                questionText: pending.question_text,
              }).then(({ data: row, error }) => {
                if (error) console.error('[journal] pending save failed:', error.message);
                else { console.log('[journal] pending entry saved:', row.id); setCurrentEntryId(row.id); }
              });
              goTo('reveal');
            }
          }
        } catch (e) {
          console.warn('[auth] failed to restore pending entry:', e);
        }

        // Upsert marketing opt-in preference saved during signup
        const raw = localStorage.getItem(PENDING_MARKETING_KEY);
        if (raw !== null) {
          const optIn = JSON.parse(raw);
          localStorage.removeItem(PENDING_MARKETING_KEY);
          supabase
            .from('user_preferences')
            .upsert({ user_id: u.id, marketing_opt_in: optIn }, { onConflict: 'user_id' })
            .then(({ error }) => {
              if (error) console.error('[prefs] marketing opt-in save failed:', error.message);
              else console.log('[prefs] marketing opt-in saved:', optIn);
            });
        }
      }
    });
    return onAuthChange(setUser);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isPaid = false; // Phase 2: derive from user subscription status

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

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      if (data.crisis) {
        goTo('crisis');
      } else {
        setRoutingResult(data);
        setPhilosopher(data.philosopher);
        if (user) {
          // Signed in — save immediately and go straight to reveal
          saveJournalEntry({
            userId:       user.id,
            entryText,
            philosopher:  data.philosopher,
            questionText: data.question_text,
          }).then(({ data: row, error }) => {
            if (error) console.error('[journal] save failed:', error.message);
            else { console.log('[journal] entry saved:', row.id); setCurrentEntryId(row.id); }
          });
          goTo('reveal');
        } else {
          // Not signed in — pause to offer sign-in before reveal
          goTo('save_prompt');
        }
      }
    } catch (err) {
      console.warn('[route-entry] API call failed, falling back to local routing:', err.message);
      const fallback = buildLocalFallback();
      setRoutingResult(fallback);
      setPhilosopher(fallback.philosopher);
      if (user) {
        saveJournalEntry({
          userId:       user.id,
          entryText,
          philosopher:  fallback.philosopher,
          questionText: fallback.question_text,
        }).then(({ data: row, error }) => {
          if (error) console.error('[journal] save failed (fallback):', error.message);
          else { console.log('[journal] entry saved (fallback):', row.id); setCurrentEntryId(row.id); }
        });
        goTo('reveal');
      } else {
        goTo('save_prompt');
      }
    }
  }, [goTo, setPhilosopher, user]);

  const handleSaveReflection = useCallback(async (reflectionText) => {
    // Persist reflection regardless of tier (fire-and-forget)
    if (user && currentEntryId) {
      updateReflection(currentEntryId, reflectionText).then(({ error }) => {
        if (error) console.error('[journal] reflection update failed:', error.message);
        else console.log('[journal] reflection saved for entry:', currentEntryId);
      });
    }

    if (!isPaid) {
      // Free tier: acknowledge save, reset to journal
      setPhilosopher('brand');
      setRoutingResult(null);
      setEntry('');
      setCurrentEntryId(null);
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
  }, [isPaid, routingResult, entry, goTo, setPhilosopher, user, currentEntryId]);

  const handleCloseSession = useCallback(() => {
    setPhilosopher('brand');
    setEntry('');
    setRoutingResult(null);
    setAiReflection(null);
    setCurrentEntryId(null);
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
        onEnClick={() => goTo('en')}
        onProfileClick={() => goTo('profile')}
        onSignInClick={() => { setAuthOrigin('landing'); goTo('auth'); }}
        user={user}
      />
    ),
    save_prompt: (
      <SavePromptScreen
        routingResult={routingResult}
        onSignIn={() => {
          // Persist entry so it survives the magic-link redirect/reload
          try {
            localStorage.setItem(
              PENDING_ENTRY_KEY,
              JSON.stringify({ entryText: entry, routingResult }),
            );
          } catch (e) {
            console.warn('[auth] could not persist pending entry:', e);
          }
          setAuthOrigin('save_prompt');
          goTo('auth');
        }}
        onContinue={() => goTo('reveal')}
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
        autoStreakQuestion={autoStreakQuestion}
        onAutoStreakQuestionConsumed={() => setAutoStreakQuestion(false)}
        user={user}
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
        user={user}
      />
    ),
    insights: (
      <InsightsScreen
        isPaid={isPaid}
        onTabChange={handleTabChange}
        onUpgradeClick={handleUpgradeClick}
        onLogoClick={handleLogoClick}
        user={user}
      />
    ),
    profile: (
      <ProfileScreen
        isPaid={isPaid}
        onTabChange={handleTabChange}
        onUpgradeClick={handleUpgradeClick}
        onPrivacyClick={() => goTo('privacy')}
        onLogoClick={handleLogoClick}
        onStreakQuestion={() => { setAutoStreakQuestion(true); goTo('journal'); }}
        onSignIn={() => { setAuthOrigin('profile'); goTo('auth'); }}
        user={user}
      />
    ),
    upgrade: <UpgradeScreen onBack={() => goTo(upgradeOrigin)} />,
    privacy: <PrivacyScreen onBack={() => goTo('profile')} />,
    en: <EnglishComingSoon onBack={() => goTo('landing')} />,
    auth: <AuthScreen onBack={() => goTo(authOrigin)} />,
  };

  const handleWelcomeSignIn = useCallback(() => {
    markWelcomed();
    setShowWelcome(false);
    setAuthOrigin('landing');
    goTo('auth');
  }, [goTo]);

  const handleWelcomeDismiss = useCallback(() => {
    markWelcomed();
    setShowWelcome(false);
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}
    >
      {screens[screen] ?? screens.landing}
      <WelcomeModal
        visible={showWelcome}
        onSignIn={handleWelcomeSignIn}
        onDismiss={handleWelcomeDismiss}
      />
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
