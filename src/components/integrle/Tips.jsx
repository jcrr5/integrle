import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, Calculator, CheckCircle } from 'lucide-react';

const TIPS = [
  {
    icon: Lightbulb,
    title: 'Solve',
    description: 'Calculate the value of the daily integral shown on screen.',
  },
  {
    icon: Calculator,
    title: 'Toolset',
    description: 'You may use a scientific calculator to help evaluate complex expressions.',
  },
  {
    icon: CheckCircle,
    title: 'Submit',
    description: 'Enter your answer to 2 decimal places and check your answer.',
  },
];

export default function TipsModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl p-6 shadow-xl
              bg-[#FAF6F0] dark:bg-[#1E1E32] border border-[#A8D5BA]/20"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold">How to Play</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {TIPS.map((tip, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#A8D5BA]/20 flex items-center justify-center">
                    <tip.icon className="w-4 h-4 text-[#5B9E7A]" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{tip.title}</p>
                    <p className="text-sm opacity-60 mt-0.5 leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}