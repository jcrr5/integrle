import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X } from 'lucide-react';

export default function SignOutPopup({ isOpen, onClose, onConfirm, userEmail }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Popup Card */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="relative w-full max-w-[320px] bg-white dark:bg-[#1a1a1a] rounded-[28px] shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
              
              <h3 className="text-lg font-bold tracking-tight mb-1">Sign Out?</h3>
              <p className="text-xs opacity-50 leading-relaxed mb-6">
                Logged in as <span className="font-semibold text-[#5B9E7A]">{userEmail}</span>. 
                Are you sure you want to end your session?
              </p>

              <div className="flex flex-col w-full gap-2">
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20"
                >
                  Sign Out
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Close Icon */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 opacity-20 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}