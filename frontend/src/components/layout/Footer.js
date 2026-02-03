import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={6} className="mb-4 mb-md-0">
            <h5>Advosia Legal Services</h5>
            <p>
              Connecting clients with qualified legal professionals worldwide.
            </p>
          </Col>
          <Col md={3} className="mb-4 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-light">Home</Link>
              </li>
              <li>
                <Link to="/cases" className="text-light">Cases</Link>
              </li>
              <li>
                <Link to="/about" className="text-light">About</Link>
              </li>
            </ul>
          </Col>
          <Col md={3} className="mb-4 mb-md-0">
            <h5>Legal Services</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/services" className="text-light">Family Law</Link>
              </li>
              <li>
                <Link to="/services" className="text-light">Corporate Law</Link>
              </li>
              <li>
                <Link to="/services" className="text-light">Criminal Law</Link>
              </li>
            </ul>
          </Col>
        </Row>
        <hr className="bg-light" />
        <Row>
          <Col className="text-center py-3">
            <small>&copy; 2024 Advosia Legal Services. All rights reserved.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
