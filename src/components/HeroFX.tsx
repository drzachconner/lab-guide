// HeroFX.tsx
import { motion } from "framer-motion";

export default function HeroFX() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Soft mesh base (static) */}
      <div
        aria-hidden
        className="absolute -inset-[20%] opacity-80"
        style={{
          background:
            "radial-gradient(40% 35% at 20% 30%, rgba(59,130,246,0.22), transparent 60%), radial-gradient(40% 35% at 80% 20%, rgba(147,197,253,0.22), transparent 60%), radial-gradient(50% 45% at 50% 90%, rgba(59,130,246,0.18), transparent 60%)",
          filter: "blur(40px)",
        }}
      />

      {/* Three animated blobs (smaller, less blur, continuous loop) */}
      <motion.div
        initial={{ x: "-10vw", y: "-8vh", scale: 1, opacity: 0.4 }}
        animate={{ x: ["-10vw", "6vw", "-2vw", "-10vw"], y: ["-8vh", "2vh", "-4vh", "-8vh"], scale: [1, 1.05, 1.02, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "32rem",
          height: "32rem",
          borderRadius: "9999px",
          background:
            "radial-gradient(circle at 30% 30%, rgba(59,130,246,0.4), rgba(59,130,246,0.15) 60%, transparent 70%)",
          filter: "blur(20px)",
          willChange: "transform, opacity",
        }}
      />
      <motion.div
        initial={{ x: "6vw", y: "8vh", scale: 1, opacity: 0.35 }}
        animate={{ x: ["6vw", "-4vw", "2vw", "6vw"], y: ["8vh", "-2vh", "4vh", "8vh"], scale: [1, 1.03, 1.01, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          right: 0,
          top: "10%",
          width: "28rem",
          height: "28rem",
          borderRadius: "9999px",
          background:
            "radial-gradient(circle at 70% 30%, rgba(147,197,253,0.35), rgba(147,197,253,0.15) 60%, transparent 70%)",
          filter: "blur(20px)",
          willChange: "transform, opacity",
        }}
      />
      <motion.div
        initial={{ x: "0vw", y: "10vh", scale: 1, opacity: 0.3 }}
        animate={{ x: ["0vw", "-6vw", "3vw", "0vw"], y: ["10vh", "-2vh", "6vh", "10vh"], scale: [1, 1.04, 1.01, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          left: "15%",
          bottom: "-15%",
          width: "34rem",
          height: "34rem",
          borderRadius: "9999px",
          background:
            "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.3), rgba(59,130,246,0.12) 60%, transparent 70%)",
          filter: "blur(20px)",
          willChange: "transform, opacity",
        }}
      />

      {/* Optional tiny dots (CSS only) */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            radial-gradient(rgba(59,130,246,0.35) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          backgroundPosition: "0 0",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}