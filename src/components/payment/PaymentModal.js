import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { paymentService } from '../../services/paymentService';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';

const PaymentModal = ({ show, onHide, caseId, bidId, caseTitle, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [paymentCreated, setPaymentCreated] = useState(null);
  const [error, setError] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const amount = 150; // Fixed amount for chat access
  const amountInPaise = amount * 100; // Razorpay uses paise

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCreatePayment = async () => {
    try {
      setLoading(true);
      setError('');
      
      const paymentData = {
        caseId,
        bidId,
        amount
      };
      
      const response = await paymentService.createChatPayment(paymentData);
      setPaymentCreated(response.data.payment);
      
      // Initialize Razorpay after payment creation
      initializeRazorpay(response.data.payment);
      
    } catch (error) {
      console.error('Error creating payment:', error);
      setError(error.response?.data?.message || 'Failed to create payment');
    } finally {
      setLoading(false);
    }
  };

  const initializeRazorpay = (payment) => {
    const options = {
      key: 'rzp_test_1DP5mmOlF5G5ag', // Replace with your live Razorpay key
      amount: amountInPaise,
      currency: 'INR',
      name: 'LawConnect',
      description: `Chat access for case: ${caseTitle}`,
      image: 'https://your-logo-url.com/logo.png', // Add your logo URL
      order_id: payment.razorpay_order_id,
      handler: async function (response) {
        // Handle successful payment
        await handlePaymentSuccess(response);
      },
      prefill: {
        name: 'Client Name', // You can prefill user data here
        email: 'client@example.com',
        contact: '9999999999'
      },
      notes: {
        case_id: caseId,
        payment_id: payment.id
      },
      theme: {
        color: '#3399cc' // Customize theme color
      },
      modal: {
        ondismiss: function() {
          setLoading(false);
          setError('Payment cancelled');
        },
        escape: false,
        backdropclose: false,
        handleback: false
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePaymentSuccess = async (response) => {
    try {
      setLoading(true);
      console.log('Payment success response:', response);
      console.log('Payment created data:', paymentCreated);
      
      // Update payment status in backend
      await paymentService.completePayment({
        payment_id: paymentCreated.id,
        status: 'success',
        payment_gateway_id: response.razorpay_payment_id,
        gateway_response: response
      });
      
      setPaymentCompleted(true);
      
      // Notify parent component
      setTimeout(() => {
        onPaymentSuccess();
        onHide();
      }, 2000);
      
    } catch (error) {
      console.error('Error completing payment:', error);
      console.error('Error response:', error.response?.data);
      setError('Payment successful but failed to update records. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!paymentCompleted) {
      setPaymentCreated(null);
      setError('');
    }
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>
          <CreditCard className="me-2" />
          Unlock Chat Access
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {paymentCompleted ? (
          <div className="text-center py-4">
            <CheckCircle className="text-success mb-3" size={64} />
            <h4 className="text-success">Payment Successful!</h4>
            <p className="text-muted">Chat access has been unlocked for this case.</p>
            <Spinner animation="border" size="sm" className="mt-2" />
            <p className="text-muted small mt-2">Redirecting to chat...</p>
          </div>
        ) : (
          <>
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

            <div className="text-center mb-3">
              <Lock className="text-muted mb-2" size={24} />
              <p className="text-muted small mb-0">
                Secure payment powered by Razorpay
              </p>
              <p className="text-muted small">
                Accepts: Credit Card, Debit Card, UPI, Net Banking, Wallets
              </p>
            </div>

            <div className="d-grid">
              <Button
                variant="primary"
                onClick={handleCreatePayment}
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="me-2" size={16} />
                    Pay ₹{amount}
                  </>
                )}
              </Button>
            </div>

            <div className="text-center mt-3">
              <small className="text-muted">
                <strong>Real Payment:</strong> You will be charged ₹150 for chat access
              </small>
              <div className="mt-2">
                <small className="text-muted">
                  All payments are secure and processed by Razorpay
                </small>
              </div>
            </div>
          </>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          {paymentCompleted ? 'Close' : 'Cancel'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;
