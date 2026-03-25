import React from 'react';
import { Rocket, Sparkles } from 'lucide-react';

export default function ComingSoon() {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-dashboard-bg p-12 text-center text-zinc-800">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
        <div className="relative p-8 rounded-full bg-white border border-secondary/30 shadow-sm">
          <Rocket size={64} className="text-primary animate-bounce" />
        </div>
      </div>
      
      <h1 className="text-5xl font-display font-bold mb-4 tracking-tight">
        Coming <span className="text-primary">Soon</span>
      </h1>
      
      <div className="max-w-md space-y-4">
        <p className="text-zinc-500 text-lg">
          This module is currently under development as part of the Aura AI ecosystem.
        </p>
        <div className="flex items-center justify-center gap-2 text-primary/60 text-sm font-bold uppercase tracking-widest">
          <Sparkles size={16} />
          <span>Future AI Tool Module</span>
          <Sparkles size={16} />
        </div>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-4 w-full max-w-lg">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-1 bg-zinc-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary/40 w-1/3 animate-progress" style={{ animationDelay: `${i * 0.2}s` }} />
          </div>
        ))}
      </div>
    </div>
  );
}
