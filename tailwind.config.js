/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 학교 감성을 담은 커스텀 컬러 시스템
        school: {
          chalkboard: {
            DEFAULT: '#1e3f35', // 칠판 메인
            dark: '#142b24',    // 칠판 어두운 그림자
            light: '#2a5547',   // 칠판 밝은 영역
          },
          postit: {
            yellow: '#fef08a',  // 노란 포스트잇
            pink: '#fecdd3',    // 분홍 포스트잇
            blue: '#bae6fd',    // 파란 포스트잇
            green: '#bbf7d0',   // 초록 포스트잇
          },
          paper: {
            DEFAULT: '#FAF8F5', // 따뜻한 미색 종이 질감
            dark: '#0f172a',    // 다크 모드용 배경
          },
          wood: {
            light: '#d97706',   // 교탁 나무색 (연함)
            DEFAULT: '#b45309', // 교탁 나무색
            dark: '#78350f',    // 교탁 나무색 (진함)
          }
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'Inter', 'system-ui', 'sans-serif'],
        school: ['GmarketSansMedium', 'Comic Sans MS', 'Pretendard', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.4s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'bounce-subtle': 'bounceSubtle 2s infinite ease-in-out',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      },
      boxShadow: {
        'school-flat': '4px 4px 0px 0px rgba(0, 0, 0, 0.15)',
        'school-press': '2px 2px 0px 0px rgba(0, 0, 0, 0.15)',
        'school-deep': '8px 8px 0px 0px rgba(0, 0, 0, 0.15)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      }
    },
  },
  plugins: [],
}
