import { Outlet, Route, Routes } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { LandingPage } from './pages/LandingPage'
import { TeamPage } from './pages/TeamPage'
import { DashboardPage } from './pages/DashboardPage'
import { ScrollToTop } from './components/ScrollToTop'

/** Marketing chrome. The dashboard is an app shell and opts out of it. */
function SiteLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/team" element={<TeamPage />} />
        </Route>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </>
  )
}

export default App
