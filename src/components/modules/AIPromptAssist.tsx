import React from 'react';
import PromptBuilder from '../PromptBuilder';

interface AIPromptAssistProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSendToChat: (prompt: string) => void;
}

export default function AIPromptAssist({ prompt, setPrompt, onSendToChat }: AIPromptAssistProps) {
  return (
    <div className="h-full bg-dashboard-bg overflow-y-auto">
      <PromptBuilder 
        prompt={prompt} 
        setPrompt={setPrompt} 
        onSendToChat={onSendToChat} 
        fullScreen={true} 
      />
    </div>
  );
}
