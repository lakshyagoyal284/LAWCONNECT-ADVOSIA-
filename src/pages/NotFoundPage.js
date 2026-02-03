import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center py-5">
      <div className="display-1 text-muted mb-4">404</div>
      <h1 className="h2 mb-3">Page Not Found</h1>
      <p className="lead mb-4">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="d-flex justify-content-center gap-3">
        <Button variant="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button variant="outline-primary" onClick={() => navigate('/')}>
          Go to Home
        </Button>
      </div>
    </Container>
  );
};

export default NotFoundPage;
