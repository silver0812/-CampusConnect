import React, { useState, useEffect } from 'react';
import { 
  Role, 
  Announcement, 
  EventItem, 
  Committee, 
  Task, 
  ChatMessage, 
  ShopItem, 
  CartItem, 
  Transaction 
} from './types';
import AnnouncementsView from './components/AnnouncementsView';
import CalendarView from './components/CalendarView';
import CommitteesView from './components/CommitteesView';
import PaymentsView from './components/PaymentsView';
import LandingView from './components/LandingView';
import OwnerView from './components/OwnerView';
import AuthView from './components/AuthView';
import { 
  Megaphone, 
  Calendar as CalendarIcon, 
  Users, 
  ShoppingBag, 
  Sparkles, 
  Menu, 
  X, 
  User, 
  Clock, 
  DollarSign, 
  CheckCircle,
  Activity,
  Heart,
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Global View Layout: 'landing' | 'dashboard' | 'announcements' | 'schedule' | 'committees' | 'payments' | 'owner'
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'announcements' | 'schedule' | 'committees' | 'payments' | 'owner'>('landing');
  const [userRole, setUserRole] = useState<Role>('member');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Authentication states and handlers
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('Amelia Alvarez');
  const [userEmail, setUserEmail] = useState('amelia.alvarez@student.apc.edu.ph');
  const [registeredUsers, setRegisteredUsers] = useState<Array<{ name: string; email: string; password: string; role: Role }>>([
    { name: 'Admin Owner', email: 'owner@gmail.com', password: 'admin123', role: 'officer' },
    { name: 'Amelia Alvarez', email: 'amelia.alvarez@student.apc.edu.ph', password: 'amelia123', role: 'member' },
    { name: 'Marcus Vance', email: 'marcus.vance@student.apc.edu.ph', password: 'marcus123', role: 'member' }
  ]);

  const handleRegisterUser = (name: string, email: string, pb: string): boolean => {
    const emailLower = email.trim().toLowerCase();
    if (registeredUsers.some(u => u.email.toLowerCase() === emailLower)) {
      return false;
    }
    
    // Role verification using domain:
    // @gmail.com = owner / officer
    // @student.apc.edu.ph = member
    let role: Role = 'member';
    if (emailLower.endsWith('@gmail.com')) {
      role = 'officer';
    } else if (emailLower.endsWith('@student.apc.edu.ph')) {
      role = 'member';
    }

    const newUser = {
      name,
      email: emailLower,
      password: pb,
      role
    };
    setRegisteredUsers(prev => [...prev, newUser]);
    return true;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('landing');
    setMobileMenuOpen(false);
    addLog(`Logged out successfully. Transient session cleared.`);
  };

  // Dynamic config states for My Space (Owner Workspace)
  const [orgName, setOrgName] = useState('CampusConnect');
  const [welcomeMessage, setWelcomeMessage] = useState('CampusConnect syncs announcements, activities, schedules, and secure checkout gateways in an eye-safe ambient workspace layout. Ditch messy chats permanently.');
  const [duesPrice, setDuesPrice] = useState(15.00);
  const [systemStatus, setSystemStatus] = useState<'online' | 'maintenance' | 'stealth'>('online');
  const [primaryColor, setPrimaryColor] = useState('indigo');
  const [activePromoCodes, setActivePromoCodes] = useState<{ code: string; discount: number }[]>([
    { code: 'WELCOMESPRING', discount: 15 },
    { code: 'TECHINNOVATE', discount: 25 }
  ]);

  const getAccentColor = () => {
    switch (primaryColor) {
      case 'blue':
        return {
          bg: 'bg-blue-600',
          bgLight: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-600',
          hoverText: 'hover:text-blue-600',
          focusRing: 'focus:ring-blue-500',
          badge: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
        };
      case 'emerald':
        return {
          bg: 'bg-emerald-600',
          bgLight: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-600',
          hoverText: 'hover:text-emerald-600',
          focusRing: 'focus:ring-emerald-500',
          badge: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
        };
      case 'amber':
        return {
          bg: 'bg-amber-600',
          bgLight: 'bg-amber-50',
          text: 'text-amber-800',
          border: 'border-amber-500',
          hoverText: 'hover:text-amber-600',
          focusRing: 'focus:ring-amber-500',
          badge: 'bg-amber-100 text-amber-800 hover:bg-amber-200'
        };
      case 'rose':
        return {
          bg: 'bg-rose-600',
          bgLight: 'bg-rose-50',
          text: 'text-rose-700',
          border: 'border-rose-600',
          hoverText: 'hover:text-rose-600',
          focusRing: 'focus:ring-rose-500',
          badge: 'bg-rose-100 text-rose-700 hover:bg-rose-200'
        };
      case 'indigo':
      default:
        return {
          bg: 'bg-indigo-600',
          bgLight: 'bg-indigo-50',
          text: 'text-indigo-700',
          border: 'border-indigo-600',
          hoverText: 'hover:text-indigo-600',
          focusRing: 'focus:ring-indigo-500',
          badge: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
        };
    }
  };

  const accent = getAccentColor();

  // PRE-SEEDED DATA STATES
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 'ann-1',
      title: '📌 Special Hackathon Kickoff & Launch Procedures',
      content: 'Gear up! We are officially opening registration paths for the CampusConnect design sprint. Executive officers will handle team allocation rules this upcoming Friday, with direct briefing sessions hosted online. Team deliverables will prioritize community communication systems.',
      category: 'urgent',
      date: 'May 22, 2026',
      author: 'Marcus Vance',
      role: 'officer',
      isPinned: true,
      readBy: ['Amelia Alvarez']
    },
    {
      id: 'ann-2',
      title: '📢 Chapter Operational Dues & Merchandise Apparel Order',
      content: 'Official CampusConnect hooded pullovers and chapter sticker sets are now available in the payments tab! Dues collections must be finalised using the Secure Checkout Gateways before standard semester certifications. Contact the Finance committee for details.',
      category: 'general',
      date: 'May 21, 2026',
      author: 'Kiana Sterling',
      role: 'officer',
      isPinned: false,
      readBy: []
    },
    {
      id: 'ann-3',
      title: '📚 Academic Resource Repository Access Guide',
      content: 'Curated semester guides, syllabus matrices, and old homework repositories have been successfully migrated. Access codes were shared directly inside committee chats. If you find missing folders, please notify Tech Support.',
      category: 'academic',
      date: 'May 19, 2026',
      author: 'Prof. Chloe Vance',
      role: 'officer',
      isPinned: false,
      readBy: ['Amelia Alvarez']
    }
  ]);

  const [events, setEvents] = useState<EventItem[]>([
    {
      id: 'evt-1',
      title: '🎯 Design Sprint Hackathon Kickoff & Alignment',
      description: 'The definitive kickoff event! Meet your teams, consult committee leaders, and outline design guidelines under absolute mentoring support.',
      date: '2026-05-24',
      time: '14:00',
      location: 'Science Complex Hall 306',
      organizer: 'Tech Committee',
      rsvps: [
        { name: 'Marcus Vance', avatar: '', role: 'officer' },
        { name: 'Kiana Sterling', avatar: '', role: 'officer' },
        { name: 'Chloe Vance', avatar: '', role: 'officer' }
      ]
    },
    {
      id: 'evt-2',
      title: '🚀 Executive Officer Weekly Alignment Sync',
      description: 'Reviewing budget proposals, dues invoices, active task backlogs, and assigning calendar items.',
      date: '2026-05-26',
      time: '17:30',
      location: 'Zoom Virtual Meeting Room',
      link: 'https://zoom.us/j/9876543210',
      organizer: 'Marcus Vance',
      rsvps: [
        { name: 'Marcus Vance', avatar: '', role: 'officer' },
        { name: 'Kiana Sterling', avatar: '', role: 'officer' }
      ]
    },
    {
      id: 'evt-3',
      title: '🎨 Marketing Brand Strategy Layout Workroom',
      description: 'Aligning final design sticker drafts, hoodie logos, and publishing promo brochures for CampusConnect promotion grids.',
      date: '2026-05-29',
      time: '11:00',
      location: 'Student Hub Workspace B',
      organizer: 'Marketing Committee',
      rsvps: [
        { name: 'Chloe Vance', avatar: '', role: 'officer' },
        { name: 'Amelia Alvarez', avatar: '', role: 'member' }
      ]
    }
  ]);

  const committees: Committee[] = [
    { id: 'marketing', name: '🎨 Marketing Branch', description: 'Promotes organization events, crafts stickers, creates hoodies, and designs visual prints', color: 'border-l-indigo-500 text-indigo-700' },
    { id: 'logistics', name: '📦 Logistics Branch', description: 'Manages physical meeting rooms, books physical halls, and structures student events calendar', color: 'border-l-emerald-500 text-emerald-700' },
    { id: 'tech', name: '💻 Technology Branch', description: 'Designs online portal interfaces, handles repository access codes, and maintains files', color: 'border-l-amber-500 text-amber-700' },
    { id: 'finance', name: '📈 Finance Branch', description: 'Formulates budget guidelines, manages dues receipts, and validates transaction logs', color: 'border-l-rose-500 text-rose-700' }
  ];

  const [tasks, setTasks] = useState<Task[]>([
    { id: 'task-1', title: 'Publish Promo Brochure drafts', description: 'Upload initial sticker designs for Kiana to inspect', priority: 'medium', status: 'in_progress', assignee: { name: 'Amelia Alvarez', avatar: '' }, committeeId: 'marketing' },
    { id: 'task-2', title: 'Compile chapter hoodie measurements', description: 'Collect size statistics from members checklist', priority: 'low', status: 'todo', assignee: { name: 'Chloe Vance', avatar: '' }, committeeId: 'marketing' },
    { id: 'task-3', title: 'Confirm Science Complex booking', description: 'Acquire official administration signature codes', priority: 'high', status: 'done', assignee: { name: 'Kiana Sterling', avatar: '' }, committeeId: 'logistics' },
    { id: 'task-4', title: 'Establish server-side Gemini gateway', description: 'Deploy server routers and bind port configurations', priority: 'high', status: 'review', assignee: { name: 'Amelia Alvarez', avatar: '' }, committeeId: 'tech' },
    { id: 'task-5', title: 'Audit annual budget balances', description: 'Formulate receipts logs for auditor review', priority: 'medium', status: 'todo', assignee: { name: 'Marcus Vance', avatar: '' }, committeeId: 'finance' }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 'msg-1', senderName: 'Marcus Vance', senderAvatar: '', senderRole: 'officer', content: 'Hey team, did we confirm the Science Hall room availability for the Hackathon kickoff?', timestamp: '4:15 PM', committeeId: 'logistics' },
    { id: 'msg-2', senderName: 'Kiana Sterling', senderAvatar: '', senderRole: 'officer', content: 'Yes! Admin has officially locked Room 306 for us. Booking is cleared and registered.', timestamp: '4:18 PM', committeeId: 'logistics' },
    { id: 'msg-3', senderName: 'Amelia Alvarez', senderAvatar: '', senderRole: 'member', content: 'Awesome! I will update the calendar description and configure RSVP links.', timestamp: '4:22 PM', committeeId: 'logistics' },
    { id: 'msg-4', senderName: 'Chloe Vance', senderAvatar: '', senderRole: 'officer', content: 'Hi everyone! I just launched merchandise options. Please tell members to pay their dues soon!', timestamp: '5:02 PM', committeeId: 'marketing' },
    { id: 'msg-5', senderName: 'Amelia Alvarez', senderAvatar: '', senderRole: 'member', content: 'I am ordering my hoodies right now.', timestamp: '5:05 PM', committeeId: 'marketing' },
    { id: 'msg-6', senderName: 'Amelia Alvarez', senderAvatar: '', senderRole: 'member', content: 'Has anyone configured the api endpoints yet? Checking server.ts setups.', timestamp: '4:10 PM', committeeId: 'tech' }
  ]);

  const shopItems: ShopItem[] = [
    { id: 'shop-dues-1', name: '💳 Annual Chapter Membership Fee', description: 'Official registration fee clearance. Grants absolute voting rights, committee selection access, and official member listings.', price: duesPrice, category: 'dues', image: '' },
    { id: 'shop-merch-1', name: `👕 Official ${orgName} hooded Pullover`, description: 'Premium ultra-soft fleece hoodie featuring detailed embroideries and secure double-stitch hems. Perfect for campus chills.', price: 29.99, category: 'merch', image: '' },
    { id: 'shop-merch-2', name: '📦 Limited Design Holographic Stickers', description: 'A 5-pack of high-durability weather-resistant stickers suitable for laptop decoration. Includes original brand logos.', price: 4.99, category: 'merch', image: '' },
    { id: 'shop-merch-3', name: '💧 Technology Branch Vacuum Flask bottle', description: 'Stainless steel double-walled insulated bottle to maintain hydration during sprints. Laser engraved logo prints.', price: 18.50, category: 'merch', image: '' }
  ];

  const [cart, setCart] = useState<CartItem[]>([
    { item: shopItems[0], quantity: 1 } // preseed annual dues in cart for ease of testing!
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    // Blank initially to let users experience invoice flows
  ]);

  const [systemLogs, setSystemLogs] = useState<string[]>([
    "System Initialized successfully.",
    "Communication node loaded at port 3000.",
    "Loaded preseeded organization agendas."
  ]);

  // DERIVED METRICS
  const isDuesPaid = transactions.some(t => t.items.some(i => i.name.includes("Membership Fee")));
  const pendingDuesCount = isDuesPaid ? 0 : 1;

  // Add system Log helper
  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSystemLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 5)]);
  };

  // ANNOUNCEMENTS HANDLERS
  const handleAddAnnouncement = (newAnn: Omit<Announcement, 'id' | 'date' | 'readBy'>) => {
    const ann: Announcement = {
      ...newAnn,
      id: `ann-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readBy: [username]
    };
    setAnnouncements(prev => [ann, ...prev]);
    addLog(`New Broadcast issued: "${newAnn.title}"`);
  };

  const handleToggleRead = (id: string) => {
    setAnnouncements(prev => prev.map(a => {
      if (a.id === id) {
        const alreadyRead = a.readBy.includes(username);
        return {
          ...a,
          readBy: alreadyRead 
            ? a.readBy.filter(u => u !== username) 
            : [...a.readBy, username]
        };
      }
      return a;
    }));
  };

  // CALENDAR EVENT HANDLERS
  const handleAddEvent = (newEvent: Omit<EventItem, 'id' | 'rsvps'>) => {
    const ev: EventItem = {
      ...newEvent,
      id: `evt-${Date.now()}`,
      rsvps: [{ name: username, avatar: '', role: userRole }]
    };
    setEvents(prev => [...prev, ev]);
    addLog(`Proposed Event: "${newEvent.title}" on ${newEvent.date}`);
  };

  const handleToggleRSVP = (eventId: string) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        const hasRSVP = evt.rsvps.some(u => u.name === username);
        const updatedRsvps = hasRSVP
          ? evt.rsvps.filter(u => u.name !== username)
          : [...evt.rsvps, { name: username, avatar: '', role: userRole }];
        
        addLog(hasRSVP ? `Withdrawn RSVP from event: "${evt.title}"` : `RSVP confirmed for event: "${evt.title}"`);
        
        return { ...evt, rsvps: updatedRsvps };
      }
      return evt;
    }));
  };

  // COMMITTEES WORKFLOW HANDLERS
  const handleAddTask = (newTask: Omit<Task, 'id' | 'assignee'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      assignee: { name: username, avatar: '' }
    };
    setTasks(prev => [...prev, task]);
    addLog(`Assigned workflow task: "${newTask.title}"`);
  };

  const handleMoveTask = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        addLog(`Moved task "${t.title}" status to: ${newStatus.toUpperCase()}`);
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    setTasks(prev => prev.filter(t => t.id !== taskId));
    addLog(`Deleted workflow log: "${task.title}"`);
  };

  const handleAddChatMessage = (content: string, committeeId: string) => {
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: username,
      senderAvatar: '',
      senderRole: userRole,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      committeeId
    };
    setChatMessages(prev => [...prev, msg]);
    // Only log if it's the user speaking to avoid double logs from automatic replies
    if (username === msg.senderName) {
      addLog(`Chat dispatch transmitted: "${content.substring(0, 20)}..."`);
    }
  };

  // SHOP PORTAL & PAYMENT HANDLERS
  const handleAddToCart = (item: ShopItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) {
        return prev.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { item, quantity: 1 }];
    });
    addLog(`Cart Added: ${item.name}`);
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prev => prev.filter(c => c.item.id !== itemId));
    addLog(`Cart item cleared.`);
  };

  const handleUpdateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(c => c.item.id === itemId ? { ...c, quantity } : c));
  };

  const handleCompleteCheckout = (transactionDetails: Omit<Transaction, 'id' | 'date'>) => {
    const finalTxn: Transaction = {
      ...transactionDetails,
      id: 'TXN-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    setTransactions(prev => [finalTxn, ...prev]);
    setCart([]); // Clear cart
    addLog(`Transaction completed for sum: $${finalTxn.total.toFixed(2)}. Dues catalog updated!`);
  };

  const handleInjectMockMember = (name: string, committeeId: string) => {
    handleAddChatMessage(`[SYSTEM SIGNAL] Simulated member "${name}" was successfully deployed into this branch workspace! Hello team!`, committeeId);
    addLog(`Owner Space: Injected custom user "${name}" in ${committeeId.toUpperCase()}`);
  };

  const handleAddPromoCode = (code: string, discount: number) => {
    setActivePromoCodes(prev => [...prev.filter(p => p.code !== code.toUpperCase()), { code: code.toUpperCase(), discount }]);
  };

  if (!isLoggedIn) {
    return (
      <AuthView
        orgName={orgName}
        primaryColor={primaryColor}
        onLogin={(name, email, role) => {
          setUsername(name);
          setUserEmail(email);
          setUserRole(role);
          setIsLoggedIn(true);
          setCurrentView('landing');
          addLog(`Logged in securely as: ${name} (${role})`);
        }}
        onAddLog={addLog}
        registeredUsers={registeredUsers}
        onRegisterUser={handleRegisterUser}
      />
    );
  }

  if (currentView === 'landing') {
    return (
      <LandingView 
        onEnterApp={(view) => {
          setCurrentView(view || 'dashboard');
          addLog(`Entered portal: ${(view || 'dashboard').toUpperCase()}`);
        }} 
        announcementsCount={announcements.length}
        eventsCount={events.length}
        orgName={orgName}
        welcomeMessage={welcomeMessage}
      />
    );
  }

  return (
    <div id="campusconnect-root" className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 border border-slate-200">
      
      {/* 1. Global Navigation Top Header */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-xs px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Logo */}
          <div className="h-9 w-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm shadow-indigo-600/10">
            <Sparkles className="h-5 w-5 fill-indigo-200 text-indigo-100" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 tracking-tight leading-none flex items-center gap-1">
              {orgName}
              <span className="text-[10px] bg-slate-100 border text-slate-500 font-bold px-1.5 py-0.2 rounded-full font-sans select-none scale-90">
                v1.2
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Student Communication Hub</p>
          </div>
        </div>

        {/* Desktop layout role swapper & accounts badges */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 font-sans text-xs">
            <button
              onClick={() => {
                setUserRole('member');
                addLog(`Switched role to: Member. Access limited.`);
              }}
              className={`px-3 py-1.5 font-bold rounded-lg transition-all ${
                userRole === 'member' 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Member View
            </button>
            <button
              onClick={() => {
                setUserRole('officer');
                addLog(`Switched role to: Officer. Advanced dashboard unlocked.`);
              }}
              className={`px-3 py-1.5 font-bold rounded-lg transition-all flex items-center gap-1 ${
                userRole === 'officer' 
                  ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow shadow-indigo-500/15' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              👑 Officer Suite
            </button>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-1.5 px-3 border rounded-xl">
            <div className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[10px] select-none border ${userRole === 'officer' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-indigo-100 text-indigo-700'}`}>
              {username.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
            </div>
            <div className="text-left font-sans text-xs">
              <p className="font-bold text-slate-800 leading-tight">{username}</p>
              <p className="text-[9px] text-slate-400 leading-none capitalize font-semibold">{userRole}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-3 py-2 border border-rose-200 text-rose-650 bg-rose-50/50 hover:bg-rose-150/70 hover:text-rose-700 hover:border-rose-300 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            title="Disconnect session"
          >
            Log Out
          </button>
        </div>

        {/* Mobile menu and mobile role selector triggers */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile role button icon */}
          <button
            onClick={() => {
              const nextRole = userRole === 'member' ? 'officer' : 'member';
              setUserRole(nextRole);
              addLog(`Role changed on mobile: ${nextRole.toUpperCase()}`);
            }}
            className="text-[10px] uppercase font-extrabold px-2.5 py-1.5 rounded-lg border bg-white shadow-xs"
            title="Toggle user context"
          >
            {userRole === 'member' ? '👤 Member' : '👑 Officer'}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* 2. Main content container split */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        
        {/* Left Side Sidebar / Navigation Drawer */}
        <aside className={`hidden md:flex flex-col w-56 border-r border-gray-100 bg-white p-4 justify-between select-none`}>
          <div className="space-y-6">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block pl-2 font-mono">
              Hub Director
            </span>
            <nav className="space-y-1.5">
              {[
                { id: 'landing', label: 'Welcome Portal', icon: Heart },
                { id: 'dashboard', label: 'Dashboard', icon: Sparkles },
                { id: 'announcements', label: 'Broadcasting', icon: Megaphone, badge: announcements.filter(a => !a.readBy.includes(username)).length },
                { id: 'schedule', label: 'Schedules', icon: CalendarIcon, badge: events.length },
                { id: 'committees', label: 'Committees', icon: Users },
                { id: 'payments', label: 'Fees & Dues', icon: ShoppingBag, badge: cart.length > 0 ? cart.length : undefined },
                { id: 'owner', label: '👑 Website Owner Space', icon: ShieldAlert, badge: 'Active' }
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setCurrentView(m.id as any);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      currentView === m.id 
                        ? `${accent.bgLight} border-l-4 ${accent.border} ${accent.text} font-bold` 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4 shrink-0" />
                      {m.label}
                    </span>
                    {m.badge ? (
                      <span className={`text-[9px] ${accent.bgLight} ${accent.text} font-extrabold px-2 py-0.5 rounded-full select-none`}>
                        {m.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* System logs widgets */}
          <div className="space-y-2 border-t pt-4">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block pl-1 font-mono flex items-center gap-1 select-none">
              <Activity className="h-3 w-3 text-indigo-500 animate-pulse" />
              Live Workspace Signals
            </span>
            <div className="bg-slate-900 text-emerald-400 text-[8px] p-2.5 rounded-lg border border-slate-800 font-mono space-y-1 select-all h-24 overflow-y-auto">
              {systemLogs.map((log, index) => (
                <div key={index} className="truncate">{log}</div>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="md:hidden fixed inset-0 top-[60px] bg-white z-30 p-5 flex flex-col justify-between border-r"
            >
              <div className="space-y-6">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pl-2">Section Index</span>
                <nav className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'landing', label: '❤️ Welcome Portals Page', icon: Sparkles },
                    { id: 'dashboard', label: '🏠 Dashboard Overview', icon: Sparkles },
                    { id: 'announcements', label: '📢 Broadcasting Channel', icon: Megaphone },
                    { id: 'schedule', label: '📅 Schedules & Events', icon: CalendarIcon },
                    { id: 'committees', label: '👥 Committees Workroom', icon: Users },
                    { id: 'payments', label: '🛍️ Org Dues & Merchandise', icon: ShoppingBag },
                    { id: 'owner', label: '👑 Website Owner Space', icon: ShieldAlert }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setCurrentView(m.id as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`text-left px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                        currentView === m.id
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Mobile Profile bar */}
              <div className="p-3.5 bg-slate-50 border rounded-xl flex items-center justify-between gap-2 text-xs font-sans">
                <div className="flex items-center gap-2 text-left">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center font-bold border ${userRole === 'officer' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-indigo-100 text-indigo-700'}`}>
                    {username.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-850 leading-tight">{username}</p>
                    <p className="text-[10px] text-slate-400 capitalize font-semibold mt-0.5">{userRole}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1.5 border border-rose-200 text-rose-600 bg-rose-50 rounded-lg font-bold text-[10px] whitespace-nowrap"
                >
                  Log Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Main Display Screen layout */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-5xl mx-auto w-full z-10 space-y-6">
          
          <AnimatePresence mode="wait">
            {/* 3a. DASHBOARD SUMMARY VIEW */}
            {currentView === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6 font-sans"
              >
                {/* Hero Greeting Section */}
                <div className="bg-slate-900 border text-white p-5 rounded-xl shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1 z-10">
                    <span className="text-[10px] text-indigo-300 font-bold bg-indigo-500/20 py-0.5 px-2 rounded-full uppercase tracking-wider select-none font-sans">
                      Academic Year 2026
                    </span>
                    <h2 className="text-xl font-black tracking-tight pt-1 leading-snug">Welcome back, {username}!</h2>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-lg">
                      You are actively listed under <span className="font-bold text-white">Marketing &amp; Logistics Branches</span>. Check below to pay dues, view agendas or draft broadcasts.
                    </p>
                  </div>
                  
                  <div className="z-10 bg-slate-800 border border-slate-700 p-3.5 rounded-xl text-xs flex items-center gap-3 shrink-0">
                    <Clock className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase leading-none">Session Alert:</p>
                      <p className="font-extrabold text-white mt-1">Hackathon proposal</p>
                      <p className="text-[9px] text-indigo-300">Sunday @ 2:00 PM</p>
                    </div>
                  </div>
                </div>

                {/* Dashboard statistics blocks */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Status dues widget */}
                  <div className="bg-white border text-left p-4.5 rounded-xl shadow-xs flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 border ${
                      isDuesPaid 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block font-mono">
                        Dues Status
                      </span>
                      <p className="text-sm font-black text-slate-800 leading-snug mt-0.5">
                        {isDuesPaid ? 'All Dues cleared' : 'Outstanding Membership Fee'}
                      </p>
                      {!isDuesPaid && (
                        <button
                          onClick={() => {
                            setCurrentView('payments');
                            addLog("Redirected to payments store.");
                          }}
                          className="text-[10px] text-indigo-600 hover:underline font-bold mt-1 flex items-center gap-0.5"
                        >
                          Invoice Checkout now ➔
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Active channels summary */}
                  <div className="bg-white border text-left p-4.5 rounded-xl shadow-xs flex items-center gap-3">
                    <div className="h-9 w-9 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                      <Megaphone className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block font-mono">
                        Broadcasting
                      </span>
                      <p className="text-sm font-black text-slate-800 leading-snug mt-0.5">
                        {announcements.filter(a => !a.readBy.includes(username)).length} urgent unreads
                      </p>
                      <button
                        onClick={() => setCurrentView('announcements')}
                        className="text-[10px] text-indigo-600 hover:underline font-semibold mt-1 block"
                      >
                        Read official logs
                      </button>
                    </div>
                  </div>

                  {/* Operational workflow tasks */}
                  <div className="bg-white border text-left p-4.5 rounded-xl shadow-xs flex items-center gap-3">
                    <div className="h-9 w-9 bg-amber-50 border border-amber-100 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block font-mono">
                        Workflow Assignments
                      </span>
                      <p className="text-sm font-black text-slate-800 leading-snug mt-0.5">
                        {tasks.filter(t => t.assignee.name === username && t.status !== 'done').length} Pending sprint tasks
                      </p>
                      <button
                        onClick={() => setCurrentView('committees')}
                        className="text-[10px] text-indigo-600 hover:underline font-semibold mt-1 block"
                      >
                        Launch Kanban Workspace
                      </button>
                    </div>
                  </div>
                </div>

                {/* Split Column: Core Board and Schedule previews */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  
                  {/* Left Column previews (Announcements brief) */}
                  <div className="lg:col-span-12 bg-white border border-slate-100 rounded-xl p-5 shadow-xs space-y-4 text-left">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                        <Megaphone className="h-4.5 w-4.5" />
                        Urgent Organization Bulletins
                      </h3>
                      
                      <button 
                        onClick={() => setCurrentView('announcements')}
                        className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-0.5"
                      >
                        Open board
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {announcements.slice(0, 2).map(ann => (
                        <div key={ann.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                          <div className="flex wrap items-center justify-between gap-2">
                            <span className="text-[9px] font-extrabold uppercase bg-red-50 text-red-700 border border-red-100 px-2 rounded-full">
                              🚨 Urgent Priority
                            </span>
                            <span className="text-xs text-slate-400 font-semibold">{ann.date}</span>
                          </div>

                          <h4 className="text-sm font-extrabold text-slate-850 leading-snug">{ann.title}</h4>
                          <p className="text-xs text-slate-500 font-sans tracking-wide leading-relaxed line-clamp-2">{ann.content}</p>
                          
                          <div className="pt-2 border-t border-dashed border-slate-200/60 text-[11px] font-medium text-slate-450 uppercase tracking-wider flex items-center justify-between">
                            <span>Author: {ann.author}</span>
                            {!ann.readBy.includes(username) && (
                              <button
                                onClick={() => {
                                  handleToggleRead(ann.id);
                                  addLog(`Marked read: "${ann.title}"`);
                                }}
                                className="text-indigo-600 hover:underline font-extrabold"
                              >
                                Mark Read
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next Activities Brief */}
                  <div className="lg:col-span-12 bg-white border border-slate-100 rounded-xl p-5 shadow-xs space-y-4 text-left">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                        <CalendarIcon className="h-4.5 w-4.5" />
                        Schedules &amp; Quick RSVP Alignments
                      </h3>
                      
                      <button 
                        onClick={() => setCurrentView('schedule')}
                        className="text-xs font-semibold text-indigo-600 hover:underline"
                      >
                        All schedules
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {events.slice(0, 2).map(evt => {
                        const attends = evt.rsvps.some(u => u.name === username);
                        return (
                          <div key={evt.id} className="p-3.5 bg-slate-50/50 border border-slate-150 rounded-xl flex items-start gap-3 justify-between">
                            <div className="space-y-1.5 flex-1 min-w-0">
                              <span className="inline-block text-[9px] bg-indigo-50 text-indigo-700 border font-extrabold px-1.5 py-0.2 rounded-full">
                                {evt.date} @ {evt.time}
                              </span>
                              <h4 className="text-xs font-extrabold text-slate-800 truncate">{evt.title}</h4>
                              <p className="text-[10px] text-slate-450 font-sans truncate">{evt.location}</p>
                            </div>

                            <button
                              onClick={() => {
                                handleToggleRSVP(evt.id);
                              }}
                              className={`py-1.5 px-3 rounded-lg text-[10px] font-bold border shrink-0 shrink-0 select-none ${
                                attends 
                                  ? 'bg-rose-50 text-rose-600 border-rose-200' 
                                  : 'bg-indigo-600 text-white border-indigo-600'
                              }`}
                            >
                              {attends ? 'Going ✓' : 'Join'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3b. ANNOUNCEMENTS VIEW PANEL */}
            {currentView === 'announcements' && (
              <motion.div
                key="announcements"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
              >
                <AnnouncementsView
                  announcements={announcements}
                  userRole={userRole}
                  username={username}
                  onAddAnnouncement={handleAddAnnouncement}
                  onToggleRead={handleToggleRead}
                />
              </motion.div>
            )}

            {/* 3c. EVENTS CALENDAR VIEW */}
            {currentView === 'schedule' && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
              >
                <CalendarView
                  events={events}
                  userRole={userRole}
                  username={username}
                  onAddEvent={handleAddEvent}
                  onToggleRSVP={handleToggleRSVP}
                />
              </motion.div>
            )}

            {/* 3d. COMMITTEES WORKFLOW VIEW */}
            {currentView === 'committees' && (
              <motion.div
                key="committees"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
              >
                <CommitteesView
                  committees={committees}
                  tasks={tasks}
                  chatMessages={chatMessages}
                  userRole={userRole}
                  username={username}
                  onAddTask={handleAddTask}
                  onMoveTask={handleMoveTask}
                  onDeleteTask={handleDeleteTask}
                  onAddChatMessage={handleAddChatMessage}
                />
              </motion.div>
            )}

            {/* 3e. SHOP PORTAL PAYMENT GATEWAY */}
            {currentView === 'payments' && (
              <motion.div
                key="payments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
              >
                <PaymentsView
                  shopItems={shopItems}
                  cart={cart}
                  transactions={transactions}
                  userRole={userRole}
                  username={username}
                  onAddToCart={handleAddToCart}
                  onRemoveFromCart={handleRemoveFromCart}
                  onUpdateCartQuantity={handleUpdateCartQuantity}
                  onCompleteCheckout={handleCompleteCheckout}
                />
              </motion.div>
            )}

            {/* 3f. OWNER SPACE GATEWAY */}
            {currentView === 'owner' && (
              <motion.div
                key="owner"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
              >
                <OwnerView
                  orgName={orgName}
                  setOrgName={setOrgName}
                  welcomeMessage={welcomeMessage}
                  setWelcomeMessage={setWelcomeMessage}
                  duesPrice={duesPrice}
                  setDuesPrice={setDuesPrice}
                  systemStatus={systemStatus}
                  setSystemStatus={setSystemStatus}
                  primaryColor={primaryColor}
                  setPrimaryColor={setPrimaryColor}
                  systemLogs={systemLogs}
                  onAddLog={addLog}
                  onInjectMockMember={handleInjectMockMember}
                  onAddPromoCode={handleAddPromoCode}
                  activePromoCodes={activePromoCodes}
                  totalDuesCollected={transactions.reduce((acc, t) => acc + t.total, 0)}
                  membersCount={7}
                  tasksCount={tasks.length}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* 4. Footer */}
      <footer className="bg-white border-t border-gray-100 py-4 px-6 text-center text-slate-400 text-[10px] sm:text-xs z-15 select-none shrink-0 font-sans">
        <p>© 2026 {orgName}. Centralized communication nodes for student organizations.</p>
        <p className="mt-0.5 text-indigo-500/80 font-medium">PCI-DSS Compliant secure payment gateway integration simulation logs active.</p>
      </footer>
    </div>
  );
}
