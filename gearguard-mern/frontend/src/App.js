import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Equipment from './pages/Equipment';
import Teams from './pages/Teams';
import Requests from './pages/Requests';
import KanbanBoard from './pages/KanbanBoard';
import CalendarView from './pages/CalendarView';
import Login from './pages/Login';

import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/equipment" element={<Equipment />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/kanban" element={<KanbanBoard />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
