import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { getDailyProblem } from '../Integrle/ProblemList'; // Ensure path is correct

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
        {problem.isFallback ? "Archive Integral" : `Daily Integral #${problem.dayNumber}`}
      </div>
      <div 
        className="katex-display text-base font-medium sm:text-lg md:text-xl py-2"
        dangerouslySetInnerHTML={{ __html: renderLatex(problem.integral) }}
      />
    </div>
  );
}