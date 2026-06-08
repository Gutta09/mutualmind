import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/ui/Navbar'
import Landing from './pages/Landing'
import Quiz from './pages/Quiz'
import Dashboard from './pages/Dashboard'
import Comparator from './pages/Comparator'
import OverlapVisualizer from './pages/OverlapVisualizer'
import SIPCalculator from './pages/SIPCalculator'
import FundDetail from './pages/FundDetail'
import Funds from './pages/Funds'

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/*" element={<AppLayout />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  )
}

function AppLayout() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', transition: 'background .2s, color .2s' }}>
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/compare"   element={<Comparator />} />
        <Route path="/overlap"   element={<OverlapVisualizer />} />
        <Route path="/calculator" element={<SIPCalculator />} />
        <Route path="/funds"     element={<Funds />} />
        <Route path="/fund/:scheme_code" element={<FundDetail />} />
      </Routes>
    </div>
  )
}
