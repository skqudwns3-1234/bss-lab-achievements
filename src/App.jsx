import { BrowserRouter, Routes, Route } from 'react-router'
import Layout from './components/layout/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import MembersPage from './pages/MembersPage.jsx'
import AchievementsPage from './pages/AchievementsPage.jsx'
import AchievementFormPage from './pages/AchievementFormPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

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
