import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ResultFeedback({ result }) {
  if (!result) return null;

  const isCorrect = result === 'correct';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10 }}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
          isCorrect
            ? 'bg-[#A8D5BA]/20 text-[#2d6b45] dark:text-[#A8D5BA]'
            : 'bg-red-100/60 dark:bg-red-500/10 text-red-700 dark:text-red-400'
        }`}
      >
        {isCorrect ? (
          <>
            <CheckCircle className="w-4 h-4" />
            Correct! Well done.
          </>
        ) : (
          <>
            <XCircle className="w-4 h-4" />
            Not quite. Try again!
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}