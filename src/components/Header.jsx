import React from 'react';

export default function Header({ historyCount = 0, onHistoryClick, onUpgradeClick, onLogoClick, isPaid = false }) {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#2F3A34] shadow-sm backdrop-blur-md">
      <div className="flex justify-between items-center px-6 py-4 w-full">
        <div
          className={`flex items-center gap-2 font-body text-[#F5F1EA] italic tracking-tight text-xl ${onLogoClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
          onClick={onLogoClick}
          role={onLogoClick ? 'button' : undefined}
          tabIndex={onLogoClick ? 0 : undefined}
          onKeyDown={onLogoClick ? (e) => e.key === 'Enter' && onLogoClick() : undefined}
        >
          <span className="material-symbols-outlined">psychology</span>
          Inner Lens
        </div>
        <div className="flex items-center gap-4">
          {onHistoryClick && (
            <button
              onClick={onHistoryClick}
              className="flex items-center gap-1.5 text-[#F5F1EA]/80 hover:text-[#F5F1EA] transition-colors px-3 py-1 rounded-full hover:bg-white/10"
            >
              <span className="material-symbols-outlined text-sm">menu_book</span>
              {historyCount > 0 && (
                <span className="font-label text-xs font-medium uppercase tracking-wider">
                  {historyCount}
                </span>
              )}
            </button>
          )}
          {!isPaid && onUpgradeClick && (
            <button
              onClick={onUpgradeClick}
              className="bg-[#C8A96A] text-[#2F3A34] px-4 py-1.5 rounded-lg font-label text-xs uppercase tracking-widest font-bold hover:brightness-110 transition-all"
            >
              ✨ Deep Lens
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
