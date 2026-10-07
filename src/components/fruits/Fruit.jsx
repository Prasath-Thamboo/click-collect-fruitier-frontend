import { useId } from 'react';
import { FRUIT_PALETTES } from './fruitTheme';

/*
 * Illustrations de fruits en SVG, dessinées à la main pour le thème « Néon Verger ».
 * Chaque fruit a ses dégradés, reflets et détails (quartiers, pépins, akènes…).
 * Usage : <Fruit kind="kiwi" className="w-24 h-24" />
 */

function useSvgId() {
  return useId().replace(/[^a-zA-Z0-9_-]/g, '');
}

function Citrus({ id, colors }) {
  const { rind, pith, flesh, fleshDeep } = colors;
  const segments = 10;
  return (
    <>
      <defs>
        <radialGradient id={`${id}-flesh`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor={flesh} />
          <stop offset="100%" stopColor={fleshDeep} />
        </radialGradient>
        <linearGradient id={`${id}-rind`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={rind[0]} />
          <stop offset="100%" stopColor={rind[1]} />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill={`url(#${id}-rind)`} />
      <circle cx="50" cy="50" r="41" fill={pith} />
      {Array.from({ length: segments }, (_, i) => {
        const a0 = (i / segments) * Math.PI * 2 + 0.05;
        const a1 = ((i + 1) / segments) * Math.PI * 2 - 0.05;
        const r = 37;
        const x0 = 50 + Math.cos(a0) * r;
        const y0 = 50 + Math.sin(a0) * r;
        const x1 = 50 + Math.cos(a1) * r;
        const y1 = 50 + Math.sin(a1) * r;
        const ix = 50 + Math.cos((a0 + a1) / 2) * 4;
        const iy = 50 + Math.sin((a0 + a1) / 2) * 4;
        return (
          <g key={i}>
            <path
              d={`M${ix},${iy} L${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1} Z`}
              fill={`url(#${id}-flesh)`}
              stroke={pith}
              strokeWidth="0.6"
              strokeLinejoin="round"
            />
            {/* vésicules de jus */}
            {[0.45, 0.68, 0.86].map((t) => {
              const am = (a0 + a1) / 2;
              return (
                <ellipse
                  key={t}
                  cx={50 + Math.cos(am) * r * t}
                  cy={50 + Math.sin(am) * r * t}
                  rx="1.1"
                  ry="2.6"
                  transform={`rotate(${(am * 180) / Math.PI + 90} ${50 + Math.cos(am) * r * t} ${50 + Math.sin(am) * r * t})`}
                  fill="#fff"
                  opacity="0.35"
                />
              );
            })}
          </g>
        );
      })}
      <circle cx="50" cy="50" r="3.2" fill={pith} />
      <path d="M22,30 A34,34 0 0 1 46,15" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.55" />
    </>
  );
}

function Kiwi({ id }) {
  return (
    <>
      <defs>
        <radialGradient id={`${id}-flesh`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f4ffd6" />
          <stop offset="28%" stopColor="#c9f56a" />
          <stop offset="70%" stopColor="#6fd43a" />
          <stop offset="100%" stopColor="#3f9e24" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="#7a5a2e" />
      <circle cx="50" cy="50" r="43" fill="#a07a3c" />
      <circle cx="50" cy="50" r="41" fill={`url(#${id}-flesh)`} />
      {/* rayons de fibres */}
      {Array.from({ length: 36 }, (_, i) => {
        const a = (i / 36) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={50 + Math.cos(a) * 14}
            y1={50 + Math.sin(a) * 11}
            x2={50 + Math.cos(a) * 38}
            y2={50 + Math.sin(a) * 38}
            stroke="#e9ffb8"
            strokeWidth="0.5"
            opacity="0.45"
          />
        );
      })}
      {/* pépins */}
      {Array.from({ length: 30 }, (_, i) => {
        const a = (i / 30) * Math.PI * 2;
        const r = i % 2 ? 18 : 21.5;
        const x = 50 + Math.cos(a) * r;
        const y = 50 + Math.sin(a) * r * 0.86;
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx="1.1"
            ry="2.3"
            transform={`rotate(${(a * 180) / Math.PI + 90} ${x} ${y})`}
            fill="#1b1206"
          />
        );
      })}
      <ellipse cx="50" cy="50" rx="11" ry="8.5" fill="#fbffe9" />
      <ellipse cx="47" cy="47.5" rx="4" ry="2.5" fill="#fff" opacity="0.8" />
      <path d="M20,32 A34,34 0 0 1 42,16" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.5" />
    </>
  );
}

function Strawberry({ id }) {
  const seeds = [];
  for (let row = 0; row < 6; row++) {
    const y = 40 + row * 8;
    const width = 30 - row * 4.2;
    const count = 5 - Math.floor(row / 2);
    for (let c = 0; c < count; c++) {
      const x = 50 - width + ((c + (row % 2 ? 0.5 : 0)) / (count - 0.5 || 1)) * width * 2;
      seeds.push({ x, y: y + (c % 2) * 1.5 });
    }
  }
  return (
    <>
      <defs>
        <radialGradient id={`${id}-body`} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ff8aa8" />
          <stop offset="45%" stopColor="#ff2d5f" />
          <stop offset="100%" stopColor="#9e0028" />
        </radialGradient>
        <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9cf56a" />
          <stop offset="100%" stopColor="#2e9e2a" />
        </linearGradient>
      </defs>
      <path
        d="M50,94 C30,86 13,62 15,42 C17,27 32,24 50,28 C68,24 83,27 85,42 C87,62 70,86 50,94 Z"
        fill={`url(#${id}-body)`}
      />
      {seeds.map((s, i) => (
        <g key={i}>
          <ellipse cx={s.x} cy={s.y + 0.6} rx="1.6" ry="2.2" fill="#7a0020" opacity="0.6" />
          <ellipse cx={s.x} cy={s.y} rx="1.1" ry="1.8" fill="#ffe14d" />
        </g>
      ))}
      <path
        d="M50,30 L36,18 L44,27 L28,24 L42,32 L34,38 L50,33 L66,38 L58,32 L72,24 L56,27 L64,18 Z"
        fill={`url(#${id}-leaf)`}
        stroke="#1f7a1f"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <path d="M50,30 C50,22 52,14 56,8" stroke="#3a8f2a" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M26,46 C26,40 30,36 36,35" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" fill="none" opacity="0.55" />
    </>
  );
}

function Watermelon({ id }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-flesh`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff8a9c" />
          <stop offset="100%" stopColor="#ff2d55" />
        </linearGradient>
      </defs>
      <g transform="rotate(-12 50 50)">
        <path d="M6,40 A44,44 0 0 0 94,40 Z" fill="#1f8f3a" />
        {[18, 32, 46, 60, 74].map((x) => (
          <path key={x} d={`M${x},${48 + Math.abs(50 - x) * -0.2} q4,10 2,22`} stroke="#0f5f24" strokeWidth="3" fill="none" opacity="0.7" />
        ))}
        <path d="M10,40 A40,40 0 0 0 90,40 Z" fill="#d9ffd6" />
        <path d="M14,40 A36,36 0 0 0 86,40 Z" fill={`url(#${id}-flesh)`} />
        {[
          [30, 50], [42, 55], [56, 55], [68, 50], [36, 63], [50, 66], [62, 62], [50, 47],
        ].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="1.6" ry="2.8" fill="#1a0a10" transform={`rotate(${(x - 50) * 1.2} ${x} ${y})`} />
        ))}
        <path d="M20,44 Q30,46 40,44" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
      </g>
    </>
  );
}

