import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Share2, HelpCircle, Flame, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { getDailyProblem, getTodayDateString } from '../components/integrle/ProblemList';
import CalculatorInput from '../components/integrle/InputKeyboard';
import DailyIntegralDisplay from '../components/integrle/DailyIntegral';
import Timer from '../components/integrle/Timer';
import TipsModal from '../components/integrle/Tips';
import ShareModal from '../components/integrle/Share';
import ResultFeedback from '../components/integrle/Results';

export default function Home() {
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
    loadStats();
  }, []);

  // REPLACED: Now uses localStorage
    const loadStats = () => {
        const savedStats = localStorage.getItem('integrle_user_stats');
        if (savedStats) {
            const s = JSON.parse(savedStats);
            setStats(s);
            setStreak(s.current_streak || 0);
            if (s.last_solved_date === today) {
            setSolved(true);
            setTimerRunning(false);
            setSolveTime(s.last_solve_time || 0);
            setResult('correct');
            
            // Find today's entry in history to get the correct attempt count
            const todayEntry = s.solve_history?.find(h => h.date === today);
            if (todayEntry) {
                setAttempts(todayEntry.attempts || 1);
            }
            }
        }
    };

  const handleSubmit = async () => {
    if (!answer || solved) return;
    
    const userAnswer = parseFloat(answer);
    const correctAnswer = problem.answer;
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (Math.abs(userAnswer - correctAnswer) < 0.005) {
      setResult('correct');
      setSolved(true);
      setTimerRunning(false);
      const finalTime = timeRef.current;
      setSolveTime(finalTime);

      // Calculate streak
      let newStreak = 1;
      if (stats) {
        const lastDate = stats.last_solved_date;
        if (lastDate) {
          const last = new Date(lastDate);
          const todayDate = new Date(today);
          const diffDays = Math.floor((todayDate.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            newStreak = (stats.current_streak || 0) + 1;
          } else if (diffDays === 0) {
            newStreak = stats.current_streak || 1;
          }
        }
      }
      setStreak(newStreak);

      const historyEntry = { date: today, time_seconds: finalTime, correct: true, attempts: newAttempts };
      const existingHistory = stats?.solve_history || [];

      // REPLACED: Saving to localStorage 
      const updatedStats = {
        ...stats,
        current_streak: newStreak,
        best_streak: Math.max(newStreak, stats?.best_streak || 0),
        total_solved: (stats?.total_solved || 0) + 1,
        last_solved_date: today,
        last_solve_time: finalTime,
        solve_history: [...existingHistory, historyEntry],
      };

      localStorage.setItem('integrle_user_stats', JSON.stringify(updatedStats));
      setStats(updatedStats);
      
    } else {
      setResult('wrong');
      setTimeout(() => setResult(null), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-6 pb-10">
      
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-4">
        <button
          onClick={() => setShowTips(true)}
          className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <HelpCircle className="w-5 h-5 opacity-60" />
        </button>
        
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-[#5B9E7A]">intergle</span>
        </h1>

        <Link
          to={createPageUrl('Stats')}
          className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <BarChart3 className="w-5 h-5 opacity-60" />
        </Link>
      </div>

      {/* Timer & Streak */}
      <div className="w-full max-w-md flex items-center justify-between mb-2 px-2">
        <Timer
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

    {/* Calculator or Solution Video */}
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
            {/* Thumbnail Image */}
            <img 
                src={`https://img.youtube.com/vi/${problem.videoId}/mqdefault.jpg`} 
                alt="Solution Walkthrough"
                className="w-full h-full object-cover"
            />
            {/* Play Button Overlay */}
           <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/10 transition-colors">
            {/* YouTube Red Rectangle (Rounded Corners) */}
            <div className="w-16 h-11 bg-[#FF0000] rounded-xl flex items-center justify-center shadow-md transition-all group-hover:scale-110">
                {/* White Play Arrow */}
                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
            </div>
            </div>
            {/* Label */}
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

        {/* Submit & Share */}
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
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
    </div>
  );
}