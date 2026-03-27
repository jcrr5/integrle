import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ResultFeedback({ result, problem, solved }) {
  if (!result) return null;

  const isCorrect = result === 'correct';

  return (
    <AnimatePresence mode="wait">
      <div className="flex flex-col gap-4 w-full">
        {/* The Text Notification */}
        <motion.div
          key="text-feedback"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            isCorrect
              ? 'bg-[#A8D5BA]/20 text-[#2d6b45] dark:text-[#A8D5BA]'
              : 'bg-red-100/60 dark:bg-red-500/10 text-red-700 dark:text-red-400'
          }`}
        >
          {isCorrect ? (
            <>
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>Correct! Come back tomorrow for another Integral.</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 flex-shrink-0" />
              <span>Not quite. Try again!</span>
            </>
          )}
        </motion.div>

        {/* The Solution Video - Only shows if solved and problem data exists */}
        {isCorrect && solved && problem?.videoId && (
          <motion.div
            key="video-solution"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full"
          >
            <a
              href={`https://www.youtube.com/watch?v=${problem.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-[#A8D5BA]/30 shadow-lg transition-transform group-hover:scale-[1.01]">
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
      </div>
    </AnimatePresence>
  );
}