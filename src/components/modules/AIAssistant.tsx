import React from 'react';
import { Send, Code, Globe, MessageSquare, Terminal, Search, Trash2, PanelRightOpen, PanelRightClose, Mic, MicOff } from 'lucide-react';
import Markdown from 'react-markdown';
import { generateResponse, generateCode, researchTopic } from '../../services/geminiService';
import { ChatMessage } from '../../types';
import PromptBuilder from '../PromptBuilder';
import { useVoiceTranscription } from '../../hooks/useVoiceTranscription';

interface AIAssistantProps {
  initialPrompt?: string;
  onPromptChange?: (prompt: string) => void;
}

export default function AIAssistant({ initialPrompt = '', onPromptChange }: AIAssistantProps) {
  const [activeTab, setActiveTab] = React.useState<'chat' | 'code' | 'research'>('chat');
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPromptBuilder, setShowPromptBuilder] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { isListening, transcript, startListening, stopListening, setTranscript } = useVoiceTranscription();

  React.useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
    }
  }, [initialPrompt]);

  React.useEffect(() => {
    if (transcript) {
      setInput(prev => prev ? `${prev} ${transcript}` : transcript);
      setTranscript('');
    }
  }, [transcript, setTranscript]);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    if (onPromptChange) onPromptChange('');
    setIsLoading(true);

    let response = '';
    if (activeTab === 'chat') {
      response = await generateResponse(input);
    } else if (activeTab === 'code') {
      response = await generateCode(input);
    } else {
      response = await researchTopic(input);
    }

    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: response,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleSendFromBuilder = (prompt: string) => {
    setInput(prompt);
    if (onPromptChange) onPromptChange(prompt);
  };

  return (
    <div className="flex h-full bg-dashboard-bg text-zinc-800 overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Tabs */}
        <div className="flex border-b border-secondary/30 bg-white/40">
          <TabButton 
            active={activeTab === 'chat'} 
            onClick={() => setActiveTab('chat')} 
            icon={<MessageSquare size={16} />} 
            label="Chat" 
          />
          <TabButton 
            active={activeTab === 'code'} 
            onClick={() => setActiveTab('code')} 
            icon={<Code size={16} />} 
            label="Code Assistant" 
          />
          <TabButton 
            active={activeTab === 'research'} 
            onClick={() => setActiveTab('research')} 
            icon={<Search size={16} />} 
            label="Web Research" 
          />
          <div className="flex-1" />
          <div className="flex items-center px-4 gap-2">
            <button 
              onClick={() => setMessages([])}
              className="px-2 py-2 text-zinc-400 hover:text-red-500 transition-colors flex items-center gap-2 text-xs font-medium"
              title="Clear History"
            >
              <Trash2 size={14} />
            </button>
            <div className="w-px h-4 bg-secondary/30 mx-2" />
            <button 
              onClick={() => setShowPromptBuilder(!showPromptBuilder)}
              className={`
                p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold
                ${showPromptBuilder ? 'bg-primary text-white shadow-md' : 'text-zinc-400 hover:text-primary hover:bg-white'}
              `}
            >
              {showPromptBuilder ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
              Prompt Builder
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-secondary/30"
          >
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-300 space-y-4">
                <div className="p-6 rounded-full bg-white border border-secondary/20 shadow-sm">
                  {activeTab === 'chat' && <MessageSquare size={48} className="text-primary" />}
                  {activeTab === 'code' && <Terminal size={48} className="text-primary" />}
                  {activeTab === 'research' && <Globe size={48} className="text-primary" />}
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-zinc-700">How can I help you today?</p>
                  <p className="text-sm text-zinc-400">Ask me anything about development, research, or productivity.</p>
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  max-w-[80%] p-4 rounded-2xl border shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-primary/10 border-primary/30 text-zinc-800' 
                    : 'bg-white border-secondary/20 text-zinc-700'}
                `}>
                  <div className="prose prose-sm max-w-none prose-zinc">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                  <div className="mt-2 text-[10px] opacity-30 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-secondary/20 p-4 rounded-2xl flex gap-2 shadow-sm">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-secondary/30 bg-white/40">
            {/* Transcription Preview */}
            {isListening && (
              <div className="max-w-4xl mx-auto mb-4 p-4 bg-primary/5 border border-primary/20 rounded-2xl animate-pulse">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Listening...</span>
                </div>
                <p className="text-sm text-zinc-600 italic">
                  {transcript || "Speak now..."}
                </p>
              </div>
            )}

            <div className="max-w-4xl mx-auto relative">
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (onPromptChange) onPromptChange(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={
                  activeTab === 'chat' ? "Type a message..." :
                  activeTab === 'code' ? "Describe the code you need..." :
                  "Enter a topic to research..."
                }
                className="w-full bg-white border border-secondary/50 rounded-2xl px-6 py-4 pr-32 focus:outline-none focus:border-primary transition-colors resize-none min-h-[60px] max-h-[200px] shadow-sm"
                rows={1}
              />
              <div className="absolute right-3 bottom-3 flex gap-2">
                <button 
                  onClick={isListening ? stopListening : startListening}
                  className={`p-3 rounded-xl transition-all shadow-md ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white border border-secondary/50 text-zinc-400 hover:text-primary'}`}
                  title={isListening ? "Stop Listening" : "Voice Transcription"}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-3 rounded-xl bg-accent text-white hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
            <p className="text-center text-[10px] text-zinc-400 mt-3 uppercase tracking-widest font-bold">
              Aura AI Engine • Powered by Gemini
            </p>
          </div>
        </div>
      </div>

      {/* Prompt Builder Sidebar */}
      {showPromptBuilder && (
        <div className="w-96 border-l border-secondary/30 bg-white/40 animate-in slide-in-from-right duration-300">
          <PromptBuilder 
            prompt={initialPrompt || input} 
            setPrompt={handleSendFromBuilder}
            onSendToChat={handleSendFromBuilder}
          />
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`
        px-6 py-4 flex items-center gap-2 border-b-2 transition-all
        ${active 
          ? 'border-primary text-primary bg-primary/5' 
          : 'border-transparent text-zinc-400 hover:text-zinc-600 hover:bg-white/50'}
      `}
    >
      {icon}
      <span className="text-sm font-bold">{label}</span>
    </button>
  );
}
