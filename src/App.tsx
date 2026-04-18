/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { Heart, Stars, Clock, Calendar, Gift, Music, Volume2, VolumeX } from "lucide-react";

// --- Configuration ---
const BIRTHDAY_DATE = new Date("2026-04-20T00:00:00"); 

// Birthday Score URL (Royalty Free Celebration Track)
const BACKGROUND_MUSIC_URL = "https://cdn.pixabay.com/audio/2022/03/15/audio_732a926d56.mp3?filename=happy-birthday-15546.mp3";

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
  const [isTimelineView, setIsTimelineView] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showAgePrompt, setShowAgePrompt] = useState(false);
  const [ageInput, setAgeInput] = useState("");
  const [irritationLevel, setIrritationLevel] = useState(0);

  const timelineData = [
    { year: 1, title: "The Beginning", desc: "A tiny bundle of joy enters the world, bringing endless sunshine.", img: "https://lh3.googleusercontent.com/d/18q_jwKacPvGGLkNgBH_N9FWYl8guv9LK" },
    { year: 2, title: "First Steps", desc: "Wobbly steps and curious eyes, exploring a brand new world.", img: "https://lh3.googleusercontent.com/d/1iDZqtbDcdCFXrbbsRzFXbYWKylo6J9Vz" },
    { year: 3, title: "Little Explorer", desc: "Constant wonder and many 'Why?' questions in every corner.", img: "https://lh3.googleusercontent.com/d/1ea4FGkdcY8Vk_QPh1RedLitA49rHELY7"  },
    { year: 4, title: "Preschool Fun", desc: "Crayons, stories, and the start of many great friendships.", img: "https://lh3.googleusercontent.com/d/1OQp_lOmxOdOQdlNAX4yq1XX-W8_4VIyA"  },
    { year: 5, title: "Big School", desc: "A giant backpack and a heart full of big dreams.", img: "https://lh3.googleusercontent.com/d/1nQLP3r6xuaZr3fPN4zpd8y3Wo-FI2GGN"  },
    { year: 6, title: "Learning Fast", desc: "Reading books and discovering the magic of numbers.", img: "https://lh3.googleusercontent.com/d/11PCNHb78tcbxeevfnEhm3O1nRqHg3hNk"  },
    { year: 7, title: "Little Artist", desc: "Paint-covered hands and masterpieces on the fridge.", img: "https://lh3.googleusercontent.com/d/1zg5Jbce8ZghXw2c37r2As2HRJh7OTuoy"  },
    { year: 8, title: "Adventure Awaits", desc: "Bike rides and sunset games with neighborhood friends.", img:   "https://lh3.googleusercontent.com/d/15scFa8mBOo0OAOriMiRR1uWTph6BJUPd" },
    { year: 9, title: "Dreaming Big", desc: "Writing stories and imagining a future full of magic.", img: "https://lh3.googleusercontent.com/d/1nPehMZbs8OuWMG7SXJ_SBy4a6KGVrluw"   },
    { year: 10, title: "Double Digits", desc: "A big milestone! No longer just a 'little' kid anymore.", img:  "https://lh3.googleusercontent.com/d/15pIKsqs5Vh8hKg2xNwUmELTb0EHBNVJe" },
    { year: 11, title: "New Horizons", desc: "Starting to find your own unique voice and style.", img: "https://lh3.googleusercontent.com/d/1IQNEXju4DdWV09e6JL1XK64OdQDonvYa" },
    { year: 12, title: "Tween Times", desc: "Mixing childhood games with the start of teenage dreams.", img:  "https://lh3.googleusercontent.com/d/1iIuY4sZTWEoPbC166MDtuOQqX8_PkVCW" },
    { year: 13, title: "Official Teen", desc: "Music, moods, and the start of a beautiful transition.", img:  "https://lh3.googleusercontent.com/d/1UyJVuoIvkGQu4AcQEC0jAnFKzQwCrDAg"},
    { year: 14, title: "Finding Self", desc: "Deep thoughts and deeper friendships that last forever.", img: "https://lh3.googleusercontent.com/d/1JyUyPndB5Wai272woCR4aBuwkVMfjrzo"     },
    { year: 15, title: "Quinceañera/Spark", desc: "A shimmering year of growth and feminine strength.", img: "https://lh3.googleusercontent.com/d/1MIiZ_G87nfJuzIC-Hi6WGvEUN8Vl2d32"   },
    { year: 16, title: "Driving Dreams", desc: "Freedom, energy, and the world starting to look smaller.", img:  "https://lh3.googleusercontent.com/d/1NGnFr18HRpUlNecD9lzU_QLilRQo0vhA"   },
    { year: 17, title: "Almost There", desc: "Reflecting on the past while looking at the bright future.", img: "https://lh3.googleusercontent.com/d/1jEetCGNNYTJ80xq94LMX3K_czbmDcJEq"  },
    { year: 18, title: "Adulthood Gaze", desc: "Standing on the threshold of a magnificent new journey.", img: "https://lh3.googleusercontent.com/d/1p6OTZchrAivn4Gq0rQnxkz-Dec33RSV0"   },
  ];
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const performReveal = () => {
    setIsRevealed(true);
    triggerConfetti();
    if (audioRef.current && isMuted) {
      audioRef.current.play().catch(e => console.log("Manual reveal audio blocked"));
      setIsMuted(false);
    }
    setShowAgePrompt(false);
  };

  const handleAgeSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    const isCountdownOver = timeLeft.total <= 0;

    if (ageInput === "19" && isCountdownOver) {
      performReveal();
    } else {
      setIrritationLevel(prev => prev + 1);
      setAgeInput("");
      
      // If they got the age right but it's too early, maybe give a slight hint
      if (ageInput === "19" && !isCountdownOver) {
        // Special case for getting it right but being too early
        console.log("Right age, but too early!");
      }
    }
  };

  const irritationMessages = [
    "Wait, are you sure? 🤨",
    "Hmm... that doesn't sound right. 🤐",
    "Really? That's your final answer? 🤡",
    "Go ask your mom! 🏃‍♀️",
    "Maybe count on your fingers? 🖐️",
    "ACCESS DENIED (obviously) 🚫",
    "Are you even the right person? 🧐",
    "LOL NO. 💀",
    "Patience is a virtue! ⏳",
    "Nice try, but the stars haven't aligned yet. ✨",
  ];

  // Floating Icons State for Interactive Scattering
  const [interactiveIcons, setInteractiveIcons] = useState([
    { id: 1, icon: "🎈", x: 10, y: 10, size: 60 },
    { id: 2, icon: "💖", x: 80, y: 20, size: 70 },
    { id: 3, icon: "🧁", x: 15, y: 70, size: 55 },
    { id: 4, icon: "🌸", x: 85, y: 75, size: 65 },
    { id: 5, icon: "🎁", x: 50, y: 85, size: 50 },
  ]);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(e => console.log("Audio play blocked by browser"));
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

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
        // Unmute on reveal if browser allows
        if (audioRef.current && isMuted) {
          audioRef.current.play().catch(e => console.log("Reveal audio blocked"));
          setIsMuted(false);
        }
      }
    }, 1000);

    setTimeout(() => setIsReady(true), 500);

    return () => clearInterval(timer);
  }, [isRevealed, triggerConfetti, isMuted]);

  const handleManualReveal = () => {
    setShowAgePrompt(true);
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-sans selection:bg-rose-200 selection:text-rose-900 bg-vibrant-bg">
      
      {/* Background Music */}
      <audio ref={audioRef} src={BACKGROUND_MUSIC_URL} loop />

      {/* Mute Toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMute}
        className="fixed top-6 right-6 z-[60] p-3 bg-white/50 backdrop-blur-md rounded-full shadow-lg border border-vibrant-pink/20 text-vibrant-pink"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </motion.button>

      {/* Immersive Background Gradients */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 20% 20%, #ffdde1 0%, transparent 40%), radial-gradient(circle at 80% 80%, #ee9ca7 0%, transparent 40%)' 
        }} />
      </div>

      <AnimatePresence mode="wait">
        {showAgePrompt && (
          <motion.div
            key="age-gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-vibrant-plum/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ 
                scale: 1, 
                y: 0,
                x: irritationLevel > 0 ? [0, -10, 10, -10, 10, 0] : 0
              }}
              transition={{ x: { duration: 0.3 } }}
              className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              {/* Irritation Background Elements */}
              {irritationLevel > 2 && Array.from({ length: Math.min(irritationLevel, 15) }).map((_, i) => (
                <motion.div
                  key={`err-${i}`}
                  initial={{ opacity: 0, x: Math.random() * 400 - 200, y: Math.random() * 400 - 200 }}
                  animate={{ opacity: 0.2, x: Math.random() * 400 - 200, y: Math.random() * 400 - 200 }}
                  transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
                  className="absolute text-4xl select-none pointer-events-none"
                >
                  {["🤡", "🤨", "🤐", "🚫", "💀"][i % 5]}
                </motion.div>
              ))}

              <button 
                onClick={() => { setShowAgePrompt(false); setIrritationLevel(0); }}
                className="absolute top-6 right-6 text-vibrant-plum/20 hover:text-vibrant-pink transition-colors"
              >
                <Stars className="w-6 h-6" />
              </button>

              <div className="text-center space-y-6 relative z-10">
                <motion.div 
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={performReveal}
                  className="mx-auto bg-vibrant-pink/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 cursor-pointer hover:bg-vibrant-pink/20 transition-colors"
                  title="Secret Bypass"
                >
                  <Gift className="w-8 h-8 text-vibrant-pink" />
                </motion.div>
                <h2 className="text-3xl font-[900] text-vibrant-plum">Security Check</h2>
                <p className="text-vibrant-plum/60 font-medium italic">"Wts ur age?"</p>
                
                <form onSubmit={handleAgeSubmit} className="space-y-4">
                  {irritationLevel > 1 && Array.from({ length: Math.min(irritationLevel - 1, 3) }).map((_, i) => (
                    <motion.div
                      key={`denied-${i}`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], x: Math.random() * 200 - 100, y: Math.random() * 200 - 100 }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[110] bg-rose-600 text-white px-4 py-1 rounded-md font-black text-xs whitespace-nowrap"
                    >
                      ACCESS DENIED
                    </motion.div>
                  ))}
                  <input 
                    autoFocus
                    type="number"
                    value={ageInput}
                    onChange={(e) => setAgeInput(e.target.value)}
                    placeholder="Enter your age..."
                    className="w-full px-6 py-4 bg-zinc-100 rounded-2xl font-black text-2xl text-center outline-none focus:ring-4 focus:ring-vibrant-pink/20 transition-all text-vibrant-plum"
                  />
                  
                  {irritationLevel > 0 && (
                    <motion.p 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={irritationLevel}
                      className="text-rose-500 font-black text-sm uppercase tracking-wider"
                    >
                      {ageInput === "19" && timeLeft.total > 0 
                        ? "Patience is a virtue! Wait for the day. ⏳" 
                        : irritationMessages[(irritationLevel - 1) % irritationMessages.length]}
                    </motion.p>
                  )}

                  <motion.button 
                    animate={irritationLevel > 4 ? {
                      x: [0, Math.random() * 50 - 25, Math.random() * -50 + 25, 0],
                      y: [0, Math.random() * 30 - 15, Math.random() * -30 + 15, 0]
                    } : {}}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    whileHover={irritationLevel > 2 ? { x: Math.random() * 100 - 50, y: Math.random() * 100 - 50 } : { scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full py-4 bg-vibrant-pink text-white font-black rounded-2xl uppercase tracking-widest shadow-[0_6px_0_#d93466] relative overflow-hidden"
                  >
                    <span className="relative z-10">Verify Me</span>
                    {irritationLevel > 5 && (
                      <motion.div 
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="absolute inset-0 bg-white/30 skew-x-12"
                      />
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}

        {isSpecialDayView ? (
          <motion.div
            key="special-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#1a1a1a] flex flex-col items-center justify-center p-6 overflow-hidden"
          >
            {/* Top Controls */}
            <div className="absolute top-8 right-8 z-[210] flex gap-4">
              <button 
                onClick={() => setIsSpecialDayView(false)}
                className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-md transition-all shadow-xl"
              >
                <Stars className="w-6 h-6" />
              </button>
            </div>

            {/* Video Theater */}
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-[40px] shadow-2xl overflow-hidden border-8 border-white/10 flex items-center justify-center">
               <iframe 
                 src="https://drive.google.com/file/d/1OKWgoY0ihoobacLEB_75GvRxj9QfnN46/preview" 
                 className="w-full h-full border-none"
                 allow="autoplay; fullscreen"
                 title="Birthday Surprise Video"
               />
            </div>

            {/* Hover Text */}
            <div className="mt-12 text-center">
              <motion.h3 
                whileHover={{ scale: 1.1, color: "#ff477e" }}
                className="text-5xl md:text-7xl font-dancing text-white/90 cursor-default transition-colors tracking-normal drop-shadow-lg"
              >
                Happy Birthday Siriga....
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-4 text-white/30 text-xs font-black uppercase tracking-[0.3em]"
              >
                A memory to cherish forever
              </motion.p>
            </div>

            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none -z-10 bg-gradient-to-tr from-[#1a1a1a] via-[#2c1a3a] to-[#1a1a1a]" />
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
            
            {/* Secret Bypass Point */}
            <motion.button
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={performReveal}
              className="absolute bottom-6 right-6 p-2 text-vibrant-plum/10 hover:text-vibrant-pink/30 transition-colors cursor-pointer z-20"
              title="Secret Bypass"
            >
              <Gift className="w-5 h-5" />
            </motion.button>
            
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

            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mb-10">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Mins", value: timeLeft.minutes },
                { label: "Secs", value: timeLeft.seconds },
              ].map((item, i) => (
                <div key={item.label} className="w-[70px] sm:w-[85px] h-[85px] sm:h-[100px] bg-vibrant-pink text-white rounded-[15px] sm:rounded-[20px] flex flex-col items-center justify-center shadow-[0_6px_0_#d93466] sm:shadow-[0_8px_0_#d93466]">
                  <motion.span 
                    key={item.value}
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-2xl sm:text-3xl font-black tabular-nums"
                  >
                    {String(item.value).padStart(2, "0")}
                  </motion.span>
                  <span className="text-[8px] sm:text-[10px] uppercase tracking-widest font-bold opacity-90">
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
                <motion.button 
                  whileHover={{ scale: 1.1, color: "#ff477e" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleManualReveal}
                  className="text-xs uppercase tracking-[0.2em] text-vibrant-plum/40 hover:text-vibrant-pink transition-colors underline font-medium"
                >
                  Unlock Secret Gift
                </motion.button>
              </div>
            </div>
          </motion.section>
        ) : (
          <motion.div
            key="reveal-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white overflow-y-auto selection:bg-vibrant-pink selection:text-white"
          >
            {/* Immersive Hero Header */}
            <div className="relative h-[80vh] w-full flex flex-col items-center justify-center text-center px-6 overflow-hidden">
               <div className="absolute inset-0 -z-10">
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute inset-0 bg-[url('https://picsum.photos/seed/celebration/1920/1080')] bg-cover bg-center opacity-20 blur-sm"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/50 to-white" />
               </div>

               <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                className="mb-8 w-24 h-24 bg-vibrant-pink text-white rounded-[32px] flex items-center justify-center shadow-vibrant"
              >
                <Gift className="w-12 h-12" />
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="uppercase tracking-[0.5em] text-xs text-vibrant-pink font-black mb-6"
              >
                The Surprise has been Unlocked
              </motion.h2>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-7xl sm:text-8xl md:text-[10rem] lg:text-[12rem] font-[900] text-vibrant-pink leading-none tracking-[-0.05em]"
              >
                HBD!
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 animate-bounce cursor-pointer"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
              >
                <div className="w-8 h-12 border-4 border-vibrant-pink/30 rounded-full flex justify-center p-2">
                  <motion.div 
                    animate={{ y: [0, 15, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-1 h-2 bg-vibrant-pink rounded-full"
                  />
                </div>
              </motion.div>
            </div>

            {/* Content Section */}
            <div className="max-w-5xl mx-auto px-6 py-32 space-y-48">
              
              {/* Personal Letter Block */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative p-12 md:p-24 bg-rose-50 rounded-[60px] border-4 border-white shadow-vibrant text-center overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-12 text-rose-200">
                  <Heart className="w-64 h-64 fill-current rotate-12" />
                </div>
                <div className="relative z-10 space-y-8">
                  <div className="inline-flex items-center gap-4 text-vibrant-pink font-black uppercase tracking-widest text-sm">
                    <div className="h-px w-8 bg-current" />
                    For the Birthday Girl
                    <div className="h-px w-8 bg-current" />
                  </div>
                  <p className="text-3xl md:text-5xl font-black text-vibrant-plum leading-[1.1] tracking-tight italic">
                    "You bring so much light and joy into existence. On this special day, I wanted to create a vibrant celebration just for you."
                  </p>
                  <p className="text-xl md:text-2xl text-vibrant-plum/60 font-medium max-w-2xl mx-auto leading-relaxed">
                    Today, the world celebrates the magic that is YOU. May your year be as beautiful as your smile and as bright as your soul.
                  </p>
                </div>
              </motion.div>

              {/* Special Memory Section */}
              <div className="w-full space-y-8">
                <div className="text-center">
                  <h3 className="text-3xl md:text-4xl font-black text-vibrant-plum uppercase tracking-widest">A Special Memory</h3>
                  <div className="mt-2 h-1 w-24 bg-vibrant-pink mx-auto rounded-full" />
                </div>
                <div className="relative w-full aspect-video bg-black rounded-[40px] shadow-2xl overflow-hidden border-8 border-rose-100 flex items-center justify-center">
                  <iframe 
                    src="https://drive.google.com/file/d/1wBuBKBciwrk4gjrN33nRTthX4TLoxs78/preview" 
                    className="w-full h-full border-none"
                    allow="autoplay; fullscreen"
                    title="Special Memory"
                  />
                </div>
              </div>

              {/* Final Call to Action */}
              <div className="text-center space-y-12">
                <div className="text-[140px] leading-none mb-8 select-none">🎂</div>
                <h3 className="text-5xl md:text-7xl font-black text-vibrant-plum tracking-tight leading-none">The celebration <br/>doesn't end here.</h3>
                
                <div className="flex flex-col md:flex-row gap-6 justify-center pt-8">
                  <button 
                    onClick={() => { setIsTimelineView(true); window.scrollTo(0, 0); }}
                    className="px-12 py-6 border-4 border-vibrant-pink text-vibrant-pink font-black rounded-full uppercase text-lg tracking-widest hover:bg-vibrant-pink hover:text-white transition-all shadow-vibrant"
                  >
                    View My 18 Years Road Map
                  </button>
                  <button 
                    onClick={() => { setIsRevealed(false); window.scrollTo(0, 0); }}
                    className="px-12 py-6 bg-vibrant-plum text-white font-black rounded-full uppercase text-lg tracking-widest shadow-[0_10px_0_#4a1535] hover:scale-105 active:scale-95 transition-all"
                  >
                    Back to Countdown
                  </button>
                  <button 
                    onClick={() => setIsSpecialDayView(true)}
                    className="px-12 py-6 bg-vibrant-pink text-white font-black rounded-full uppercase text-lg tracking-widest shadow-[0_10px_0_#d93466] hover:scale-105 active:scale-95 transition-all"
                  >
                    Enter Special Day
                  </button>
                </div>
              </div>

            </div>

            {/* Timeline View Overlay */}
            <AnimatePresence>
              {isTimelineView && (
                <motion.div
                  initial={{ opacity: 0, x: "100%" }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 120 }}
                  className="fixed inset-0 z-[60] bg-white overflow-y-auto"
                >
                  <div className="sticky top-0 z-50 w-full p-6 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-rose-100">
                    <button 
                      onClick={() => setIsTimelineView(false)}
                      className="px-8 py-3 bg-vibrant-plum text-white font-black rounded-full uppercase text-xs tracking-widest shadow-[0_5px_0_#4a1535]"
                    >
                      Close Map
                    </button>
                    <h2 className="text-vibrant-pink font-black uppercase tracking-widest text-sm">Life Journey: 18 Years</h2>
                  </div>

                  <div className="max-w-4xl mx-auto py-24 px-6">
                    <div className="relative border-l-4 border-rose-200 ml-4 py-8 space-y-24">
                      {timelineData.map((item, idx) => (
                        <motion.div 
                          key={item.year}
                          initial={{ opacity: 0, x: 50 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-100px" }}
                          className="relative pl-12 group"
                        >
                          {/* Timeline Dot */}
                          <div className="absolute -left-[14px] top-6 w-6 h-6 bg-white border-4 border-vibrant-pink rounded-full group-hover:scale-150 transition-transform" />
                          
                          <div className="flex flex-col lg:flex-row gap-8 items-start">
                            <div className="w-full lg:w-1/2 space-y-4">
                              <span className="text-vibrant-pink font-black text-4xl sm:text-6xl opacity-20">Year {item.year}</span>
                              <h3 className="text-2xl sm:text-3xl font-black text-vibrant-plum leading-none">{item.title}</h3>
                              <p className="text-base sm:text-lg text-vibrant-plum/70 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                            <div className="w-full lg:w-1/2">
                              <div className="aspect-[4/3] w-full overflow-hidden rounded-[20px] sm:rounded-[30px] shadow-vibrant border-4 border-white rotate-1 group-hover:rotate-0 transition-transform duration-500">
                                <img 
                                  src={item.img} 
                                  alt={`Year ${item.year}`} 
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-32 text-center">
                      <div className="inline-block p-12 bg-vibrant-pink text-white rounded-[50px] shadow-glow transform -rotate-1">
                        <h3 className="text-4xl font-black mb-4">And your journey has only just begun...</h3>
                        <p className="text-xl font-medium opacity-90">Happy 18th Birthday!</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Animated Decoration */}
            <div className="fixed inset-0 pointer-events-none -z-10">
               <motion.div 
                 animate={{ 
                   y: [0, -100, 0],
                   rotate: [0, 360],
                 }}
                 transition={{ duration: 30, repeat: Infinity }}
                 className="absolute -top-20 -right-20 w-96 h-96 bg-vibrant-pink/5 blur-3xl rounded-full"
               />
               <motion.div 
                 animate={{ 
                   y: [0, 100, 0],
                   rotate: [360, 0],
                 }}
                 transition={{ duration: 25, repeat: Infinity }}
                 className="absolute -bottom-20 -left-20 w-96 h-96 bg-vibrant-gold/5 blur-3xl rounded-full"
               />
            </div>
          </motion.div>
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
