import React, { useState } from 'react';
import { 
  Megaphone, 
  Bell, 
  Calendar as CalendarIcon, 
  MessageSquare, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  Check, 
  X, 
  Cpu, 
  History, 
  DollarSign, 
  MousePointerClick, 
  Clock,
  LayoutDashboard
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingViewProps {
  onEnterApp: (view?: 'dashboard' | 'announcements' | 'schedule' | 'committees' | 'payments' | 'owner') => void;
  announcementsCount: number;
  eventsCount: number;
  orgName?: string;
  welcomeMessage?: string;
}

export default function LandingView({ 
  onEnterApp, 
  announcementsCount, 
  eventsCount,
  orgName = 'CampusConnect',
  welcomeMessage = 'CampusConnect syncs announcements, activities, schedules, and secure checkout gateways in an eye-safe ambient workspace layout. Ditch messy chats permanently.'
}: LandingViewProps) {
  // Simulated Interactive Mockup State
  const [activeSimTab, setActiveSimTab] = useState<'dashboard' | 'announcements' | 'calendar' | 'committees'>('dashboard');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('npm run dev');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const features = [
    {
      icon: Megaphone,
      title: 'Announcements Board',
      description: 'Officers post updates instantly. Members see everything in a clean, organized feed — no more buried messages.',
      color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Real-time alerts for meetings, deadlines, and important updates delivered directly to every member.',
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    {
      icon: CalendarIcon,
      title: 'Calendar of Activities',
      description: 'Visual monthly calendar with all org events. Add, edit, and track upcoming activities with ease.',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      icon: MessageSquare,
      title: 'Committee Messaging',
      description: 'Dedicated chat channels per committee. Keep conversations organized and relevant to each team.',
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    {
      icon: ShieldCheck,
      title: 'Role-Based Access',
      description: 'Admins manage everything. Members get their own personalized view. Secure and role-appropriate for all.',
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    },
    {
      icon: Layers,
      title: 'Member Dashboard',
      description: 'A personalized hub showing announcements, upcoming events, and unread notifications at a glance.',
      color: 'bg-violet-500/10 text-violet-400 border-violet-500/20'
    }
  ];

  return (
    <div className="bg-[#0a1628] text-slate-100 font-sans min-h-screen relative overflow-x-hidden selection:bg-blue-600 selection:text-white pb-16">
      
      {/* Background Gradients (Isolated inside landing) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-[10%] w-[80%] h-[700px] bg-[radial-gradient(ellipse_at_top,rgba(26,79,214,0.18),transparent_65%)]" />
        <div className="absolute bottom-[20%] right-[5%] w-[60%] h-[600px] bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.12),transparent_60%)]" />
        <div className="absolute top-[35%] left-[5%] w-[50%] h-[500px] bg-[radial-gradient(ellipse_at_left,rgba(96,165,250,0.06),transparent_50%)]" />
      </div>

      <div className="relative z-10">
        
        {/* Nav Header */}
        <nav className="sticky top-0 w-full z-50 bg-[#0a1628]/80 backdrop-blur-md border-b border-blue-500/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <Sparkles className="h-5 w-5 fill-blue-300 text-blue-100 animate-pulse" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight leading-none text-white font-syne flex items-center gap-1.5">
                {orgName}
                <span className="text-[10px] bg-blue-950 border border-blue-500/20 text-blue-400 font-mono px-1.5 py-0.5 rounded-full">Pro</span>
              </h1>
              <p className="text-[10px] text-blue-400/80 mt-0.5 font-semibold uppercase tracking-wider">Central Portal</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-400 hover:text-white transition-colors text-xs font-semibold tracking-wider uppercase">Features</a>
            <a href="#dashboard" className="text-slate-400 hover:text-white transition-colors text-xs font-semibold tracking-wider uppercase">Live Mockup</a>
            <a href="#solutions" className="text-slate-400 hover:text-white transition-colors text-xs font-semibold tracking-wider uppercase">About</a>
            <a href="#stack" className="text-slate-400 hover:text-white transition-colors text-xs font-semibold tracking-wider uppercase">Tech Stack</a>
          </div>

          <div>
            <button
              onClick={() => onEnterApp('dashboard')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              Enter Portal <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center select-none flex flex-col items-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-400/30 rounded-full text-xs text-blue-400 font-semibold tracking-wider uppercase mb-8">
            <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            🎓 Chapter Alignment Engine
          </span>

          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight font-syne text-white leading-[1.1] max-w-3xl">
            One Platform.<br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
              One Organization.<br />One Community.
            </span>
          </h2>

          <p className="text-slate-400 mt-6 text-sm md:text-lg max-w-2xl font-normal leading-relaxed">
            {welcomeMessage}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-sm">
            <button
              onClick={() => onEnterApp('dashboard')}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-extrabold rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/35 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              Launch Dashboard <Sparkles className="h-4 w-4" />
            </button>
            <a
              href="#dashboard"
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 border border-blue-500/20 hover:border-blue-500/40 text-slate-350 text-sm font-semibold rounded-xl text-center transition-all hover:bg-slate-850"
            >
              Explore Mockup
            </a>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="border-y border-blue-500/10 bg-slate-950/40 backdrop-blur-xs py-8 select-none">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-black font-syne text-blue-400 leading-none">100%</div>
              <div className="text-[10px] text-slate-500 font-extrabold tracking-widest uppercase mt-2">Centralized Comms</div>
            </div>
            <div>
              <div className="text-3xl font-black font-syne text-blue-400 leading-none">{announcementsCount + 3}+</div>
              <div className="text-[10px] text-slate-500 font-extrabold tracking-widest uppercase mt-2">Core Bulletins</div>
            </div>
            <div>
              <div className="text-3xl font-black font-syne text-blue-400 leading-none">{eventsCount + 2}</div>
              <div className="text-[10px] text-slate-500 font-extrabold tracking-widest uppercase mt-2">Active Events</div>
            </div>
            <div>
              <div className="text-3xl font-black font-syne text-blue-400 leading-none">∞</div>
              <div className="text-[10px] text-slate-500 font-extrabold tracking-widest uppercase mt-2">Team Syncs</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="max-w-5xl mx-auto px-6 py-24 scroll-mt-12 text-left">
          <span className="text-xs font-extrabold text-blue-400 uppercase tracking-widest">WHAT WE CHERISH</span>
          <h3 className="text-2xl md:text-4xl font-black tracking-tight font-syne text-white mt-1.5 mb-3">
            Everything your chapter needs in one place
          </h3>
          <p className="text-slate-400 text-sm md:text-base max-w-xl font-light leading-relaxed mb-12">
            No more chaotic messengers or lost files. Access notifications, calendars, and secure payment logs seamlessly inside a unified UI layout.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-slate-900/40 border border-blue-500/5 hover:border-blue-500/25 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 select-none"
                >
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center border ${feat.color} mb-4`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-bold text-white font-syne">{feat.title}</h4>
                  <p className="text-xs text-slate-400/90 mt-2.5 leading-relaxed font-light">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Live Mockup Section */}
        <section id="dashboard" className="max-w-5xl mx-auto px-6 py-16 scroll-mt-12 text-left">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-extrabold text-blue-400 uppercase tracking-widest">ACTIVE PREVIEW</span>
              <h3 className="text-2xl md:text-4xl font-black tracking-tight font-syne text-white mt-1.5">
                Play inside our live dashboard mockup
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-md font-light">
              Designed for high-density reading and micro-interactions. Click the sidebar links inside the simulated panel below to test drive different views instantly!
            </p>
          </div>

          {/* Simulated Browser Frame with interactive content */}
          <div className="border border-blue-500/15 bg-slate-950/60 rounded-2xl overflow-hidden shadow-2xl">
            {/* Window bar */}
            <div className="bg-slate-900 px-4 py-3 border-b border-blue-500/10 flex items-center gap-2 justify-between">
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <div className="bg-slate-950 text-[10px] text-blue-400/80 font-mono px-4 py-1.5 rounded-md border border-blue-500/5 flex-1 max-w-[320px] text-center truncate">
                campusconnect.app/workspace/{activeSimTab}
              </div>
              <div className="hidden md:flex items-center gap-1.5 shrink-0 text-slate-500 font-mono text-[9px]">
                <Clock className="w-3.5 h-3.5 text-blue-500/60" /> Live Demo
              </div>
            </div>

            {/* Simulated Desktop Workspace */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[440px]">
              
              {/* Simulated Sidebar */}
              <div className="col-span-3 bg-slate-950/80 border-r border-blue-500/10 p-4 space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold">CC</div>
                  <span className="text-xs font-extrabold font-syne text-white">Campus<span className="text-blue-400">Hub</span></span>
                </div>

                <div className="space-y-1">
                  {[
                    { id: 'dashboard', label: 'Dashboard View', icon: LayoutDashboard },
                    { id: 'announcements', label: 'Announcements', icon: Megaphone },
                    { id: 'calendar', label: 'Org calendar', icon: CalendarIcon },
                    { id: 'committees', label: 'Committees Chat', icon: MessageSquare }
                  ].map(tab => {
                    const TabIcon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveSimTab(tab.id as any)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs font-medium cursor-pointer transition-all ${
                          activeSimTab === tab.id 
                            ? 'bg-blue-600/15 text-blue-300 border-l-2 border-blue-500' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                      >
                        <TabIcon className="h-3.5 w-3.5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-blue-500/10 text-center select-none">
                  <span className="text-[10px] font-mono bg-blue-500/5 border border-blue-500/10 text-blue-400 px-2 py-1 rounded">
                    Role: Student Member
                  </span>
                </div>
              </div>

              {/* Simulated Main Content */}
              <div className="col-span-9 p-5 md:p-6 bg-slate-900/30 font-sans flex flex-col justify-between">
                <div>
                  
                  {/* Custom Simulated Views */}
                  {activeSimTab === 'dashboard' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-blue-500/5 pb-2">
                        <div>
                          <p className="text-[10px] text-blue-400/80 uppercase tracking-widest font-semibold">Active Directory</p>
                          <h4 className="text-sm font-bold text-white leading-tight">Welcome, Amelia Alvarez!</h4>
                        </div>
                        <span className="text-[10px] uppercase font-bold bg-blue-500/15 border border-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                          3 Alerts
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-slate-950 p-3 border border-blue-500/10 rounded-xl">
                          <p className="text-[9px] text-slate-500 font-extrabold tracking-wider uppercase">Urgent alerts</p>
                          <p className="text-lg font-black font-syne text-blue-400 mt-1">2 Unreads</p>
                        </div>
                        <div className="bg-slate-950 p-3 border border-blue-500/10 rounded-xl">
                          <p className="text-[9px] text-slate-500 font-extrabold tracking-wider uppercase">Schedules</p>
                          <p className="text-lg font-black font-syne text-emerald-400 mt-1">3 Events</p>
                        </div>
                        <div className="bg-slate-950 p-3 border border-blue-500/10 rounded-xl">
                          <p className="text-[9px] text-slate-500 font-extrabold tracking-wider uppercase">Pending Dues</p>
                          <p className="text-lg font-black font-syne text-rose-400 mt-1">$15.00</p>
                        </div>
                      </div>

                      <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl text-left select-none flex items-center justify-between">
                        <div>
                          <p className="text-[9px] text-blue-400 font-bold uppercase">Important Milestone Ahead</p>
                          <p className="text-xs text-slate-300 font-medium">Design Sprint registration opens this upcoming Friday afternoon.</p>
                        </div>
                        <MousePointerClick className="w-4 h-4 text-blue-400 animate-bounce shrink-0" />
                      </div>
                    </div>
                  )}

                  {activeSimTab === 'announcements' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-blue-500/5 pb-2">
                        <h4 className="text-xs font-extrabold text-[#94a3b8] uppercase tracking-wider flex items-center gap-1">
                          <Megaphone className="h-3 w-3 text-blue-400" />
                          Chapter Bulletin Log
                        </h4>
                      </div>

                      <div className="space-y-2">
                        <div className="p-3 bg-slate-950 border border-blue-500/10 rounded-xl text-left">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded">URGENT</span>
                            <span className="text-[9px] text-slate-500 font-mono">Today</span>
                          </div>
                          <p className="text-xs text-white font-bold mt-1.5">📌 Special Hackathon Kickoff &amp; Launch Procedures</p>
                          <p className="text-[10px] text-slate-450 mt-1 truncate">Gather up! We are opening registration paths online...</p>
                        </div>

                        <div className="p-3 bg-slate-950 border border-blue-500/5 rounded-xl text-left">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded">MERCH</span>
                            <span className="text-[9px] text-slate-500 font-mono">Yesterday</span>
                          </div>
                          <p className="text-xs text-slate-300 font-semibold mt-1.5">👕 Official Pullovers Ordered &amp; Merchandise Dues</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSimTab === 'calendar' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-blue-500/5 pb-2">
                        <h4 className="text-xs font-extrabold text-[#94a3b8] uppercase tracking-wider flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3 text-blue-400" />
                          Chapter Roadmap Timeline
                        </h4>
                      </div>

                      <div className="space-y-2 text-left">
                        <div className="flex gap-2.5 items-start p-2.5 bg-slate-950 border border-blue-500/10 rounded-xl">
                          <div className="text-center bg-blue-600/20 text-blue-400 font-bold px-2 py-1 rounded font-mono text-xs w-12 tracking-tighter">
                            MAY 24
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-white leading-none">🎯 Design Hackathon Kickoff</p>
                            <p className="text-[9px] text-slate-400 mt-1">Science Complex Hall 306 @ 14:00</p>
                          </div>
                        </div>

                        <div className="flex gap-2.5 items-start p-2.5 bg-slate-950 border border-blue-500/5 rounded-xl">
                          <div className="text-center bg-emerald-600/25 text-emerald-400 font-bold px-2 py-1 rounded font-mono text-xs w-12 tracking-tighter">
                            MAY 26
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-300 leading-none">🚀 Officers Weekly Management Sync</p>
                            <p className="text-[9px] text-slate-450 mt-1">Zoom Portal Room</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSimTab === 'committees' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-blue-500/5 pb-2">
                        <h4 className="text-xs font-extrabold text-[#94a3b8] uppercase tracking-wider flex items-center gap-1">
                          <MessageSquare className="h-3 w-3 text-blue-400" />
                          Logistics Workroom Chat
                        </h4>
                      </div>

                      <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 text-[11px] leading-relaxed">
                        <div className="text-left">
                          <span className="font-bold text-blue-300">Marcus Vance:</span> <span className="text-slate-400">Hey team, did we lock the Science hall availability code?</span>
                        </div>
                        <div className="text-left">
                          <span className="font-bold text-emerald-400">Kiana Sterling:</span> <span className="text-slate-400">Yes! Admin approved and Room 306 is scheduled.</span>
                        </div>
                        <div className="text-left bg-blue-500/5 p-1 rounded">
                          <span className="font-bold text-white">Amelia Alvarez (You):</span> <span className="text-slate-300">Awesome. Updating RSVP list entries right now.</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Lower Action bar inside browser preview */}
                <div className="border-t border-blue-500/5 pt-3 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-500">
                    *This is a live preview. Click the primary launcher below to open the fully functional systems.
                  </span>
                  <button
                    onClick={() => {
                      const mapping: Record<string, 'dashboard' | 'announcements' | 'schedule' | 'committees'> = {
                        dashboard: 'dashboard',
                        announcements: 'announcements',
                        calendar: 'schedule',
                        committees: 'committees'
                      };
                      onEnterApp(mapping[activeSimTab] || 'dashboard');
                    }}
                    className="cursor-pointer shrink-0 text-[10px] font-extrabold bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-1.5 transition-all flex items-center gap-1 self-end"
                  >
                    Open Live Interface <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* Comparison Section / Problem vs Solution */}
        <section id="solutions" className="max-w-5xl mx-auto px-6 py-24 scroll-mt-12 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* The Problem */}
            <div className="p-8 bg-slate-950/30 rounded-2xl border border-red-500/10">
              <span className="text-xs font-extrabold text-red-400 uppercase tracking-widest">CHAPTER BOTTLENECK</span>
              <h3 className="text-xl md:text-2xl font-black tracking-tight font-syne text-white mt-1.5 mb-6">
                Communication is broken in student orgs
              </h3>

              <div className="space-y-4">
                {[
                  'Important announcements buried in random group chats',
                  'Missed deadlines because of notification overload',
                  'Committee updates scattered across four separate platforms',
                  'No historical logs or centralized calendars',
                  'Reduced member engagement and participation rates'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed font-light">
                    <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* The Solution */}
            <div className="p-8 bg-slate-950/40 rounded-2xl border border-emerald-500/10">
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">THE PLATFORM SOLUTION</span>
              <h3 className="text-xl md:text-2xl font-black tracking-tight font-syne text-white mt-1.5 mb-6">
                CampusConnect fixes all of that
              </h3>

              <div className="space-y-4">
                {[
                  'Centralized announcement board everyone can access',
                  'Smart filters and priority notifications sent to the right views',
                  'Dedicated spaces per branch with Kanban task management',
                  'Unified secure payments gateway for annual dues & merchandise',
                  'Beautiful offline-ready React interface built for accessibility'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed font-light">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Tech Stack Section */}
        <section id="stack" className="max-w-5xl mx-auto px-6 py-16 scroll-mt-12 text-left bg-slate-950/20 rounded-2xl border border-blue-500/5">
          <span className="text-xs font-extrabold text-blue-400 uppercase tracking-widest">TECHNOLOGY CORE</span>
          <h3 className="text-2xl md:text-4xl font-black tracking-tight font-syne text-white mt-1.5 mb-3">
            Built with modern, scalable stack
          </h3>
          <p className="text-slate-400 text-xs md:text-sm max-w-xl font-light leading-relaxed mb-6">
            A hackathon-ready template designed with clean state-management architectures, compiled into highly efficient scripts.
          </p>

          <div className="flex flex-wrap gap-2.5 max-w-3xl">
            {[
              { label: '⚛️ React 19', detail: 'Dynamic SPAs' },
              { label: '🔷 TypeScript', detail: 'Strict Types' },
              { label: '🎨 Tailwind CSS', detail: 'Custom Themes' },
              { label: '🟢 Express', detail: 'Backend API' },
              { label: '🚀 Esbuild', detail: 'Fast Bundling' },
              { label: '🔥 Firebase Sim', detail: 'Data Blueprint' },
              { label: '📦 Vite', detail: 'Asset HotReload' },
              { label: '🌀 Lucide', detail: 'Vector Graphics' },
              { label: '⚡ Motion', detail: 'Interactions' }
            ].map((pill, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900 border border-blue-500/10 hover:border-blue-500/30 px-4 py-2 rounded-full text-xs font-semibold text-slate-300 flex items-center gap-2 transition-all cursor-default select-none"
              >
                <span>{pill.label}</span>
                <span className="text-[9px] font-mono text-blue-500 bg-blue-950/30 px-1.5 py-0.2 rounded font-normal uppercase">{pill.detail}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-5 border-t border-blue-500/5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px]">
            <div className="text-slate-500">
              Ready-compiled application directory entry point: <span className="text-blue-400">/src/App.tsx</span> (ESM)
            </div>
            <div 
              onClick={handleCopyCommand}
              className="bg-slate-950 hover:bg-slate-900 border border-blue-500/10 text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer transition-all self-end"
            >
              <code>$ npm run dev</code>
              <span className="text-[9px] font-sans bg-blue-950 border border-blue-500/20 text-blue-300 px-1 py-0.2 rounded-sm leading-none">
                {copiedCode ? 'Copied ✓' : 'Copy'}
              </span>
            </div>
          </div>
        </section>

        {/* Call To Action Section */}
        <div className="max-w-4xl mx-auto px-6 py-16 text-center select-none mt-16">
          <div className="bg-gradient-to-r from-blue-950 via-[#0a1628] to-indigo-950 rounded-3xl border border-blue-500/20 p-8 md:p-12 shadow-2xl space-y-4">
            <h3 className="text-2xl md:text-3xl font-black font-syne text-white tracking-tight">
              Connect. Collaborate. Succeed.
            </h3>
            <p className="text-slate-400 text-xs md:text-sm max-w-lg mx-auto font-light leading-relaxed">
              One central dashboard for your student organization members, logistical committees, and treasury invoices.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center max-w-xs mx-auto">
              <button
                onClick={() => onEnterApp('dashboard')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                Enter Free Portal <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('features');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-slate-900 border border-blue-500/20 hover:border-blue-500/40 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer text-center flex items-center justify-center"
              >
                Read Features
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
