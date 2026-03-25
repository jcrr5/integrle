import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Share2, HelpCircle, Flame, BarChart3, 
  LogIn, LogOut, CheckCircle2 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDailyProblem, getTodayDateString } from '../components/integrle/ProblemList';
import { useAuth } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';

// Components
import CalculatorInput from '../components/integrle/InputKeyboard';
import DailyIntegralDisplay from '../components/integrle/DailyIntegral';
import Timer from '../components/integrle/Timer';
import TipsModal from '../components/integrle/Tips';
import ShareModal from '../components/integrle/Share';
import ResultFeedback from '../components/integrle/Results';

// UI
import SignOutPopup from '../components/ui/signout-popup';

export default function Home() {
  const { user, loginWithGoogle, logout } = useAuth();
  
  // State
  const [showSignOut, setShowSignOut] = useState(false);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [solved, setSolved] = useState(false);
  const [timerRunning, setTimerRunning] = useState(true);
  const [solveTime, setSolveTime] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [stats, setStats] = useState(null);
  
  const timeRef = useRef(0);
  const problem = getDailyProblem();
  const today = getTodayDateString();

  useEffect(() => {
    const handleAuthChange = async () => {
      if (user) {
        // When a user links or signs in, we load the new ID's data
        await loadStatsFromCloud();
      } else {
        // Total reset for the UI
        resetUI();
      }
    };

    handleAuthChange();
  }, [user?.uid]); // Use uid as the trigger to detect the actual ID swap
  
  const resetUI = () => {
    setSolved(false);
    setResult(null);
    setAnswer('');
    setStreak(0);
    setStats(null);
    setSolveTime(0);
    setAttempts(0);
    setTimerRunning(true);
    timeRef.current = 0;
  };
  const loadStatsFromCloud = async () => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      
      let currentData = null;

      if (docSnap.exists()) {
        currentData = docSnap.data();
      } else {
        // MIGRATION: Check if they have old local data
        const localData = localStorage.getItem('integrle_user_stats');
        if (localData) {
          currentData = JSON.parse(localData);
          await setDoc(userRef, currentData); 
          localStorage.removeItem('integrle_user_stats');
        }
      }

      if (currentData) {
        setStats(currentData);
        setStreak(currentData.current_streak || 0);
        
        // Check if already solved today
        if (currentData.last_solved_date === today) {
          setSolved(true);
          setTimerRunning(false);
          setSolveTime(currentData.last_solve_time || 0);
          setResult('correct');
          const todayEntry = currentData.solve_history?.find(h => h.date === today);
          if (todayEntry) setAttempts(todayEntry.attempts || 1);
        }
      }
    } catch (error) {
      console.error("Error loading cloud stats:", error);
    }
  };

  const handleSubmit = async () => {
    if (!answer || solved) return;
    
    const userAnswer = parseFloat(answer);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (Math.abs(userAnswer - problem.answer) < 0.005) {
      setResult('correct');
      setSolved(true);
      setTimerRunning(false);
      const finalTime = timeRef.current;
      setSolveTime(finalTime);

      // Streak Logic
      let newStreak = 1;
      if (stats?.last_solved_date) {
        const lastDate = new Date(stats.last_solved_date);
        const todayDate = new Date(today);
        const diffTime = Math.abs(todayDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) newStreak = (stats.current_streak || 0) + 1;
        else if (diffDays === 0) newStreak = stats.current_streak || 1;
      }
      setStreak(newStreak);

      const historyEntry = { 
        date: today, 
        time_seconds: finalTime, 
        correct: true, 
        attempts: newAttempts 
      };
      
      const updatedStats = {
        current_streak: newStreak,
        best_streak: Math.max(newStreak, stats?.best_streak || 0),
        total_solved: (stats?.total_solved || 0) + 1,
        last_solved_date: today,
        last_solve_time: finalTime,
        solve_history: arrayUnion(historyEntry)
      };

      // Save to Firebase if user exists
      if (user) {
        await setDoc(doc(db, 'users', user.uid), updatedStats, { merge: true });
      }
      
      setStats(prev => ({
        ...prev, 
        ...updatedStats, 
        solve_history: [...(prev?.solve_history || []), historyEntry]
      }));
      
    } else {
      setResult('wrong');
      setTimeout(() => setResult(null), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-6 pb-10">
      
{/* Header Row */}
<div className="w-full max-w-md flex items-center justify-between mb-8">
  
  {/* Left Side: Help Button (Fixed Width) */}
  <div className="flex justify-start w-24">
    <button
      onClick={() => setShowTips(true)}
      className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
    >
      <HelpCircle className="w-5 h-5 opacity-60" />
    </button>
  </div>

  {/* Center: Logo (Always Centered) */}
  <h1 className="text-3xl font-bold tracking-tight">
    <span className="text-[#5B9E7A]">integrle</span>
  </h1>

{/* Right Side: Auth + Stats (Fixed Width) */}
<div className="flex items-center justify-end gap-1 w-24">
  {!user || user.isAnonymous ? (
    <button
      onClick={loginWithGoogle}
      /* Added 'flex items-center h-full' to center vertically */
      className="px-2 py-1 flex items-center h-8 rounded-lg hover:bg-[#5B9E7A]/10 transition-colors relative"
    >
      <span className="text-[10px] font-medium italic text-[#5B9E7A] whitespace-nowrap leading-none -mt-0.5">
        sign in
      </span>
      {/* Tiny notification dot */}
      <span className="absolute top-1.5 right-0.5 w-1.5 h-1.5 bg-orange-500 rounded-full border border-white dark:border-[#1a1a1a]" />
    </button>
  ) : (
    <button
      onClick={() => setShowSignOut(true)} // Open the custom popup instead of window.confirm
      className="px-2 py-1 flex items-center h-8 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
    >
      <span className="text-[10px] font-medium italic opacity-40 hover:opacity-100 transition-opacity whitespace-nowrap leading-none -mt-0.5">
        sign out
      </span>
    </button>
  )}

  <Link
    to="/Stats"
    className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
  >
    <BarChart3 className="w-5 h-5 opacity-60" />
  </Link>
</div>
</div>

      {/* Timer & Streak */}
      <div className="w-full max-w-md flex items-center justify-between mb-2 px-2">
        <Timer
          key={user ? user.uid : 'guest'} // 👈 THIS IS THE FIX
          isRunning={timerRunning}
          onTimeUpdate={(t) => { timeRef.current = t; }}
          solvedTime={solved ? solveTime : undefined}
        />
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <Flame className="w-4 h-4 text-orange-400" />
          <span>{streak}</span>
        </div>
      </div>

      {/* Integral Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-md flex-shrink-0 mb-2 py-3 px-3 rounded-2xl text-center
          bg-white/50 dark:bg-white/5 border border-[#A8D5BA]/15"
      >
        <DailyIntegralDisplay />
      </motion.div>

      {/* Feedback */}
      <div className="w-full max-w-md mb-2 min-h-[44px]">
        <ResultFeedback result={result} />
      </div>

      {/* Input or Solution Video */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md"
      >
        {!solved ? (
          <CalculatorInput
            value={answer}
            onChange={setAnswer}
            disabled={solved}
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            <a 
              href={`https://www.youtube.com/watch?v=${problem.videoId}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-[#A8D5BA]/30 shadow-lg transition-transform group-hover:scale-[1.02]">
                <img 
                  src={`https://img.youtube.com/vi/${problem.videoId}/mqdefault.jpg`} 
                  alt="Solution Walkthrough"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                  <div className="w-16 h-11 bg-[#FF0000] rounded-xl flex items-center justify-center shadow-md transition-all group-hover:scale-110">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] text-white font-bold uppercase tracking-wider">
                  Watch Solution
                </div>
              </div>
            </a>
            <p className="text-center text-xs opacity-50 mt-3 italic">
              Nice work! Watch the walkthrough for this integral.
            </p>
          </motion.div>
        )}

        {/* Buttons */}
        <div className="mt-4 flex gap-3 max-w-[280px] mx-auto">
          {!solved ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={!answer}
              className="flex-1 h-12 rounded-xl font-semibold text-sm transition-all
                bg-[#A8D5BA] hover:bg-[#96CDAB] text-[#1a3a28]
                disabled:opacity-30 disabled:cursor-not-allowed
                shadow-sm hover:shadow-md"
            >
              Submit
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowShare(true)}
              className="flex-1 h-12 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2
                bg-[#A8D5BA] hover:bg-[#96CDAB] text-[#1a3a28]
                shadow-sm hover:shadow-md"
            >
              <Share2 className="w-4 h-4" />
              Share Result
            </motion.button>
          )}
        </div>
      </motion.div>

      <TipsModal isOpen={showTips} onClose={() => setShowTips(false)} />
      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        solveTime={solveTime}
        streak={streak}
        attempts={attempts}
      />
      <SignOutPopup 
        isOpen={showSignOut} 
        onClose={() => setShowSignOut(false)} 
        onConfirm={logout}
        userEmail={user?.email}
      />
    </div>
  );
}