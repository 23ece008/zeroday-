import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import TopNavbar from './components/TopNavbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Announcements from './pages/Announcements.jsx';
import LostFound from './pages/LostFound.jsx';
import Timetable from './pages/Timetable.jsx';
import Complaints from './pages/Complaints.jsx';
import SkillExchange from './pages/SkillExchange.jsx';
import OnDuty from './pages/OnDuty.jsx';
import AIChatbot from './components/AIChatbot.jsx';
import TechFeed from './pages/TechFeed.jsx';
import Polls from './pages/Polls.jsx';
import Canteen from './pages/Canteen.jsx';
import './App.css';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="app">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <TopNavbar 
          onToggleSidebar={toggleSidebar}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/lost-found" element={<LostFound />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/skill-exchange" element={<SkillExchange />} />
            <Route path="/on-duty" element={<OnDuty />} />
            <Route path="/tech-feed" element={<TechFeed />} />
            <Route path="/polls" element={<Polls />} />
            <Route path="/canteen" element={<Canteen />} />
          </Routes>
        </main>
      </div>
      <AIChatbot />
    </div>
  );
}

export default App;