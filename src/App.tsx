import React from 'react';
import Layout from './components/Layout';
import Carousel from './components/Carousel';
import AIAssistant from './components/modules/AIAssistant';
import TaskOrganizer from './components/modules/TaskOrganizer';
import ProjectHub from './components/modules/ProjectHub';
import AIPromptAssist from './components/modules/AIPromptAssist';
import ComingSoon from './components/modules/ComingSoon';
import { ModuleId } from './types';

export default function App() {
  const [currentModule, setCurrentModule] = React.useState<ModuleId>('dashboard');
  const [sharedPrompt, setSharedPrompt] = React.useState('');

  const handleSendToChat = (prompt: string) => {
    setSharedPrompt(prompt);
    setCurrentModule('ai-assistant');
  };

  const renderModule = () => {
    switch (currentModule) {
      case 'dashboard':
        return <Carousel onSelect={setCurrentModule} />;
      case 'ai-assistant':
        return (
          <AIAssistant 
            initialPrompt={sharedPrompt} 
            onPromptChange={setSharedPrompt} 
          />
        );
      case 'task-organizer':
        return <TaskOrganizer />;
      case 'project-hub':
        return <ProjectHub />;
      case 'ai-prompt-assist':
        return (
          <AIPromptAssist 
            prompt={sharedPrompt} 
            setPrompt={setSharedPrompt} 
            onSendToChat={handleSendToChat} 
          />
        );
      case 'code-cleaner':
      case 'research-viz':
        return <ComingSoon />;
      default:
        return <Carousel onSelect={setCurrentModule} />;
    }
  };

  return (
    <Layout 
      currentModule={currentModule} 
      onNavigate={(module) => setCurrentModule(module as ModuleId)}
    >
      <div className="h-full w-full animate-in fade-in duration-700">
        {renderModule()}
      </div>
    </Layout>
  );
}
