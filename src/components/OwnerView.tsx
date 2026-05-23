import React, { useState } from 'react';
import { 
  Terminal, 
  ShieldCheck, 
  Sliders, 
  UserPlus, 
  Settings, 
  Activity, 
  FileCode, 
  Trash2, 
  Play, 
  RefreshCw, 
  Sparkles, 
  Command,
  Database,
  ArrowRight,
  TrendingUp,
  Coins,
  ShieldAlert,
  HelpCircle,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OwnerViewProps {
  orgName: string;
  setOrgName: (val: string) => void;
  welcomeMessage: string;
  setWelcomeMessage: (val: string) => void;
  duesPrice: number;
  setDuesPrice: (val: number) => void;
  systemStatus: 'online' | 'maintenance' | 'stealth';
  setSystemStatus: (val: 'online' | 'maintenance' | 'stealth') => void;
  primaryColor: string;
  setPrimaryColor: (val: string) => void;
  systemLogs: string[];
  onAddLog: (msg: string) => void;
  onInjectMockMember: (name: string, committee: string) => void;
  onAddPromoCode: (code: string, discount: number) => void;
  activePromoCodes: { code: string; discount: number }[];
  totalDuesCollected: number;
  membersCount: number;
  tasksCount: number;
}

export default function OwnerView({
  orgName,
  setOrgName,
  welcomeMessage,
  setWelcomeMessage,
  duesPrice,
  setDuesPrice,
  systemStatus,
  setSystemStatus,
  primaryColor,
  setPrimaryColor,
  systemLogs,
  onAddLog,
  onInjectMockMember,
  onAddPromoCode,
  activePromoCodes,
  totalDuesCollected,
  membersCount,
  tasksCount
}: OwnerViewProps) {
  // Input/Output console query states
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleOutput, setConsoleOutput] = useState<Array<{ type: 'input' | 'output' | 'error' | 'success'; text: string; time: string }>>([
    { type: 'success', text: 'Administrative Command Space Initialized (Active User: System Owner Key)', time: '09:00:00 AM' },
    { type: 'output', text: 'Type "/help" or select a quick command preset below to inspect available workflows.', time: '09:00:05 AM' }
  ]);

  // Inject member temporary state
  const [mockName, setMockName] = useState('');
  const [mockCommittee, setMockCommittee] = useState('marketing');

  // New promo code states
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState(10);

  // Command input handler
  const handleExecuteCommand = (commandOverride?: string) => {
    const rawCmd = (commandOverride || consoleInput).trim();
    if (!rawCmd) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const userLog = { type: 'input' as const, text: rawCmd, time: timeStr };

    // Update terminal output history
    setConsoleOutput(prev => [...prev, userLog]);

    const lowerCmd = rawCmd.toLowerCase();
    let reply = '';
    let replyType: 'output' | 'success' | 'error' = 'output';

    if (lowerCmd === '/help') {
      reply = 'AVAILABLE CODES:\n  /status               Check infrastructure metrics\n  /promo <code> <%>     Register automatic coupon codes\n  /system-audit         Query deep security system checkup\n  /clear-logs           Wipe transient administrative logs\n  /simulate-member      Inject mock attendee instance.';
    } else if (lowerCmd === '/status') {
      reply = `SYSTEM STATUS INTEGRITY: ${systemStatus.toUpperCase()}\n----------------------------------------\nOrganization: ${orgName}\nMembership Fee: $${duesPrice.toFixed(2)}\nActive Members Counter: ${membersCount}\nIn-flight Agile Tasks: ${tasksCount}\nTreasury Balance: $${totalDuesCollected.toFixed(2)}`;
      replyType = 'success';
    } else if (lowerCmd.startsWith('/promo')) {
      const parts = rawCmd.split(' ');
      if (parts.length >= 3) {
        const codeText = parts[1].toUpperCase();
        const discountVal = parseInt(parts[2], 10);
        if (!isNaN(discountVal) && discountVal > 0 && discountVal <= 100) {
          onAddPromoCode(codeText, discountVal);
          reply = `PROMO REGISTERED: Code "${codeText}" grants ${discountVal}% discount on checkout fees!`;
          replyType = 'success';
          onAddLog(`Owner registered Coupon: ${codeText} (${discountVal}% off)`);
        } else {
          reply = 'ERROR: Discount percent must be a numerical integer between 1 and 100.';
          replyType = 'error';
        }
      } else {
        reply = 'USAGE ERROR: Please configure using syntax "/promo CODE PERCENT_NUMBER" (e.g. /promo DEV25 25)';
        replyType = 'error';
      }
    } else if (lowerCmd === '/system-audit') {
      reply = `AUDITING SECURITY LAYER INGRESS REGISTERS...\n----------------------------------------\n✓ Secure PCI-DSS gateway simulations bound at dev port 3000\n✓ Host IP address authorized: "0.0.0.0" (Public Sandbox Node)\n✓ Static metadata rules in check: CampusConnect JSON Active\n✓ Security level: Standard member authorization rules enforced.\nIntegrity Audit Score: 100/100 Perfect Sandbox Execution!`;
      replyType = 'success';
      onAddLog('Simulated full system compliance security sweep completed.');
    } else if (lowerCmd === '/clear-logs') {
      setConsoleOutput([
        { type: 'success', text: 'Interactive Terminal History Purged successfully.', time: timeStr }
      ]);
      setConsoleInput('');
      return;
    } else if (lowerCmd.startsWith('/simulate-member')) {
      const parts = rawCmd.split(' ');
      const nameVal = parts.slice(1).join(' ') || 'John Doe';
      onInjectMockMember(nameVal, 'logistics');
      reply = `Mock user ${nameVal} was injected. Notice dispatched in Logistics chat.`;
      replyType = 'success';
    } else {
      reply = `Unknown Server Command "${rawCmd}". Type "/help" for list of permitted inputs.`;
      replyType = 'error';
    }

    setTimeout(() => {
      setConsoleOutput(prev => [...prev, {
        type: replyType,
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }]);
    }, 150);

    setConsoleInput('');
  };

  const handleCreateMockMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mockName.trim()) return;
    onInjectMockMember(mockName, mockCommittee);
    onAddLog(`Owner Space: Injected custom simulated member "${mockName}" inside ${mockCommittee.toUpperCase()} branch`);
    setMockName('');
  };

  const handleCreatePromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    onAddPromoCode(newCode.trim().toUpperCase(), newDiscount);
    onAddLog(`Owner Space: Registered discount coupon: ${newCode.trim().toUpperCase()} (${newDiscount}% off)`);
    setNewCode('');
  };

  return (
    <div id="owner-space-container" className="space-y-6 font-sans text-left">
      
      {/* Upper Space Header banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border text-white p-6 rounded-2xl shadow-md relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="z-10 space-y-1">
          <span className="text-[10px] text-indigo-300 font-extrabold bg-indigo-500/20 py-1 px-2.5 rounded-full uppercase tracking-wider select-none font-mono flex items-center gap-1 w-fit">
            <ShieldCheck className="h-3 w-3 text-indigo-400" />
            Website Owner Space Control Suite
          </span>
          <h2 className="text-xl font-bold tracking-tight pt-1 leading-snug">My Space: Platform Owner Control Center</h2>
          <p className="text-xs text-slate-300 max-w-xl font-light leading-relaxed">
            Welcome to your proprietary developer space. Take control of parameters, inject simulated member states, run command-line terminal scripts, and observe immediate react-state outputs.
          </p>
        </div>

        <div className="z-10 bg-slate-900/60 border border-slate-700/60 p-3.5 rounded-xl text-xs space-y-1 shrink-0 font-mono">
          <p className="text-slate-400 text-[9px] uppercase font-bold leading-none">Global Server Node status:</p>
          <div className="flex items-center gap-1.5 mt-1">
            <div className={`h-2.5 w-2.5 rounded-full ${
              systemStatus === 'online' ? 'bg-emerald-500 animate-pulse' :
              systemStatus === 'maintenance' ? 'bg-amber-500 animate-pulse' : 'bg-slate-500'
            }`} />
            <p className="font-extrabold text-white capitalize">{systemStatus} Mode</p>
          </div>
          <p className="text-[9px] text-indigo-300">Port Ingress: 3000 (Proxy Map)</p>
        </div>
      </div>

      {/* Grid of system quick metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border p-4 rounded-xl flex items-center gap-3 shadow-xs">
          <div className="h-9 w-9 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
            <Coins className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block font-mono">Treasury Inflow</span>
            <p className="text-sm font-black text-slate-800 leading-none mt-0.5">${totalDuesCollected.toFixed(2)}</p>
            <span className="text-[9px] text-slate-400">Total fees parsed</span>
          </div>
        </div>

        <div className="bg-white border p-4 rounded-xl flex items-center gap-3 shadow-xs">
          <div className="h-9 w-9 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
            <UserPlus className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block font-mono">Registered Users</span>
            <p className="text-sm font-black text-slate-800 leading-none mt-0.5">{membersCount}</p>
            <span className="text-[9px] text-slate-400">Including seed list</span>
          </div>
        </div>

        <div className="bg-white border p-4 rounded-xl flex items-center gap-3 shadow-xs">
          <div className="h-9 w-9 bg-amber-50 border border-amber-100 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
            <Activity className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block font-mono">Agile Backlog</span>
            <p className="text-sm font-black text-slate-800 leading-none mt-0.5">{tasksCount}</p>
            <span className="text-[9px] text-slate-400">Tasks in Kanban</span>
          </div>
        </div>

        <div className="bg-white border p-4 rounded-xl flex items-center gap-3 shadow-xs">
          <div className="h-9 w-9 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg flex items-center justify-center shrink-0">
            <Command className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block font-mono">Acquired Coupons</span>
            <p className="text-sm font-black text-slate-800 leading-none mt-0.5">{activePromoCodes.length}</p>
            <span className="text-[9px] text-indigo-600 font-medium">Valid checkout codes</span>
          </div>
        </div>
      </div>

      {/* Main double column Workspace grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left column: Controls and Variables Setup */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* SECTION 1: DYNAMIC PROPERTY ADJUSTER (Website Customizer & Owner controls) */}
          <div className="bg-white border rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-1.5 border-b pb-2">
              <Sliders className="h-4 w-4 text-indigo-600" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Live Website Variables</h3>
            </div>

            <div className="grid grid-cols-1 gap-3.5 text-xs">
              
              {/* Org Name Variable Input */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block text-[11px] uppercase tracking-wide">
                  Adjust Chapter / Org Name Branding (Input)
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => {
                    setOrgName(e.target.value);
                    if (e.target.value.trim() !== '') {
                      onAddLog(`Rebranded chapter name to "${e.target.value}"`);
                    }
                  }}
                  className="w-full bg-slate-50 px-3 py-2 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-semibold"
                  placeholder="Enter organization title"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Updates header, lists, and footer titles dynamically!
                </span>
              </div>

              {/* Welcome Subtitle Variable Input */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block text-[11px] uppercase tracking-wide">
                  Dashboard Platform Announcement (Input)
                </label>
                <textarea
                  rows={2}
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  className="w-full bg-slate-50 px-3 py-2 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-600 font-sans"
                  placeholder="Enter platform wide guidance notice"
                />
              </div>

              {/* Dues Fee Pricing Input Option */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block text-[11px] uppercase tracking-wide">
                    Membership Standard Fee ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={duesPrice}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) setDuesPrice(val);
                    }}
                    className="w-full bg-slate-50 px-3 py-2 border rounded-lg text-slate-800 font-extrabold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block text-[11px] uppercase tracking-wide">
                    Server Ingress Mode
                  </label>
                  <select
                    value={systemStatus}
                    onChange={(e) => {
                      const mode = e.target.value as any;
                      setSystemStatus(mode);
                      onAddLog(`Global system state altered to ${mode.toUpperCase()} mode.`);
                    }}
                    className="w-full bg-slate-50 px-3 py-2 border rounded-lg font-bold text-slate-700"
                  >
                    <option value="online">Online Production</option>
                    <option value="maintenance">Maintenance mode</option>
                    <option value="stealth">Stealth Sandbox Only</option>
                  </select>
                </div>
              </div>

              {/* Theme Preset Splicer toggle buttons */}
              <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
                <p className="font-bold text-slate-700 text-[11px] uppercase tracking-wide">
                  Workspace Core Primary Accent (Theme CSS)
                </p>
                <div className="flex gap-2">
                  {[
                    { label: 'Royal Indigo', value: 'indigo', color: 'bg-indigo-600' },
                    { label: 'Cyber Blue', value: 'blue', color: 'bg-blue-600' },
                    { label: 'Forest Green', value: 'emerald', color: 'bg-emerald-600' },
                    { label: 'Hot Amber', value: 'amber', color: 'bg-amber-500' },
                    { label: 'Crimson Rose', value: 'rose', color: 'bg-rose-500' }
                  ].map(theme => (
                    <button
                      key={theme.value}
                      onClick={() => {
                        setPrimaryColor(theme.value);
                        onAddLog(`System theme primary color changed to ${theme.label}`);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                        primaryColor === theme.value 
                          ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${theme.color} shrink-0`} />
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 2: MEMBER INJECTOR WORKROOM (Create Custom simulated people) */}
          <div className="bg-white border rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-1.5 border-b pb-2 justify-between">
              <div className="flex items-center gap-1.5">
                <UserPlus className="h-4 w-4 text-emerald-600" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Inject Simulated Member State</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest font-mono">Sandbox</span>
            </div>

            <form onSubmit={handleCreateMockMember} className="space-y-3.5 text-xs">
              <div className="flex gap-2 text-xs">
                <div className="space-y-1 flex-1">
                  <label className="font-bold text-slate-700 block text-[10px] uppercase">
                    Member Name (Any Input)
                  </label>
                  <input
                    type="text"
                    required
                    value={mockName}
                    onChange={(e) => setMockName(e.target.value)}
                    className="w-full bg-slate-50 px-3 py-2 border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. Liam Sterling Jr"
                  />
                </div>

                <div className="space-y-1 w-2/5">
                  <label className="font-bold text-slate-700 block text-[10px] uppercase">
                    Branch Assignment
                  </label>
                  <select
                    value={mockCommittee}
                    onChange={(e) => setMockCommittee(e.target.value)}
                    className="w-full bg-slate-50 px-3 py-2 border rounded-lg font-bold"
                  >
                    <option value="marketing">Marketing Hub</option>
                    <option value="logistics">Logistics Hub</option>
                    <option value="tech">Technology Hub</option>
                    <option value="finance">Finance Hub</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-450 font-medium">
                <p>Injecting posts system updates inside chosen committee chats.</p>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-bold flex items-center gap-1 cursor-pointer transition-all"
                >
                  Confirm Injection <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </form>
          </div>

          {/* SECTION 3: PROMO COUPONS REGISTER (Manage Checkout variables) */}
          <div className="bg-white border rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-1.5 border-b pb-2">
              <Coins className="h-4 w-4 text-amber-500" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Checkout Discount Couponer</h3>
            </div>

            <form onSubmit={handleCreatePromoCode} className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
              <div className="md:col-span-5 space-y-1">
                <label className="font-bold text-slate-700 block text-[10px] uppercase">Promo Coupon Code</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full bg-slate-50 px-3 py-2 border rounded-lg font-mono uppercase font-bold text-slate-800"
                  placeholder="e.g. SPRINT50"
                />
              </div>

              <div className="md:col-span-4 space-y-1">
                <label className="font-bold text-slate-700 block text-[10px] uppercase">Discount %</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-50 px-3 py-2 border rounded-lg text-slate-800 font-bold"
                />
              </div>

              <div className="md:col-span-3 flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-lg cursor-pointer transition-all text-center text-xs"
                >
                  Add Code
                </button>
              </div>
            </form>

            <div className="space-y-1.5">
              <span className="text-[9px] font-extrabold text-slate-405 uppercase tracking-wider block font-mono">
                Active Store Promo Codes Output:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activePromoCodes.length === 0 ? (
                  <span className="text-[10px] text-slate-400 font-medium font-sans">No coupon parameters registered yet.</span>
                ) : (
                  activePromoCodes.map((p, idx) => (
                    <div key={idx} className="bg-amber-50/70 border border-amber-200 px-2.5 py-1 rounded-lg flex items-center gap-1 text-[10px] font-mono font-bold text-amber-800 select-all">
                      <span>{p.code} ({p.discount}% Off)</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right column: Interactive Terminal CLI Input and Output simulation */}
        <div className="lg:col-span-6 space-y-5">
          
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-[525px]">
            {/* Header of simulated terminal */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 bg-indigo-500/20 text-indigo-400 rounded-md flex items-center justify-center">
                  <Terminal className="h-3 w-3" />
                </div>
                <h4 className="text-[11px] font-bold font-mono text-slate-300">
                  CampusConnect Core Web-Shell (Terminal-CLI)
                </h4>
              </div>

              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-mono text-emerald-400 pl-0.5">OWNER_SESSION: AUTH_OK</span>
              </div>
            </div>

            {/* Simulated output console container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-[11px] select-text bg-[#030712] max-h-[380px]">
              {consoleOutput.map((log, index) => {
                let colorClass = 'text-slate-400';
                let prefix = ':: ';
                
                if (log.type === 'input') {
                  colorClass = 'text-blue-400 font-bold';
                  prefix = 'client_owner:~$ ';
                } else if (log.type === 'success') {
                  colorClass = 'text-emerald-400';
                  prefix = '✔ SYSTEM OUT: ';
                } else if (log.type === 'error') {
                  colorClass = 'text-rose-400';
                  prefix = '✖ STDOUT ERROR: ';
                }

                return (
                  <div key={index} className="space-y-1 border-b border-slate-900/40 pb-2 leading-relaxed">
                    <div className="flex items-center justify-between text-[9px] text-slate-600 font-normal">
                      <span>{prefix}{log.type === 'input' ? 'User Instruction Input' : 'Reactive Processed Output'}</span>
                      <span>[{log.time}]</span>
                    </div>
                    <p className={`whitespace-pre-line ${colorClass}`}>{log.text}</p>
                  </div>
                );
              })}
            </div>

            {/* Quick Presets Command Selection List */}
            <div className="bg-[#090d16] p-2.5 border-t border-slate-900 space-y-1.5 select-none">
              <p className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-wider block">
                Quick Command Variable Presets (Shortcut Injectors):
              </p>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold font-mono">
                {[
                  { text: 'Check /status', val: '/status' },
                  { text: 'Auditing Rules', val: '/system-audit' },
                  { text: 'Clear Log System', val: '/clear-logs' },
                  { text: 'Injector Helper', val: '/help' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setConsoleInput(item.val);
                      handleExecuteCommand(item.val);
                    }}
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1"
                  >
                    <Play className="h-2.5 w-2.5 text-indigo-400" />
                    {item.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form at Bottom of Terminal */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleExecuteCommand();
              }}
              className="bg-slate-950 p-2.5 border-t border-slate-900 flex items-center gap-2 shrink-0"
            >
              <div className="text-slate-500 font-mono text-xs items-center pl-1 select-none">
                ~$
              </div>
              <input
                type="text"
                value={consoleInput}
                onChange={(e) => setConsoleInput(e.target.value)}
                placeholder='Type commands (e.g., "/status", "/promo DISK50 50", "/system-audit")'
                className="flex-1 bg-transparent text-indigo-300 font-mono text-[11px] focus:outline-hidden placeholder-slate-600 border border-slate-900 px-3 py-2 rounded-lg"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[10px] font-extrabold px-3.5 py-2.5 rounded-lg cursor-pointer transition-all uppercase"
              >
                Execute
              </button>
            </form>
          </div>

          {/* Quick tips & sandbox guidance info */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <HelpCircle className="h-4.5 w-4.5 text-indigo-500" />
              What is this space?
            </h4>
            <div className="text-[11px] text-slate-500 leading-relaxed font-sans space-y-1">
              <p>
                In standard website files, the system owner modifies variables on a static configuration file or command line database. I built this interactive <strong className="text-indigo-600 font-bold">Owner space</strong> so you can configure everything in real-time.
              </p>
              <p>
                Try changing the <strong className="text-slate-705">Custom Org Brand Name</strong> to a custom name, then checkout the standard tabs or landing screen. You will see your input instantly update the whole application output!
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
