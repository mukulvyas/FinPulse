import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Mobile pages
import MobileLayout from './layouts/MobileLayout'
import Welcome from './pages/mobile/Welcome'
import ConnectGST from './pages/mobile/ConnectGST'
import ConnectUPI from './pages/mobile/ConnectUPI'
import ConnectEPFO from './pages/mobile/ConnectEPFO'
import ConnectAA from './pages/mobile/ConnectAA'
import Analyzing from './pages/mobile/Analyzing'
import HealthCard from './pages/mobile/HealthCard'
import ScoreExplain from './pages/mobile/ScoreExplain'
import LoanOffers from './pages/mobile/LoanOffers'
import Profile from './pages/mobile/Profile'
import MSMELogin from './pages/mobile/Login'

// Desktop pages
import OfficerLogin from './pages/desktop/Login'
import Dashboard from './pages/desktop/Dashboard'
import Applications from './pages/desktop/Applications'
import Analytics from './pages/desktop/Analytics'
import Compliance from './pages/desktop/Compliance'
import Settings from './pages/desktop/Settings'

function ProtectedOfficerRoute({ children }) {
  const token = localStorage.getItem('finpulse_token')
  if (!token) return <Navigate to="/officer/login" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Mobile MSME Owner Flow */}
        <Route element={<MobileLayout />}>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<MSMELogin />} />
          <Route path="/connect-gst" element={<ConnectGST />} />
          <Route path="/connect-upi" element={<ConnectUPI />} />
          <Route path="/connect-epfo" element={<ConnectEPFO />} />
          <Route path="/connect-aa" element={<ConnectAA />} />
          <Route path="/analyzing" element={<Analyzing />} />
          <Route path="/health-card" element={<HealthCard />} />
          <Route path="/score-explain" element={<ScoreExplain />} />
          <Route path="/loan-offers" element={<LoanOffers />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Officer Portal */}
        <Route path="/officer/login" element={<OfficerLogin />} />
        <Route path="/officer" element={<ProtectedOfficerRoute><Dashboard /></ProtectedOfficerRoute>} />
        <Route path="/officer/dashboard" element={<ProtectedOfficerRoute><Dashboard /></ProtectedOfficerRoute>} />
        <Route path="/officer/applications" element={<ProtectedOfficerRoute><Applications /></ProtectedOfficerRoute>} />
        <Route path="/officer/analytics" element={<ProtectedOfficerRoute><Analytics /></ProtectedOfficerRoute>} />
        <Route path="/officer/compliance" element={<ProtectedOfficerRoute><Compliance /></ProtectedOfficerRoute>} />
        <Route path="/officer/settings" element={<ProtectedOfficerRoute><Settings /></ProtectedOfficerRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
