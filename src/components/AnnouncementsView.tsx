import React, { useState } from 'react';
import { Announcement, Role } from '../types';
import { 
  Megaphone, 
  Pin, 
  Tag, 
  Plus, 
  CheckCircle, 
  BookOpen, 
  Sparkles, 
  Loader2, 
  Send,
  User,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AnnouncementsViewProps {
  announcements: Announcement[];
  userRole: Role;
  username: string;
  onAddAnnouncement: (announcement: Omit<Announcement, 'id' | 'date' | 'readBy'>) => void;
  onToggleRead: (id: string) => void;
}

export default function AnnouncementsView({
  announcements,
  userRole,
  username,
  onAddAnnouncement,
  onToggleRead,
}: AnnouncementsViewProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'general' | 'urgent' | 'academic' | 'event'>('all');
  const [isAdding, setIsAdding] = useState(false);
  
  // Announcement Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'general' | 'academic' | 'urgent' | 'event'>('general');
  const [isPinned, setIsPinned] = useState(false);

  // AI Assistant States
  const [aiTopic, setAiTopic] = useState('');
  const [aiTone, setAiTone] = useState<'professional' | 'energetic' | 'urgent' | 'friendly'>('friendly');
  const [isPlayingAI, setIsPlayingAI] = useState(false);
  const [aiDescription, setAiDescription] = useState('');
  const [aiError, setAiError] = useState<string | null>(null);

  // Filtered Announcements
  const filteredAnnouncements = announcements
    .filter(a => activeTab === 'all' || a.category === activeTab)
    // Sort pinned first, then by date desc (mock sorting)
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.id.localeCompare(a.id); // Newer first based on id
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    onAddAnnouncement({
      title,
      content,
      category,
      author: username,
      role: userRole,
      isPinned,
    });

    // Reset Form
    setTitle('');
    setContent('');
    setCategory('general');
    setIsPinned(false);
    setIsAdding(false);
  };

  // AI Draft generator call
  const generateAIDraft = async () => {
    if (!aiTopic.trim()) {
      setAiError("Please type an assistant topic or keywords first!");
      return;
    }
    setIsPlayingAI(true);
    setAiError(null);

    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          category,
          tone: aiTone,
          description: aiDescription,
        }),
      });

      const data = await response.json();
      if (data.text) {
        setContent(data.text);
        if (!title) {
          setTitle(`Update: ${aiTopic}`);
        }
      } else if (data.error) {
        setAiError(data.error);
      }
    } catch (err: any) {
      console.error(err);
      setAiError("Connection to AI assistant failed. Please try again or create post manually.");
    } finally {
      setIsPlayingAI(false);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'urgent':
        return 'bg-red-50 text-red-700 border-red-200 ring-red-500/15';
      case 'academic':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/15';
      case 'event':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/15';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/15';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h2 id="announcements-title" className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-indigo-600" />
            Broadcasting Center
          </h2>
          <p className="text-sm text-slate-500">Official updates, campus alerts, and committee declarations</p>
        </div>

        {userRole === 'officer' && (
          <button
            id="btn-add-announcement"
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm transition-all duration-200 hover:shadow"
          >
            {isAdding ? 'Cancel Post' : 'Post Announcement'}
            <Plus className={`h-4 w-4 transition-transform duration-200 ${isAdding ? 'rotate-45' : ''}`} />
          </button>
        )}
      </div>

      {/* Add Announcement Panel */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            id="panel-add-announcement"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden bg-white border border-gray-100 rounded-xl shadow-sm"
          >
            <div className="p-5 border-b border-gray-50 bg-slate-50/50">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Sparkles className="h-4 w-4 text-amber-500 fill-amber-100" />
                AI-Assisted Writing Co-Pilot
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Let Gemini structure a professional memo or write it manually below.</p>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Topic or Announcement Goal</label>
                    <input 
                      type="text"
                      placeholder="e.g. Org Shirt ordering details, General Assembly venue shift"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Tone &amp; Style Choice</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['friendly', 'professional', 'energetic', 'urgent'] as const).map((tone) => (
                        <button
                          key={tone}
                          type="button"
                          onClick={() => setAiTone(tone)}
                          className={`text-[10px] py-1.5 px-1 font-medium capitalize rounded border transition-all ${
                            aiTone === tone 
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold' 
                              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {tone}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Rough Notes, Bullet Points or Logistics</label>
                    <textarea
                      placeholder="e.g. Wednesday 4PM, Science Hall Room 302, bring $15, free sticker included..."
                      value={aiDescription}
                      rows={2}
                      onChange={(e) => setAiDescription(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white resize-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={generateAIDraft}
                    disabled={isPlayingAI}
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-medium rounded-lg text-xs shadow-sm transition-all duration-150 flex items-center justify-center gap-2"
                  >
                    {isPlayingAI ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Gemini Compose Active...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" />
                        Generate AI Announcement Draft
                      </>
                    )}
                  </button>
                </div>
              </div>

              {aiError && (
                <div className="mt-3 p-2 bg-red-50 text-red-700 text-[11px] rounded-lg border border-red-100 flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                  {aiError}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Announcement Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter short, eye-catching subject header..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="md:col-span-4">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-sm px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white outline-none"
                  >
                    <option value="general">📢 General News</option>
                    <option value="urgent">🚨 Crisis / Urgent</option>
                    <option value="academic">📚 Academic Sync</option>
                    <option value="event">🎉 Special Event</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1 font-semibold">Memo Content</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Draft detailed memo. Supports paragraph formatting. AI Draft inserts directly here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-sans"
                />
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <label className="flex items-center gap-2 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                    <Pin className="h-3 w-3 text-amber-500" />
                    Pin this broadcast at the top
                  </span>
                </label>

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                  >
                    Publish Memo
                    <Send className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category filters */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {(['all', 'general', 'urgent', 'academic', 'event'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize border transition-all shrink-0 ${
              activeTab === tab
                ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
            }`}
          >
            {tab === 'all' && '🌍 All Signals'}
            {tab === 'general' && '📢 General'}
            {tab === 'urgent' && '🚨 Urgent'}
            {tab === 'academic' && '📚 Academic'}
            {tab === 'event' && '🎉 Events'}
          </button>
        ))}
      </div>

      {/* Announcements list */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-8 text-center text-slate-400 font-medium">
            <Megaphone className="h-8 w-8 mx-auto mb-2 opacity-50" />
            No announcements found in this channel.
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => {
            const isRead = announcement.readBy.includes(username);
            return (
              <motion.div
                key={announcement.id}
                id={`announcement-card-${announcement.id}`}
                layout
                className={`p-5 bg-white border rounded-xl shadow-sm hover:shadow transition-all relative ${
                  announcement.isPinned ? 'border-amber-200/80 bg-amber-50/10' : 'border-slate-100/90'
                }`}
              >
                {/* Pin indicator */}
                {announcement.isPinned && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 py-0.5 px-2 bg-amber-50 border border-amber-200 rounded-full text-[10px] font-semibold text-amber-700">
                    <Pin className="h-2.5 w-2.5 fill-amber-500 text-amber-600" />
                    Pinned
                  </div>
                )}

                <div className="space-y-3.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Category pill */}
                    <span className={`text-[10px] font-bold uppercase tracking-wider py-0.5 px-2 border rounded-full ${getCategoryColor(announcement.category)}`}>
                      {announcement.category}
                    </span>
                    <span className="text-slate-300 text-xs">•</span>
                    <span className="text-xs text-slate-400 font-sans flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {announcement.date}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5 leading-snug">
                      {announcement.title}
                    </h3>
                    <div className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                      <User className="h-3 w-3 text-slate-400" />
                      Issued by <span className="text-indigo-600 font-semibold">{announcement.author}</span>
                      <span className="text-[10px] bg-slate-50 text-slate-400 px-1.5 py-0.2 border rounded">
                        {announcement.role === 'officer' ? 'Org Officer' : 'Member'}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line font-sans">
                    {announcement.content}
                  </p>

                  <div className="pt-3 border-t border-dashed border-slate-100 flex items-center justify-between">
                    <div>
                      {!isRead ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 py-0.5 px-2 rounded border border-amber-100">
                          <BookOpen className="h-2.5 w-2.5" />
                          Unread
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 py-0.5 px-2 rounded border border-emerald-100">
                          <CheckCircle className="h-2.5 w-2.5" />
                          Marked Read
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleRead(announcement.id)}
                      className={`text-xs font-semibold py-1 px-3 border rounded-lg transition-all ${
                        isRead 
                          ? 'text-slate-400 hover:text-slate-500 hover:bg-slate-50 bg-white border-slate-100' 
                          : 'text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 border-indigo-100'
                      }`}
                    >
                      {isRead ? 'Mark as Unread' : 'Mark as Read ✓'}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
