import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import CasesPage from './pages/CasesPage';
import CreateCasePage from './pages/CreateCasePage';
import CaseDetailPage from './pages/CaseDetailPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import { AuthProvider, useAuth } from './context/AuthContext';

// Private Route Component
const PrivateRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <ToastContainer position="top-right" autoClose={3000} />
        <main className="flex-grow-1 py-4">
          <Container>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/about" element={<AboutPage />} />
              
              {/* Protected Routes */}
              <Route
                path="/cases"
                element={
                  <PrivateRoute>
                    <CasesPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/cases/new"
                element={
                  <PrivateRoute roles={['client']}>
                    <CreateCasePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/cases/:id"
                element={
                  <PrivateRoute>
                    <CaseDetailPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
              
              <Route
                path="/payment/success/:paymentId?"
                element={
                  <PrivateRoute>
                    <PaymentSuccessPage />
                  </PrivateRoute>
                }
              />
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Container>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
