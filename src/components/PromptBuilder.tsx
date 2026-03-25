import React from 'react';
import { Save, Trash2, FileText, Plus, Copy, Send, Mic, MicOff, ChevronDown, Check } from 'lucide-react';
import { useVoiceTranscription } from '../hooks/useVoiceTranscription';

interface PromptBuilderProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSendToChat?: (prompt: string) => void;
  fullScreen?: boolean;
}

const CATEGORIES = {
  'Basic Query': [
    'Short Clarification', 'Step-by-Step Explanation', 'Summarize for a 5-year-old', 
    'Pros/Cons List', 'Fact Check', 'Definition & Context', 'Analogy Creator', 
    'Bullet Point Summary', 'Key Takeaways', 'Counter-Argument', 'Statistical Overview', 'Actionable Steps'
  ],
  'Code Review': [
    'Security Audit', 'Efficiency Optimization', 'Bug Hunter', 'Documentation Generator', 
    'Refactor for Readability', 'Unit Test Creator', 'Logic Validator', 'Tech Stack Suggestion', 
    'Performance Bottleneck Check', 'Error Handling Review', 'Legacy Code Modernizer', 'API Mapping'
  ],
  'System Persona': [
    'Socratic Tutor', 'Harsh Critic', 'Encaging Coach', 'Minimalist Assistant', 
    'Detailed Strategist', 'Ethical Hacker', 'Creative Visionary', 'Data Scientist', 
    'Legal Advisor', 'Historical Expert', 'Technical Writer', 'UX Researcher'
  ],
  'Creative Writing': [
    'Hero\'s Journey Plot', 'Sensory Description', 'Dialogue Polisher', 'World-Building Detail', 
    'Character Flaw Generator', 'Poetry Converter', 'Narrative Hook', 'Cliffhanger Ending', 
    'Tone Shifter', 'Metaphor Maker', 'Flash Fiction Starter', 'Script Formatter'
  ],
  'Roles': [
    'AI Prompt Engineer', 'Senior DevOps', 'Content Marketing Lead', 'Agile Scrum Master', 
    'Financial Analyst', 'Full-Stack Architect', 'Product Manager', 'Cybersecurity Lead', 
    'Data Engineer', 'UI Designer', 'Business Consultant', 'Research Scientist'
  ]
};

export default function PromptBuilder({ prompt, setPrompt, onSendToChat, fullScreen = false }: PromptBuilderProps) {
  const [history, setHistory] = React.useState<{ name: string; content: string }[]>(() => {
    const saved = localStorage.getItem('prompt_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [saveName, setSaveName] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const { isListening, transcript, startListening, stopListening, setTranscript } = useVoiceTranscription();

  React.useEffect(() => {
    localStorage.setItem('prompt_history', JSON.stringify(history));
  }, [history]);

  React.useEffect(() => {
    if (transcript) {
      setPrompt(prompt ? `${prompt}\n${transcript}` : transcript);
      setTranscript('');
    }
  }, [transcript, prompt, setPrompt, setTranscript]);

  const handleSave = () => {
    if (!saveName.trim() || !prompt.trim()) return;
    setHistory(prev => [...prev, { name: saveName, content: prompt }]);
    setSaveName('');
  };

  const handleDelete = (index: number) => {
    setHistory(prev => prev.filter((_, i) => i !== index));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
  };

  const appendPrompt = (text: string) => {
    const newPrompt = prompt ? `${prompt}\n\n[${text}]` : `[${text}]`;
    setPrompt(newPrompt);
    setActiveCategory(null);
  };

  return (
    <div className={`flex flex-col h-full ${fullScreen ? 'p-8 max-w-5xl mx-auto' : 'p-4'} space-y-6 bg-white/50`}>
      <div className="flex items-center justify-between">
        <h2 className={`font-bold text-zinc-800 ${fullScreen ? 'text-3xl' : 'text-lg'}`}>
          AI Prompt Builder
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={isListening ? stopListening : startListening}
            className={`p-2 rounded-lg transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-zinc-200 text-zinc-500'}`}
            title={isListening ? "Stop Listening" : "Voice Transcription"}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <button 
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-zinc-200 text-zinc-500 transition-colors"
            title="Copy to Clipboard"
          >
            <Copy size={18} />
          </button>
          {onSendToChat && (
            <button 
              onClick={() => onSendToChat(prompt)}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl hover:bg-accent/80 transition-all shadow-md text-sm font-bold"
            >
              <Send size={16} />
              {fullScreen ? 'Send to AI Assistant' : 'Send'}
            </button>
          )}
        </div>
      </div>

      {/* Categories Dropdowns */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Template Categories</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORIES).map(([cat, items]) => (
            <div key={cat} className="relative">
              <button
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-xs font-bold
                  ${activeCategory === cat 
                    ? 'bg-primary text-white border-primary shadow-md' 
                    : 'bg-white border-secondary/30 text-zinc-600 hover:border-primary hover:text-primary shadow-sm'}
                `}
              >
                {cat} <ChevronDown size={14} className={`transition-transform ${activeCategory === cat ? 'rotate-180' : ''}`} />
              </button>
              
              {activeCategory === cat && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-secondary/30 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                  <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary/30">
                    {items.map((item) => (
                      <button
                        key={item}
                        onClick={() => appendPrompt(item)}
                        className="w-full text-left px-4 py-2 text-xs text-zinc-600 hover:bg-primary/10 hover:text-primary transition-colors flex items-center justify-between group"
                      >
                        {item}
                        <Plus size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Builder Area */}
      <div className="flex-1 flex flex-col space-y-2">
        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Prompt Editor</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Construct your prompt here..."
          className="flex-1 w-full bg-white border border-secondary/50 rounded-2xl p-6 focus:outline-none focus:border-primary transition-colors resize-none shadow-inner font-mono text-sm leading-relaxed"
        />
      </div>

      {/* History Management */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder="Save prompt as..."
            className="flex-1 bg-white border border-secondary/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
          />
          <button
            onClick={handleSave}
            disabled={!saveName.trim() || !prompt.trim()}
            className="p-2 rounded-xl bg-primary text-white hover:bg-primary/80 disabled:opacity-50 transition-all shadow-md"
          >
            <Save size={20} />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Saved History</label>
          <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-secondary/30">
            {history.length === 0 ? (
              <p className="text-xs text-zinc-400 italic py-4 text-center border border-dashed border-secondary/30 rounded-xl">
                No saved prompts yet.
              </p>
            ) : (
              history.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white border border-secondary/20 rounded-xl hover:border-primary/30 transition-all group">
                  <button 
                    onClick={() => setPrompt(item.content)}
                    className="flex-1 text-left text-sm font-medium text-zinc-700 hover:text-primary truncate"
                  >
                    {item.name}
                  </button>
                  <button 
                    onClick={() => handleDelete(i)}
                    className="p-1.5 text-zinc-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
