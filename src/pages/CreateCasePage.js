import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { caseService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CreateCasePage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Family Law',
    currency: 'USD',
    budget: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const { title, description, category, currency, budget } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Creating case with data:', formData);
      console.log('User:', user);
      const response = await caseService.create(formData);
      console.log('Case created successfully:', response);
      navigate(`/cases/${response.data.id}`);
    } catch (err) {
      console.error('Error creating case:', err);
      setError('Failed to create case: ' + (err.response?.data?.message || err.message));
    }

    setLoading(false);
  };

  // Temporarily remove role check for testing
  // if (user?.role !== 'client') {
  //   return (
  //     <Container className="py-4">
  //       <Alert variant="danger">
  //         Only clients can create cases. Current role: {user?.role || 'Not logged in'}
  //       </Alert>
  //     </Container>
  //   );
  // }

  return (
    <Container className="py-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="mb-4">Create New Case</h2>
        
        <Card>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Case Title *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={title}
                  onChange={handleChange}
                  placeholder="Enter case title"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category *</Form.Label>
                <Form.Select
                  name="category"
                  value={category}
                  onChange={handleChange}
                  required
                >
                  <option value="Family Law">Family Law</option>
                  <option value="Corporate Law">Corporate Law</option>
                  <option value="Criminal Law">Criminal Law</option>
                  <option value="Real Estate Law">Real Estate Law</option>
                  <option value="Immigration Law">Immigration Law</option>
                  <option value="Intellectual Property">Intellectual Property</option>
                  <option value="Employment Law">Employment Law</option>
                  <option value="Tax Law">Tax Law</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Currency *</Form.Label>
                    <Form.Select
                      name="currency"
                      value={currency}
                      onChange={handleChange}
                      required
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="CAD">CAD ($)</option>
                      <option value="AUD">AUD ($)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Budget (optional)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      min="0"
                      name="budget"
                      value={budget}
                      onChange={handleChange}
                      placeholder="Enter your budget"
                    />
                    <Form.Text className="text-muted">
                      Specify your budget range for this case
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label>Description *</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Provide detailed description of your case..."
                  required
                />
              </Form.Group>

              <div className="d-flex gap-2">
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Case'}
                </Button>
                <Button 
                  variant="outline-secondary" 
                  onClick={() => navigate('/cases')}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default CreateCasePage;
