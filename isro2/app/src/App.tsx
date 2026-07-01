import { Routes, Route } from 'react-router';
import HomePage from './pages/HomePage';
import AgriculturePage from './pages/AgriculturePage';
import WaterPage from './pages/WaterPage';
import UrbanPage from './pages/UrbanPage';
import AIAssistantPage from './pages/AIAssistantPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import ContactPage from './pages/ContactPage';
import SettingsPage from './pages/SettingsPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/agriculture" element={<AgriculturePage />} />
      <Route path="/water" element={<WaterPage />} />
      <Route path="/urban" element={<UrbanPage />} />
      <Route path="/ai-assistant" element={<AIAssistantPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
