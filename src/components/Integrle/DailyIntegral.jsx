import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const PROBLEMS = {
  "2026-03-15": { 
    integral: "\\int_0^1 3x^2-1 \\, dx", 
    answer: 0.00, 
    videoId: "dQw4w9WgXcQ",
    dayNumber: 1 
  }, 
  "2026-03-16": { 
    integral: "\\int_0^1 3x^2 \\, dx", 
    answer: 1.00, 
    videoId: "dQw4w9WgXcQ",
    dayNumber: 2 
  },
  "2026-03-17": { 
    integral: "\\int_1^2 x \\, dx", 
    answer: 1.50, 
    videoId: "dQw4w9WgXcQ",
    dayNumber: 3
  },
  "2026-03-18": { 
    integral: "\\int_1^2 x \\, dx", 
    answer: 1.50, 
    videoId: "dQw4w9WgXcQ",
    dayNumber: 4
  },
  "2026-03-19": {
    integral: "\\int_0^2 (2x + 1) \\, dx",
    answer: 6.00,
    videoId: "dQw4w9WgXcQ",
    dayNumber: 5
  },
  "2026-03-20": {
    integral: "\\int_1^3 x^2 \\, dx",
    answer: 8.67,
    videoId: "dQw4w9WgXcQ",
    dayNumber: 6
  },
  "2026-03-21": {
    integral: "\\int_0^4 \\sqrt{x} \\, dx",
    answer: 5.33,
    videoId: "dQw4w9WgXcQ",
    dayNumber: 7
  },
  "2026-03-22": {
    integral: "\\int_0^1 e^x \\, dx",
    answer: 1.72,
    videoId: "dQw4w9WgXcQ",
    dayNumber: 8
  },
};

export function getTodayDateString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function getDailyProblem() {
  const today = getTodayDateString();
  const problem = PROBLEMS[today];

  if (!problem) {
    // Fallback in case a date is missing from the dictionary
    return {
      integral: "\\int 0 \\, dx",
      answer: 0.00,
      videoId: "dQw4w9WgXcQ",
      dayNumber: "??",
      isFallback: true
    };
  }

  return problem;
}

export default function DailyIntegralDisplay() {
  const problem = getDailyProblem();
  
  const renderLatex = (tex) => {
    try {
      return katex.renderToString(tex, {
        displayMode: true,
        throwOnError: false,
        output: 'html',
        strict: false,
      });
    } catch (e) {
      return tex;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-xs font-medium tracking-widest uppercase opacity-50">
        {problem.isFallback ? "Bonus Round" : `Daily Integral #${problem.dayNumber}`}
      </div>
      <div 
        className="katex-display text-base font-medium sm:text-lg md:text-xl"
        dangerouslySetInnerHTML={{ __html: renderLatex(problem.integral) }}
      />
    </div>
  );
}