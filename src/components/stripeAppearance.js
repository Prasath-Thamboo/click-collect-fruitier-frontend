// Thème du formulaire de paiement Stripe, aligné sur « Néon Verger »
export const stripeAppearance = {
  theme: 'night',
  variables: {
    colorPrimary: '#ff3d7f',
    colorBackground: '#14112f',
    colorText: '#ebe9fb',
    colorTextSecondary: '#a7a5c8',
    colorDanger: '#ff6a9b',
    colorSuccess: '#7cf06a',
    fontFamily: 'Inter, system-ui, sans-serif',
    borderRadius: '14px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': {
      border: '1px solid rgba(255,255,255,0.12)',
      boxShadow: 'none',
    },
    '.Input:focus': {
      border: '1px solid rgba(124,240,106,0.6)',
      boxShadow: '0 0 0 4px rgba(124,240,106,0.12), 0 0 24px -4px rgba(124,240,106,0.45)',
    },
    '.Tab': {
      border: '1px solid rgba(255,255,255,0.1)',
      backgroundColor: 'rgba(255,255,255,0.04)',
    },
    '.Tab--selected': {
      borderColor: '#ff3d7f',
      boxShadow: '0 0 20px -6px #ff3d7f',
    },
  },
};
