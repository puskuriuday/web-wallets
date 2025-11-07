import React, { useState } from 'react';

interface NotificationModalProps {
  title: string;
  message: string;
  details?: string;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ title, message, details, onClose }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed inset-0 z-[300] bg-black/55 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="w-full max-w-[520px] rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-slate-100 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-sky-500/15 to-transparent" />
        <div className="p-7 relative">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="px-2 py-1 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              Close
            </button>
          </div>
          <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap">
            {message}
          </p>
          {details && (
            <div className="mt-5">
              <button
                onClick={() => setExpanded(e => !e)}
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800/60 border border-white/10 hover:bg-slate-800/80 transition-colors"
              >
                {expanded ? 'Hide Details' : 'Show Details'}
              </button>
              {expanded && (
                <pre className="mt-3 max-h-[240px] overflow-auto text-[11px] leading-relaxed bg-slate-950/70 border border-white/10 rounded-lg p-3 font-mono whitespace-pre-wrap">
{details}
                </pre>
              )}
              <button
                onClick={() => { navigator.clipboard.writeText(details); }}
                className="mt-3 text-xs text-sky-400 hover:text-sky-300 underline"
              >
                Copy Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
