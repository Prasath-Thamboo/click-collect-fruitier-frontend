export const FRUIT_PALETTES = {
  orange: { glow: '#ff9a1f', from: '#ffb547', to: '#ff6a1f', label: 'Orange' },
  lemon: { glow: '#ffe14d', from: '#fff27a', to: '#ffc61a', label: 'Citron' },
  lime: { glow: '#9cf542', from: '#c6ff6b', to: '#4fd12a', label: 'Citron vert' },
  grapefruit: { glow: '#ff5c6c', from: '#ff8a7a', to: '#ff3d5e', label: 'Pamplemousse' },
  kiwi: { glow: '#7cf06a', from: '#a6f56e', to: '#3fbf3a', label: 'Kiwi' },
  strawberry: { glow: '#ff3d7f', from: '#ff5c8a', to: '#e0123f', label: 'Fraise' },
  watermelon: { glow: '#ff4d6d', from: '#ff6b81', to: '#2fbf5b', label: 'Pastèque' },
  cherry: { glow: '#ff2d55', from: '#ff4d6a', to: '#a3001f', label: 'Cerise' },
  blueberry: { glow: '#6f6bff', from: '#8c88ff', to: '#3a2fb8', label: 'Myrtille' },
  grape: { glow: '#b45cff', from: '#c98bff', to: '#6a1fc9', label: 'Raisin' },
  dragon: { glow: '#ff4fd8', from: '#ff6ee0', to: '#c41a9b', label: 'Fruit du dragon' },
};

export const FRUIT_KINDS = Object.keys(FRUIT_PALETTES);

// Associe un nom de produit / magasin à un fruit (mots-clés, sinon hachage stable)
const KEYWORDS = [
  [/fraise|strawberr|framboise/i, 'strawberry'],
  [/kiwi/i, 'kiwi'],
  [/past[eè]que|melon|watermelon/i, 'watermelon'],
  [/cerise|cherr/i, 'cherry'],
  [/myrtille|blueberr|m[uû]re|cassis|bleuet/i, 'blueberry'],
  [/raisin|grape/i, 'grape'],
  [/dragon|pitaya|exotique|passion|litchi/i, 'dragon'],
  [/pamplemousse|grapefruit|sanguine/i, 'grapefruit'],
  [/citron vert|lime|mojito|menthe|vert|d[ée]tox|green/i, 'lime'],
  [/citron|lemon|ananas|mangue|banane/i, 'lemon'],
  [/orange|agrume|vitamin|clementine|mandarine|abricot|p[eê]che/i, 'orange'],
];

function hash(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function fruitFor(name = '', seed = '') {
  const match = KEYWORDS.find(([re]) => re.test(name));
  if (match) return match[1];
  return FRUIT_KINDS[hash(name + seed) % FRUIT_KINDS.length];
}

export function paletteFor(kind) {
  return FRUIT_PALETTES[kind] ?? FRUIT_PALETTES.orange;
}
