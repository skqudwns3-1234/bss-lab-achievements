import { BrowserRouter, Routes, Route } from 'react-router'
import Layout from './components/layout/Layout.tsx'
import HomePage from './pages/HomePage.tsx'
import AboutPage from './pages/AboutPage.tsx'
import MembersPage from './pages/MembersPage.tsx'
import AchievementsPage from './pages/AchievementsPage.tsx'
import AchievementFormPage from './pages/AchievementFormPage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout이 헤더·푸터를 그리고, 가운데 <Outlet />에 아래 페이지가 들어간다 */}
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="achievements" element={<AchievementsPage />} />
          <Route path="achievements/new" element={<AchievementFormPage />} />
          <Route path="achievements/:id/edit" element={<AchievementFormPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
