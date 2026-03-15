import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Flame, Clock, Trophy, Hash, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl p-5 bg-white/50 dark:bg-white/5 border border-[#A8D5BA]/15"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs opacity-50 mt-1 font-medium uppercase tracking-wider">{label}</p>
    </motion.div>
  );
}

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  // REPLACED: Fetching from localStorage 
  const loadStats = () => {
    setLoading(true);
    const savedStats = localStorage.getItem('integrle_user_stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
    setLoading(false);
  };

  const formatTime = (s) => {
    if (!s && s !== 0) return '--:--';
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const handleShare = async () => {
    const text = `🧮 Integrle Stats\n🔥 Current Streak: ${stats?.current_streak || 0}\n🏆 Best Streak: ${stats?.best_streak || 0}\n📊 Total Solved: ${stats?.total_solved || 0}\n⏱️ Last Solve: ${formatTime(stats?.last_solve_time)}`;
    
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        await navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
      }
    }
  };

  const avgTime = (() => {
    if (!stats?.solve_history?.length) return null;
    const total = stats.solve_history.reduce((sum, h) => sum + (h.time_seconds || 0), 0);
    return Math.round(total / stats.solve_history.length);
  })();

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-6 pb-10">
      
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-8">
        <Link
          to={createPageUrl('Home')}
          className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 opacity-60" />
        </Link>
        
        <h1 className="text-xl font-bold tracking-tight">Statistics</h1>
        
        <button
          onClick={handleShare}
          className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <Share2 className="w-5 h-5 opacity-60" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 opacity-40">
          <div className="w-6 h-6 border-2 border-[#A8D5BA] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="w-full max-w-md grid grid-cols-2 gap-3 mb-8">
            <StatCard
              icon={Flame}
              label="Current Streak"
              value={stats?.current_streak || 0}
              color="bg-orange-100 dark:bg-orange-500/15 text-orange-500"
              delay={0.05}
            />
            <StatCard
              icon={Trophy}
              label="Best Streak"
              value={stats?.best_streak || 0}
              color="bg-yellow-100 dark:bg-yellow-500/15 text-yellow-600"
              delay={0.1}
            />
            <StatCard
              icon={Clock}
              label="Last Solve Time"
              value={formatTime(stats?.last_solve_time)}
              color="bg-[#A8D5BA]/20 dark:bg-[#A8D5BA]/15 text-[#5B9E7A]"
              delay={0.15}
            />
            <StatCard
              icon={Hash}
              label="Total Solved"
              value={stats?.total_solved || 0}
              color="bg-blue-100 dark:bg-blue-500/15 text-blue-500"
              delay={0.2}
            />
          </div>

          {/* Average Time */}
          {avgTime !== null && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="w-full max-w-md rounded-2xl p-5 mb-8
                bg-white/50 dark:bg-white/5 border border-[#A8D5BA]/15"
            >
              <p className="text-xs opacity-50 font-medium uppercase tracking-wider mb-1">Average Solve Time</p>
              <p className="text-3xl font-bold font-mono">{formatTime(avgTime)}</p>
            </motion.div>
          )}

          {/* Recent History */}
          {stats?.solve_history?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full max-w-md"
            >
              <h2 className="text-sm font-semibold opacity-50 uppercase tracking-wider mb-3 px-1">
                Recent Solves
              </h2>
              <div className="space-y-2">
                {[...stats.solve_history].reverse().slice(0, 10).map((entry, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3 rounded-xl
                      bg-white/50 dark:bg-white/5 border border-[#A8D5BA]/10"
                  >
                    <span className="text-sm font-medium">{entry.date}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-xs opacity-50">{entry.attempts} attempt{entry.attempts !== 1 ? 's' : ''}</span>
                      <span className="text-sm font-mono font-medium">{formatTime(entry.time_seconds)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {!stats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 opacity-40"
            >
              <p className="text-sm">No stats yet. Solve your first integral!</p>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}