// Custom Tailwind plugin to handle shadcn/ui opacity variants
const plugin = require('tailwindcss/plugin');

module.exports = plugin(function({ addUtilities }) {
  const newUtilities = {
    '.ring-ring\\/50': {
      '--tw-ring-color': 'var(--ring) / 0.5',
    },
    '.ring-destructive\\/20': {
      '--tw-ring-color': 'var(--destructive) / 0.2',
    },
    '.ring-destructive\\/40': {
      '--tw-ring-color': 'var(--destructive) / 0.4',
    },
    '.bg-input\\/30': {
      'background-color': 'var(--input) / 0.3',
    },
    '.bg-input\\/50': {
      'background-color': 'var(--input) / 0.5',
    },
  };

  addUtilities(newUtilities);
});
