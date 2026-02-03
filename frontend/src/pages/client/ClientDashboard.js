import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { 
  FaPlus, 
  FaSearch, 
  FaFileAlt, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaUserTie,
  FaComments,
  FaDollarSign,
  FaCalendarAlt
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const navigate = useNavigate();

  // Mock data - in a real app, this would come from an API
  const [cases, setCases] = useState([
    {
      id: 'c1',
      title: 'Divorce Settlement',
      status: 'in_progress',
      category: 'Family Law',
      description: 'Need assistance with divorce settlement and child custody agreement.',
      budget: 3000,
      deadline: '2023-12-31',
      bids: 3,
      messages: 5,
      createdAt: '2023-11-15T10:30:00Z',
      documents: ['marriage_certificate.pdf', 'financial_info.pdf']
    },
    {
      id: 'c2',
      title: 'Business Contract Review',
      status: 'pending',
      category: 'Corporate Law',
      description: 'Need legal review of a vendor contract for my small business.',
      budget: 1500,
      deadline: '2023-12-15',
      bids: 0,
      messages: 0,
      createdAt: '2023-11-20T14:15:00Z',
      documents: ['contract_draft.docx']
    },
    {
      id: 'c3',
      title: 'Real Estate Purchase',
      status: 'completed',
      category: 'Real Estate',
      description: 'Legal assistance for residential property purchase.',
      budget: 2500,
      deadline: '2023-10-30',
      bids: 5,
      messages: 12,
      completedAt: '2023-11-05T16:20:00Z',
      documents: ['purchase_agreement.pdf', 'inspection_report.pdf']
    }
  ]);

  useEffect(() => {
    // In a real app, fetch cases from API
    const fetchCases = async () => {
      try {
        // const response = await axios.get('/api/cases/my-cases');
        // setCases(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cases:', err);
        setError('Failed to load your cases. Please try again later.');
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning" className="text-dark">Pending</Badge>;
      case 'in_progress':
        return <Badge bg="info">In Progress</Badge>;
      case 'completed':
        return <Badge bg="success">Completed</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredCases = cases.filter(caseItem => {
    if (activeTab === 'active') {
      return ['pending', 'in_progress'].includes(caseItem.status);
    } else if (activeTab === 'completed') {
      return caseItem.status === 'completed';
    }
    return true;
  });

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading your dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Cases</h2>
        <Button 
          variant="primary" 
          onClick={() => navigate('/client/cases/new')}
        >
          <FaPlus className="me-2" /> New Case
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          <FaExclamationTriangle className="me-2" />
          {error}
        </Alert>
      )}

      <Row className="mb-4">
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <h3 className="text-primary">
                {cases.filter(c => c.status === 'in_progress').length}
              </h3>
              <p className="text-muted mb-0">Active Cases</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <h3 className="text-success">
                {cases.filter(c => c.status === 'completed').length}
              </h3>
              <p className="text-muted mb-0">Completed Cases</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <h3>
                {cases.reduce((total, c) => total + c.bids, 0)}
              </h3>
              <p className="text-muted mb-0">Total Bids Received</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Header className="bg-white border-bottom-0">
          <div className="d-flex justify-content-between align-items-center">
            <div className="btn-group" role="group">
              <Button
                variant={activeTab === 'active' ? 'primary' : 'outline-secondary'}
                onClick={() => setActiveTab('active')}
                className="me-2"
              >
                Active Cases
              </Button>
              <Button
                variant={activeTab === 'completed' ? 'primary' : 'outline-secondary'}
                onClick={() => setActiveTab('completed')}
              >
                Completed Cases
              </Button>
            </div>
            <div className="w-25">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search cases..."
                  // Add search functionality here
                />
              </div>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          {filteredCases.length === 0 ? (
            <div className="text-center py-5">
              <FaFileAlt size={48} className="text-muted mb-3" />
              <h4>No {activeTab === 'active' ? 'active' : 'completed'} cases found</h4>
              <p className="text-muted">
                {activeTab === 'active' 
                  ? 'You don\'t have any active cases. Create a new case to get started.'
                  : 'Your completed cases will appear here.'}
              </p>
              {activeTab === 'active' && (
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/client/cases/new')}
                >
                  <FaPlus className="me-2" /> Create New Case
                </Button>
              )}
            </div>
          ) : (
            <div className="list-group">
              {filteredCases.map(caseItem => (
                <div key={caseItem.id} className="list-group-item list-group-item-action">
                  <div className="d-flex w-100 justify-content-between">
                    <div>
                      <h5 className="mb-1">
                        <Link 
                          to={`/client/cases/${caseItem.id}`} 
                          className="text-decoration-none"
                        >
                          {caseItem.title}
                        </Link>
                        <span className="ms-2">
                          {getStatusBadge(caseItem.status)}
                        </span>
                      </h5>
                      <p className="mb-1">{caseItem.description}</p>
                      <div className="d-flex align-items-center text-muted small">
                        <span className="me-3">
                          <FaDollarSign className="me-1" />
                          Budget: ${caseItem.budget.toLocaleString()}
                        </span>
                        <span className="me-3">
                          <FaCalendarAlt className="me-1" />
                          Deadline: {formatDate(caseItem.deadline)}
                        </span>
                        {caseItem.status === 'in_progress' && (
                          <span className="me-3">
                            <FaUserTie className="me-1" />
                            {caseItem.bids} {caseItem.bids === 1 ? 'lawyer' : 'lawyers'} interested
                          </span>
                        )}
                        {caseItem.messages > 0 && (
                          <span>
                            <FaComments className="me-1" />
                            {caseItem.messages} {caseItem.messages === 1 ? 'message' : 'messages'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-end">
                      <small className="text-muted">
                        Created: {formatDate(caseItem.createdAt)}
                      </small>
                      <div className="mt-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          as={Link}
                          to={`/client/cases/${caseItem.id}`}
                          className="me-2"
                        >
                          View Details
                        </Button>
                        {caseItem.status === 'pending' && (
                          <Button variant="outline-danger" size="sm">
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Activity</h5>
            </Card.Header>
            <Card.Body>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-badge bg-primary">
                    <FaFileAlt />
                  </div>
                  <div className="timeline-content">
                    <p className="mb-0">
                      <strong>Divorce Settlement</strong> - New bid received from Jane Smith
                    </p>
                    <small className="text-muted">2 hours ago</small>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-badge bg-success">
                    <FaCheckCircle />
                  </div>
                  <div className="timeline-content">
                    <p className="mb-0">
                      <strong>Business Contract Review</strong> - Case submitted for review
                    </p>
                    <small className="text-muted">1 day ago</small>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-badge bg-info">
                    <FaUserTie />
                  </div>
                  <div className="timeline-content">
                    <p className="mb-0">
                      <strong>Real Estate Purchase</strong> - Lawyer assigned: Robert Johnson
                    </p>
                    <small className="text-muted">3 days ago</small>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Upcoming Deadlines</h5>
                <Button variant="link" size="sm">View All</Button>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="list-group">
                {cases
                  .filter(c => c.status === 'in_progress')
                  .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                  .slice(0, 3)
                  .map(caseItem => (
                    <div key={caseItem.id} className="list-group-item border-0 px-0">
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">{caseItem.title}</h6>
                        <small className="text-muted">
                          {formatDate(caseItem.deadline)}
                        </small>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          {caseItem.category}
                        </small>
                        <Badge bg="warning" text="dark">
                          {Math.ceil((new Date(caseItem.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days left
                        </Badge>
                      </div>
                    </div>
                  ))}
                {cases.filter(c => c.status === 'in_progress').length === 0 && (
                  <div className="text-center py-3">
                    <FaCheckCircle size={32} className="text-muted mb-2" />
                    <p className="mb-0">No upcoming deadlines</p>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style jsx>{`
        .timeline {
          position: relative;
          padding-left: 30px;
        }
        
        .timeline-item {
          position: relative;
          padding-bottom: 15px;
          margin-bottom: 15px;
          border-left: 2px solid #dee2e6;
          padding-left: 20px;
        }
        
        .timeline-item:last-child {
          border-left-color: transparent;
        }
        
        .timeline-badge {
          position: absolute;
          left: -10px;
          top: 0;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        
        .timeline-content {
          margin-left: 15px;
        }
      `}</style>
    </Container>
  );
};

export default ClientDashboard;
