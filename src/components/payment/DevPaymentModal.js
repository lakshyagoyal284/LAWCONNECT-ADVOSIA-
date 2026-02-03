import React, { useState } from 'react';
import { Modal, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { CreditCard, Lock, CheckCircle, Smartphone, QrCode } from 'lucide-react';

const DevPaymentModal = ({ show, onHide, caseId, bidId, caseTitle, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const amount = 150;

  const handlePayment = async (method) => {
    try {
      setLoading(true);
      setError('');
      setPaymentMethod(method);

      // Simulate payment processing based on method
      await new Promise(resolve => setTimeout(resolve, 2000));

      setPaymentCompleted(true);
      
      // Notify parent component
      setTimeout(() => {
        onPaymentSuccess();
        onHide();
      }, 2000);
      
    } catch (error) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!paymentCompleted) {
      setPaymentMethod('');
      setError('');
    }
    onHide();
  };

  if (paymentCompleted) {
    return (
      <Modal show={show} onHide={handleClose} centered size="md">
        <Modal.Body className="text-center py-4">
          <CheckCircle className="text-success mb-3" size={64} />
          <h4 className="text-success">Payment Successful!</h4>
          <p className="text-muted">Chat access has been unlocked for this case.</p>
          <Spinner animation="border" size="sm" className="mt-2" />
          <p className="text-muted small mt-2">Redirecting to chat...</p>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <CreditCard className="me-2" />
          Unlock Chat Access - ₹{amount}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Card className="mb-3 border-primary">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold">Case:</span>
              <span>{caseTitle}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold">Service:</span>
              <span>Chat Access</span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-bold">Amount:</span>
              <span className="h4 text-primary mb-0">₹{amount}</span>
            </div>
          </Card.Body>
        </Card>

        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <h5 className="mb-3">Choose Payment Method:</h5>
        
        <div className="row g-3">
          {/* Credit/Debit Card */}
          <div className="col-md-6">
            <Card 
              className="payment-option h-100" 
              style={{ cursor: 'pointer' }}
              onClick={() => !loading && handlePayment('card')}
            >
              <Card.Body className="text-center">
                <CreditCard className="text-primary mb-2" size={32} />
                <h6>Credit/Debit Card</h6>
                <small className="text-muted">Visa, Mastercard, Rupay</small>
              </Card.Body>
            </Card>
          </div>

          {/* UPI */}
          <div className="col-md-6">
            <Card 
              className="payment-option h-100" 
              style={{ cursor: 'pointer' }}
              onClick={() => !loading && handlePayment('upi')}
            >
              <Card.Body className="text-center">
                <Smartphone className="text-success mb-2" size={32} />
                <h6>UPI</h6>
                <small className="text-muted">GPay, PhonePe, Paytm</small>
              </Card.Body>
            </Card>
          </div>

          {/* QR Code */}
          <div className="col-md-6">
            <Card 
              className="payment-option h-100" 
              style={{ cursor: 'pointer' }}
              onClick={() => !loading && handlePayment('qr')}
            >
              <Card.Body className="text-center">
                <QrCode className="text-info mb-2" size={32} />
                <h6>QR Code</h6>
                <small className="text-muted">Scan & Pay</small>
              </Card.Body>
            </Card>
          </div>

          {/* Net Banking */}
          <div className="col-md-6">
            <Card 
              className="payment-option h-100" 
              style={{ cursor: 'pointer' }}
              onClick={() => !loading && handlePayment('netbanking')}
            >
              <Card.Body className="text-center">
                <Lock className="text-warning mb-2" size={32} />
                <h6>Net Banking</h6>
                <small className="text-muted">All major banks</small>
              </Card.Body>
            </Card>
          </div>
        </div>

        {loading && (
          <div className="text-center mt-3">
            <Spinner animation="border" />
            <p className="mt-2">Processing {paymentMethod} payment...</p>
          </div>
        )}

        <div className="text-center mt-3">
          <small className="text-muted">
            <strong>Development Mode:</strong> This simulates real payment processing
          </small>
          <div className="mt-2">
            <small className="text-muted">
              For production, configure Razorpay API keys
            </small>
          </div>
        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DevPaymentModal;
