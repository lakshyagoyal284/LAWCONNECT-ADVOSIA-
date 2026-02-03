import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Badge, 
  Button, 
  Spinner, 
  Tab, 
  Nav, 
  Table,
  ListGroup,
  Alert,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaTrash, 
  FaFilePdf, 
  FaFileWord, 
  FaFileImage, 
  FaFileAlt,
  FaPaperclip,
  FaClock,
  FaUser,
  FaDollarSign,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaCommentDots,
  FaHistory
} from 'react-icons/fa';

const AdminCaseDetail = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [caseData, setCaseData] = useState(null);
  const [error, setError] = useState('');

  // Mock data - in a real app, this would come from an API
  const mockCaseData = {
    _id: caseId,
    title: 'Divorce Settlement',
    client: { 
      _id: '1', 
      name: 'John Doe', 
      email: 'john@example.com',
      phone: '+1 555-123-4567',
      address: '123 Main St, Anytown, USA'
    },
    lawyer: { 
      _id: 'l1', 
      name: 'Jane Smith',
      email: 'jane@lawfirm.com',
      phone: '+1 555-987-6543',
      specialization: 'Family Law',
      rating: 4.8
    },
    category: 'Family Law',
    status: 'in_progress',
    budget: 2500,
    description: 'Need assistance with divorce settlement and child custody agreement. The client is looking for an amicable separation with fair distribution of assets and shared custody of two children.',
    priority: 'high',
    isUrgent: true,
    deadline: '2023-12-31',
    createdAt: '2023-10-15T10:30:00Z',
    updatedAt: '2023-11-20T14:15:00Z',
    documents: [
      { id: 'doc1', name: 'Marriage_Certificate.pdf', size: '2.4 MB', type: 'pdf', uploaded: '2023-11-10' },
      { id: 'doc2', name: 'Financial_Statement.pdf', size: '1.8 MB', type: 'pdf', uploaded: '2023-11-12' },
      { id: 'doc3', name: 'Child_Custody_Agreement.docx', size: '0.8 MB', type: 'doc', uploaded: '2023-11-15' }
    ],
    bids: [
      { 
        id: 'bid1', 
        lawyer: { name: 'Robert Johnson', id: 'l2' },
        amount: 3000,
        proposal: 'I have extensive experience in family law and can help you navigate this difficult time.',
        status: 'rejected',
        submittedAt: '2023-10-18T11:20:00Z'
      },
      { 
        id: 'bid2', 
        lawyer: { name: 'Emily Davis', id: 'l3' },
        amount: 2800,
        proposal: 'I specialize in amicable divorces and can help you reach a fair settlement.',
        status: 'accepted',
        submittedAt: '2023-10-17T09:45:00Z'
      }
    ],
    messages: [
      {
        id: 'msg1',
        sender: { id: '1', name: 'John Doe', role: 'client' },
        content: 'Hi Jane, I wanted to check if you received the additional documents I sent yesterday?',
        timestamp: '2023-11-18T10:30:00Z',
        read: true
      },
      {
        id: 'msg2',
        sender: { id: 'l1', name: 'Jane Smith', role: 'lawyer' },
        content: 'Yes, I received them. I\'m reviewing everything now and will get back to you with an update by tomorrow.',
        timestamp: '2023-11-18T11:15:00Z',
        read: true
      }
    ],
    timeline: [
      {
        id: 't1',
        action: 'case_created',
        description: 'Case was created',
        timestamp: '2023-10-15T10:30:00Z',
        user: { name: 'System' }
      },
      {
        id: 't2',
        action: 'bid_submitted',
        description: 'Bid submitted by Emily Davis',
        timestamp: '2023-10-17T09:45:00Z',
        user: { name: 'Emily Davis' }
      },
      {
        id: 't3',
        action: 'bid_accepted',
        description: 'Bid accepted from Emily Davis',
        timestamp: '2023-10-20T14:20:00Z',
        user: { name: 'John Doe' }
      },
      {
        id: 't4',
        action: 'document_uploaded',
        description: 'Marriage Certificate uploaded',
        timestamp: '2023-11-10T15:10:00Z',
        user: { name: 'John Doe' }
      }
    ]
  };

  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call
        // const { data } = await axios.get(`/api/cases/${caseId}`);
        
        // Simulate API call
        setTimeout(() => {
          setCaseData(mockCaseData);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching case:', err);
        setError('Failed to load case data. Please try again.');
        setLoading(false);
      }
    };

    fetchCaseData();
  }, [caseId]);

  const handleDeleteCase = async () => {
    if (window.confirm('Are you sure you want to delete this case? This action cannot be undone.')) {
      try {
        // In a real app, this would be an API call
        // await axios.delete(`/api/cases/${caseId}`);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Redirect to cases list
        navigate('/admin/cases');
      } catch (err) {
        console.error('Error deleting case:', err);
        setError('Failed to delete case. Please try again.');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <Badge bg="warning" text="dark">Open</Badge>;
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

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'low':
        return <Badge bg="secondary">Low</Badge>;
      case 'medium':
        return <Badge bg="primary">Medium</Badge>;
      case 'high':
        return <Badge bg="danger">High</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf':
        return <FaFilePdf className="text-danger me-2" />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="text-primary me-2" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FaFileImage className="text-success me-2" />;
      default:
        return <FaFileAlt className="text-secondary me-2" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderOverviewTab = () => (
    <Row>
      <Col md={8}>
        <Card className="mb-4">
          <Card.Header className="bg-light">
            <h5 className="mb-0">Case Details</h5>
          </Card.Header>
          <Card.Body>
            <div className="mb-4">
              <h4>{caseData.title}</h4>
              <div className="d-flex align-items-center mb-3">
                <span className="me-3">{getStatusBadge(caseData.status)}</span>
                {caseData.isUrgent && <Badge bg="danger" className="me-3">Urgent</Badge>}
                {getPriorityBadge(caseData.priority)}
              </div>
              <p className="text-muted">
                <FaCalendarAlt className="me-2" />
                Created on {formatDate(caseData.createdAt)}
              </p>
            </div>
            
            <h5>Description</h5>
            <p className="mb-4">{caseData.description}</p>
            
            <Row className="mb-4">
              <Col md={6}>
                <h5>Client Information</h5>
                <ListGroup variant="flush">
                  <ListGroup.Item className="px-0">
                    <FaUser className="me-2 text-primary" />
                    {caseData.client.name}
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0">
                    <a href={`mailto:${caseData.client.email}`} className="text-decoration-none">
                      {caseData.client.email}
                    </a>
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0">
                    <a href={`tel:${caseData.client.phone}`} className="text-decoration-none">
                      {caseData.client.phone}
                    </a>
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              
              {caseData.lawyer && (
                <Col md={6}>
                  <h5>Assigned Lawyer</h5>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="px-0">
                      <FaUser className="me-2 text-primary" />
                      {caseData.lawyer.name}
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0">
                      <span className="badge bg-light text-dark me-2">
                        {caseData.lawyer.specialization}
                      </span>
                      <span className="text-warning">
                        {'★'.repeat(Math.floor(caseData.lawyer.rating))}
                        {'☆'.repeat(5 - Math.floor(caseData.lawyer.rating))}
                      </span>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0">
                      <a href={`mailto:${caseData.lawyer.email}`} className="text-decoration-none">
                        {caseData.lawyer.email}
                      </a>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0">
                      <a href={`tel:${caseData.lawyer.phone}`} className="text-decoration-none">
                        {caseData.lawyer.phone}
                      </a>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              )}
            </Row>
            
            <Row>
              <Col md={6}>
                <h5>Budget</h5>
                <p className="h4 text-primary">
                  <FaDollarSign className="me-2" />
                  {caseData.budget.toLocaleString()}
                </p>
              </Col>
              <Col md={6}>
                <h5>Deadline</h5>
                <p className="h5">
                  <FaCalendarAlt className="me-2 text-primary" />
                  {new Date(caseData.deadline).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={4}>
        <Card className="mb-4">
          <Card.Header className="bg-light">
            <h5 className="mb-0">Quick Actions</h5>
          </Card.Header>
          <Card.Body>
            <div className="d-grid gap-2">
              <Button 
                variant="primary" 
                as={Link} 
                to={`/admin/cases/${caseId}/edit`}
                className="mb-2"
              >
                <FaEdit className="me-2" /> Edit Case
              </Button>
              <Button 
                variant="outline-danger" 
                onClick={handleDeleteCase}
                className="mb-2"
              >
                <FaTrash className="me-2" /> Delete Case
              </Button>
              <Button variant="outline-secondary" className="mb-2">
                <FaPaperclip className="me-2" /> Add Document
              </Button>
              <Button variant="outline-secondary">
                <FaCommentDots className="me-2" /> Send Message
              </Button>
            </div>
          </Card.Body>
        </Card>
        
        <Card className="mb-4">
          <Card.Header className="bg-light">
            <h5 className="mb-0">Case Stats</h5>
          </Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                <span>Status</span>
                {getStatusBadge(caseData.status)}
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                <span>Priority</span>
                {getPriorityBadge(caseData.priority)}
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                <span>Category</span>
                <span className="badge bg-light text-dark">{caseData.category}</span>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                <span>Created</span>
                <span>{formatDate(caseData.createdAt)}</span>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between align-items-center">
                <span>Last Updated</span>
                <span>{formatDate(caseData.updatedAt)}</span>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderDocumentsTab = () => (
    <Card>
      <Card.Header className="bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Documents</h5>
        <Button variant="primary" size="sm">
          <FaUpload className="me-1" /> Upload Document
        </Button>
      </Card.Header>
      <Card.Body>
        {caseData.documents.length > 0 ? (
          <Table hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Size</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {caseData.documents.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    {getFileIcon(doc.name)}
                    {doc.name}
                  </td>
                  <td>{doc.size}</td>
                  <td>{formatDate(doc.uploaded)}</td>
                  <td>
                    <Button variant="link" size="sm" className="p-0 me-2">
                      <FaFileAlt className="text-primary" />
                    </Button>
                    <Button variant="link" size="sm" className="p-0 text-danger">
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="text-center py-5">
            <FaFileAlt size={48} className="text-muted mb-3" />
            <h5>No documents found</h5>
            <p className="text-muted">Upload documents to keep them organized with this case.</p>
            <Button variant="primary">
              <FaUpload className="me-2" /> Upload Document
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  const renderBidsTab = () => (
    <Card>
      <Card.Header className="bg-light">
        <h5 className="mb-0">Bids & Proposals</h5>
      </Card.Header>
      <Card.Body>
        {caseData.bids.length > 0 ? (
          caseData.bids.map((bid) => (
            <Card key={bid.id} className={`mb-3 ${bid.status === 'accepted' ? 'border-success' : ''}`}>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <div>
                    <h6 className="mb-1">{bid.lawyer.name}</h6>
                    <p className="text-muted small mb-2">Submitted on {formatDate(bid.submittedAt)}</p>
                  </div>
                  <div className="text-end">
                    <h5 className="text-primary mb-1">${bid.amount.toLocaleString()}</h5>
                    {bid.status === 'accepted' ? (
                      <Badge bg="success">Accepted</Badge>
                    ) : bid.status === 'rejected' ? (
                      <Badge bg="danger">Rejected</Badge>
                    ) : (
                      <Badge bg="warning" text="dark">Pending</Badge>
                    )}
                  </div>
                </div>
                <p className="mb-0">{bid.proposal}</p>
              </Card.Body>
              {bid.status === 'pending' && (
                <Card.Footer className="bg-light d-flex justify-content-end gap-2">
                  <Button variant="outline-success" size="sm">Accept</Button>
                  <Button variant="outline-danger" size="sm">Reject</Button>
                </Card.Footer>
              )}
            </Card>
          ))
        ) : (
          <div className="text-center py-5">
            <FaFileAlt size={48} className="text-muted mb-3" />
            <h5>No bids yet</h5>
            <p className="text-muted">No lawyers have submitted bids for this case yet.</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  const renderMessagesTab = () => (
    <Card>
      <Card.Header className="bg-light">
        <h5 className="mb-0">Messages</h5>
      </Card.Header>
      <Card.Body>
        {caseData.messages.length > 0 ? (
          <div className="chat-messages" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {caseData.messages.map((message) => (
              <div 
                key={message.id} 
                className={`d-flex mb-4 ${message.sender.role === 'lawyer' ? 'justify-content-end' : ''}`}
              >
                <div 
                  className={`p-3 rounded-3 ${message.sender.role === 'lawyer' ? 'bg-primary text-white' : 'bg-light'}`}
                  style={{ maxWidth: '70%' }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>{message.sender.name}</strong>
                    <small className={`ms-3 ${message.sender.role === 'lawyer' ? 'text-white-50' : 'text-muted'}`}>
                      {formatDate(message.timestamp)}
                    </small>
                  </div>
                  <p className="mb-0">{message.content}</p>
                </div>
              </div>
            ))}
            
            <div className="mt-4">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    placeholder="Type your message here..."
                  />
                </Form.Group>
                <div className="d-flex justify-content-between">
                  <div>
                    <Button variant="outline-secondary" size="sm" className="me-2">
                      <FaPaperclip className="me-1" /> Attach
                    </Button>
                  </div>
                  <Button variant="primary">
                    Send Message
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        ) : (
          <div className="text-center py-5">
            <FaCommentDots size={48} className="text-muted mb-3" />
            <h5>No messages yet</h5>
            <p className="text-muted">Start a conversation with the client or lawyer.</p>
            <Button variant="primary">
              <FaCommentDots className="me-2" /> New Message
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  const renderTimelineTab = () => (
    <Card>
      <Card.Header className="bg-light">
        <h5 className="mb-0">Case Timeline</h5>
      </Card.Header>
      <Card.Body>
        <div className="timeline">
          {caseData.timeline.map((event, index) => (
            <div key={event.id} className="timeline-item">
              <div className="timeline-badge">
                {event.action === 'case_created' && <FaCheckCircle className="text-success" />}
                {event.action === 'bid_submitted' && <FaFileAlt className="text-primary" />}
                {event.action === 'bid_accepted' && <FaCheckCircle className="text-success" />}
                {event.action === 'document_uploaded' && <FaPaperclip className="text-info" />}
              </div>
              <div className="timeline-content">
                <div className="d-flex justify-content-between">
                  <h6>{event.description}</h6>
                  <small className="text-muted">
                    {formatDate(event.timestamp)}
                  </small>
                </div>
                <p className="text-muted small mb-0">
                  by {event.user.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading case details...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <FaExclamationTriangle className="me-2" />
          {error}
        </Alert>
        <Button variant="outline-primary" onClick={() => window.location.reload()}>
          <FaRefresh className="me-2" />
          Try Again
        </Button>
      </Container>
    );
  }

  if (!caseData) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <FaExclamationTriangle className="me-2" />
          Case not found or you don't have permission to view it.
        </Alert>
        <Button variant="outline-primary" onClick={() => navigate('/admin/cases')}>
          <FaArrowLeft className="me-2" />
          Back to Cases
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate('/admin/cases')}
            className="me-3"
          >
            <FaArrowLeft className="me-2" /> Back to Cases
          </Button>
          <h2 className="d-inline-block mb-0">{caseData.title}</h2>
        </div>
        <div>
          <Button 
            variant="outline-primary" 
            as={Link} 
            to={`/admin/cases/${caseId}/edit`}
            className="me-2"
          >
            <FaEdit className="me-2" /> Edit Case
          </Button>
          <Button 
            variant="outline-danger"
            onClick={handleDeleteCase}
          >
            <FaTrash className="me-2" /> Delete
          </Button>
        </div>
      </div>
      
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="overview">Overview</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="documents">
              Documents {caseData.documents.length > 0 && `(${caseData.documents.length})`}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="bids">
              Bids & Proposals {caseData.bids.length > 0 && `(${caseData.bids.length})`}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="messages">
              Messages {caseData.messages.length > 0 && `(${caseData.messages.length})`}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="timeline">
              <FaHistory className="me-1" /> Timeline
            </Nav.Link>
          </Nav.Item>
        </Nav>
        
        <Tab.Content>
          <Tab.Pane eventKey="overview">
            {renderOverviewTab()}
          </Tab.Pane>
          <Tab.Pane eventKey="documents">
            {renderDocumentsTab()}
          </Tab.Pane>
          <Tab.Pane eventKey="bids">
            {renderBidsTab()}
          </Tab.Pane>
          <Tab.Pane eventKey="messages">
            {renderMessagesTab()}
          </Tab.Pane>
          <Tab.Pane eventKey="timeline">
            {renderTimelineTab()}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
      
      <style jsx global>{`
        .timeline {
          position: relative;
          padding-left: 30px;
        }
        
        .timeline-item {
          position: relative;
          padding-bottom: 20px;
          border-left: 2px solid #dee2e6;
          padding-left: 20px;
        }
        
        .timeline-item:last-child {
          border-left-color: transparent;
        }
        
        .timeline-badge {
          position: absolute;
          left: -11px;
          top: 0;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #0d6efd;
        }
        
        .timeline-content {
          margin-left: 10px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 6px;
          margin-bottom: 10px;
        }
        
        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }
        
        .chat-messages::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        .chat-messages::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }
      `}</style>
    </Container>
  );
};

export default AdminCaseDetail;
