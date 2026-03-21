import React from 'react';

const tabs = [
  { id: 'reflect',  icon: 'self_improvement', label: 'Reflect' },
  { id: 'library',  icon: 'local_library',    label: 'Library' },
  { id: 'insights', icon: 'auto_awesome',     label: 'Insights' },
  { id: 'profile',  icon: 'person',           label: 'Profile' },
];

export default function BottomNav({ activeTab = 'reflect', onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 backdrop-blur-xl bg-[#FDF9F2]/85 shadow-[0_-4px_20px_rgba(74,69,65,0.08)] z-50 rounded-t-xl">
      {tabs.map(({ id, icon, label }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange?.(id)}
            className={`flex flex-col items-center justify-center transition-colors ${
              active
                ? 'text-[#536252] font-bold bg-[#F1EDE6] rounded-full px-4 py-1'
                : 'text-[#4A4541]/60 hover:text-[#2F3A34]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
            <span className="font-label text-[11px] uppercase tracking-widest mt-1">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
