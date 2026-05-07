/** @type {import('tailwindcss').Config} */
/* 设计系统配置 - 活力电商主题 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* 主色：活力橙红 */
        primary: {
          DEFAULT: '#FF4500',
          light: '#FF6B35',
          dark: '#CC3700',
          50: '#FFF4F0',
          100: '#FFE4D9',
        },
        /* 辅色：金橙暖调 */
        accent: {
          DEFAULT: '#FF8C00',
          light: '#FFB347',
          dark: '#E07B00',
        },
        /* 深色调：墨色系 */
        ink: {
          DEFAULT: '#1A1A2E',
          soft: '#2D2D44',
          muted: '#6B6B80',
        },
        /* 背景暖白 */
        surface: {
          DEFAULT: '#FFF8F5',
          card: '#FFFFFF',
          muted: '#F5F0EB',
        },
        /* 成功绿 */
        success: '#22C55E',
        /* 危险红（秒杀/标签） */
        danger: '#FF2D55',
      },
      fontFamily: {
        /* 英文/数字标题：Rubik */
        display: ['Rubik', 'sans-serif'],
        /* 中文主体：Noto Sans SC */
        body: ['"Noto Sans SC"', 'sans-serif'],
        /* 等宽数字 */
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      /* 自定义动画 */
      animation: {
        'slide-up':     'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade-in':      'fadeIn 0.3s ease-out',
        'fade-in-up':   'fadeInUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',  /* 任务6：商品卡片入场 */
        'pulse-dot':    'pulseDot 2s ease-in-out infinite',
        'shimmer':      'shimmer 1.5s infinite',
        'bounce-soft':  'bounceSoft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        /* 卡片入场动画：向上淡入 + 弹性曲线 */
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.3)', opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSoft: {
          '0%': { transform: 'scale(0.95)' },
          '60%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      /* 阴影系统 */
      boxShadow: {
        'card': '0 2px 16px rgba(255, 69, 0, 0.08)',
        'card-hover': '0 8px 32px rgba(255, 69, 0, 0.16)',
        'bottom-bar': '0 -4px 24px rgba(0,0,0,0.08)',
        'float': '0 8px 32px rgba(0,0,0,0.12)',
      },
      /* 圆角系统 */
      borderRadius: {
        'card': '16px',
        'pill': '999px',
        'tag': '6px',
      },
    },
  },
  plugins: [],
}
