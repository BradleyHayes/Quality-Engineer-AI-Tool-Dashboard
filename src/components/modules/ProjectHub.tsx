import React from 'react';
import { 
  Folder, 
  FolderPlus, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  FileCode, 
  Github, 
  ExternalLink,
  MoreHorizontal,
  Plus,
  LayoutGrid,
  List
} from 'lucide-react';
import { Project } from '../../types';

export default function ProjectHub() {
  const [projects, setProjects] = React.useState<Project[]>([
    {
      id: '1',
      name: 'Aura Dashboard',
      path: '~/dev/aura-ai',
      description: 'Main productivity platform',
      notes: 'Focus on performance and modularity',
      prompts: ['Generate carousel component', 'Setup Gemini service'],
      documents: ['Architecture.md', 'Roadmap.md'],
      createdAt: Date.now(),
    },
    {
      id: '2',
      name: 'Neural Engine',
      path: '~/dev/neural-core',
      description: 'Core LLM processing unit',
      notes: 'Researching multi-modal support',
      prompts: [],
      documents: ['Specs.pdf'],
      createdAt: Date.now() - 86400000,
    }
  ]);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-dashboard-bg text-zinc-800">
      {/* Header */}
      <div className="p-8 border-b border-secondary/30 bg-white/40">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2 text-zinc-800">Project Hub</h1>
            <p className="text-zinc-400 text-sm">Manage and organize your development workspaces</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-50 border border-secondary/50 text-sm font-bold transition-all flex items-center gap-2 shadow-sm">
              <Github size={16} /> Link Repository
            </button>
            <button className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent/80 transition-all flex items-center gap-2 shadow-md">
              <Plus size={18} /> New Project
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, folders, or notes..."
              className="w-full bg-white border border-secondary/50 rounded-xl pl-12 pr-4 py-2.5 focus:outline-none focus:border-primary transition-colors text-sm shadow-sm"
            />
          </div>
          <div className="flex bg-white rounded-xl p-1 border border-secondary/30 shadow-sm">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-md' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-md' : 'text-zinc-400 hover:text-zinc-600'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      <div className="flex-1 overflow-y-auto p-8">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
            <button className="flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border-2 border-dashed border-secondary/30 hover:border-primary hover:bg-primary/5 transition-all group">
              <div className="p-4 rounded-full bg-white group-hover:bg-primary/10 text-zinc-200 group-hover:text-primary transition-all shadow-sm">
                <FolderPlus size={32} />
              </div>
              <span className="text-sm font-bold text-zinc-400 group-hover:text-primary">Create New Workspace</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredProjects.map(project => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group bg-white border border-secondary/20 rounded-3xl p-6 hover:border-primary hover:shadow-xl transition-all relative overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
          <Folder size={24} />
        </div>
        <button className="p-2 text-zinc-300 hover:text-zinc-500 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>
      <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors text-zinc-800">{project.name}</h3>
      <p className="text-[10px] text-zinc-400 font-mono mb-4">{project.path}</p>
      <p className="text-sm text-zinc-500 line-clamp-2 mb-6">{project.description}</p>
      
      <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
        <div className="flex -space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-6 h-6 rounded-full bg-zinc-100 border border-white flex items-center justify-center text-[8px] font-bold text-zinc-400">
              {i}
            </div>
          ))}
        </div>
        <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
          Open Workspace <ExternalLink size={12} />
        </button>
      </div>

      {/* Background Glow */}
      <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <div className="group flex items-center gap-6 p-4 bg-white border border-secondary/20 rounded-2xl hover:border-primary hover:shadow-md transition-all">
      <div className="p-2 rounded-xl bg-primary/10 text-primary">
        <Folder size={20} />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-bold group-hover:text-primary transition-colors text-zinc-800">{project.name}</h3>
        <p className="text-[10px] text-zinc-400 font-mono">{project.path}</p>
      </div>
      <div className="hidden md:block text-xs text-zinc-500 max-w-xs truncate">
        {project.description}
      </div>
      <div className="flex gap-2">
        <button className="p-2 rounded-lg hover:bg-zinc-50 text-zinc-300 hover:text-zinc-600 transition-all">
          <Github size={16} />
        </button>
        <button className="p-2 rounded-lg hover:bg-zinc-50 text-zinc-300 hover:text-zinc-600 transition-all">
          <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
}
