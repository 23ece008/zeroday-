import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Bell, 
  Search, 
  Calendar, 
  MessageSquare,
  BookOpen,
  Briefcase,
  Newspaper,
  BarChart3,
  Utensils
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isCollapsed }) => {
  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/announcements', icon: Bell, label: 'Announcements' },
    { path: '/lost-found', icon: Search, label: 'Lost & Found' },
    { path: '/timetable', icon: Calendar, label: 'Timetable' },
    { path: '/complaints', icon: MessageSquare, label: 'Complaints' },
    { path: '/on-duty', icon: Briefcase, label: 'On-Duty' },
    { path: '/canteen', icon: Utensils, label: 'Canteen Prebook' },
    { path: '/skill-exchange', icon: BookOpen, label: 'Skill Exchange' },
    { path: '/tech-feed', icon: Newspaper, label: 'Tech Feed' },
    { path: '/polls', icon: BarChart3, label: 'Polls & Feedback' }
  ];

  return (
    <aside className={`sidebar${isCollapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="college-logo">
          <BookOpen size={32} />
        </div>
        {!isCollapsed && (
          <div className="college-info">
            <h3>Sri Eshwar College</h3>
            <p>of Engineering</p>
          </div>
        )}
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-item${isActive ? ' active' : ''}`
            }
          >
            <item.icon size={24} />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;