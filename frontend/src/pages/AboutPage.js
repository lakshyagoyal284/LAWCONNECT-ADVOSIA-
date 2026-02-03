import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Fade } from 'react-awesome-reveal';
import { FaRocket, FaBrain, FaShieldAlt, FaGlobe, FaCogs, FaUsers } from 'react-icons/fa';

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero py-5">
        <Container>
          <Fade direction="up" triggerOnce>
            <div className="text-center">
              <div className="hero-icon mb-4">
                <FaRocket className="display-1" />
              </div>
              <h1 className="display-3 fw-bold mb-3">Advosia</h1>
              <p className="lead text-muted mb-4">
                The Future of Legal Services is Here
              </p>
              <div className="hero-subtitle">
                <span className="badge bg-primary me-2">AI-Powered</span>
                <span className="badge bg-success me-2">Secure</span>
                <span className="badge bg-info">Global</span>
              </div>
            </div>
          </Fade>
        </Container>
      </section>

      {/* Mission Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <Fade direction="left" triggerOnce>
                <div className="mission-content">
                  <h2 className="display-5 fw-bold mb-4">Our Mission</h2>
                  <p className="fs-5 text-muted mb-4">
                    Revolutionizing legal services through cutting-edge technology and human expertise. 
                    We're building the future where justice is accessible to everyone, everywhere.
                  </p>
                  <div className="mission-stats">
                    <Row className="g-3">
                      <Col md={4}>
                        <div className="stat-card">
                          <h3 className="text-primary">10K+</h3>
                          <p className="text-muted">Legal Experts</p>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="stat-card">
                          <h3 className="text-success">50K+</h3>
                          <p className="text-muted">Cases Solved</p>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="stat-card">
                          <h3 className="text-info">99.9%</h3>
                          <p className="text-muted">Success Rate</p>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Fade>
            </Col>
            <Col lg={6}>
              <Fade direction="right" triggerOnce>
                <div className="mission-visual">
                  <Card className="border-0 shadow-lg bg-glass">
                    <Card.Body className="p-5 text-center">
                      <FaBrain className="display-1 text-primary mb-3" />
                      <h4 className="text-white">AI-Enhanced Matching</h4>
                      <p className="text-white-50">
                        Our intelligent algorithm connects you with the perfect legal professional 
                        based on your specific needs and preferences.
                      </p>
                    </Card.Body>
                  </Card>
                </div>
              </Fade>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Grid */}
      <section className="py-5">
        <Container>
          <Fade direction="up" triggerOnce>
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">Why Choose Advosia?</h2>
              <p className="lead text-muted">
                Experience the next generation of legal services
              </p>
            </div>
          </Fade>

          <Row className="g-4">
            <Col md={4}>
              <Fade direction="up" triggerOnce delay={100}>
                <Card className="feature-card h-100 border-0 shadow-sm">
                  <Card.Body className="p-4 text-center">
                    <div className="feature-icon mb-3">
                      <FaShieldAlt className="display-4 text-primary" />
                    </div>
                    <h4 className="mb-3">Bank-Level Security</h4>
                    <p className="text-muted">
                      End-to-end encryption and biometric authentication keep your data safe
                    </p>
                  </Card.Body>
                </Card>
              </Fade>
            </Col>
            <Col md={4}>
              <Fade direction="up" triggerOnce delay={200}>
                <Card className="feature-card h-100 border-0 shadow-sm">
                  <Card.Body className="p-4 text-center">
                    <div className="feature-icon mb-3">
                      <FaCogs className="display-4 text-success" />
                    </div>
                    <h4 className="mb-3">Smart Automation</h4>
                    <p className="text-muted">
                      AI-powered document analysis and case management save you time
                    </p>
                  </Card.Body>
                </Card>
              </Fade>
            </Col>
            <Col md={4}>
              <Fade direction="up" triggerOnce delay={300}>
                <Card className="feature-card h-100 border-0 shadow-sm">
                  <Card.Body className="p-4 text-center">
                    <div className="feature-icon mb-3">
                      <FaGlobe className="display-4 text-info" />
                    </div>
                    <h4 className="mb-3">Global Network</h4>
                    <p className="text-muted">
                      Connect with legal professionals from over 100 countries
                    </p>
                  </Card.Body>
                </Card>
              </Fade>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Technology Section */}
      <section className="py-5 bg-dark text-white">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <Fade direction="left" triggerOnce>
                <div className="tech-content">
                  <h2 className="display-5 fw-bold mb-4">Powered by Innovation</h2>
                  <p className="fs-5 mb-4">
                    Our platform leverages cutting-edge technology to deliver seamless legal services:
                  </p>
                  <ul className="tech-list">
                    <li><span className="tech-badge">Machine Learning</span> Intelligent case matching</li>
                    <li><span className="tech-badge">Blockchain</span> Secure document verification</li>
                    <li><span className="tech-badge">Cloud Native</span> Access from anywhere</li>
                    <li><span className="tech-badge">Real-time</span> Live collaboration tools</li>
                  </ul>
                </div>
              </Fade>
            </Col>
            <Col lg={6}>
              <Fade direction="right" triggerOnce>
                <div className="tech-visual">
                  <Card className="border-0 bg-glass-light">
                    <Card.Body className="p-5 text-center">
                      <FaUsers className="display-1 text-primary mb-3" />
                      <h4 className="text-white">24/7 Support</h4>
                      <p className="text-white-50">
                        Round-the-clock assistance from our team of legal experts and AI assistants
                      </p>
                    </Card.Body>
                  </Card>
                </div>
              </Fade>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Fade direction="up" triggerOnce>
            <div className="text-center">
              <h2 className="display-5 fw-bold mb-4">Ready to Experience the Future?</h2>
              <p className="fs-5 mb-4">
                Join thousands who have already transformed their legal journey with Advosia
              </p>
              <div className="cta-buttons">
                <button className="btn btn-light btn-lg me-3 px-4">
                  Get Started Free
                </button>
                <button className="btn btn-outline-light btn-lg px-4">
                  Learn More
                </button>
              </div>
            </div>
          </Fade>
        </Container>
      </section>
    </div>
  );
};

export default AboutPage;
