import { useEffect, useRef } from 'react';

const Confetti = ({ active = true, duration = 6000 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let isActive = true;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const colors = [
      '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b',
      '#ef4444', '#06b6d4', '#14b8a6', '#f97316'
    ];

    const particles = [];
    const count = 150;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -50 - 20,
        r: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.08 + 0.03,
        tiltAngle: Math.random() * Math.PI,
        speedX: Math.random() * 4 - 2,
        speedY: Math.random() * 4 + 3,
      });
    }

    const draw = () => {
      if (!isActive) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let ongoing = false;

      particles.forEach((p) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += p.speedY;
        p.x += p.speedX;
        p.tilt = Math.sin(p.tiltAngle) * 12;

        // Keep drifting sideways slightly
        p.speedX += Math.sin(p.tiltAngle) * 0.05;

        if (p.y < canvas.height + 20) {
          ongoing = true;
        }

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });

      if (ongoing) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    draw();

    const timer = setTimeout(() => {
      isActive = false;
      cancelAnimationFrame(animationFrameId);
    }, duration);

    return () => {
      isActive = false;
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timer);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [active, duration]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 99999,
      }}
    />
  );
};

export default Confetti;
