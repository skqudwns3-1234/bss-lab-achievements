import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AchievementsProvider } from './context/AchievementsContext.tsx'

// index.html에 <div id="root">가 항상 있으므로 끝의 !로 "null이 아니다"라고 알려 준다
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 성과 목록 상자로 앱 전체를 감싼다 — 어느 화면에서든 useAchievements()로 같은 목록을 씀 (spec/02 2-5) */}
    <AchievementsProvider>
      <App />
    </AchievementsProvider>
  </StrictMode>,
)
