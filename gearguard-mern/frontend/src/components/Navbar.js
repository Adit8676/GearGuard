import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useApp();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          ⚙️ GearGuard
        </Link>
        <ul className="navbar-nav">
          <li>
            <Link to="/" className={`nav-link ${isActive('/')}`}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/equipment" className={`nav-link ${isActive('/equipment')}`}>
              Equipment
            </Link>
          </li>
          <li>
            <Link to="/teams" className={`nav-link ${isActive('/teams')}`}>
              Teams
            </Link>
          </li>
          <li>
            <Link to="/requests" className={`nav-link ${isActive('/requests')}`}>
              Requests
            </Link>
          </li>
          <li>
            <Link to="/kanban" className={`nav-link ${isActive('/kanban')}`}>
              Kanban Board
            </Link>
          </li>
          <li>
            <Link to="/calendar" className={`nav-link ${isActive('/calendar')}`}>
              Calendar
            </Link>
          </li>
          {user && (
            <li>
              <span className="nav-link">👤 {user.name}</span>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
