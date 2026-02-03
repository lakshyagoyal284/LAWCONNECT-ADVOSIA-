import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { caseService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CasesPage = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const response = await caseService.getAll();
      setCases(response.data);
    } catch (err) {
      setError('Failed to fetch cases');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCase = async (caseId) => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      try {
        await caseService.delete(caseId);
        setCases(cases.filter(c => c.id !== caseId));
      } catch (err) {
        setError('Failed to delete case');
        console.error(err);
      }
    }
  };

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
        <p className="mt-2">Loading cases...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Cases</h2>
        {user?.role === 'client' && (
          <Button as={Link} to="/cases/new" variant="primary">
            New Case
          </Button>
        )}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {cases.length === 0 ? (
        <div className="text-center py-5">
          <h4>No cases found</h4>
          <p className="text-muted">
            {user?.role === 'client' 
              ? 'Create your first case to get started.'
              : 'No cases available at the moment.'
            }
          </p>
          {user?.role === 'client' && (
            <Button as={Link} to="/cases/new" variant="primary">
              Create Case
            </Button>
          )}
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Case Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((caseItem) => (
              <tr key={caseItem.id}>
                <td>{caseItem.title}</td>
                <td>{caseItem.category}</td>
                <td>{getStatusBadge(caseItem.status)}</td>
                <td>{new Date(caseItem.created_at).toLocaleDateString()}</td>
                <td>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    as={Link} 
                    to={`/cases/${caseItem.id}`}
                    className="me-2"
                  >
                    View
                  </Button>
                  {(user?.role === 'admin' || caseItem.user_id === user?.id) && (
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => handleDeleteCase(caseItem.id)}
                    >
                      Delete
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default CasesPage;
