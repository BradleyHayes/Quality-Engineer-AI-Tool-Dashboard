export interface Project {
  id: string;
  name: string;
  path: string;
  description: string;
  notes: string;
  prompts: string[];
  documents: string[];
  createdAt: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  displayId: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed' | 'on-hold';
  dueDate?: string;
  timeWorked: number; // in minutes
  completionPercentage: number;
  checklist: ChecklistItem[];
  createdAt: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export type ModuleId = 'dashboard' | 'ai-assistant' | 'task-organizer' | 'code-cleaner' | 'research-viz' | 'project-hub' | 'ai-prompt-assist';
