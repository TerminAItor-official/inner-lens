import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header.jsx';
import BottomNav from '../components/BottomNav.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const PHILOSOPHER_ORDER = ['freud', 'anna_freud', 'winnicott', 'jung', 'klein', 'lacan'];

const PHILOSOPHER_LABELS = {
  freud:      'Freud',
  anna_freud: 'Anna Freud',
  winnicott:  'Winnicott',
  jung:       'Jung',
  klein:      'Klein',
  lacan:      'Lacan',
};

export default function PhilosopherReveal({ routingResult, entry, onSave, onBack, isPaid }) {
  const { philosopher: activePhilosopher } = useTheme();
  const [reflection, setReflection] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { philosopher_data, question_text } = routingResult;

  const handleSave = async () => {
    if (!reflection.trim() || saving) return;
    setSaving(true);
    await onSave(reflection.trim());
    setSaved(true);
    setSaving(false);
  };

  const otherPhilosophers = PHILOSOPHER_ORDER.filter(k => k !== routingResult.philosopher);

  return (
    <motion.div
      className="min-h-screen pb-32 font-body"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Header isPaid={isPaid} />

      <main className="pt-24 px-6 max-w-2xl mx-auto space-y-8">

        {/* Philosopher card */}
        <section>
          <div
            className="rounded-[18px] p-6 shadow-sm"
            style={{ backgroundColor: 'var(--bg)', border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{philosopher_data.emoji}</span>
              <h1
                className="text-2xl font-bold tracking-tight font-headline"
                style={{ color: 'var(--text-primary)' }}
              >
                {philosopher_data.name}
              </h1>
            </div>
            <p className="text-sm italic opacity-60 mb-1 font-body">{philosopher_data.tagline}</p>
            <p className="text-base leading-relaxed mb-6 opacity-90 font-body">{philosopher_data.intro}</p>
            <blockquote
              className="pl-5 py-2 italic text-xl leading-snug font-body"
              style={{ borderLeft: `3px solid var(--accent)`, color: 'var(--text-primary)' }}
            >
              "{question_text}"
            </blockquote>
          </div>

          {/* Original entry */}
          <div
            className="mt-4 rounded-xl p-4"
            style={{ backgroundColor: 'rgba(255,255,255,0.5)', border: '1px solid color-mix(in srgb, var(--accent) 10%, transparent)' }}
          >
            <h3
              className="font-label text-[10px] uppercase tracking-[0.15em] mb-2 opacity-60"
              style={{ color: 'var(--text-primary)' }}
            >
              Your entry
            </h3>
            <p className="text-sm italic opacity-80 line-clamp-3 font-body leading-relaxed">
              "{entry}"
            </p>
          </div>
        </section>

        {/* Reflection textarea */}
        <section className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label
              className="font-label text-xs font-semibold tracking-wide opacity-70"
              style={{ color: 'var(--text-primary)' }}
            >
              Your reflection
            </label>
            {!isPaid && (
              <span className="text-[#C8A96A] font-label text-[11px] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                Upgrade to Deep Lens for AI insight
              </span>
            )}
          </div>
          <textarea
            className="w-full rounded-xl p-5 text-lg italic font-body leading-relaxed resize-none min-h-[140px] border-none focus:ring-1"
            style={{
              backgroundColor: 'rgba(255,255,255,0.4)',
              focusRingColor: 'var(--accent)',
            }}
            placeholder="Sit with the question. Write whatever comes..."
            value={reflection}
            onChange={e => setReflection(e.target.value)}
          />
        </section>

        {/* Lens switcher */}
        <section className="space-y-3 pt-2">
          <h4
            className="font-label text-[10px] uppercase tracking-[0.2em] text-center opacity-50"
            style={{ color: 'var(--text-primary)' }}
          >
            See this through a different lens:
          </h4>
          <div className="flex flex-wrap justify-center gap-2">
            {otherPhilosophers.map(key => (
              <button
                key={key}
                className="px-4 py-1.5 rounded-full font-label text-[11px] font-medium transition-all opacity-60 cursor-not-allowed"
                style={{ border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)', color: 'var(--text-primary)' }}
                title="Coming soon"
                disabled
              >
                {PHILOSOPHER_LABELS[key]}
              </button>
            ))}
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 pb-12">
          <button
            onClick={onBack}
            className="flex-1 py-4 rounded-xl font-label text-sm font-semibold tracking-wide transition-colors"
            style={{ border: '1px solid var(--accent)', color: 'var(--accent)' }}
          >
            ← Back
          </button>
          <button
            onClick={handleSave}
            disabled={!reflection.trim() || saving || saved}
            className="flex-[2] py-4 rounded-xl font-label text-sm font-semibold tracking-wide shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#2F3A34', color: '#F5F1EA' }}
          >
            {saved
              ? <>Saved <span className="material-symbols-outlined text-sm">check</span></>
              : saving
              ? 'Saving...'
              : isPaid
              ? <>Get AI Reflection <span className="material-symbols-outlined text-sm">auto_awesome</span></>
              : <>Save to journal <span className="material-symbols-outlined text-sm">check</span></>
            }
          </button>
        </div>
      </main>

      <BottomNav activeTab="reflect" onTabChange={() => {}} />
    </motion.div>
  );
}
