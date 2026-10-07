import Fruit from './fruits/Fruit';

// Fruits qui flottent en périphérie de l'écran (positions en %, tailles en px)
const FLOATERS = [
  { kind: 'orange', top: '12%', left: '-3%', size: 150, delay: '0s', blur: 0, opacity: 0.85 },
  { kind: 'kiwi', top: '58%', left: '2%', size: 110, delay: '-3s', blur: 1, opacity: 0.7 },
  { kind: 'strawberry', top: '8%', left: '86%', size: 120, delay: '-6s', blur: 0, opacity: 0.85 },
  { kind: 'blueberry', top: '70%', left: '88%', size: 96, delay: '-2s', blur: 0, opacity: 0.8 },
  { kind: 'lemon', top: '38%', left: '93%', size: 70, delay: '-8s', blur: 3, opacity: 0.45 },
  { kind: 'cherry', top: '86%', left: '40%', size: 64, delay: '-5s', blur: 4, opacity: 0.35 },
  { kind: 'dragon', top: '32%', left: '-1%', size: 58, delay: '-9s', blur: 4, opacity: 0.35 },
  { kind: 'watermelon', top: '2%', left: '48%', size: 54, delay: '-4s', blur: 5, opacity: 0.3 },
];

// Particules « pépins de lumière » — générées une fois, positions déterministes
const PARTICLES = Array.from({ length: 46 }, (_, i) => {
  const colors = ['#ff3d7f', '#ffab2e', '#ffe14d', '#7cf06a', '#2ff5b4', '#6f6bff', '#b45cff'];
  return {
    left: `${(i * 37.7) % 100}%`,
    top: `${(i * 61.3) % 100}%`,
    size: 1 + ((i * 7) % 3),
    color: colors[i % colors.length],
    delay: `${-(i % 9)}s`,
  };
});

export default function FuturisticBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      {/* Aurores fruitées */}
      <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-strawberry/30 blur-[120px] animate-aurora" />
      <div className="absolute top-[10%] right-[-15%] w-[55vw] h-[55vw] rounded-full bg-blueberry/30 blur-[130px] animate-aurora [animation-delay:-7s]" />
      <div className="absolute bottom-[-25%] left-[20%] w-[60vw] h-[50vw] rounded-full bg-mint/20 blur-[140px] animate-aurora [animation-delay:-12s]" />
      <div className="absolute top-[40%] left-[35%] w-[30vw] h-[30vw] rounded-full bg-mango/20 blur-[120px] animate-aurora [animation-delay:-4s]" />

      {/* Sol en grille, en perspective */}
      <div
        className="absolute inset-x-[-50%] bottom-[-10%] h-[60%] grid-floor opacity-60"
        style={{
          transform: 'perspective(600px) rotateX(62deg)',
          transformOrigin: 'bottom',
          maskImage: 'linear-gradient(to top, black 10%, transparent 85%)',
          WebkitMaskImage: 'linear-gradient(to top, black 10%, transparent 85%)',
        }}
      />

      {/* Particules lumineuses */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full animate-float-slow"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 5}px ${p.color}`,
            animationDelay: p.delay,
            opacity: 0.7,
          }}
        />
      ))}

      {/* Fruits en apesanteur */}
      {FLOATERS.map((f, i) => (
        <div
          key={i}
          className="absolute hidden sm:block animate-float"
          style={{ top: f.top, left: f.left, animationDelay: f.delay, opacity: f.opacity, filter: `blur(${f.blur}px)` }}
        >
          <Fruit kind={f.kind} glow style={{ width: f.size, height: f.size }} />
        </div>
      ))}

      {/* Ligne de scan + grain */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-transparent via-white/[0.025] to-transparent animate-scan" />
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(7,6,26,0.85)_100%)]" />
    </div>
  );
}
