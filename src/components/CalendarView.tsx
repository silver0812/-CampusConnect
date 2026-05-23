import React, { useState } from 'react';
import { EventItem, Role, RSVPUser } from '../types';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Video, 
  Users, 
  Heart, 
  Plus, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CalendarViewProps {
  events: EventItem[];
  userRole: Role;
  username: string;
  onAddEvent: (newEvent: Omit<EventItem, 'id' | 'rsvps'>) => void;
  onToggleRSVP: (eventId: string) => void;
}

export default function CalendarView({
  events,
  userRole,
  username,
  onAddEvent,
  onToggleRSVP,
}: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // New Event Forms
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('2026-05-24');
  const [time, setTime] = useState('14:00');
  const [location, setLocation] = useState('Zoom / Online Meeting');
  const [link, setLink] = useState('');

  // Calendar Engine variables (simulating May 2026)
  const currentYear = 2026;
  const currentMonthIdx = 4; // May
  const monthName = "May 2026";
  const daysInMonth = 31;
  const startDayOffset = 5; // Friday offset (May 1, 2026 is Friday)

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !time) return;

    onAddEvent({
      title,
      description,
      date,
      time,
      location,
      link: link.trim() || undefined,
      organizer: username,
    });

    // Reset fields
    setTitle('');
    setDescription('');
    setDate('2026-05-24');
    setTime('14:00');
    setLocation('Zoom / Online Meeting');
    setLink('');
    setIsAdding(false);
  };

  const getEventsForDay = (day: number) => {
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `2026-05-${formattedDay}`;
    return events.filter(e => e.date === dateStr);
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h2 id="calendar-title" className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-indigo-600" />
            Active Organization Schedules
          </h2>
          <p className="text-sm text-slate-500">Coordinate and RSVP to upcoming general meetings and workshops</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Switchers */}
          <div className="bg-slate-100 p-0.5 rounded-lg flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                viewMode === 'list' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              📋 List View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                viewMode === 'grid' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              📅 Grid View
            </button>
          </div>

          {userRole === 'officer' && (
            <button
              id="btn-add-event"
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              New Event
            </button>
          )}
        </div>
      </div>

      {/* Grid calendar / Form toggle */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            id="panel-add-event"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-5 bg-white border border-indigo-100 rounded-xl shadow-md space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500/10" />
                Schedule Proposed Organization Session
              </h3>
              <button 
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Session Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Marketing Drive Kickoff"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                  <textarea
                    placeholder="Brief description about the event agenda..."
                    value={description}
                    rows={3}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Time</label>
                    <input
                      type="time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Location / Venue</label>
                  <input
                    type="text"
                    placeholder="e.g., Science Lab Hall OR Zoom Meeting"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Virtual Meeting Link (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://zoom.us/j/123456789"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="md:col-span-2 pt-3 border-t flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-slate-50 text-slate-500"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm"
                >
                  Create Calendar Event
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main calendars */}
      {viewMode === 'grid' ? (
        <div className="bg-white border rounded-xl shadow-sm p-4 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
              <ChevronLeft className="h-4 w-4 text-slate-400 shrink-0 cursor-not-allowed" />
              {monthName}
              <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 cursor-not-allowed" />
            </div>
            <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 py-0.5 px-2.5 rounded-full">
              {events.length} Total Engagements
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 pb-1">
            <span>SU</span><span>MO</span><span>TU</span><span>WE</span><span>TH</span><span>FR</span><span>SA</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {/* Start offset days empty */}
            {Array.from({ length: startDayOffset }).map((_, i) => (
              <div key={`offset-${i}`} className="bg-slate-50/20 aspect-video rounded-lg" />
            ))}

            {/* Active Month days */}
            {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
              const day = dayIndex + 1;
              const dayEvents = getEventsForDay(day);
              return (
                <div 
                  key={`day-${day}`} 
                  className={`border border-slate-100 aspect-video rounded-lg p-1.5 flex flex-col justify-between hover:bg-slate-50/50 transition-colors cursor-pointer min-h-[5rem] ${
                    dayEvents.length > 0 ? 'bg-indigo-50/10 border-indigo-100' : 'bg-white'
                  }`}
                  onClick={() => dayEvents.length > 0 && setSelectedEvent(dayEvents[0])}
                >
                  <span className="text-xs font-bold text-slate-800 self-start">{day}</span>
                  
                  {dayEvents.length > 0 && (
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 2).map(e => (
                        <div 
                          key={e.id} 
                          title={e.title}
                          className="text-[9px] px-1 py-0.5 font-bold uppercase truncate bg-indigo-600 text-white rounded text-left leading-none"
                        >
                          {e.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[8px] text-slate-400 font-bold self-end pr-1 font-sans">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Event Detailed list mode */
        <div id="events-list" className="space-y-4">
          {events.length === 0 ? (
            <div className="bg-white border rounded-xl p-8 text-center text-slate-400">
              No meetings scheduled. High committee action is needed!
            </div>
          ) : (
            events.map((event) => {
              const isRSVPed = event.rsvps.some(u => u.name === username);
              const formattedDateString = new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              });

              return (
                <motion.div
                  key={event.id}
                  id={`event-card-${event.id}`}
                  layoutId={`event-${event.id}`}
                  className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="space-y-3.5 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
                        📅 {formattedDateString}
                      </span>
                      <span className="text-slate-300 text-xs">•</span>
                      <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-600 border border-slate-200 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-800 leading-tight">
                        {event.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 font-sans">
                        Organized by <span className="font-semibold text-slate-600">{event.organizer}</span>
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 font-sans leading-relaxed">
                      {event.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3.5 text-xs font-sans text-slate-500">
                      {event.link ? (
                        <a 
                          href={event.link} 
                          target="_blank" 
                          rel="noreferrer noopener"
                          className="flex items-center gap-1 text-indigo-600 font-semibold hover:underline bg-indigo-50/40 border border-indigo-100 px-2 py-0.5 rounded"
                        >
                          <Video className="h-3 w-3 text-indigo-500" />
                          Join Virtual Zoom Meeting
                          <LinkIcon className="h-3 w-3 ml-0.5" />
                        </a>
                      ) : (
                        <span className="flex items-center gap-1 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded text-[11px] font-semibold">
                          <MapPin className="h-3 w-3 text-rose-500" />
                          {event.location}
                        </span>
                      )}
                      
                      <button 
                        type="button"
                        onClick={() => setSelectedEvent(event)}
                        className="flex items-center gap-1 cursor-pointer hover:text-indigo-600 transition-colors"
                      >
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        <strong>{event.rsvps.length}</strong> attending
                      </button>
                    </div>
                  </div>

                  {/* Actions / RSVP section */}
                  <div className="flex flex-col items-stretch md:items-end gap-3 shrink-0">
                    <div className="flex -space-x-1.5 overflow-hidden justify-start md:justify-end">
                      {event.rsvps.slice(0, 5).map((user, i) => (
                        <div
                          key={`${user.name}-${i}`}
                          className="h-7 w-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center font-bold text-[10px] text-slate-600 shrink-0 select-none uppercase shadow-sm"
                          title={user.name}
                        >
                          {user.name.substring(0, 2)}
                        </div>
                      ))}
                      {event.rsvps.length > 5 && (
                        <div className="h-7 w-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center font-bold text-[9px] text-slate-500 shadow-sm font-sans">
                          +{event.rsvps.length - 5}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleRSVP(event.id)}
                      className={`py-2 px-6 rounded-lg text-xs font-semibold border shadow-sm transition-all text-center flex items-center justify-center gap-1.5 ${
                        isRSVPed
                          ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100/70 font-bold'
                          : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      <Heart className={`h-3.5 w-3.5 ${isRSVPed ? 'fill-rose-500 text-rose-600' : 'text-white'}`} />
                      {isRSVPed ? 'RSVP Active (Going)' : 'RSVP Event'}
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {/* RSVP users modal/drawer */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border text-slate-800 rounded-xl overflow-hidden w-full max-w-sm shadow-xl p-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 bg-slate-50/50 -m-5 p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Who is going?:</span>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{selectedEvent.title}</h4>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  {selectedEvent.date} @ {selectedEvent.time}
                </p>
              </div>

              <div className="mt-4 max-h-48 overflow-y-auto space-y-2.5 pr-1">
                {selectedEvent.rsvps.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No RSVPs yet. Be the first!</p>
                ) : (
                  selectedEvent.rsvps.map((u, i) => (
                    <div key={`${u.name}-${i}`} className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <div className="h-6 w-6 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-[10px] uppercase flex items-center justify-center shrink-0">
                        {u.name.substring(0, 2)}
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-slate-700 leading-tight">{u.name}</p>
                        <p className="text-[9px] text-slate-400 leading-none capitalize">{u.role}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="w-full mt-5 py-2 border rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all font-sans"
              >
                Close List
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
