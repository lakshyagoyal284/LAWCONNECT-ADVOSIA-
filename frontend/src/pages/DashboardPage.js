import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    cases: 0,
    activeBids: 0,
    completedCases: 0,
    messages: 0,
  });
  const [recentCases, setRecentCases] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch this data from your API
        // const res = await axios.get('/api/dashboard');
        // setStats(res.data.stats);
        // setRecentCases(res.data.recentCases);
        
        // Mock data for now
        setTimeout(() => {
          setStats({
            cases: user.role === 'client' ? 5 : 12,
            activeBids: user.role === 'client' ? 3 : 8,
            completedCases: user.role === 'client' ? 2 : 15,
            messages: user.role === 'client' ? 7 : 23,
          });
          
          setRecentCases([
            { id: 1, title: 'Contract Review Needed', status: 'In Progress', date: '2023-11-15' },
            { id: 2, title: 'Divorce Consultation', status: 'Pending', date: '2023-11-10' },
            { id: 3, title: 'Business Incorporation', status: 'Completed', date: '2023-11-05' },
          ]);
          
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.role]);

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'primary';
      case 'pending':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Dashboard</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <Row className="mb-4 g-4">
            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-1">
                        {user.role === 'client' ? 'My Cases' : 'Available Cases'}
                      </h6>
                      <h3 className="mb-0">{stats.cases}</h3>
                    </div>
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                      <i className="fas fa-briefcase text-primary fs-4"></i>
                    </div>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-transparent border-0 pt-0">
                  <Link to="/cases" className="text-decoration-none small">
                    View all <i className="fas fa-arrow-right ms-1"></i>
                  </Link>
                </Card.Footer>
              </Card>
            </Col>
            
            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-1">Active Bids</h6>
                      <h3 className="mb-0">{stats.activeBids}</h3>
                    </div>
                    <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                      <i className="fas fa-gavel text-warning fs-4"></i>
                    </div>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-transparent border-0 pt-0">
                  <Link to="/bids" className="text-decoration-none small">
                    View all <i className="fas fa-arrow-right ms-1"></i>
                  </Link>
                </Card.Footer>
              </Card>
            </Col>
            
            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-1">Completed</h6>
                      <h3 className="mb-0">{stats.completedCases}</h3>
                    </div>
                    <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                      <i className="fas fa-check-circle text-success fs-4"></i>
                    </div>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-transparent border-0 pt-0">
                  <Link to="/cases?status=completed" className="text-decoration-none small">
                    View all <i className="fas fa-arrow-right ms-1"></i>
                  </Link>
                </Card.Footer>
              </Card>
            </Col>
            
            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-1">Messages</h6>
                      <h3 className="mb-0">{stats.messages}</h3>
                    </div>
                    <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                      <i className="fas fa-envelope text-info fs-4"></i>
                    </div>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-transparent border-0 pt-0">
                  <Link to="/messages" className="text-decoration-none small">
                    View all <i className="fas fa-arrow-right ms-1"></i>
                  </Link>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
          
          {/* Recent Cases */}
          <Row className="mb-4">
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Recent Cases</h5>
                  <Button as={Link} to="/cases/new" variant="primary" size="sm">
                    <i className="fas fa-plus me-1"></i> New Case
                  </Button>
                </Card.Header>
                <Card.Body>
                  {recentCases.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead>
                          <tr>
                            <th>Case Title</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentCases.map((caseItem) => (
                            <tr key={caseItem.id}>
                              <td>
                                <Link to={`/cases/${caseItem.id}`} className="text-decoration-none">
                                  {caseItem.title}
                                </Link>
                              </td>
                              <td>
                                <span className={`badge bg-${getStatusBadge(caseItem.status)}`}>
                                  {caseItem.status}
                                </span>
                              </td>
                              <td>{new Date(caseItem.date).toLocaleDateString()}</td>
                              <td>
                                <Button
                                  as={Link}
                                  to={`/cases/${caseItem.id}`}
                                  variant="outline-primary"
                                  size="sm"
                                >
                                  View
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <i className="fas fa-inbox fs-1 text-muted mb-3"></i>
                      <p className="text-muted mb-0">No recent cases found</p>
                      <Button as={Link} to="/cases/new" variant="primary" className="mt-3">
                        Create Your First Case
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {/* Quick Actions */}
          <Row>
            <Col md={6}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Header className="bg-white border-0">
                  <h5 className="mb-0">Quick Actions</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-grid gap-2">
                    <Button as={Link} to="/cases/new" variant="outline-primary" className="text-start">
                      <i className="fas fa-plus-circle me-2"></i> Post a New Case
                    </Button>
                    <Button as={Link} to="/bids" variant="outline-success" className="text-start">
                      <i className="fas fa-gavel me-2"></i> View My Bids
                    </Button>
                    <Button as={Link} to="/profile" variant="outline-secondary" className="text-start">
                      <i className="fas fa-user-edit me-2"></i> Update Profile
                    </Button>
                    {user.role === 'lawyer' && (
                      <Button as={Link} to="/lawyer/profile" variant="outline-info" className="text-start">
                        <i className="fas fa-briefcase me-2"></i> Lawyer Profile
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6} className="mt-4 mt-md-0">
              <Card className="border-0 shadow-sm h-100">
                <Card.Header className="bg-white border-0">
                  <h5 className="mb-0">Recent Activity</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex mb-3">
                    <div className="flex-shrink-0">
                      <div className="bg-primary bg-opacity-10 p-2 rounded-circle">
                        <i className="fas fa-bell text-primary"></i>
                      </div>
                    </div>
                    <div className="ms-3">
                      <p className="mb-1 fw-medium">New message from John Doe</p>
                      <p className="text-muted small mb-0">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="d-flex mb-3">
                    <div className="flex-shrink-0">
                      <div className="bg-success bg-opacity-10 p-2 rounded-circle">
                        <i className="fas fa-check-circle text-success"></i>
                      </div>
                    </div>
                    <div className="ms-3">
                      <p className="mb-1 fw-medium">Your bid was accepted</p>
                      <p className="text-muted small mb-0">1 day ago</p>
                    </div>
                  </div>
                  
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <div className="bg-warning bg-opacity-10 p-2 rounded-circle">
                        <i className="fas fa-exclamation-triangle text-warning"></i>
                      </div>
                    </div>
                    <div className="ms-3">
                      <p className="mb-1 fw-medium">Case deadline approaching</p>
                      <p className="text-muted small mb-0">3 days ago</p>
                    </div>
                  </div>
                  
                  <div className="text-center mt-3">
                    <Button variant="link" size="sm" className="text-decoration-none">
                      View All Activity <i className="fas fa-arrow-right ms-1"></i>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default DashboardPage;
