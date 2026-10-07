import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Fruit from '../components/fruits/Fruit';
import { fruitFor, paletteFor } from '../components/fruits/fruitTheme';
import FruitLoader from '../components/ui/FruitLoader';

const ORBITERS = [
  { kind: 'strawberry', r: 150, dur: '22s', delay: '0s', size: 'w-14 h-14' },
  { kind: 'kiwi', r: 150, dur: '22s', delay: '-7.3s', size: 'w-12 h-12' },
  { kind: 'blueberry', r: 150, dur: '22s', delay: '-14.6s', size: 'w-11 h-11' },
  { kind: 'cherry', r: 205, dur: '34s', delay: '-4s', size: 'w-11 h-11' },
  { kind: 'lemon', r: 205, dur: '34s', delay: '-15s', size: 'w-12 h-12' },
  { kind: 'grape', r: 205, dur: '34s', delay: '-26s', size: 'w-12 h-12' },
];

const MARQUEE = [
  ['orange', 'Agrumes pressés'],
  ['strawberry', 'Baies rouges'],
  ['kiwi', 'Kiwis'],
  ['watermelon', 'Pastèque'],
  ['blueberry', 'Myrtilles'],
  ['dragon', 'Fruits exotiques'],
  ['lime', 'Smoothies verts'],
  ['grape', 'Raisins'],
  ['cherry', 'Cerises'],
  ['lemon', 'Citronnades'],
];

const STEPS = [
  { kind: 'strawberry', n: '01', title: 'Choisissez', text: 'Parcourez les magasins et composez votre panier de fruits frais.' },
  { kind: 'kiwi', n: '02', title: 'Réservez', text: 'Sélectionnez votre créneau de retrait et payez en ligne en toute sécurité.' },
  { kind: 'orange', n: '03', title: 'Récupérez', text: 'Passez au magasin à l’heure choisie : votre commande vous attend.' },
];

function HeroOrb() {
  return (
    <div className="relative mx-auto w-[300px] h-[300px] sm:w-[440px] sm:h-[440px] scale-[0.72] sm:scale-100">
      {/* anneaux holographiques */}
      <div className="absolute inset-0 rounded-full border border-white/10" />
      <div className="absolute inset-[12%] rounded-full border border-dashed border-mango/30 animate-spin-slow" />
      <div className="absolute inset-[24%] rounded-full border border-blueberry/30 animate-spin-slow [animation-direction:reverse]" />
      <div className="absolute inset-[18%] rounded-full bg-[conic-gradient(from_0deg,rgba(255,61,127,.35),rgba(255,171,46,.25),rgba(124,240,106,.3),rgba(111,107,255,.35),rgba(255,61,127,.35))] blur-3xl opacity-70 animate-spin-slow" />

      {/* graduations type HUD */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-spin-slow [animation-duration:60s]">
        {Array.from({ length: 72 }, (_, i) => (
          <line
            key={i}
            x1="100"
            y1="2"
            x2="100"
            y2={i % 6 === 0 ? 9 : 5}
            stroke={i % 6 === 0 ? '#ffab2e' : '#ffffff'}
            strokeOpacity={i % 6 === 0 ? 0.8 : 0.25}
            strokeWidth="0.6"
            transform={`rotate(${i * 5} 100 100)`}
          />
        ))}
      </svg>

      {/* fruit central */}
      <div className="absolute inset-[28%] animate-float">
        <Fruit kind="orange" glow className="w-full h-full animate-spin-slow [animation-duration:80s]" />
      </div>

      {/* fruits en orbite */}
      {ORBITERS.map((o) => (
        <div
          key={o.kind}
          className="absolute left-1/2 top-1/2 animate-orbit"
          style={{ '--orbit-r': `${o.r}px`, animationDuration: o.dur, animationDelay: o.delay, marginLeft: -24, marginTop: -24 }}
        >
          <Fruit kind={o.kind} glow className={o.size} />
        </div>
      ))}

      {/* étiquettes flottantes */}
      <div className="absolute -left-4 top-[18%] chip hud text-gray-600 animate-float [animation-delay:-2s]">
        <span className="neon-dot" style={{ background: '#ffab2e', boxShadow: '0 0 10px #ffab2e' }} /> Agrumes
      </div>
      <div className="absolute -right-6 top-[46%] chip hud text-gray-600 animate-float [animation-delay:-5s]">
        <span className="neon-dot" style={{ background: '#ff3d7f', boxShadow: '0 0 10px #ff3d7f' }} /> Baies
      </div>
      <div className="absolute left-[8%] bottom-[6%] chip hud text-gray-600 animate-float [animation-delay:-8s]">
        <span className="neon-dot" /> Exotiques
      </div>
    </div>
  );
}

function StoreCard({ store, index }) {
  const kind = fruitFor(store.name, store.id);
  const palette = paletteFor(kind);
  return (
    <Link
      to={`/stores/${store.id}`}
      className="group holo glass rounded-[1.75rem] p-6 overflow-hidden transition-transform duration-500 hover:-translate-y-1.5 animate-rise"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* halo de couleur du fruit */}
      <div
        className="absolute -right-16 -top-16 w-56 h-56 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle, ${palette.glow}, transparent 70%)` }}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="hud text-gray-400 mb-3">
            Magasin <span style={{ color: palette.glow }}>#{String(index + 1).padStart(2, '0')}</span>
          </p>
          <h3 className="text-xl font-bold text-white truncate">{store.name}</h3>
          <p className="text-gray-500 text-sm mt-1.5 flex items-start gap-1.5">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-2">{store.address}</span>
          </p>
        </div>
        <Fruit
          kind={kind}
          glow
          className="w-20 h-20 shrink-0 transition-transform duration-700 group-hover:rotate-[24deg] group-hover:scale-110"
        />
      </div>

      <div className="relative mt-6 flex items-center justify-between">
        <span className="hud" style={{ color: palette.glow }}>
          {palette.label}
        </span>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
          Voir les produits
          <span className="grid place-items-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-white group-hover:text-ink transition-colors">
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </span>
      </div>
    </Link>
  );
}

