import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Navbar from './components/ui/Navbar'
import Landing from './pages/Landing'
import Quiz from './pages/Quiz'
import Dashboard from './pages/Dashboard'
import Comparator from './pages/Comparator'
import OverlapVisualizer from './pages/OverlapVisualizer'
import SIPCalculator from './pages/SIPCalculator'
import FundDetail from './pages/FundDetail'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/compare" element={<Comparator />} />
        <Route path="/overlap" element={<OverlapVisualizer />} />
        <Route path="/calculator" element={<SIPCalculator />} />
        <Route path="/fund/:scheme_code" element={<FundDetail />} />
      </Routes>
    </div>
  )
}
