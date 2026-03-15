import React from 'react';
import { Delete } from 'lucide-react';
import { motion } from 'framer-motion';

const KEYS = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['-', '0', '.'],
];

export default function CalculatorInput({ value, onChange, disabled }) {
  const handleKey = (key) => {
    if (disabled) return;
    
    if (key === '-') {
      if (value === '' || value === '-') {
        onChange(value === '-' ? '' : '-');
      }
      return;
    }
    
    if (key === '.' && value.includes('.')) return;
    
    onChange(value + key);
  };

  const handleDelete = () => {
    if (disabled) return;
    onChange(value.slice(0, -1));
  };

  return (
    <div className="w-full max-w-[280px] mx-auto">
      {/* Display */}
      <div className="mb-2 relative">
        <div className="calc-display rounded-xl px-4 py-3 text-right text-2xl font-mono min-h-[56px] flex items-center justify-end border-2 transition-colors
          border-[#A8D5BA]/40 dark:border-[#A8D5BA]/30 bg-white/80 dark:bg-white/5">
          <span className={value ? 'opacity-100' : 'opacity-30'}>
            {value || '0.00'}
          </span>
        </div>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-2">
        {KEYS.flat().map((key) => (
          <motion.button
            key={key}
            whileTap={{ scale: 0.92 }}
            onClick={() => handleKey(key)}
            disabled={disabled}
            className="calc-key h-10 rounded-xl text-lg font-medium transition-all
              bg-white/60 dark:bg-white/8 hover:bg-[#A8D5BA]/20 dark:hover:bg-[#A8D5BA]/15
              active:bg-[#A8D5BA]/30 border border-[#A8D5BA]/20 dark:border-[#A8D5BA]/15
              disabled:opacity-40 disabled:cursor-not-allowed
              shadow-sm hover:shadow-md"
          >
            {key}
          </motion.button>
        ))}
      </div>

      {/* Delete button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleDelete}
        disabled={disabled}
        className="w-full mt-2 h-11 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2
          bg-white/40 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-500/10
          border border-[#A8D5BA]/15 dark:border-[#A8D5BA]/10
          disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Delete className="w-4 h-4" />
        <span>Delete</span>
      </motion.button>
    </div>
  );
}