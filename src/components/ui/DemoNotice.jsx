import Fruit from '../fruits/Fruit';

// Message « fonctionnalité pas encore disponible » affiché en mode démonstration
export default function DemoNotice({ title, children, fruit = 'lemon', className = '' }) {
  return (
    <div
      role="status"
      className={`relative overflow-hidden rounded-2xl border border-citrus/30 bg-citrus/[0.07] p-4 animate-rise ${className}`}
    >
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-citrus/20 blur-2xl" />
      <div className="relative flex gap-3">
        <Fruit kind={fruit} glow className="w-10 h-10 shrink-0" />
        <div className="min-w-0">
          <p className="hud text-citrus mb-1">Version de démonstration</p>
          {title && <p className="font-semibold text-white text-sm mb-1">{title}</p>}
          <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