export default function StoresPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/stores').then(({ data }) => setStores(data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-x-clip">
      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-10 grid lg:grid-cols-[1.1fr_1fr] gap-6 items-center">
        <div className="animate-rise">
          <span className="chip hud text-gray-600">
            <span className="neon-dot" /> Click &amp; Collect · nouvelle génération
          </span>
          <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.95] text-white">
            Le fruit frais,
            <br />
            <span className="text-fruit">version futur.</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-md leading-relaxed">
            Commandez en ligne, choisissez votre créneau, récupérez votre panier de fruits au magasin.
            Simple, rapide, éclatant de couleurs.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#magasins" className="btn-fruit px-7 py-4 rounded-2xl">
              Explorer les magasins
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
            <Link to="/subscriptions/new" className="btn-ghost px-7 py-4 rounded-2xl font-semibold">
              Abonnement <span className="text-kiwi">−15 %</span>
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-3 max-w-md">
            {[
              { k: loading ? '—' : String(stores.length).padStart(2, '0'), v: 'Magasins', c: '#ff3d7f' },
              { k: '−15 %', v: 'Abonnés', c: '#7cf06a' },
              { k: '24/7', v: 'Commande', c: '#6f6bff' },
            ].map((s) => (
              <div key={s.v} className="glass rounded-2xl px-4 py-3">
                <dt className="hud text-gray-400">{s.v}</dt>
                <dd className="font-display text-2xl font-bold mt-1" style={{ color: s.c, textShadow: `0 0 18px ${s.c}88` }}>
                  {s.k}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroOrb />
      </section>

      {/* ── Ruban défilant ── */}
      <div className="relative py-5 border-y border-white/10 bg-white/[0.02] -rotate-1 my-6">
        <div className="flex w-max animate-marquee">
          {[...MARQUEE, ...MARQUEE].map(([kind, label], i) => (
            <span key={i} className="flex items-center gap-3 px-6 font-display text-xl font-bold text-gray-700 whitespace-nowrap">
              <Fruit kind={kind} className="w-8 h-8" />
              {label}
              <span className="text-mango">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Magasins ── */}
      <section id="magasins" className="max-w-6xl mx-auto px-4 sm:px-6 py-14 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="hud text-mango mb-2">// 01 — Nos magasins</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Choisissez votre verger</h2>
            <p className="text-gray-500 mt-2">Sélectionnez un magasin pour découvrir ses produits.</p>
          </div>
          {!loading && stores.length > 0 && (
            <span className="chip hud text-gray-600">
              <span className="neon-dot" /> {stores.length} magasin{stores.length > 1 ? 's' : ''} disponible{stores.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {loading ? (
          <FruitLoader label="Connexion aux vergers…" />
        ) : stores.length === 0 ? (
          <div className="glass rounded-3xl text-center py-20 px-6">
            <Fruit kind="lemon" glow className="w-20 h-20 mx-auto mb-5 animate-float" />
            <p className="text-white font-semibold text-lg">Aucun magasin disponible pour le moment</p>
            <p className="text-gray-500 text-sm mt-1">Revenez bientôt, la récolte arrive !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {stores.map((store, i) => (
              <StoreCard key={store.id} store={store} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ── Comment ça marche ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <p className="hud text-kiwi mb-2">// 02 — Protocole</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-8">Trois étapes, zéro attente</h2>
        <div className="grid md:grid-cols-3 gap-5 relative">
          <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-px bg-gradient-to-r from-strawberry via-kiwi to-mango opacity-50" />
          {STEPS.map((s) => (
            <div key={s.n} className="glass rounded-[1.75rem] p-6 relative">
              <div className="flex items-center justify-between mb-6">
                <div className="relative grid place-items-center w-20 h-20 rounded-2xl bg-black/30 border border-white/10">
                  <Fruit kind={s.kind} glow className="w-14 h-14 animate-float" />
                </div>
                <span className="font-display text-5xl font-extrabold text-white/10">{s.n}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{s.title}</h3>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bannière abonnement ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="holo relative overflow-hidden rounded-[2rem] p-8 sm:p-12 bg-gradient-to-br from-strawberry/25 via-grape/20 to-blueberry/25 border border-white/10">
          <div className="absolute -right-10 -bottom-12 flex gap-2 opacity-90">
            <Fruit kind="watermelon" glow className="w-40 h-40 animate-float" />
            <Fruit kind="grape" glow className="w-28 h-28 animate-float [animation-delay:-3s] hidden sm:block" />
          </div>
          <div className="relative max-w-lg">
            <p className="hud text-citrus mb-3">Abonnement fruité</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Vos fruits, chaque semaine, <span className="text-fruit">−15 %</span>.
            </h2>
            <p className="text-gray-600 mt-3">
              Choisissez vos jours de retrait, on prépare tout automatiquement. Résiliable à tout moment.
            </p>
            <Link to="/subscriptions/new" className="btn-fruit mt-6 px-7 py-4 rounded-2xl">
              Créer mon abonnement
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
