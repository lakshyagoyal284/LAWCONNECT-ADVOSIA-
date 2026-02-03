import React, { useEffect, useState } from 'react';
import { Container, Card, Alert, Button, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const PaymentSuccessPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { paymentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle payment success
    const urlParams = new URLSearchParams(window.location.search);
    const razorpay_payment_id = urlParams.get('razorpay_payment_id');
    const razorpay_order_id = urlParams.get('razorpay_order_id');
    const razorpay_signature = urlParams.get('razorpay_signature');

    console.log('Payment success params:', {
      paymentId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    });

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [paymentId]);

  const handleBackToCases = () => {
    navigate('/cases');
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" size="lg" />
        <p className="mt-3">Processing payment...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="max-w-md mx-auto">
        <Card className="text-center p-4">
          <div className="mb-4">
            <CheckCircle className="text-success" size={64} />
          </div>
          
          <Card.Title className="text-success mb-3">
            Payment Successful!
          </Card.Title>
          
          <Card.Text className="mb-4">
            Your chat access has been unlocked. You can now communicate with your lawyer.
          </Card.Text>

          {error && (
            <Alert variant="warning" className="mb-4">
              {error}
            </Alert>
          )}

          <div className="d-grid gap-2">
            <Button variant="primary" onClick={handleBackToCases}>
              <ArrowLeft size={16} className="me-2" />
              Back to Cases
            </Button>
          </div>

          <div className="mt-3">
            <small className="text-muted">
              Payment ID: {paymentId}
            </small>
          </div>
        </Card>
      </div>
    </Container>
  );
};

export default PaymentSuccessPage;
