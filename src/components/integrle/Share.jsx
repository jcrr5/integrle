import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Share2 } from 'lucide-react';
// REPLACED: Removed sonner, added shadcn hook
import { useToast } from "@/components/ui/use-toast";
import { getDailyProblem } from './DailyIntegral';

export default function ShareModal({ isOpen, onClose, solveTime, streak, attempts }) {
  const problem = getDailyProblem();
  const { toast } = useToast(); // Initialize shadcn toast
  
  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const appUrl = window.location.origin; 
  const shareText = `🧮 Integrle #${problem.dayNumber}\n⏱️ Time: ${formatTime(solveTime)}\n🔥 Streak: ${streak}\n📝 Attempts: ${attempts}\n\nSolve it here: ${appUrl}`;

  const handleCopy = async () => {
    try {
      // Method 1: Modern Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied to clipboard!",
          description: "Your results are ready to be pasted.",
        });
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch (err) {
      // Method 2: Fallback "Legacy" Method (Works on insecure IP addresses)
      try {
        const textArea = document.createElement("textarea");
        textArea.value = shareText;
        
        // Ensure the textarea is not visible but part of the DOM
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
          toast({
            title: "Copied to clipboard!",
            description: "Results saved (using legacy fallback).",
          });
        } else {
          throw new Error("Fallback copy failed");
        }
      } catch (fallbackErr) {
        toast({
          variant: "destructive",
          title: "Copy Failed",
          description: "Please try manually selecting the text above.",
        });
      }
    }
  };

  const handleShare = async () => {
    // Check for both support AND secure context (HTTPS/localhost)
    if (navigator.share && window.isSecureContext) {
      try {
        await navigator.share({
          title: 'Integrle Result',
          text: shareText,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      // Automatic fallback for Android/Mobile over insecure local IP
      handleCopy();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl p-6 shadow-2xl
              bg-[#FAF6F0] dark:bg-[#1E1E32] border border-[#A8D5BA]/30"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Share Result</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 opacity-60" />
              </button>
            </div>

            <div className="rounded-2xl p-5 mb-6 font-mono text-sm whitespace-pre-line leading-relaxed
              bg-white/80 dark:bg-white/5 border border-[#A8D5BA]/20 shadow-inner">
              {shareText}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl font-bold text-base transition-all
                  bg-[#A8D5BA] hover:bg-[#96CDAB] text-[#1a3a28] shadow-lg active:scale-95"
              >
                <Share2 className="w-5 h-5" />
                Share Results
              </button>
              
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl font-semibold text-sm transition-all
                  bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10
                  border border-[#A8D5BA]/20 opacity-80"
              >
                <Copy className="w-4 h-4" />
                Copy to Clipboard
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}