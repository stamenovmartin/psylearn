import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import HomePage from './pages/HomePage.jsx'
import SurveyPage from './pages/SurveyPage.jsx'
import ResultsPage from './pages/ResultsPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import TrainerPage from './pages/TrainerPage.jsx'
import ModelPage from './pages/ModelPage.jsx'
import LearnPage from './pages/LearnPage.jsx'
import FlowPage from './pages/FlowPage.jsx'
import HBSCPage from './pages/HBSCPage.jsx'
import WellnessPage from './pages/WellnessPage.jsx'
import PlayHubPage from './pages/PlayHubPage.jsx'
import ScenarioGamePage from './pages/ScenarioGamePage.jsx'
import PerceptionPage from './pages/PerceptionPage.jsx'
import StroopGamePage from './pages/StroopGamePage.jsx'
import ReactionGamePage from './pages/ReactionGamePage.jsx'

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/trainer" element={<TrainerPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/flow" element={<FlowPage />} />
          <Route path="/hbsc" element={<HBSCPage />} />
          <Route path="/wellness" element={<WellnessPage />} />
          <Route path="/play" element={<PlayHubPage />} />
          <Route path="/game" element={<ScenarioGamePage />} />
          <Route path="/perception" element={<PerceptionPage />} />
          <Route path="/stroop" element={<StroopGamePage />} />
          <Route path="/reaction" element={<ReactionGamePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/model" element={<ModelPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
