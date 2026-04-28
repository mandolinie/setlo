import { Routes, Route, Navigate } from "react-router-dom"
import AboutPage from "./screens/AboutPage"
import CookieBanner from "./components/ui/CookieBanner"
import HistoryScreen from "./screens/HistoryScreen"
import LegalPage from "./screens/LegalPage"
import PrivacyPage from "./screens/PrivacyPage"
import RoutineScreen from "./screens/RoutineScreen"
import WorkoutScreen from "./screens/WorkoutScreen"

export default function App() {
  return (
    <>
      <CookieBanner />
      <Routes>
        <Route path="/" element={<Navigate to="/workout" />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/history" element={<HistoryScreen />} />
        <Route path="/legal" element={<LegalPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/routine" element={<RoutineScreen />} />
        <Route path="/workout" element={<WorkoutScreen />} />
      </Routes>
    </>
  )
}