/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Teal Accent
        brand: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',   // PRIMARY
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Pastel section backgrounds
        sky:      { DEFAULT: '#F0F7FF' },
        mint:     { DEFAULT: '#F0FDF4' },
        cream:    { DEFAULT: '#FFFBEB' },
        lavender: { DEFAULT: '#F5F3FF' },
        // Neon accent colors
        neon: {
          teal:   '#00FFE0',
          violet: '#B44FFF',
          cyan:   '#00D4FF',
          green:  '#39FF14',
          pink:   '#FF3DFF',
        },
        // Crisp neutrals
        neutral: {
          0:   'var(--neutral-0)',
          50:  'var(--neutral-50)',
          100: 'var(--neutral-100)',
          200: 'var(--neutral-200)',
          300: 'var(--neutral-300)',
          400: 'var(--neutral-400)',
          500: 'var(--neutral-500)',
          600: 'var(--neutral-600)',
          700: 'var(--neutral-700)',
          800: 'var(--neutral-800)',
          900: 'var(--neutral-900)',
        },
        // Semantic
        success: '#22c55e',
        warning: '#f59e0b',
        error:   '#ef4444',
      },
      fontFamily: {
        en:      ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        ta:      ['"Noto Sans Tamil"', 'sans-serif'],
        sans:    ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Space Grotesk', 'Plus Jakarta Sans', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem',  { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display':    ['3.5rem',  { lineHeight: '1.1',  letterSpacing: '-0.025em', fontWeight: '700' }],
        'heading':    ['2rem',    { lineHeight: '1.25', letterSpacing: '-0.02em',  fontWeight: '700' }],
        'subhead':    ['1.25rem', { lineHeight: '1.5',  letterSpacing: '-0.01em',  fontWeight: '600' }],
        'body-lg':    ['1.0625rem', { lineHeight: '1.7' }],
        'body':       ['0.9375rem', { lineHeight: '1.65' }],
        'small':      ['0.8125rem', { lineHeight: '1.5' }],
        'label':      ['0.75rem',   { lineHeight: '1.4', letterSpacing: '0.06em', fontWeight: '700' }],
      },
      borderRadius: {
        DEFAULT: '8px',
        sm:  '6px',
        md:  '10px',
        lg:  '14px',
        xl:  '20px',
        '2xl': '28px',
        '3xl': '40px',
        full: '9999px',
      },
      boxShadow: {
        'card':            '0 2px 8px 0 rgb(0 0 0 / 0.06)',
        'card-hover':      '0 8px 32px 0 rgb(0 0 0 / 0.10)',
        'panel':           '0 12px 40px 0 rgb(0 0 0 / 0.07)',
        'glow-teal':       '0 0 30px 0 rgb(20 184 166 / 0.35)',
        'glow-teal-lg':    '0 0 60px 0 rgb(20 184 166 / 0.25)',
        'glow-violet':     '0 0 30px 0 rgb(139 92 246 / 0.4)',
        'glow-cyan':       '0 0 30px 0 rgb(6 182 212 / 0.4)',
        'glow-pink':       '0 0 30px 0 rgb(236 72 153 / 0.4)',
        'neon-teal':       '0 0 8px #00FFE0, 0 0 20px rgba(0,255,224,0.4), 0 0 40px rgba(0,255,224,0.15)',
        'neon-violet':     '0 0 8px #B44FFF, 0 0 20px rgba(180,79,255,0.4), 0 0 40px rgba(180,79,255,0.15)',
        'neon-cyan':       '0 0 8px #00D4FF, 0 0 20px rgba(0,212,255,0.4), 0 0 40px rgba(0,212,255,0.15)',
        'inner-soft':      'inset 0 1px 0 0 rgba(255,255,255,0.7)',
        'inner-glow':      'inset 0 0 30px rgba(20,184,166,0.1)',
        'game-card':       '0 4px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(20,184,166,0.08)',
        'game-card-hover': '0 20px 60px rgba(20,184,166,0.15), 0 0 0 1px rgba(20,184,166,0.2)',
      },
      animation: {
        'float':           'float 6s ease-in-out infinite',
        'float-slow':      'float 9s ease-in-out infinite',
        'float-fast':      'float 4s ease-in-out infinite',
        'pulse-slow':      'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':       'spin 20s linear infinite',
        'spin-reverse':    'spinReverse 15s linear infinite',
        'marquee':         'marquee 25s linear infinite',
        'blob':            'blob 10s infinite',
        'gradient':        'gradient 8s ease infinite',
        'neon-pulse':      'neonPulse 2.5s ease-in-out infinite',
        'gradient-x':      'gradientX 4s ease infinite',
        'orbit':           'orbit 8s linear infinite',
        'orbit-reverse':   'orbit 12s linear infinite reverse',
        'shimmer':         'shimmer 2.5s linear infinite',
        'xp-fill':         'xpFill 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'badge-pop':       'badgePop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'confetti':        'confettiDrop 0.8s ease-out forwards',
        'scanline':        'scanline 3s linear infinite',
        'flame':           'flame 1s ease-in-out infinite alternate',
        'glow-pulse':      'glowPulse 2s ease-in-out infinite',
        'slide-up':        'slideUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards',
        'count-up':        'countUp 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        blob: {
          '0%':   { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%':  { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
          '100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        neonPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(20,184,166,0.4), 0 0 20px rgba(20,184,166,0.2)' },
          '50%':      { boxShadow: '0 0 16px rgba(20,184,166,0.8), 0 0 40px rgba(20,184,166,0.4), 0 0 60px rgba(20,184,166,0.2)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        orbit: {
          '0%':   { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
        shimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        xpFill: {
          '0%':   { width: '0%' },
          '100%': { width: 'var(--xp-width)' },
        },
        badgePop: {
          '0%':   { transform: 'scale(0) rotate(-10deg)', opacity: '0' },
          '70%':  { transform: 'scale(1.15) rotate(3deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        confettiDrop: {
          '0%':   { transform: 'translateY(-10px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(60px) rotate(360deg)', opacity: '0' },
        },
        scanline: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flame: {
          '0%':   { transform: 'scaleY(1) rotate(-3deg)', filter: 'hue-rotate(0deg)' },
          '100%': { transform: 'scaleY(1.15) rotate(3deg)', filter: 'hue-rotate(20deg)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%':      { opacity: '1', transform: 'scale(1.05)' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        spinReverse: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        countUp: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundSize: {
        '200%': '200% 200%',
        '300%': '300% 300%',
      },
    },
  },
  plugins: [],
}
