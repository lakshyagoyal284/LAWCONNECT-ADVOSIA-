import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLawyers: 0,
    totalCases: 0,
    pendingVerifications: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentCases, setRecentCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, these would be actual API calls
        // const { data } = await axios.get('/api/admin/dashboard');
        
        // Mock data for now
        setTimeout(() => {
          setStats({
            totalUsers: 124,
            totalLawyers: 42,
            totalCases: 89,
            pendingVerifications: 7
          });
          
          setRecentUsers([
            { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'client', createdAt: new Date() },
            { _id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'lawyer', verified: false, createdAt: new Date() },
            { _id: '3', name: 'Robert Johnson', email: 'robert@example.com', role: 'client', createdAt: new Date() },
          ]);
          
          setRecentCases([
            { _id: '1', title: 'Divorce Case', status: 'open', client: 'John Doe', createdAt: new Date() },
            { _id: '2', title: 'Business Contract', status: 'in_progress', client: 'Sarah Wilson', createdAt: new Date() },
            { _id: '3', title: 'Real Estate', status: 'completed', client: 'Mike Brown', createdAt: new Date() },
          ]);
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <Badge bg="warning">Open</Badge>;
      case 'in_progress':
        return <Badge bg="info">In Progress</Badge>;
      case 'completed':
        return <Badge bg="success">Completed</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      
      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <Card.Text className="display-6">{stats.totalUsers}</Card.Text>
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">All platform users</small>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Lawyers</Card.Title>
              <Card.Text className="display-6">{stats.totalLawyers}</Card.Text>
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">Registered lawyers</small>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Total Cases</Card.Title>
              <Card.Text className="display-6">{stats.totalCases}</Card.Text>
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">Posted cases</small>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Pending Verifications</Card.Title>
              <Card.Text className="display-6">{stats.pendingVerifications}</Card.Text>
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">Lawyers to verify</small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      
      {/* Recent Users */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Users</h5>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => navigate('/admin/users')}
                >
                  View All
                </button>
              </div>
            </Card.Header>
            <Card.Body>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map(user => (
                    <tr key={user._id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/users/${user._id}`)}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        {user.verified === false ? (
                          <Badge bg="warning">Pending</Badge>
                        ) : (
                          <Badge bg="success">Verified</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Recent Cases */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Cases</h5>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => navigate('/admin/cases')}
                >
                  View All
                </button>
              </div>
            </Card.Header>
            <Card.Body>
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Case Title</th>
                    <th>Client</th>
                    <th>Status</th>
                    <th>Date Posted</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCases.map(caseItem => (
                    <tr 
                      key={caseItem._id} 
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/admin/cases/${caseItem._id}`)}
                    >
                      <td>{caseItem.title}</td>
                      <td>{caseItem.client}</td>
                      <td>{getStatusBadge(caseItem.status)}</td>
                      <td>{new Date(caseItem.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
