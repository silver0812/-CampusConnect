import React, { useState, useEffect, useRef } from 'react';
import { Committee, Task, ChatMessage, Role } from '../types';
import { 
  Users, 
  Layers, 
  MessageSquare, 
  Plus, 
  ChevronRight, 
  ChevronLeft, 
  Trash2, 
  Send,
  Sparkles,
  ArrowRight,
  Bookmark,
  CheckCircle,
  AlertCircle,
  Activity,
  Loader2,
  ListTodo
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CommitteesViewProps {
  committees: Committee[];
  tasks: Task[];
  chatMessages: ChatMessage[];
  userRole: Role;
  username: string;
  onAddTask: (task: Omit<Task, 'id' | 'assignee'>) => void;
  onMoveTask: (taskId: string, newStatus: Task['status']) => void;
  onDeleteTask: (taskId: string) => void;
  onAddChatMessage: (content: string, committeeId: string) => void;
}

export default function CommitteesView({
  committees,
  tasks,
  chatMessages,
  userRole,
  username,
  onAddTask,
  onMoveTask,
  onDeleteTask,
  onAddChatMessage,
}: CommitteesViewProps) {
  const [activeCommitteeId, setActiveCommitteeId] = useState<string>(committees[0]?.id || '');
  const [chatInput, setChatInput] = useState('');
  
  // Tasks Kanban state
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // AI Summary panel state
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryResult, setSummaryResult] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const activeCommittee = committees.find(c => c.id === activeCommitteeId);
  const activeTasks = tasks.filter(t => t.committeeId === activeCommitteeId);
  const activeMessages = chatMessages.filter(m => m.committeeId === activeCommitteeId);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new chat messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    onAddChatMessage(chatInput.trim(), activeCommitteeId);
    const sentText = chatInput.trim();
    setChatInput('');

    // Active Simulated Partner Reply Trigger
    setTimeout(() => {
      const bots = [
        { name: 'Chloe (Marketing)', text: "I can check the social media insights. Let me add that task to 'In Progress'!", role: 'member' },
        { name: 'Nate (Tech Support)', text: "I've reviewed the server code. Let me know if we need to draft a general update.", role: 'member' },
        { name: 'Kiana (Logistics)', text: "Meeting rooms are booked for Wednesday. I will add the calendar invite.", role: 'member' },
        { name: 'Marcus (Finance)', text: "Budget details approved! Proceeding with shirt ordering procedures.", role: 'officer' },
      ];
      const selectedBot = bots[Math.floor(Math.random() * bots.length)];
      
      // Select appropriate replies depending on committee triggers
      let botsReply = selectedBot.text;
      if (sentText.toLowerCase().includes('shirt') || sentText.toLowerCase().includes(' hoodie')) {
        botsReply = "Got it! Checked the payments list in the Store dashboard; looks like a few members completed their checkout.";
      } else if (sentText.toLowerCase().includes('calendar') || sentText.toLowerCase().includes('event') || sentText.toLowerCase().includes('rsvp')) {
        botsReply = "I already RSVPed on the Schedule page. See you guys there!";
      }

      onAddChatMessage(botsReply, activeCommitteeId);
    }, 1500);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    onAddTask({
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      priority: taskPriority,
      status: 'todo',
      committeeId: activeCommitteeId,
    });

    setTaskTitle('');
    setTaskDesc('');
    setTaskPriority('medium');
    setIsAddingTask(false);
  };

  // AI Discussion Summarizer call
  const handleSummarizeDiscussion = async () => {
    if (activeMessages.length === 0) {
      setAiError("There is no active discussion to summarize yet. Chat first!");
      return;
    }
    setIsSummarizing(true);
    setSummaryResult(null);
    setAiError(null);

    try {
      const response = await fetch('/api/gemini/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: activeMessages }),
      });

      const data = await response.json();
      if (data.text) {
        setSummaryResult(data.text);
      } else if (data.error) {
        setAiError(data.error);
      }
    } catch (err) {
      console.error(err);
      setAiError("Failed connecting to Gemini. Try discussing manually!");
    } finally {
      setIsSummarizing(false);
    }
  };

  const parseSuggestedAITasks = (text: string) => {
    // Basic parser extracting double-quotes or items for immediate addition
    const lines = text.split('\n');
    const tasksFound: { title: string; desc: string; priority: 'low' | 'medium' | 'high' }[] = [];
    
    lines.forEach(line => {
      const matches = line.match(/"([^"]+)"/);
      if (matches && matches[1]) {
        let p: 'low' | 'medium' | 'high' = 'medium';
        if (line.toLowerCase().includes('high')) p = 'high';
        if (line.toLowerCase().includes('low')) p = 'low';
        tasksFound.push({
          title: matches[1],
          desc: "Auto-extracted from committee discussion",
          priority: p
        });
      }
    });
    return tasksFound;
  };

  const handleApplyAITask = (t: { title: string; desc: string; priority: 'low' | 'medium' | 'high' }) => {
    onAddTask({
      title: t.title,
      description: t.desc,
      priority: t.priority,
      status: 'todo',
      committeeId: activeCommitteeId,
    });
    setSummaryResult(null);
  };

  const getPriorityColor = (p: Task['priority']) => {
    switch (p) {
      case 'high':
        return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      default:
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section with Committees selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h2 id="committees-title" className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            Committee Collaboration Suite
          </h2>
          <p className="text-sm text-slate-500">Formulate initiatives, coordinate workflows, and assign committee logs</p>
        </div>

        {/* Dynamic selector */}
        <div id="committee-pills" className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {committees.map((com) => (
            <button
              key={com.id}
              onClick={() => {
                setActiveCommitteeId(com.id);
                setSummaryResult(null);
                setAiError(null);
              }}
              className={`text-xs px-3 py-1.5 font-semibold rounded-lg border transition-all text-center shrink-0 ${
                activeCommitteeId === com.id 
                  ? `${com.color} bg-white shadow-sm ring-2 ring-indigo-500/20`
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {com.name}
            </button>
          ))}
        </div>
      </div>

      {activeCommittee && (
        <div className="bg-amber-100/15 border border-dashed border-amber-200 rounded-xl p-4 flex gap-3 text-slate-700">
          <Bookmark className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold">{activeCommittee.name} Mission:</span> {activeCommittee.description}
          </div>
        </div>
      )}

      {/* Main Two Column layout (Kanban Left, Chat & AI Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kanban Task Board (Col-span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-indigo-500" />
              Workflow Task Dispatch
            </h3>
            
            {userRole === 'officer' && (
              <button
                id="btn-add-task"
                onClick={() => setIsAddingTask(!isAddingTask)}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 border text-white rounded-lg text-xs font-semibold hover:bg-slate-800 shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" />
                Delegate Task
              </button>
            )}
          </div>

          <AnimatePresence>
            {isAddingTask && (
              <motion.form
                id="form-add-task"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                onSubmit={handleCreateTask}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Task Scope Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Design sticker typography"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none bg-white font-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Priority Weight</label>
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value as any)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none font-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                    >
                      <option value="low">🟢 Low Priority</option>
                      <option value="medium">🟡 Medium Priority</option>
                      <option value="high">🔴 High Priority</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Details &amp; Action Item</label>
                  <input
                    type="text"
                    placeholder="Describe direct action required for logs..."
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none bg-white font-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-1.5 text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingTask(false)}
                    className="px-3 py-1 border rounded-md text-slate-500 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md shadow-sm"
                  >
                    Add Task
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Kanban Board Columns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            
            {/* Columns mapping: 'todo', 'in_progress', 'review', 'done' */}
            {(['todo', 'in_progress', 'review', 'done'] as const).map((col) => {
              const colTasks = activeTasks.filter(t => t.status === col);
              return (
                <div key={col} className="bg-slate-50/50 border border-slate-100/80 rounded-xl p-2.5 space-y-2.5 flex flex-col min-h-[16rem]">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/50">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                      {col === 'todo' && '📋 To Do'}
                      {col === 'in_progress' && '⚡ Active'}
                      {col === 'review' && '🔍 Review'}
                      {col === 'done' && '🎉 Done'}
                    </span>
                    <span className="text-[10px] bg-slate-200/60 font-bold px-1.5 py-0.2 rounded-full text-slate-500">
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Tasks nested inside column */}
                  <div className="space-y-2 flex-1 overflow-y-auto max-h-[22rem] pr-0.5">
                    {colTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        id={`task-card-${task.id}`}
                        layout
                        className="bg-white border border-slate-100 rounded-lg p-3 shadow-xs space-y-2 text-xs relative group"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.2 border rounded ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="text-slate-300 hover:text-red-500 group-hover:opacity-100 opacity-0 transition-opacity"
                            title="Remove task"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>

                        <div>
                          <p id={`task-title-${task.id}`} className="font-bold text-slate-800 leading-snug">{task.title}</p>
                          {task.description && (
                            <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">{task.description}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-dashed border-slate-100">
                          {/* Assignee identifier */}
                          <div className="flex items-center gap-1 text-[9px] font-bold text-slate-600">
                            <span className="h-4.5 w-4.5 bg-indigo-100 rounded-full flex items-center justify-center text-[8px] text-indigo-700 uppercase leading-none border border-indigo-200 font-bold">
                              {task.assignee.name.substring(0, 2)}
                            </span>
                            <span className="truncate max-w-[4rem] text-slate-500 capitalize">{task.assignee.name}</span>
                          </div>

                          {/* Quick Flow selector controls */}
                          <div className="flex gap-0.5">
                            {col !== 'todo' && (
                              <button
                                onClick={() => {
                                  const steps: Task['status'][] = ['todo', 'in_progress', 'review', 'done'];
                                  const currentIdx = steps.indexOf(col);
                                  onMoveTask(task.id, steps[currentIdx - 1]);
                                }}
                                className="p-0.5 border border-slate-100 rounded bg-slate-50 hover:bg-slate-100 text-slate-500"
                                title="Move Left"
                              >
                                <ChevronLeft className="h-3 w-3" />
                              </button>
                            )}
                            {col !== 'done' && (
                              <button
                                onClick={() => {
                                  const steps: Task['status'][] = ['todo', 'in_progress', 'review', 'done'];
                                  const currentIdx = steps.indexOf(col);
                                  onMoveTask(task.id, steps[currentIdx + 1]);
                                }}
                                className="p-0.5 border border-slate-100 rounded bg-slate-50 hover:bg-slate-100 text-slate-500"
                                title="Move status forward"
                              >
                                <ChevronRight className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {colTasks.length === 0 && (
                      <div className="text-[10px] text-slate-400 text-center py-6 border border-dashed border-slate-100 rounded-lg">
                        Empty column
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Committee Discussion chat (Col-span 5) */}
        <div className="lg:col-span-5 flex flex-col bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm h-[32rem]">
          
          {/* Chat Header and Summarize trigger info */}
          <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-slate-800">
              <MessageSquare className="h-4 w-4 text-indigo-500 shrink-0" />
              <div className="font-bold font-sans truncate max-w-[10rem]">
                #{activeCommittee.name.split(' ')[0]} Channel
              </div>
            </div>

            <button
              id="btn-gemini-summarize"
              onClick={handleSummarizeDiscussion}
              disabled={isSummarizing}
              className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 hover:border-indigo-300 text-indigo-600 rounded-lg text-[10px] font-bold transition-colors"
            >
              {isSummarizing ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin text-indigo-500" />
                  Summarizing...
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500/10" />
                  Gemini Summarize
                </>
              )}
            </button>
          </div>

          {/* AI Discussion output box */}
          <AnimatePresence>
            {summaryResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-slate-900 text-slate-200 p-4 border-b border-indigo-500/20 text-xs overflow-y-auto max-h-56 shrink-0 relative"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <span className="font-bold flex items-center gap-1 text-slate-200">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400 fill-amber-400/10" />
                    Gemini Intelligence Summary
                  </span>
                  <button 
                    onClick={() => setSummaryResult(null)}
                    className="text-slate-400 hover:text-slate-200 text-[10px] font-semibold"
                  >
                    Dismiss
                  </button>
                </div>
                <p className="font-sans leading-relaxed text-slate-300 italic">{summaryResult.split('🎯')[0]}</p>
                
                {/* Extraction helper */}
                {summaryResult.includes('🎯') && (
                  <div className="mt-3.5 pt-2 border-t border-slate-800">
                    <span className="block text-[10px] font-extrabold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <ListTodo className="h-3 w-3" />
                      Extracted Action Suggestions:
                    </span>
                    <div className="space-y-1.5 font-sans">
                      {parseSuggestedAITasks(summaryResult).map((recTask, idx) => (
                        <div key={idx} className="flex items-center justify-between p-1.5 bg-slate-800 border border-slate-700/60 rounded text-[11px] gap-2">
                          <span className="font-semibold text-slate-100 line-clamp-1">{recTask.title}</span>
                          <button
                            type="button"
                            onClick={() => handleApplyAITask(recTask)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500 px-2 py-0.5 rounded text-[9px] font-bold shrink-0 shadow-sm"
                          >
                            Add to Kanban Task Board
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {aiError && (
            <div className="bg-red-50 text-red-700 p-2 text-[10px] border-b text-center border-red-200/50 shrink-0">
              {aiError}
            </div>
          )}

          {/* Chat Messages Scrolling Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {activeMessages.map((msg) => {
              const isSelf = msg.senderName === username;
              return (
                <div key={msg.id} className={`flex items-start gap-2 max-w-[85%] ${isSelf ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className="h-7 w-7 rounded-full bg-slate-200 select-none border border-slate-300/40 font-bold uppercase text-[10px] flex items-center justify-center shrink-0">
                    {msg.senderName.substring(0, 2)}
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className={`flex items-baseline gap-1 ${isSelf ? 'justify-end' : ''}`}>
                      <span className="font-bold text-slate-800">{msg.senderName}</span>
                      <span className="text-[8px] text-slate-400 capitalize">{msg.senderRole}</span>
                    </div>
                    <div className={`p-2.5 rounded-xl border leading-relaxed font-sans ${
                      isSelf 
                        ? 'bg-indigo-600 border-indigo-700 text-white rounded-tr-none' 
                        : 'bg-white border-slate-200 text-slate-700 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Active bottom input form */}
          <form onSubmit={handleSendChat} className="p-3 border-t border-slate-100 flex items-center gap-2 bg-white shrink-0">
            <input
              type="text"
              placeholder={`Send message to #${activeCommittee.name.split(' ')[0]} committee...`}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
            />
            <button
              type="submit"
              className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg hover:shadow-md transition-all flex items-center justify-center shrink-0"
              title="Send logs"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
