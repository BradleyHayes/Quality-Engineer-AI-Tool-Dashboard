import React from 'react';
import { 
  File, Edit, AppWindow, Settings, HelpCircle, 
  LayoutDashboard, Box, Search, User, Bell
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (module: string) => void;
  currentModule: string;
}

export default function Layout({ children, onNavigate, currentModule }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen w-full bg-dashboard-bg overflow-hidden text-zinc-800">
      {/* Menu Bar */}
      <div className="h-8 bg-primary border-b border-primary/20 flex items-center px-4 text-xs select-none text-white font-medium">
        <div className="flex gap-4">
          <MenuButton label="File" items={['New Project', 'Open...', 'Save', 'Exit']} />
          <MenuButton label="Edit" items={['Undo', 'Redo', 'Cut', 'Copy', 'Paste']} />
          <MenuButton label="Window" items={['Minimize', 'Zoom', 'Full Screen']} />
          <MenuButton label="Settings" items={['Preferences', 'Themes', 'AI Config']} />
          <MenuButton label="Help" items={['Documentation', 'Check for Updates', 'About']} />
        </div>
        <div className="flex-1 flex justify-center font-display font-bold tracking-widest text-white">
          AURA AI DASHBOARD
        </div>
        <div className="flex items-center gap-3 opacity-80">
          <Bell size={14} />
          <User size={14} />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        {children}
      </main>

      {/* Status Bar */}
      <div className="h-6 bg-white border-t border-secondary/30 flex items-center px-4 text-[10px] text-zinc-400 uppercase tracking-tighter">
        <div className="flex gap-4">
          <span>System: Online</span>
          <span>AI Engine: Gemini 3.1 Pro</span>
          <span>Workspace: Personal</span>
        </div>
        <div className="flex-1" />
        <div className="flex gap-4">
          <button 
            onClick={() => onNavigate('dashboard')}
            className={cn(
              "hover:text-primary transition-colors flex items-center gap-1 font-bold",
              currentModule === 'dashboard' && "text-primary"
            )}
          >
            <LayoutDashboard size={10} /> Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuButton({ label, items }: { label: string; items: string[] }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative group" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button className="px-2 py-1 hover:bg-white/20 rounded transition-colors text-white">
        {label}
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 w-48 bg-white border border-secondary/30 shadow-2xl z-50 py-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {items.map((item) => (
            <button 
              key={item} 
              className="w-full text-left px-4 py-1.5 hover:bg-primary/10 hover:text-primary transition-colors text-zinc-700 text-xs"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
