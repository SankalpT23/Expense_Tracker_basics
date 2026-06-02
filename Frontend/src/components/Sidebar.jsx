import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, BarChart3, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import './Sidebar.css';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/expenses', label: 'Expenses', icon: Receipt },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar" id="main-sidebar">
      <div className="sidebar-inner">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Sparkles size={22} />
          </div>
          <span className="logo-text">Expenso</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <NavLink to={item.path} className={`nav-link ${isActive ? 'active' : ''}`} id={`nav-${item.label.toLowerCase()}`}>
                    {isActive && (
                      <motion.div
                        className="nav-active-bg"
                        layoutId="activeNav"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon size={20} className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                    {isActive && <div className="nav-indicator" />}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-footer-card">
            <p className="footer-title">Expenso v1.1</p>
            <p className="footer-subtitle">Track smarter, spend wiser</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
