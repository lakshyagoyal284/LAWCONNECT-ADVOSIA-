import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: searchParams.get('role') || 'client'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const { name, email, password, confirmPassword, role } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setError('');
    setLoading(true);

    try {
      const result = await register({ name, email, password, role });
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Failed to create an account');
      }
    } catch (err) {
      setError('Failed to create an account');
    }

    setLoading(false);
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Sign Up</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="name" className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              
              <Form.Group id="role" className="mb-3">
                <Form.Label>I am a</Form.Label>
                <Form.Select
                  name="role"
                  value={role}
                  onChange={handleChange}
                  required
                >
                  <option value="client">Client seeking legal services</option>
                  <option value="lawyer">Lawyer offering services</option>
                </Form.Select>
              </Form.Group>

              <Form.Group id="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              
              <Form.Group id="password" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
                <Form.Text className="text-muted">
                  Password must be at least 6 characters long.
                </Form.Text>
              </Form.Group>
              
              <Form.Group id="confirm-password" className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              
              <Button disabled={loading} className="w-100" type="submit">
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </Container>
  );
};

export default RegisterPage;
