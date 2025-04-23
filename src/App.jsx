import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './index.css';
import './styles/animations.css';
import 'react-toastify/dist/ReactToastify.css';
// Payment features temporarily disabled
import { AuthProvider } from './contexts/AuthContext';
import { EventProvider } from './contexts/EventContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import About from './pages/About';
import Calendar from './pages/Calendar';
import EventDetails from './pages/EventDetails';
import Groups from './pages/Groups';
import GroupDetails from './pages/GroupDetails';
import Home from './pages/Home';
import UserManagement from './pages/UserManagement';
import NotFound from './pages/NotFound';
// Payment components temporarily disabled
import Settings from './pages/Settings';

// Stripe configuration temporarily disabled

function App() {
  return (
    <Router>
      <ThemeProvider>
        <LoadingProvider>
          <AuthProvider>
            <EventProvider>
              <NotificationProvider>
                <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/create-event" element={<CreateEvent />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<NotFound />} />
                    <Route path="/events/:id" element={<EventDetails />} />
                    <Route path="/events/:id/edit" element={<EditEvent />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/groups" element={<Groups />} />
                    <Route path="/groups/:groupId" element={<GroupDetails />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </div>
                <ToastContainer position="top-right" autoClose={5000} />
              </NotificationProvider>
            </EventProvider>
          </AuthProvider>
        </LoadingProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;