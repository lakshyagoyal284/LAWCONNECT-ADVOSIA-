import React from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <strong>Advosia</strong> Legal Services
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            
            {isAuthenticated ? (
              <>
                {user?.role === 'client' && (
                  <Nav.Link as={Link} to="/cases">My Cases</Nav.Link>
                )}
                {user?.role === 'lawyer' && (
                  <Nav.Link as={Link} to="/cases">Available Cases</Nav.Link>
                )}
                {user?.role === 'admin' && (
                  <Nav.Link as={Link} to="/admin">Admin Panel</Nav.Link>
                )}
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                
                <NavDropdown title={user?.name} id="basic-nav-dropdown">
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;