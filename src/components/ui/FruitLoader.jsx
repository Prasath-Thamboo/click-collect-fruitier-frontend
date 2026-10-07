import Fruit from '../fruits/Fruit';

// Chargement : trois fruits en orbite autour d'un noyau lumineux
export default function FruitLoader({ label = 'Chargement…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-24">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div className="absolute inset-3 rounded-full border border-dashed border-white/10 animate-spin-slow" />
        <div className="absolute left-1/2 top-1/2 -ml-2 -mt-2 w-4 h-4 rounded-full bg-white shadow-[0_0_30px_8px_rgba(255,61,127,.6)]" />
        {['orange', 'kiwi', 'strawberry'].map((kind, i) => (
          <div
            key={kind}
            className="absolute left-1/2 top-1/2 -ml-3.5 -mt-3.5 animate-orbit"
            style={{ '--orbit-r': '44px', animationDuration: '2.4s', animationDelay: `${-i * 0.8}s` }}
          >
            <Fruit kind={kind} className="w-7 h-7" glow />
          </div>
        ))}
      </div>
      <p className="hud text-gray-400">{label}</p>
    </div>
  );
}
