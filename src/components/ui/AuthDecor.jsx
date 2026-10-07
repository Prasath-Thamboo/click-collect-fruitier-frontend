import Fruit from '../fruits/Fruit';

// Décor des pages d'authentification : halo + fruits en lévitation autour de la carte
export default function AuthDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] max-w-[140vw] rounded-full border border-white/5" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] max-w-[120vw] rounded-full border border-dashed border-white/10 animate-spin-slow" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-[conic-gradient(from_90deg,rgba(255,61,127,.35),rgba(255,171,46,.25),rgba(124,240,106,.25),rgba(111,107,255,.35),rgba(255,61,127,.35))] blur-3xl opacity-60 animate-spin-slow" />

      <div className="absolute left-1/2 top-1/2 -translate-x-[260px] -translate-y-[200px] animate-float hidden sm:block">
        <Fruit kind="strawberry" glow className="w-20 h-20" />
      </div>
      <div className="absolute left-1/2 top-1/2 translate-x-[200px] -translate-y-[230px] animate-float [animation-delay:-3s] hidden sm:block">
        <Fruit kind="lime" glow className="w-16 h-16" />
      </div>
      <div className="absolute left-1/2 top-1/2 translate-x-[210px] translate-y-[140px] animate-float [animation-delay:-6s] hidden sm:block">
        <Fruit kind="blueberry" glow className="w-20 h-20" />
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-[290px] translate-y-[120px] animate-float [animation-delay:-8s] hidden sm:block">
        <Fruit kind="dragon" glow className="w-16 h-16" />
      </div>
    </div>
  );
}
