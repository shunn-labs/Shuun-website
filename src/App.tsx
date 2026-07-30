import { Outlet, Route, Routes } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { RedirectIfAuthenticated } from './components/auth/RedirectIfAuthenticated'
import { ScrollToTop } from './components/ScrollToTop'
import { AuthProvider } from './lib/auth/AuthContext'
import { DashboardPage } from './pages/DashboardPage'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { SignupPage } from './pages/SignupPage'
import { TeamPage } from './pages/TeamPage'
import { WelcomePage } from './pages/WelcomePage'

/** Marketing chrome. App and auth screens are full-bleed and opt out. */
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
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          {/* Public marketing homepage. Signed-in visitors are forwarded to
              /welcome, but the page is NOT held back while the session is
              being checked — anonymous visitors must never wait on auth. */}
          <Route element={<RedirectIfAuthenticated blockWhileLoading={false} />}>
            <Route path="/" element={<LandingPage />} />
          </Route>
          {/* Stays browsable while signed in, so Welcome has somewhere to
              link back into the public site. */}
          <Route path="/team" element={<TeamPage />} />
        </Route>

        <Route element={<RedirectIfAuthenticated />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
