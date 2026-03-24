export const PROBLEMS = {
  // --- ADD NEW PROBLEMS HERE ---
  "2026-03-28": {
    integral: "\\int_0^\\pi 3\\cos(2x) \\, dx",
    answer: 0.00,
    videoId: "dQw4w9WgXcQ",
    dayNumber: 14,
    hintMethod: "Use Linear Substitution.",
    hintIdentity: "\\int \\cos(kx) dx = \\frac{1}{k}\\sin(kx)"
  },
  "2026-03-27": {
    integral: "\\int_1^2 2xe^{x^2} \\, dx",
    answer: 51.88,
    videoId: "dQw4w9WgXcQ",
    dayNumber: 13,
    hintMethod: "Solve via Substitution (u-sub) where u = x².",
    hintIdentity: "\\text{The anti-derivative of } e^u \\text{ is } e^u."
  },
  "2026-03-26": {
    integral: "\\int_0^5 9\\sqrt{3x} \\, dx",
    answer: 116.19,
    videoId: "dQw4w9WgXcQ",
    dayNumber: 12,
    hintMethod: "Use the Power Rule.",
    hintIdentity: "\\sqrt{3x} = \\sqrt{3} \\cdot x^{1/2}"
  },
  "2026-03-25": {
    integral: "\\int_1^e \\frac{3}{x} \\, dx",
    answer: 3.00,
    videoId: "dQw4w9WgXcQ",
    dayNumber: 11,
    hintMethod: "Factor out the constant 3.",
    hintIdentity: "\\int \\frac{1}{x} dx = \\ln|x|"
  },
  "2026-03-24": {
    integral: "\\int_{1}^{2} (2x^{2} - x^{-2}) \\, dx",
    answer: 4.17,
    videoId: "dQw4w9WgXcQ",
    dayNumber: 10,
    hintMethod: "Integrate term-by-term using the Power Rule.",
    hintIdentity: "x^{-2} \\text{ integrates to } -x^{-1}."
  },
  "2026-03-23": {
    integral: "\\int_0^{\\pi} \\sin(2x) \\, dx",
    answer: 0.00,
    videoId: "dQw4w9WgXcQ",
    dayNumber: 9,
    hintMethod: "Use Linear Substitution.",
    hintIdentity: "\\int \\sin(kx) dx = -\\frac{1}{k}\\cos(kx)"
  },
  "2026-03-22": {
    integral: "\\int_0^1 e^x \\, dx",
    answer: 1.72,
    videoId: "dQw4w9WgXcQ",
    dayNumber: 8
  },
  "2026-03-21": {
    integral: "\\int_0^4 \\sqrt{x} \\, dx",
    answer: 5.33,
    videoId: "dQw4w9WgXcQ",
    dayNumber: 7
  },
  "2026-03-20": {
    integral: "\\int_1^3 x^2 \\, dx",
    answer: 8.67,
    videoId: "dQw4w9WgXcQ",
    dayNumber: 6
  },
  "2026-03-19": {
    integral: "\\int_0^2 (2x + 1) \\, dx",
    answer: 6.00,
    videoId: "dQw4w9WgXcQ",
    dayNumber: 5
  },
  "2026-03-18": { 
    integral: "\\int_1^2 x^3 \\, dx", 
    answer: 3.75, 
    videoId: "dQw4w9WgXcQ",
    dayNumber: 4
  },
  "2026-03-17": { 
    integral: "\\int_1^2 x \\, dx", 
    answer: 1.50, 
    videoId: "dQw4w9WgXcQ",
    dayNumber: 3
  },
  "2026-03-16": { 
    integral: "\\int_0^1 3x^2 \\, dx", 
    answer: 1.00, 
    videoId: "dQw4w9WgXcQ",
    dayNumber: 2 
  },
  "2026-03-15": { 
    integral: "\\int_0^1 3x^2-1 \\, dx", 
    answer: 0.00, 
    videoId: "dQw4w9WgXcQ",
    dayNumber: 1 
  }, 
};

export function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDailyProblem() {
  const today = getTodayDateString();
  const problem = PROBLEMS[today];

  if (!problem) {
    // FALLBACK: Find the most recent past integral so the user is never stuck
    const availableDates = Object.keys(PROBLEMS).sort().reverse();
    const fallbackDate = availableDates.find(date => date <= today) || availableDates[0];
    
    return {
      ...PROBLEMS[fallbackDate],
      isFallback: true
    };
  }

  return problem;
}