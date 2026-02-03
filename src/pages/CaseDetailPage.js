import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col, Badge, ListGroup, Alert, Spinner, Modal, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { caseService, bidService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import WorkingChatComponent from '../components/chat/WorkingChatComponent';
import DevPaymentModal from '../components/payment/DevPaymentModal';
import { paymentService } from '../services/paymentService';
import { MessageSquare, CreditCard, Lock } from 'lucide-react';

const CaseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [caseData, setCaseData] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acceptedBid, setAcceptedBid] = useState(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasChatAccess, setHasChatAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(false);
  const [bidForm, setBidForm] = useState({
    amount: '',
    message: ''
  });

  useEffect(() => {
    fetchCaseDetails();
    fetchBids();
  }, [id]);

  const fetchCaseDetails = async () => {
    try {
      setLoading(true);
      const response = await caseService.getById(id);
      setCaseData(response.data);
    } catch (err) {
      setError('Failed to fetch case details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      const response = await bidService.getByCase(id);
      console.log('Bids data:', response.data);
      setBids(response.data);
      
      // Check if there's already an accepted bid
      const existingAccepted = response.data.find(bid => bid.status === 'accepted');
      if (existingAccepted) {
        console.log('Found existing accepted bid:', existingAccepted);
        setAcceptedBid(existingAccepted);
      }
    } catch (err) {
      console.error('Failed to fetch bids:', err);
    }
  };

  const handleDeleteCase = async () => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      try {
        await caseService.delete(id);
        navigate('/cases');
      } catch (err) {
        setError('Failed to delete case');
        console.error(err);
      }
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!bidForm.amount || !bidForm.message) {
      setError('Please fill in all bid fields');
      return;
    }

    try {
      await bidService.create({
        case_id: id,
        amount: parseFloat(bidForm.amount),
        message: bidForm.message
      });
      
      setShowBidModal(false);
      setBidForm({ amount: '', message: '' });
      fetchBids(); // Refresh bids list
    } catch (err) {
      setError('Failed to submit bid');
      console.error(err);
    }
  };

  const handleAcceptBid = async (bidId) => {
    try {
      await bidService.accept(bidId);
      
      // Find the accepted bid
      const accepted = bids.find(bid => bid.id === bidId);
      console.log('Accepted bid:', accepted);
      setAcceptedBid(accepted);
      
      fetchCaseDetails(); // Refresh case details
      fetchBids(); // Refresh bids
      setError('');
    } catch (err) {
      setError('Failed to accept bid: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const checkChatAccess = async () => {
    if (!acceptedBid || user?.role !== 'client') {
      setHasChatAccess(true); // Lawyers don't need to pay
      return;
    }

    try {
      setCheckingAccess(true);
      const response = await paymentService.checkChatAccess(id);
      setHasChatAccess(response.data.hasChatAccess);
    } catch (error) {
      console.error('Error checking chat access:', error);
      setHasChatAccess(false);
    } finally {
      setCheckingAccess(false);
    }
  };

  const handleChatClick = () => {
    if (user?.role === 'client' && !hasChatAccess) {
      setShowPaymentModal(true);
    } else {
      setShowChatModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    setHasChatAccess(true);
    setShowPaymentModal(false);
    setShowChatModal(true);
  };

  // Check chat access when accepted bid changes
  useEffect(() => {
    if (acceptedBid) {
      checkChatAccess();
    }
  }, [acceptedBid]);

  const getStatusBadge = (status) => {
    const variant = {
      'open': 'primary',
      'in_progress': 'warning',
      'closed': 'success'
    }[status] || 'secondary';
    
    return <Badge bg={variant}>{status.replace('_', ' ').toUpperCase()}</Badge>;
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" />
        <p className="mt-2">Loading case details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
        <Button variant="outline-secondary" onClick={() => navigate('/cases')}>
          Back to Cases
        </Button>
      </Container>
    );
  }

  if (!caseData) {
    return (
      <Container className="py-4">
        <Alert variant="info">Case not found</Alert>
        <Button variant="outline-secondary" onClick={() => navigate('/cases')}>
          Back to Cases
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-3">
        ← Back to Cases
      </Button>
      
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h2>{caseData.title} <small className="text-muted">#{caseData.id}</small></h2>
              <div className="d-flex gap-2 mb-2">
                {getStatusBadge(caseData.status)}
                <Badge bg="info" className="fs-6">{caseData.category}</Badge>
              </div>
            </div>
            {(user?.role === 'admin' || caseData.user_id === user?.id) && (
              <div className="d-flex gap-2">
                <Button variant="outline-primary" size="sm">
                  Edit Case
                </Button>
                <Button variant="outline-danger" size="sm" onClick={handleDeleteCase}>
                  Delete
                </Button>
              </div>
            )}
          </div>
          
          <Card.Text className="mb-4">
            {caseData.description}
          </Card.Text>
          
          <div className="text-muted small">
            <strong>Opened on:</strong> {new Date(caseData.created_at).toLocaleDateString()}
            {caseData.updated_at !== caseData.created_at && (
              <span className="ms-3">
                <strong>Last updated:</strong> {new Date(caseData.updated_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </Card.Body>
      </Card>

      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Case Information</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Category:</strong> {caseData.category}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Status:</strong> {getStatusBadge(caseData.status)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Created:</strong> {new Date(caseData.created_at).toLocaleDateString()}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Budget:</strong> {caseData.currency} {parseFloat(caseData.budget || 0).toLocaleString()}
                </ListGroup.Item>
                {caseData.updated_at !== caseData.created_at && (
                  <ListGroup.Item>
                    <strong>Last Updated:</strong> {new Date(caseData.updated_at).toLocaleDateString()}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>

          {bids.length > 0 && (
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Bids ({bids.length})</Card.Title>
                <ListGroup variant="flush">
                  {bids.map((bid) => (
                    <ListGroup.Item key={bid.id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold">{bid.lawyer_name}</div>
                        <div className="text-muted small">{bid.lawyer_email}</div>
                        <div className="text-success fw-bold">{bid.currency || 'USD'} {bid.amount}</div>
                        <div className="small mt-2">{bid.message}</div>
                        <Badge bg={
                          bid.status === 'accepted' ? 'success' : 
                          bid.status === 'rejected' ? 'danger' : 'primary'
                        }>
                          {bid.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="d-flex gap-2 flex-column">
                        {user?.role === 'client' && caseData.user_id === user?.id && caseData.status === 'open' && (
                          <div className="d-flex gap-2">
                            {bid.status === 'pending' && (
                              <Button 
                                size="sm" 
                                variant="success"
                                onClick={() => handleAcceptBid(bid.id)}
                              >
                                Accept
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline-danger"
                              onClick={() => bidService.reject(bid.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                        {/* Chat button - show for accepted bids */}
                        {bid.status === 'accepted' && (
                          <Button 
                            size="sm" 
                            variant="primary"
                            onClick={handleChatClick}
                            disabled={checkingAccess}
                            className="d-flex align-items-center"
                          >
                            {checkingAccess ? (
                              <Spinner animation="border" size="sm" className="me-1" />
                            ) : user?.role === 'client' && !hasChatAccess ? (
                              <CreditCard size={14} className="me-1" />
                            ) : (
                              <MessageSquare size={14} className="me-1" />
                            )}
                            {user?.role === 'client' && !hasChatAccess ? 'Pay to Chat (₹150)' : 'Chat'}
                          </Button>
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          )}
        </Col>
        
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Actions</Card.Title>
              <div className="d-grid gap-2">
                {user?.role === 'client' && caseData.status === 'open' && (
                  <Button variant="primary" onClick={() => setShowBidModal(true)}>
                    <i className="bi bi-chat-left-text me-2"></i>View Bids
                  </Button>
                )}
                {user?.role === 'lawyer' && caseData.status === 'open' && (
                  <Button variant="success" onClick={() => setShowBidModal(true)}>
                    <i className="bi bi-hand-thumbs-up me-2"></i>Submit Bid
                  </Button>
                )}
                <Button variant="outline-secondary">
                  <i className="bi bi-download me-2"></i>Download Case Details
                </Button>
                {(user?.role === 'admin' || caseData.user_id === user?.id) && caseData.status !== 'closed' && (
                  <Button variant="outline-danger">
                    <i className="bi bi-x-circle me-2"></i>Close Case
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Body>
              <Card.Title>Quick Info</Card.Title>
              <div className="small text-muted">
                <p className="mb-2">
                  <strong>Case ID:</strong> #{caseData.id}
                </p>
                <p className="mb-2">
                  <strong>Type:</strong> {caseData.category}
                </p>
                <p className="mb-0">
                  <strong>Status:</strong> {caseData.status.replace('_', ' ').toUpperCase()}
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bid Modal */}
      <Modal show={showBidModal} onHide={() => setShowBidModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {user?.role === 'lawyer' ? 'Submit Bid' : 'View Bids'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {user?.role === 'lawyer' ? (
            <Form onSubmit={handleBidSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Bid Amount ({caseData.currency || 'USD'})*</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="1"
                  name="amount"
                  value={bidForm.amount}
                  onChange={(e) => setBidForm({...bidForm, amount: e.target.value})}
                  placeholder={`Enter your bid amount in ${caseData.currency || 'USD'}`}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Bid Message *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="message"
                  value={bidForm.message}
                  onChange={(e) => setBidForm({...bidForm, message: e.target.value})}
                  placeholder="Describe your approach and experience..."
                  required
                />
              </Form.Group>
              
              <Button variant="primary" type="submit">
                Submit Bid
              </Button>
            </Form>
          ) : (
            <div>
              <h5>All Bids for this Case:</h5>
              {bids.length === 0 ? (
                <p className="text-muted">No bids submitted yet.</p>
              ) : (
                <ListGroup variant="flush">
                  {bids.map((bid) => (
                    <ListGroup.Item key={bid.id}>
                      <div className="fw-bold">{bid.lawyer_name}</div>
                      <div className="text-success">${bid.amount}</div>
                      <div className="small">{bid.message}</div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Chat Modal */}
      <Modal 
        show={showChatModal} 
        onHide={() => setShowChatModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <MessageSquare size={20} className="me-2" />
            Chat - {caseData?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {acceptedBid ? (
            <WorkingChatComponent
              caseId={id}
              caseTitle={caseData?.title}
              receiverId={user?.role === 'client' ? acceptedBid.lawyer_id : caseData?.user_id}
              receiverName={user?.role === 'client' ? acceptedBid.lawyer_name : caseData?.client_name || 'Client'}
            />
          ) : (
            <div className="p-4 text-center text-muted">
              <p>No accepted bid found for chat.</p>
              <small>Please accept a bid to start chatting.</small>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Payment Modal */}
      <DevPaymentModal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        caseId={id}
        bidId={acceptedBid?.id}
        caseTitle={caseData?.title}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </Container>
  );
};

export default CaseDetailPage;
