import React from 'react';

export default function RoutingTransition() {
  return (
    <div
      className="relative h-screen w-screen flex flex-col items-center justify-center overflow-hidden font-body"
      style={{ backgroundColor: '#F5F1EA' }}
    >
      {/* Fixed header — no nav (Destination Rule) */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#2F3A34]">
        <div className="flex items-center gap-2 font-body text-[#F5F1EA] italic tracking-tight text-xl">
          <span className="material-symbols-outlined">psychology</span>
          Inner Lens
        </div>
      </header>

      {/* Organic pulse */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="pulse-circle w-[360px] h-[360px] md:w-[560px] md:h-[560px] rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-8">
        <div className="mb-12 text-[#536252] opacity-40">
          <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'wght' 200" }}>
            auto_awesome
          </span>
        </div>
        <div className="h-16 relative flex items-center justify-center">
          <h2 className="message-1 absolute text-2xl md:text-3xl font-body italic text-[#6b7b6a] tracking-tight leading-relaxed">
            Reading between your lines...
          </h2>
          <h2 className="message-2 absolute text-2xl md:text-3xl font-body italic text-[#6b7b6a] tracking-tight leading-relaxed">
            Finding the right lens...
          </h2>
          <h2 className="message-3 absolute text-2xl md:text-3xl font-body italic text-[#6b7b6a] tracking-tight leading-relaxed">
            Someone has a question for you...
          </h2>
        </div>
        <p className="mt-12 font-label text-[11px] uppercase tracking-[0.2em] text-[#4A4541]/50">
          Curating your clinical synthesis
        </p>
      </div>

      {/* Vertical line */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-[#536252]/20 to-transparent" />

      <footer className="fixed bottom-0 w-full py-8 text-center pointer-events-none">
        <p className="font-body italic text-sm text-[#4A4541]/40">Mom Words Matter™</p>
      </footer>
    </div>
  );
}
