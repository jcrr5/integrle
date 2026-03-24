import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Flame, Target, Clock, ChevronLeft, Calendar, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { getTodayDateString } from '../components/integrle/ProblemList';
import { useAuth } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function Stats() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchStats();
  }, [user]);

  const fetchStats = async () => {
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      let s = docSnap.data();
      const todayStr = getTodayDateString();
      const lastSolvedStr = s.last_solved_date;

      if (lastSolvedStr && lastSolvedStr !== todayStr) {
        const lastDate = new Date(lastSolvedStr);
        const todayDate = new Date(todayStr);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / 86400000);

        if (diffDays > 1) {
          s.current_streak = 0;
          await updateDoc(userRef, { current_streak: 0 });
        }
      }
      setStats(s);
    }
    setLoading(false);
  };

  const formatTime = (seconds) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const statCards = [
    { 
      label: 'Current Streak', 
      value: stats?.current_streak || 0, 
      icon: Flame, 
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    },
    { 
      label: 'Best Streak', 
      value: stats?.best_streak || 0, 
      icon: Trophy, 
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10'
    },
    { 
      label: 'Total Solved', 
      value: stats?.total_solved || 0, 
      icon: Target, 
      color: 'text-[#5B9E7A]',
      bg: 'bg-[#5B9E7A]/10'
    },
    { 
      label: 'Last Time', 
      value: formatTime(stats?.last_solve_time), 
      icon: Clock, 
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-6 pb-10 max-w-md mx-auto">
      
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-8">
        <Link
          to={createPageUrl('Home')}
          className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 opacity-60" />
        </Link>
        
        <h1 className="text-xl font-bold tracking-tight opacity-80">Your Progress</h1>

        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {statCards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 flex flex-col items-center text-center"
          >
            <div className={`p-2 rounded-lg ${card.bg} mb-3`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <span className="text-2xl font-bold tracking-tight">{card.value}</span>
            <span className="text-[10px] uppercase tracking-widest font-semibold opacity-40 mt-1">
              {card.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* History Section */}
      <div className="w-full mt-8">
        <h2 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4 px-2">
          Recent History
        </h2>
        
        <div className="space-y-2">
          {stats?.solve_history?.slice(-5).reverse().map((entry, idx) => (
            <div 
              key={idx}
              className="w-full p-4 rounded-2xl bg-white/30 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 opacity-30" />
                <span className="text-sm font-medium">{entry.date}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono opacity-60">{formatTime(entry.time_seconds)}</span>
                <div className={`w-2 h-2 rounded-full ${entry.correct ? 'bg-[#5B9E7A]' : 'bg-red-400'}`} />
              </div>
            </div>
          ))}

          {(!stats?.solve_history || stats.solve_history.length === 0) && (
            <div className="text-center py-10 opacity-30 italic text-sm">
              No history yet. Solve today's integral to start!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}