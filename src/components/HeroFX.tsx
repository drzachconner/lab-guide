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

      {/* Three large animated blobs (transform-based => always visible movement) */}
      <motion.div
        initial={{ x: "-10vw", y: "-8vh", scale: 1, opacity: 0.6 }}
        animate={{ x: ["-10vw", "8vw", "0vw"], y: ["-8vh", "4vh", "0vh"], scale: [1, 1.07, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "44rem",
          height: "44rem",
          borderRadius: "9999px",
          background:
            "radial-gradient(circle at 30% 30%, rgba(59,130,246,0.6), rgba(59,130,246,0.2) 60%, transparent 70%)",
          filter: "blur(30px)",
          willChange: "transform, opacity",
        }}
      />
      <motion.div
        initial={{ x: "6vw", y: "8vh", scale: 1, opacity: 0.55 }}
        animate={{ x: ["6vw", "-6vw", "0vw"], y: ["8vh", "-4vh", "0vh"], scale: [1, 1.05, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          right: 0,
          top: "10%",
          width: "40rem",
          height: "40rem",
          borderRadius: "9999px",
          background:
            "radial-gradient(circle at 70% 30%, rgba(147,197,253,0.55), rgba(147,197,253,0.2) 60%, transparent 70%)",
          filter: "blur(30px)",
          willChange: "transform, opacity",
        }}
      />
      <motion.div
        initial={{ x: "0vw", y: "10vh", scale: 1, opacity: 0.5 }}
        animate={{ x: ["0vw", "-8vw", "0vw"], y: ["10vh", "0vh", "10vh"], scale: [1, 1.06, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          left: "15%",
          bottom: "-15%",
          width: "46rem",
          height: "46rem",
          borderRadius: "9999px",
          background:
            "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.5), rgba(59,130,246,0.2) 60%, transparent 70%)",
          filter: "blur(30px)",
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