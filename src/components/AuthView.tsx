import React, { useState } from 'react';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  UserPlus, 
  LogIn, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Key,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthViewProps {
  orgName: string;
  primaryColor: string;
  onLogin: (name: string, email: string, role: 'member' | 'officer') => void;
  onAddLog: (msg: string) => void;
  registeredUsers: Array<{ name: string; email: string; password: string; role: 'member' | 'officer' }>;
  onRegisterUser: (name: string, email: string, password: string) => boolean;
}

export default function AuthView({
  orgName,
  primaryColor,
  onLogin,
  onAddLog,
  registeredUsers,
  onRegisterUser
}: AuthViewProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  
  // Feedback states
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Accent mapping
  const getThemeClasses = () => {
    switch (primaryColor) {
      case 'blue':
        return {
          btn: 'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-600/20 text-white',
          text: 'text-blue-500',
          focusRing: 'focus:ring-blue-500 focus:border-blue-500',
          tabActive: 'bg-blue-600 text-white',
          gradientBg: 'from-blue-600 to-indigo-600'
        };
      case 'emerald':
        return {
          btn: 'bg-emerald-600 hover:bg-emerald-505 hover:shadow-emerald-600/20 text-white',
          text: 'text-emerald-500',
          focusRing: 'focus:ring-emerald-500 focus:border-emerald-500',
          tabActive: 'bg-emerald-600 text-white',
          gradientBg: 'from-emerald-500 to-teal-600'
        };
      case 'amber':
        return {
          btn: 'bg-amber-500 hover:bg-amber-400 text-slate-950 hover:shadow-amber-500/20 font-bold',
          text: 'text-amber-500',
          focusRing: 'focus:ring-amber-500 focus:border-amber-500',
          tabActive: 'bg-amber-500 text-slate-950',
          gradientBg: 'from-amber-400 to-orange-500'
        };
      case 'rose':
        return {
          btn: 'bg-rose-600 hover:bg-rose-500 hover:shadow-rose-600/20 text-white',
          text: 'text-rose-500',
          focusRing: 'focus:ring-rose-500 focus:border-rose-500',
          tabActive: 'bg-rose-600 text-white',
          gradientBg: 'from-rose-500 to-pink-600'
        };
      case 'indigo':
      default:
        return {
          btn: 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-600/20 text-white',
          text: 'text-indigo-400',
          focusRing: 'focus:ring-indigo-500 focus:border-indigo-500',
          tabActive: 'bg-indigo-600 text-white',
          gradientBg: 'from-indigo-600 to-blue-600'
        };
    }
  };

  const theme = getThemeClasses();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!loginEmail || !loginPassword) {
      setErrorMessage('Please fill in all standard fields.');
      return;
    }

    const emailClean = loginEmail.trim().toLowerCase();
    
    // Domain validation
    const isGmail = emailClean.endsWith('@gmail.com');
    const isStudent = emailClean.endsWith('@student.apc.edu.ph');
    
    if (!isGmail && !isStudent) {
      setErrorMessage('Authorized portal access is restricted to official school domains: @gmail.com for Owners or @student.apc.edu.ph for Members.');
      return;
    }

    // Check pre-seeded / registered users list
    let foundUser = registeredUsers.find(
      u => u.email.toLowerCase() === emailClean
    );

    if (foundUser) {
      onLogin(foundUser.name, foundUser.email, foundUser.role);
    } else {
      // Create a clean display name from the email prefix (e.g., "jane.doe" -> "Jane Doe")
      const prefix = emailClean.split('@')[0];
      const generatedName = prefix
        .split(/[._+-]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') || 'Campus Member';

      const assignedRole = isGmail ? 'officer' : 'member';
      
      // Auto-register the user in our sandbox state
      onRegisterUser(generatedName, emailClean, loginPassword);
      onLogin(generatedName, emailClean, assignedRole);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim()) {
      setErrorMessage('Please enter your full authorization name.');
      return;
    }
    
    const emailClean = regEmail.trim().toLowerCase();
    if (!emailClean || !emailClean.includes('@')) {
      setErrorMessage('Please specify a valid email address.');
      return;
    }

    // Domain validation
    const isGmail = emailClean.endsWith('@gmail.com');
    const isStudent = emailClean.endsWith('@student.apc.edu.ph');
    
    if (!isGmail && !isStudent) {
      setErrorMessage('Registration is restricted to @gmail.com (Owner privileges) or @student.apc.edu.ph (Member privileges) domains.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const brandRole = isGmail ? 'officer' : 'member';

    const success = onRegisterUser(regName.trim(), emailClean, regPassword);
    if (success) {
      setSuccessMessage(`✓ Account successfully created as ${brandRole === 'officer' ? 'Website Owner' : 'Student Member'}! Welcome, ${regName.trim()}. Redirecting...`);
      onAddLog(`Authentication Register: Created database entry for "${emailClean}" with role "${brandRole}"`);
      
      // Clear inputs
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');

      // Auto login shortly
      setTimeout(() => {
        onLogin(regName.trim(), emailClean, brandRole);
      }, 1200);
    } else {
      setErrorMessage('An account with this email address is already active in the database.');
    }
  };

  return (
    <div 
      id="custom-auth-portal" 
      className="min-h-screen bg-[#070e17] text-white flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans select-none"
    >
      {/* Dynamic Background Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-505/15 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-y-1/2 w-[450px] h-[450px] bg-blue-500/10 rounded-full filter blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md z-10 space-y-8">
        
        {/* Banner Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl">
            <Sparkles className={`h-8 w-8 ${theme.text} animate-pulse`} />
          </div>
          <h2 className="text-3xl font-black font-sans tracking-tight pt-3">
            {orgName}<span className={theme.text}>.</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">
            Connect · Collaborate · Succeed
          </p>
        </div>

        {/* Auth form Card container */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          
          {/* Form tab controllers */}
          <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => {
                setActiveTab('login');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'login' 
                  ? theme.tabActive + ' shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="h-3.5 w-3.5" />
              Log In
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'register' 
                  ? theme.tabActive + ' shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              Register
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'login' ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                onSubmit={handleLogin}
                className="space-y-4 text-left"
              >
                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block pl-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="you@student.apc.edu.ph"
                      className={`w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm font-sans placeholder-slate-600 focus:outline-none focus:ring-1 ${theme.focusRing} transition-colors`}
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      Security Password
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className={`w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-10 pr-10 text-sm font-sans placeholder-slate-600 focus:outline-none focus:ring-1 ${theme.focusRing} transition-colors`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                    >
                      {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="bg-rose-500/10 border border-rose-550/30 p-3 rounded-xl flex items-start gap-2 text-rose-350 text-xs">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-450 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full py-3.5 rounded-xl text-xs font-bold font-sans tracking-wide uppercase transition-all shadow-lg cursor-pointer ${theme.btn}`}
                >
                  Log In directly to Portal
                </button>

                {/* Domain guidelines display */}
                <div className="pt-4 border-t border-slate-800/45 text-center space-y-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Role Verification Domains:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-left">
                    <div className="bg-slate-950/50 p-2.5 border border-slate-800/60 rounded-xl">
                      <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1">
                        Owner / Officer
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Requires <strong className="text-amber-400">@gmail.com</strong>
                      </p>
                    </div>
                    <div className="bg-slate-950/50 p-2.5 border border-slate-800/60 rounded-xl">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                        Student Member
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Requires <strong className="text-indigo-400">@student.apc.edu.ph</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                onSubmit={handleRegister}
                className="space-y-4 text-left"
              >
                {/* Full name field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block pl-1">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Liam Sterling Jr"
                      className={`w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm font-sans placeholder-slate-600 focus:outline-none focus:ring-1 ${theme.focusRing} transition-colors`}
                    />
                  </div>
                </div>

                {/* Email address field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block pl-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. liam@campusconnect.app"
                      className={`w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm font-sans placeholder-slate-600 focus:outline-none focus:ring-1 ${theme.focusRing} transition-colors`}
                    />
                  </div>
                </div>

                {/* Password input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block pl-1">
                      Password (min 6)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••"
                        className={`w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-10 pr-8 text-sm font-sans placeholder-slate-600 focus:outline-none focus:ring-1 ${theme.focusRing} transition-colors`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-500 hover:text-slate-300"
                      >
                        {showRegPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block pl-1">
                      Confirm PW
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type={showRegConfirmPassword ? 'text' : 'password'}
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••"
                        className={`w-full bg-slate-950/60 border border-slate-800 rounded-xl py-3 pl-10 pr-8 text-sm font-sans placeholder-slate-600 focus:outline-none focus:ring-1 ${theme.focusRing} transition-colors`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-500 hover:text-slate-300"
                      >
                        {showRegConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {errorMessage && (
                  <div className="bg-rose-500/10 border border-rose-550/30 p-3 rounded-xl flex items-start gap-2 text-rose-350 text-xs">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-450 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl flex items-start gap-2 text-emerald-450 text-xs">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full py-3.5 rounded-xl text-xs font-bold font-sans tracking-wide uppercase transition-all shadow-lg cursor-pointer ${theme.btn}`}
                >
                  Create My Member Profile
                </button>
              </motion.form>
            )}
          </AnimatePresence>

        </div>

        {/* Informative bottom footer lines */}
        <p className="text-center text-[10px] text-slate-500 select-none">
          Secure offline sandboxed simulation active. Standard password logs are maintained strictly within components React state. <br/>
          CampusConnect Version 1.2
        </p>
      </div>
    </div>
  );
}
