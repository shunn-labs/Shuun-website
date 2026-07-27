import { Route, Routes } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { LandingPage } from './pages/LandingPage'
import { TeamPage } from './pages/TeamPage'
import { ScrollToTop } from './components/ScrollToTop'

function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/team" element={<TeamPage />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
