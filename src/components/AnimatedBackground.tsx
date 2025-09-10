import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  r: number;
}

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  useEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const w = parent.clientWidth;
      const h = parent.clientHeight;

      // Set internal pixel buffer size for crisp rendering
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);

      // Match CSS size to parent
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initParticles = () => {
      particles.current = [];
      const parent = canvas.parentElement;
      const w = parent?.clientWidth ?? 0;
      const h = parent?.clientHeight ?? 0;

      // Slightly more particles, but still light; scale by area
      const count = Math.max(30, Math.floor((w * h) / 18000));

      for (let i = 0; i < count; i++) {
        particles.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35, // a touch more lively
          vy: (Math.random() - 0.5) * 0.35,
          opacity: Math.random() * 0.35 + 0.25, // 0.25–0.60
          r: Math.random() * 2 + 1.8, // 1.8–3.8 px (visible but subtle)
        });
      }
    };

    const animate = () => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth ?? canvas.width / dpr;
      const h = parent?.clientHeight ?? canvas.height / dpr;

      ctx.clearRect(0, 0, w, h);

      // Soft "light" compositing to pop over gradients
      ctx.globalCompositeOperation = "lighter";

      for (const p of particles.current) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Draw particle with a tiny glow
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
        grd.addColorStop(0, `rgba(59,130,246,${0.55 * p.opacity})`); // blue-500
        grd.addColorStop(1, `rgba(59,130,246,0)`);

        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-50 md:opacity-60"
      style={{ mixBlendMode: "screen" }} // helps dots glow over darker areas
    />
  );
};

export default AnimatedBackground;