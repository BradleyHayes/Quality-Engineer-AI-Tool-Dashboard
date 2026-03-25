import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight,
  Cpu,
  PenTool,
  Layers,
  Code2,
  Microscope,
  ExternalLink,
  FileText
} from 'lucide-react';
import { ModuleId } from '../types';

interface CarouselProps {
  onSelect: (id: ModuleId) => void;
}

const modules = [
  {
    id: 'ai-assistant' as ModuleId,
    title: 'AI Assistant',
    description: 'Chat, Code & Research',
    icon: Cpu,
    color: 'from-primary to-primary/80',
    tooltip: 'Advanced AI chat and coding assistant'
  },
  {
    id: 'ai-prompt-assist' as ModuleId,
    title: 'AI Prompt Assist',
    description: 'Build & Manage Prompts',
    icon: FileText,
    color: 'from-primary to-accent',
    tooltip: 'Create, save, and manage your AI prompts'
  },
  {
    id: 'task-organizer' as ModuleId,
    title: 'Task & Docs',
    description: 'Plan & Write',
    icon: PenTool,
    color: 'from-secondary to-secondary/80',
    tooltip: 'Organize your tasks and documentation'
  },
  {
    id: 'code-cleaner' as ModuleId,
    title: 'Code Cleaner Pro',
    description: 'AI Code Optimization',
    icon: Code2,
    color: 'from-accent to-accent/80',
    externalUrl: 'https://aistudio.google.com/apps/drive/1FIF0p7K9rWtUH3I5epx1ibN3SHoi6lQ9?showPreview=true&showAssistant=true',
    tooltip: 'Clean and optimize your code with AI'
  },
  {
    id: 'research-viz' as ModuleId,
    title: 'Research Visualization',
    description: 'Data & Labs',
    icon: Microscope,
    color: 'from-primary to-secondary',
    externalUrl: 'https://aistudio.google.com/apps/bundled/research_visualization?showPreview=true&showAssistant=true',
    tooltip: 'Visualize research data with Google Labs'
  },
  {
    id: 'project-hub' as ModuleId,
    title: 'Project Hub',
    description: 'Manage & Organize',
    icon: Layers,
    color: 'from-accent to-primary',
    tooltip: 'Central hub for all your projects'
  },
];

export default function Carousel({ onSelect }: CarouselProps) {
  const [index, setIndex] = React.useState(0);
  const visibleCount = 3;

  const next = () => {
    setIndex((prev) => (prev + 1) % modules.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + modules.length) % modules.length);
  };

  const getVisibleModules = () => {
    const items = [];
    for (let i = 0; i < visibleCount; i++) {
      items.push(modules[(index + i) % modules.length]);
    }
    return items;
  };

  const handleModuleClick = (module: typeof modules[0]) => {
    if (module.externalUrl) {
      window.open(module.externalUrl, '_blank');
    } else {
      onSelect(module.id);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-6xl mx-auto px-12">
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-display font-bold mb-4 tracking-tight text-zinc-800"
        >
          Welcome to <span className="text-primary">Aura</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-500 text-lg"
        >
          Select a module to begin your productivity session
        </motion.p>
      </div>

      <div className="relative w-full flex items-center justify-center gap-8">
        <button 
          onClick={prev}
          className="absolute left-0 z-10 p-4 rounded-full bg-white/50 hover:bg-white border border-secondary transition-all text-zinc-400 hover:text-primary shadow-sm"
        >
          <ChevronLeft size={32} />
        </button>

        <div className="flex gap-8 overflow-hidden py-12 px-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {getVisibleModules().map((module, i) => (
              <motion.button
                key={`${module.id}-${(index + i) % modules.length}`}
                layout
                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -50 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={() => handleModuleClick(module)}
                title={module.tooltip}
                className={`
                  group relative w-64 h-64 rounded-3xl overflow-hidden flex flex-col items-center justify-center gap-4
                  transition-all duration-500 hover:scale-105 hover:shadow-[0_0_50px_rgba(64,224,208,0.2)]
                  bg-white border border-secondary/50
                `}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                
                {/* Icon Container */}
                <div className="relative z-10 p-6 rounded-2xl bg-white border border-secondary/30 group-hover:border-primary group-hover:text-primary transition-all duration-500 shadow-sm">
                  <module.icon size={48} strokeWidth={1.5} />
                  {module.externalUrl && (
                    <div className="absolute -top-2 -right-2 p-1 bg-accent rounded-full text-white shadow-sm">
                      <ExternalLink size={12} />
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div className="relative z-10 text-center px-4">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors text-zinc-800">{module.title}</h3>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-medium">{module.description}</p>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/20 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        <button 
          onClick={next}
          className="absolute right-0 z-10 p-4 rounded-full bg-white/50 hover:bg-white border border-secondary transition-all text-zinc-400 hover:text-primary shadow-sm"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex gap-2 mt-12">
        {modules.map((_, i) => (
          <div 
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-8 bg-primary' : 'w-1.5 bg-zinc-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
