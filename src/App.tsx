/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { Heart, Stars, Clock, Calendar, Gift, Music } from "lucide-react";

// --- Configuration ---
// Adjusting to a future date so the user can see the countdown in action
const BIRTHDAY_DATE = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); 

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

const calculateTimeLeft = (target: Date): TimeLeft => {
  const difference = +target - +new Date();
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    total: difference
  };
};

export default function App() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(BIRTHDAY_DATE));
  const [isRevealed, setIsRevealed] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSpecialDayView, setIsSpecialDayView] = useState(false);
  
  // Floating Icons State for Interactive Scattering
  const [interactiveIcons, setInteractiveIcons] = useState([
    { id: 1, icon: "🎈", x: 10, y: 10, size: 60 },
    { id: 2, icon: "💖", x: 80, y: 20, size: 70 },
    { id: 3, icon: "🧁", x: 15, y: 70, size: 55 },
    { id: 4, icon: "🌸", x: 85, y: 75, size: 65 },
    { id: 5, icon: "🎁", x: 50, y: 85, size: 50 },
  ]);

  const triggerConfetti = useCallback((x?: number, y?: number) => {
    const duration = x ? 2 * 1000 : 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      if (x && y) {
        // Localized burst
        confetti({ ...defaults, particleCount: 10, origin: { x, y } });
        return clearInterval(interval);
      }

      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }, []);

  const scatterIcon = (id: number, currentX: number, currentY: number) => {
    // Blast at current position
    triggerConfetti(currentX / 100, currentY / 100);

    setInteractiveIcons(prev => prev.map(icon => {
      if (icon.id === id) {
        return {
          ...icon,
          x: Math.random() * 80 + 5, // Keep in view
          y: Math.random() * 80 + 5
        };
      }
      return icon;
    }));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = calculateTimeLeft(BIRTHDAY_DATE);
      setTimeLeft(newTime);
      
      if (newTime.total <= 0 && !isRevealed) {
        setIsRevealed(true);
        triggerConfetti();
      }
    }, 1000);

    setTimeout(() => setIsReady(true), 500);

    return () => clearInterval(timer);
  }, [isRevealed, triggerConfetti]);

  const handleManualReveal = () => {
    setIsRevealed(true);
    triggerConfetti();
  };

  const specialQuotes = [
    { text: "In your eyes, I see a thousand stars.", icon: "✨" },
    { text: "You are the melody that my heart dances to.", icon: "🎶" },
    { text: "Every day with you feels like a beautiful dream.", icon: "💭" },
    { text: "Your smile is the sunrise I wake up for.", icon: "🌅" },
  ];

  const specialImages = [
    "https://picsum.photos/seed/romantic/800/600",
    "https://picsum.photos/seed/flowers/800/600",
    "https://picsum.photos/seed/stars/800/600",
    "https://picsum.photos/seed/sunset/800/600",
  ];

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-sans selection:bg-rose-200 selection:text-rose-900 bg-vibrant-bg">
      
      {/* Immersive Background Gradients */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 20% 20%, #ffdde1 0%, transparent 40%), radial-gradient(circle at 80% 80%, #ee9ca7 0%, transparent 40%)' 
        }} />
      </div>

      <AnimatePresence mode="wait">
        {isSpecialDayView ? (
          <motion.div
            key="special-view"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed inset-0 z-50 bg-white/95 backdrop-blur-3xl overflow-y-auto selection:bg-vibrant-pink selection:text-white"
          >
            {/* Top Bar Navigation */}
            <div className="sticky top-0 z-50 w-full p-6 flex justify-between items-center bg-white/50 backdrop-blur-md border-b border-vibrant-pink/10">
               <button 
                  onClick={() => setIsSpecialDayView(false)}
                  className="px-6 py-2 border-2 border-vibrant-pink text-vibrant-pink rounded-full font-black text-xs uppercase tracking-widest hover:bg-vibrant-pink hover:text-white transition-all"
                >
                  Back
                </button>
                <div className="flex items-center gap-4">
                   <Clock className="w-4 h-4 text-vibrant-pink animate-spin-slow" />
                   <span className="font-display font-black text-vibrant-pink text-sm tabular-nums">
                     {new Date().toLocaleTimeString()}
                   </span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto py-20 px-6 space-y-32">
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ rotate: -10, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  className="inline-block px-4 py-2 bg-vibrant-gold text-vibrant-plum font-black text-[10px] uppercase tracking-widest rounded-lg mb-4"
                >
                  Established 2026
                </motion.div>
                <h2 className="text-vibrant-pink font-black uppercase tracking-[0.5em] text-xs">Today's Reflection</h2>
                <h1 className="text-7xl md:text-9xl font-[900] text-vibrant-plum tracking-[-0.05em] leading-none">Your <span className="text-vibrant-pink">Special</span> Day</h1>
              </div>

              {/* Parallax Content Blocks */}
              {specialQuotes.map((quote, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`flex flex-col md:flex-row items-center gap-16 ${idx % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                >
                  <div className="w-full md:w-3/5 relative">
                    <div className="absolute -inset-4 bg-vibrant-pink/5 rounded-[45px] -rotate-2" />
                    <div className="relative overflow-hidden rounded-[40px] shadow-vibrant border-8 border-white">
                      <motion.img 
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 1 }}
                        src={specialImages[idx]} 
                        alt="Special Moment"
                        referrerPolicy="no-referrer"
                        className="w-full h-[500px] object-cover"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-2/5 space-y-8 text-center md:text-left">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }} 
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-7xl"
                    >
                      {quote.icon}
                    </motion.div>
                    <p className="text-4xl md:text-5xl font-black text-vibrant-plum leading-tight">
                      {quote.text}
                    </p>
                    <div className="h-2 w-32 bg-vibrant-gold rounded-full" />
                  </div>
                </motion.div>
              ))}

              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="py-32 text-center relative"
              >
                <div className="absolute inset-0 bg-vibrant-pink/5 blur-3xl rounded-full" />
                <div className="relative">
                  <div className="text-[200px] leading-none mb-4 select-none">👑</div>
                  <h3 className="text-5xl md:text-7xl font-black text-vibrant-pink tracking-tight">The Queen of Hearts</h3>
                  <p className="mt-8 text-vibrant-plum/60 font-semibold tracking-widest uppercase text-sm italic">Celebrating your existence since forever.</p>
                </div>
              </motion.div>
            </div>
            
            {/* Scroll Progress Decor */}
            <div className="fixed bottom-0 left-0 w-full h-1 bg-zinc-100 overflow-hidden">
               <motion.div 
                 className="h-full bg-vibrant-pink"
                 initial={{ scaleX: 0 }}
                 style={{ originX: 0 }}
               />
            </div>
          </motion.div>
        ) : !isRevealed ? (
          <motion.section
            key="countdown"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isReady ? 1 : 0, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 w-full max-w-[680px] bg-white/85 backdrop-blur-xl rounded-[40px] shadow-vibrant p-12 text-center border-4 border-white"
          >
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-7xl select-none">✨</div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 mb-6"
            >
              <Heart className="w-5 h-5 text-vibrant-pink fill-vibrant-pink" />
              <span className="text-xs uppercase tracking-[0.3em] font-black text-vibrant-pink">The Big Reveal Approaches</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-[900] text-vibrant-pink mb-8 tracking-[-0.05em] leading-tight">
              A Special Surprise for You
            </h1>

            <div className="flex flex-wrap gap-4 justify-center mb-10">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Mins", value: timeLeft.minutes },
                { label: "Secs", value: timeLeft.seconds },
              ].map((item, i) => (
                <div key={item.label} className="w-[85px] h-[100px] bg-vibrant-pink text-white rounded-[20px] flex flex-col items-center justify-center shadow-[0_8px_0_#d93466]">
                  <motion.span 
                    key={item.value}
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-3xl font-black tabular-nums"
                  >
                    {String(item.value).padStart(2, "0")}
                  </motion.span>
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-90">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-6">
              <p className="text-vibrant-plum font-semibold text-lg max-w-md">
                "To the most incredible girl who brings light into every room."
              </p>
              
              <div className="flex flex-col md:flex-row gap-4">
                <button 
                  onClick={handleManualReveal}
                  className="text-xs uppercase tracking-[0.2em] text-vibrant-plum/40 hover:text-vibrant-pink transition-colors underline font-medium"
                >
                  Unlock Secret Gift
                </button>
                <button 
                  onClick={() => setIsSpecialDayView(true)}
                  className="px-8 py-3 bg-vibrant-plum text-white font-black rounded-full uppercase text-xs tracking-widest shadow-[0_6px_0_#4a1535] hover:scale-105 active:scale-95 transition-all"
                >
                  Special Day
                </button>
              </div>
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="reveal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "circOut" }}
            className="relative z-10 w-full max-w-[680px] bg-white/85 backdrop-blur-xl rounded-[40px] shadow-vibrant p-12 text-center border-4 border-white"
          >
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-7xl select-none">✨</div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
              className="relative mb-8"
            >
              <div className="absolute inset-0 bg-vibrant-pink/10 blur-3xl rounded-full scale-150" />
              <div className="relative mx-auto bg-vibrant-pink text-white w-20 h-20 rounded-[24px] flex items-center justify-center shadow-[0_8px_0_#d93466]">
                <Gift className="w-10 h-10" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="uppercase tracking-[0.4em] text-xs text-vibrant-pink font-black mb-4">The Moment is Yours</h2>
              <h1 className="text-7xl md:text-8xl font-[900] text-vibrant-pink mb-6 leading-none tracking-[-0.05em]">
                Happy Birthday!
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              <p className="text-2xl text-vibrant-plum leading-relaxed font-semibold">
                "Today, the world celebrates the magic that is YOU. May your year be as beautiful as your smile."
              </p>
              
              <div className="text-base text-vibrant-pink font-bold py-2">
                THE SURPRISE HAS BEEN UNLOCKED! 🎁
              </div>

              <div className="p-8 bg-vibrant-pink/5 rounded-[30px] border-2 border-dashed border-vibrant-pink/20">
                <p className="text-vibrant-plum font-medium leading-loose text-lg">
                  You bring so much light and joy into existence. On this special day, I wanted to create a vibrant celebration just for you. Never stop being the amazing person you are.
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                   <div className="h-1 w-8 bg-vibrant-pink rounded-full" />
                   <span className="font-black italic text-vibrant-pink">Stay Amazing</span>
                   <div className="h-1 w-8 bg-vibrant-pink rounded-full" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex justify-center mt-10"
            >
              <button 
                onClick={() => setIsSpecialDayView(true)}
                className="px-12 py-6 bg-vibrant-plum text-white font-black rounded-full uppercase text-lg tracking-widest shadow-[0_10px_0_#4a1535] hover:scale-105 active:scale-95 transition-all"
              >
                Special Day
              </button>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Floating Sparkles & Interactive Icons */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
        {/* Dynamic Sparkles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute bg-white sparkle-shape"
            style={{
              width: 20,
              height: 20,
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.5],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}

        {/* Interactive Scattering Icons */}
        {interactiveIcons.map((item) => (
          <motion.div
            key={item.id}
            className="absolute select-none pointer-events-auto cursor-pointer"
            style={{ 
              fontSize: item.size,
              left: `${item.x}%`,
              top: `${item.y}%`,
            }}
            onMouseEnter={() => scatterIcon(item.id, item.x, item.y)}
            onClick={() => scatterIcon(item.id, item.x, item.y)}
            animate={{
              y: [0, -20, 0],
              rotate: [-5, 5, -5]
            }}
            transition={{
              duration: 4 + item.id,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>
    </main>
  );
}