function Cherry({ id }) {
  return (
    <>
      <defs>
        <radialGradient id={`${id}-c`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ff8a9e" />
          <stop offset="40%" stopColor="#f0103c" />
          <stop offset="100%" stopColor="#6a0012" />
        </radialGradient>
        <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b4ff7a" />
          <stop offset="100%" stopColor="#2e9e2a" />
        </linearGradient>
      </defs>
      <path d="M33,62 C38,40 48,22 60,10" stroke="#5a8f2a" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M68,58 C66,40 63,24 60,10" stroke="#5a8f2a" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M60,10 C72,4 86,8 90,18 C78,22 66,20 60,10 Z" fill={`url(#${id}-leaf)`} />
      <path d="M62,11 C72,12 80,14 88,17" stroke="#1f6f1f" strokeWidth="0.8" fill="none" />
      <circle cx="31" cy="72" r="19" fill={`url(#${id}-c)`} />
      <circle cx="69" cy="68" r="19" fill={`url(#${id}-c)`} />
      <ellipse cx="24" cy="64" rx="5" ry="3.5" fill="#fff" opacity="0.6" transform="rotate(-30 24 64)" />
      <ellipse cx="62" cy="60" rx="5" ry="3.5" fill="#fff" opacity="0.6" transform="rotate(-30 62 60)" />
    </>
  );
}

function Berry({ id, cx, cy, r, palette }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-${palette})`} />
      <circle cx={cx - r * 0.35} cy={cy - r * 0.35} r={r * 0.22} fill="#fff" opacity="0.45" />
    </g>
  );
}

function Blueberry({ id }) {
  return (
    <>
      <defs>
        <radialGradient id={`${id}-b`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#b3b0ff" />
          <stop offset="45%" stopColor="#5a52e8" />
          <stop offset="100%" stopColor="#1c1470" />
        </radialGradient>
      </defs>
      <Berry id={id} cx={34} cy={60} r={22} palette="b" />
      <Berry id={id} cx={66} cy={56} r={24} palette="b" />
      <Berry id={id} cx={52} cy={30} r={18} palette="b" />
      {[[34, 42], [66, 36], [52, 15]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          {Array.from({ length: 5 }, (_, k) => (
            <path key={k} d="M0,0 L-1.6,-4 L1.6,-4 Z" fill="#2a1f6b" transform={`rotate(${k * 72})`} />
          ))}
          <circle r="1.6" fill="#140f40" />
        </g>
      ))}
    </>
  );
}

function Grape({ id }) {
  const grapes = [
    [38, 34], [54, 32], [70, 36], [30, 50], [46, 50], [62, 50], [76, 52],
    [38, 66], [54, 66], [68, 68], [46, 81], [60, 82], [53, 94],
  ];
  return (
    <>
      <defs>
        <radialGradient id={`${id}-g`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#e8c4ff" />
          <stop offset="45%" stopColor="#a24cf0" />
          <stop offset="100%" stopColor="#4a1290" />
        </radialGradient>
        <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b4ff7a" />
          <stop offset="100%" stopColor="#2e9e2a" />
        </linearGradient>
      </defs>
      <path d="M54,24 C54,14 58,8 64,4" stroke="#6a4a1f" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M56,16 C64,8 80,8 86,16 C78,24 64,24 56,16 Z" fill={`url(#${id}-leaf)`} />
      {grapes.map(([x, y], i) => (
        <Berry key={i} id={id} cx={x} cy={y * 0.9 + 4} r={9.5} palette="g" />
      ))}
    </>
  );
}

