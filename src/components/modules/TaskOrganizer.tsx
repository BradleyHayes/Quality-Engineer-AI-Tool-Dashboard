import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  FileText, 
  Calendar, 
  MoreVertical, 
  Trash2, 
  Save,
  PenTool,
  ListTodo,
  FileEdit,
  Share2,
  FileDown,
  Filter,
  BarChart3,
  Clock,
  CheckSquare,
  ChevronRight,
  ChevronDown,
  Mail,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Task, ChecklistItem } from '../../types';
import * as XLSX from 'xlsx';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

type FilterType = 'all' | 'created-today' | 'scheduled-today' | 'completed-today';

export default function TaskOrganizer() {
  const [activeView, setActiveView] = React.useState<'tasks' | 'docs' | 'reports'>('tasks');
  const [filter, setFilter] = React.useState<FilterType>('all');
  const [tasks, setTasks] = React.useState<Task[]>([
    { 
      id: '1', 
      displayId: 'TSK-001',
      title: 'Complete Aura Dashboard UI', 
      completed: false, 
      priority: 'high', 
      status: 'in-progress',
      createdAt: Date.now(), 
      dueDate: new Date().toISOString().split('T')[0],
      timeWorked: 120,
      completionPercentage: 65,
      checklist: [
        { id: 'c1', text: 'Design sidebar', completed: true },
        { id: 'c2', text: 'Implement charts', completed: false }
      ]
    },
    { 
      id: '2', 
      displayId: 'TSK-002',
      title: 'Integrate Gemini API', 
      completed: true, 
      priority: 'high', 
      status: 'completed',
      createdAt: Date.now() - 86400000, 
      dueDate: new Date().toISOString().split('T')[0],
      timeWorked: 240,
      completionPercentage: 100,
      checklist: []
    },
  ]);
  
  const [newTaskTitle, setNewTaskTitle] = React.useState('');
  const [newTaskPriority, setNewTaskPriority] = React.useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [expandedTaskId, setExpandedTaskId] = React.useState<string | null>(null);
  const [docContent, setDocContent] = React.useState('# Project Aura\n\nThis is a high-performance productivity dashboard.\n\n## Goals\n- Modular architecture\n- AI-first workflow\n- Seamless project management');

  const generateTaskId = () => {
    const nextNum = tasks.length + 1;
    return `TSK-${String(nextNum).padStart(3, '0')}`;
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      displayId: generateTaskId(),
      title: newTaskTitle,
      completed: false,
      priority: newTaskPriority,
      status: 'pending',
      dueDate: newTaskDueDate,
      createdAt: Date.now(),
      timeWorked: 0,
      completionPercentage: 0,
      checklist: []
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed, status: !t.completed ? 'completed' : 'pending', completionPercentage: !t.completed ? 100 : 0 } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const addChecklistItem = (taskId: string, text: string) => {
    const newItem: ChecklistItem = { id: Date.now().toString(), text, completed: false };
    setTasks(tasks.map(t => t.id === taskId ? { ...t, checklist: [...t.checklist, newItem] } : t));
  };

  const toggleChecklistItem = (taskId: string, itemId: string) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const newChecklist = t.checklist.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item);
        const completedCount = newChecklist.filter(i => i.completed).length;
        const percentage = Math.round((completedCount / newChecklist.length) * 100);
        return { ...t, checklist: newChecklist, completionPercentage: percentage };
      }
      return t;
    }));
  };

  const filteredTasks = tasks.filter(task => {
    const today = new Date().toISOString().split('T')[0];
    const taskCreatedDate = new Date(task.createdAt).toISOString().split('T')[0];
    
    if (filter === 'created-today') return taskCreatedDate === today;
    if (filter === 'scheduled-today') return task.dueDate === today;
    if (filter === 'completed-today') return task.completed && taskCreatedDate === today;
    return true;
  });

  const exportToExcel = () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Deduplicate tasks for "today" (unique by title per day)
    const uniqueTasks = tasks.reduce((acc: Task[], current) => {
      const dateStr = new Date(current.createdAt).toISOString().split('T')[0];
      const isDuplicate = acc.some(t => t.title === current.title && new Date(t.createdAt).toISOString().split('T')[0] === dateStr);
      if (!isDuplicate) acc.push(current);
      return acc;
    }, []);

    const wb = XLSX.utils.book_new();

    const quarters = [
      { name: 'Q1', months: [0, 1, 2] },
      { name: 'Q2', months: [3, 4, 5] },
      { name: 'Q3', months: [6, 7, 8] },
      { name: 'Q4', months: [9, 10, 11] }
    ];

    quarters.forEach(q => {
      const qTasks = uniqueTasks.filter(t => q.months.includes(new Date(t.createdAt).getMonth()));
      const data = qTasks.map(t => ({
        'ID': t.displayId,
        'Title': t.title,
        'Due Date': t.dueDate || 'N/A',
        'Status': t.status.toUpperCase(),
        'Time Worked (min)': t.timeWorked,
        'Completion %': t.completionPercentage,
        'Priority': t.priority.toUpperCase(),
        'Creation Date': new Date(t.createdAt).toLocaleDateString()
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, q.name);
    });

    XLSX.writeFile(wb, "2026_Daily_Tasks.xlsx");
  };

  const generateReports = () => {
    const today = new Date().toISOString().split('T')[0];
    const dailyTasks = tasks.filter(t => new Date(t.createdAt).toISOString().split('T')[0] === today);
    const completedToday = dailyTasks.filter(t => t.completed);
    const pendingToday = dailyTasks.filter(t => !t.completed);

    const dailyReport = `
DAILY STATUS REPORT - ${new Date().toLocaleDateString()}
--------------------------------------------------

SUMMARY
- Total Tasks: ${dailyTasks.length}
- Completed: ${completedToday.length}
- Pending: ${pendingToday.length}

DETAILED BREAKDOWN
${dailyTasks.map(t => `
ID: ${t.displayId}
TASK: ${t.title}
TIME: ${Math.floor(t.timeWorked / 60)}h ${t.timeWorked % 60}m
PRIORITY: ${t.priority.toUpperCase()}
COMPLETION: ${t.completionPercentage}%
STATUS: ${t.status.toUpperCase()}
--------------------------------------------------`).join('\n')}

Generated by Project Aura AI
    `;

    return { dailyReport };
  };

  const { dailyReport } = generateReports();

  const sendOutlookEmail = () => {
    const subject = `Daily Status Report - ${new Date().toLocaleDateString()}`;
    const body = dailyReport;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const chartData = [
    { name: 'Pending', value: tasks.filter(t => t.status === 'pending').length, color: '#94a3b8' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: '#f59e0b' },
    { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: '#10b981' },
    { name: 'On Hold', value: tasks.filter(t => t.status === 'on-hold').length, color: '#ef4444' },
  ];

  const priorityData = [
    { name: 'High', count: tasks.filter(t => t.priority === 'high').length },
    { name: 'Medium', count: tasks.filter(t => t.priority === 'medium').length },
    { name: 'Low', count: tasks.filter(t => t.priority === 'low').length },
  ];

  return (
    <div className="flex h-full bg-dashboard-bg overflow-hidden text-zinc-800">
      {/* Sidebar */}
      <div className="w-64 border-r border-secondary/30 bg-white/40 flex flex-col">
        <div className="p-6">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">Workspace</h2>
          <nav className="space-y-1">
            <SidebarItem 
              active={activeView === 'tasks'} 
              onClick={() => setActiveView('tasks')} 
              icon={<ListTodo size={18} />} 
              label="Tasks" 
              count={tasks.filter(t => !t.completed).length}
            />
            <SidebarItem 
              active={activeView === 'docs'} 
              onClick={() => setActiveView('docs')} 
              icon={<FileEdit size={18} />} 
              label="Documentation" 
            />
            <SidebarItem 
              active={activeView === 'reports'} 
              onClick={() => setActiveView('reports')} 
              icon={<BarChart3 size={18} />} 
              label="AI Reports & Stats" 
            />
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-secondary/30 space-y-2">
          <button 
            onClick={exportToExcel}
            className="w-full py-2 px-4 rounded-xl bg-primary text-white hover:bg-primary/80 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <FileDown size={14} /> Export to Excel
          </button>
          <button 
            onClick={sendOutlookEmail}
            className="w-full py-2 px-4 rounded-xl bg-white hover:bg-zinc-50 border border-secondary/50 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Mail size={14} /> Send to Outlook
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeView === 'tasks' ? (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-display font-bold text-zinc-800">Task Manager</h1>
                  <p className="text-sm text-zinc-400 mt-1">Manage your daily workflow with precision.</p>
                </div>
                <div className="flex bg-white border border-secondary/30 rounded-lg p-1">
                  <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="All" />
                  <FilterButton active={filter === 'created-today'} onClick={() => setFilter('created-today')} label="Created" />
                  <FilterButton active={filter === 'scheduled-today'} onClick={() => setFilter('scheduled-today')} label="Scheduled" />
                  <FilterButton active={filter === 'completed-today'} onClick={() => setFilter('completed-today')} label="Done" />
                </div>
              </div>

              {/* Add Task */}
              <div className="bg-white border border-secondary/30 rounded-2xl p-6 mb-8 shadow-sm space-y-4">
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTask()}
                    placeholder="What needs to be done?"
                    className="flex-1 bg-zinc-50 border border-secondary/30 rounded-xl px-4 py-2 focus:outline-none focus:border-primary transition-colors"
                  />
                  <button 
                    onClick={addTask}
                    className="px-6 rounded-xl bg-accent text-white hover:bg-accent/80 transition-all shadow-md flex items-center gap-2 font-bold text-sm"
                  >
                    <Plus size={18} /> Add Task
                  </button>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="flex-1 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-zinc-400" />
                      <input 
                        type="date" 
                        value={newTaskDueDate}
                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                        className="bg-transparent text-xs text-zinc-600 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {(['low', 'medium', 'high'] as const).map(p => (
                      <button
                        key={p}
                        onClick={() => setNewTaskPriority(p)}
                        className={`
                          px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all
                          ${newTaskPriority === p 
                            ? (p === 'high' ? 'bg-red-500 text-white' : p === 'medium' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white')
                            : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'}
                        `}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Task List */}
              <div className="space-y-4">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-secondary/20 rounded-3xl">
                    <p className="text-zinc-400 text-sm italic">No tasks found for this filter.</p>
                  </div>
                ) : (
                  filteredTasks.map(task => (
                    <div 
                      key={task.id}
                      className={`
                        group rounded-2xl bg-white border transition-all shadow-sm overflow-hidden
                        ${expandedTaskId === task.id ? 'border-primary ring-1 ring-primary/20' : 'border-secondary/20 hover:border-primary/30'}
                      `}
                    >
                      <div className="p-4 flex items-center gap-4">
                        <button 
                          onClick={() => toggleTask(task.id)}
                          className={`transition-colors ${task.completed ? 'text-primary' : 'text-zinc-200 hover:text-zinc-400'}`}
                        >
                          {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                        </button>
                        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded uppercase tracking-widest">{task.displayId}</span>
                            <p className={`text-sm font-bold truncate ${task.completed ? 'text-zinc-300 line-through' : 'text-zinc-700'}`}>
                              {task.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                              <Calendar size={10} /> {task.dueDate || 'No date'}
                            </span>
                            <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                              <Clock size={10} /> {Math.floor(task.timeWorked / 60)}h {task.timeWorked % 60}m
                            </span>
                            <div className="flex-1 h-1 bg-zinc-100 rounded-full max-w-[60px] overflow-hidden">
                              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${task.completionPercentage}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-primary">{task.completionPercentage}%</span>
                          </div>
                        </div>
                        <div className={`
                          px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter
                          ${task.priority === 'high' ? 'bg-red-500/10 text-red-500' : 
                            task.priority === 'medium' ? 'bg-orange-500/10 text-orange-500' : 
                            'bg-blue-500/10 text-blue-500'}
                        `}>
                          {task.priority}
                        </div>
                        <button 
                          onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                          className="p-2 text-zinc-400 hover:text-primary transition-all"
                        >
                          {expandedTaskId === task.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                        <button 
                          onClick={() => deleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-zinc-300 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Expanded Details */}
                      {expandedTaskId === task.id && (
                        <div className="px-12 pb-6 pt-2 border-t border-secondary/10 bg-zinc-50/50 space-y-6 animate-in slide-in-from-top-2 duration-200">
                          <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</label>
                              <select 
                                value={task.status}
                                onChange={(e) => updateTask(task.id, { status: e.target.value as any })}
                                className="w-full bg-white border border-secondary/30 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-primary"
                              >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="on-hold">On Hold</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Time Worked (min)</label>
                              <input 
                                type="number"
                                value={task.timeWorked}
                                onChange={(e) => updateTask(task.id, { timeWorked: parseInt(e.target.value) || 0 })}
                                className="w-full bg-white border border-secondary/30 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-primary"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Completion %</label>
                              <input 
                                type="range"
                                min="0"
                                max="100"
                                value={task.completionPercentage}
                                onChange={(e) => updateTask(task.id, { completionPercentage: parseInt(e.target.value) })}
                                className="w-full accent-primary"
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <CheckSquare size={12} /> Checklist
                              </label>
                              <span className="text-[10px] font-bold text-primary">{task.checklist.filter(i => i.completed).length}/{task.checklist.length}</span>
                            </div>
                            <div className="space-y-2">
                              {task.checklist.map(item => (
                                <div key={item.id} className="flex items-center gap-3 group/item">
                                  <button 
                                    onClick={() => toggleChecklistItem(task.id, item.id)}
                                    className={`transition-colors ${item.completed ? 'text-primary' : 'text-zinc-300 hover:text-zinc-400'}`}
                                  >
                                    {item.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                                  </button>
                                  <span className={`text-xs flex-1 ${item.completed ? 'text-zinc-300 line-through' : 'text-zinc-600'}`}>
                                    {item.text}
                                  </span>
                                </div>
                              ))}
                              <div className="flex gap-2 mt-2">
                                <input 
                                  type="text"
                                  placeholder="Add item..."
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      addChecklistItem(task.id, e.currentTarget.value);
                                      e.currentTarget.value = '';
                                    }
                                  }}
                                  className="flex-1 bg-white border border-secondary/30 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-primary"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : activeView === 'docs' ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="h-16 border-b border-secondary/30 px-8 flex items-center justify-between bg-white/40">
              <div className="flex items-center gap-4">
                <FileText size={20} className="text-primary" />
                <span className="text-sm font-bold text-zinc-700">Project_Aura_Docs.md</span>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent/80 transition-all flex items-center gap-2 shadow-md">
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </div>
            <div className="flex-1 flex overflow-hidden">
              <textarea 
                value={docContent}
                onChange={(e) => setDocContent(e.target.value)}
                className="flex-1 bg-transparent p-8 focus:outline-none font-mono text-sm leading-relaxed resize-none overflow-y-auto border-r border-secondary/30 text-zinc-700"
                placeholder="Start writing..."
              />
              <div className="flex-1 p-8 overflow-y-auto prose prose-sm max-w-none bg-zinc-50/50 prose-zinc">
                <h1 className="text-xs font-bold text-zinc-300 uppercase tracking-[0.2em] mb-8">Preview</h1>
                <div className="whitespace-pre-wrap text-zinc-600">
                  {docContent}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-display font-bold text-zinc-800">Analytics & Reports</h1>
                  <p className="text-sm text-zinc-400 mt-1">Professional insights into your productivity.</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={sendOutlookEmail}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary/30 text-zinc-600 rounded-xl text-sm font-bold shadow-sm hover:bg-zinc-50 transition-all"
                  >
                    <Mail size={18} /> Outlook Email
                  </button>
                  <button 
                    onClick={exportToExcel}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-md hover:bg-primary/80 transition-all"
                  >
                    <FileDown size={18} /> 2026_Daily_Tasks.xlsx
                  </button>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white border border-secondary/30 rounded-3xl p-8 shadow-sm">
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6">Task Status Distribution</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          cursor={{ fill: '#f8fafc' }}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white border border-secondary/30 rounded-3xl p-8 shadow-sm">
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6">Priority Mix</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={priorityData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="count"
                        >
                          <Cell fill="#ef4444" />
                          <Cell fill="#f59e0b" />
                          <Cell fill="#3b82f6" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 mt-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-[10px] font-bold text-zinc-500">High</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="text-[10px] font-bold text-zinc-500">Med</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-[10px] font-bold text-zinc-500">Low</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Report View */}
              <div className="bg-white border border-secondary/30 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <FileText size={20} />
                    </div>
                    <h2 className="text-lg font-bold">Word-Ready Daily Status</h2>
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(dailyReport);
                      alert('Report copied to clipboard!');
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-lg text-xs font-bold transition-all"
                  >
                    <Copy size={14} /> Copy for Word
                  </button>
                </div>
                <div className="bg-zinc-50 rounded-2xl p-8 font-serif text-sm text-zinc-700 whitespace-pre-wrap border border-secondary/20 shadow-inner leading-relaxed">
                  {dailyReport}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarItem({ active, onClick, icon, label, count }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, count?: number }) {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm
        ${active 
          ? 'bg-primary/10 text-primary font-bold shadow-sm' 
          : 'text-zinc-400 hover:text-zinc-600 hover:bg-white/50'}
      `}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {count !== undefined && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${active ? 'bg-primary/20' : 'bg-zinc-100'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function FilterButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter transition-all
        ${active ? 'bg-primary text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}
      `}
    >
      {label}
    </button>
  );
}
