import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Zoom, Fade } from 'react-awesome-reveal';
import { FaBalanceScale, FaUserTie, FaShieldAlt, FaHandshake } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section py-5 bg-light">
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col lg={6} className="mb-5 mb-lg-0">
              <Fade direction="left" triggerOnce>
                <h1 className="display-4 fw-bold mb-4">
                  Expert Legal Guidance,<br />On Your Terms
                </h1>
                <p className="lead mb-4">
                  Connect with rigorously vetted legal professionals through Advosia's secure platform. 
                  Experience transparent, professional legal services with complete confidence.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Button as={Link} to="/register" variant="primary" size="lg" className="px-4">
                    Get Legal Help
                  </Button>
                  <Button as={Link} to="/register?role=lawyer" variant="outline-dark" size="lg" className="px-4">
                    Join as Legal Professional
                  </Button>
                </div>
              </Fade>
            </Col>
            <Col lg={6}>
              <Fade direction="right" triggerOnce>
                <div className="position-relative">
                  <div className="hero-illustration">
                    <img 
                      src="/expert-guidance.png" 
                      alt="Expert Legal Guidance" 
                      className="img-fluid rounded-3 shadow-lg"
                    />
                  </div>
                </div>
              </Fade>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Why Advosia Section */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5">Why Choose Advosia</h2>
          <Row className="g-4">
            <Col md={4}>
              <Zoom triggerOnce>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <div className="icon-wrapper mb-3">
                      <FaUserTie className="display-4 text-primary" />
                    </div>
                    <h4>Verified Professionals</h4>
                    <p className="text-muted">
                      Every legal expert undergoes rigorous verification to ensure the highest standards of professionalism.
                    </p>
                  </Card.Body>
                </Card>
              </Zoom>
            </Col>
            <Col md={4}>
              <Zoom delay={100} triggerOnce>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <div className="icon-wrapper mb-3">
                      <FaShieldAlt className="display-4 text-primary" />
                    </div>
                    <h4>Secure & Confidential</h4>
                    <p className="text-muted">
                      Your privacy is our priority. All communications and documents are protected with enterprise-grade security.
                    </p>
                  </Card.Body>
                </Card>
              </Zoom>
            </Col>
            <Col md={4}>
              <Zoom delay={200} triggerOnce>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <div className="icon-wrapper mb-3">
                      <FaHandshake className="display-4 text-primary" />
                    </div>
                    <h4>Transparent Process</h4>
                    <p className="text-muted">
                      Clear expectations, transparent pricing, and professional accountability at every step.
                    </p>
                  </Card.Body>
                </Card>
              </Zoom>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <Fade direction="left" triggerOnce>
                <h2 className="mb-4">How It Works</h2>
                <div className="process-step mb-4">
                  <h5>1. Submit Your Legal Need</h5>
                  <p className="text-muted">
                    Describe your legal requirement in detail through our secure platform.
                  </p>
                </div>
                <div className="process-step mb-4">
                  <h5>2. Get Matched</h5>
                  <p className="text-muted">
                    Our system connects you with qualified legal professionals best suited for your case.
                  </p>
                </div>
                <div className="process-step">
                  <h5>3. Resolve with Confidence</h5>
                  <p className="text-muted">
                    Work directly with your chosen professional through our secure platform.
                  </p>
                </div>
              </Fade>
            </Col>
            <Col lg={6}>
              <Fade direction="right" triggerOnce>
                <div className="p-4">
                  <h3 className="mb-4">For Legal Professionals</h3>
                  <p className="lead mb-4">
                    Join a platform that values your expertise and connects you with clients who need your specific legal skills.
                  </p>
                  <Button 
                    as={Link} 
                    to="/register/lawyer" 
                    variant="outline-primary" 
                    size="lg"
                    className="mt-3"
                  >
                    Join Our Network
                  </Button>
                </div>
              </Fade>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