function Dragon({ id }) {
  const seeds = [];
  for (let i = 0; i < 46; i++) {
    const a = i * 2.39996;
    const r = Math.sqrt(i / 46) * 30;
    seeds.push([50 + Math.cos(a) * r, 52 + Math.sin(a) * r * 1.1]);
  }
  return (
    <>
      <defs>
        <radialGradient id={`${id}-skin`} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ff9ae9" />
          <stop offset="100%" stopColor="#c0128f" />
        </radialGradient>
        <radialGradient id={`${id}-flesh`} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f3e8ff" />
        </radialGradient>
      </defs>
      {/* écailles */}
      {[[14, 30, -40], [86, 30, 40], [10, 62, -70], [90, 62, 70], [30, 92, -150], [70, 92, 150]].map(([x, y, r], i) => (
        <path key={i} d="M0,0 C-6,-6 -4,-16 4,-20 C4,-12 6,-6 0,0 Z" fill="#7cf06a" transform={`translate(${x} ${y}) rotate(${r})`} />
      ))}
      <ellipse cx="50" cy="52" rx="40" ry="44" fill={`url(#${id}-skin)`} />
      <ellipse cx="50" cy="52" rx="35" ry="39" fill={`url(#${id}-flesh)`} />
      {seeds.map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="1.1" ry="1.6" fill="#1a1020" />
      ))}
      <path d="M24,34 C28,24 36,18 44,16" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.6" />
    </>
  );
}

const CITRUS = {
  orange: { rind: ['#ffb547', '#ff6a1f'], pith: '#fff1d6', flesh: '#ffc061', fleshDeep: '#ff8a1f' },
  lemon: { rind: ['#fff27a', '#ffc61a'], pith: '#fffbe0', flesh: '#fff59a', fleshDeep: '#ffd43a' },
  lime: { rind: ['#8fe84a', '#2f9e2a'], pith: '#f2ffe0', flesh: '#d6ff8a', fleshDeep: '#86e04a' },
  grapefruit: { rind: ['#ffb08a', '#ff5c3d'], pith: '#fff0ea', flesh: '#ff9aa0', fleshDeep: '#ff4d6a' },
};

export default function Fruit({ kind = 'orange', className = '', glow = false, style, title }) {
  const id = useSvgId();
  const palette = FRUIT_PALETTES[kind] ?? FRUIT_PALETTES.orange;

  let body;
  if (CITRUS[kind]) body = <Citrus id={id} colors={CITRUS[kind]} />;
  else if (kind === 'kiwi') body = <Kiwi id={id} />;
  else if (kind === 'strawberry') body = <Strawberry id={id} />;
  else if (kind === 'watermelon') body = <Watermelon id={id} />;
  else if (kind === 'cherry') body = <Cherry id={id} />;
  else if (kind === 'blueberry') body = <Blueberry id={id} />;
  else if (kind === 'grape') body = <Grape id={id} />;
  else if (kind === 'dragon') body = <Dragon id={id} />;
  else body = <Citrus id={id} colors={CITRUS.orange} />;

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={{
        filter: glow ? `drop-shadow(0 0 18px ${palette.glow}aa) drop-shadow(0 10px 22px rgba(0,0,0,.45))` : undefined,
        ...style,
      }}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {body}
    </svg>
  );
}
