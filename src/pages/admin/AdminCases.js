import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Row, Col, Badge, InputGroup, Dropdown } from 'react-bootstrap';
import { FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminCases = () => {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const navigate = useNavigate();

  // Mock categories - in a real app, these would come from an API
  const categories = [
    'Family Law',
    'Criminal Law',
    'Corporate Law',
    'Real Estate',
    'Intellectual Property',
    'Employment Law',
    'Immigration',
    'Tax Law'
  ];

  useEffect(() => {
    // Simulate API call to fetch cases
    const fetchCases = async () => {
      try {
        // In a real app, this would be an API call
        // const { data } = await axios.get('/api/admin/cases');
        
        // Mock data
        setTimeout(() => {
          const mockCases = [
            {
              _id: '1',
              title: 'Divorce Settlement',
              client: { _id: '1', name: 'John Doe' },
              lawyer: { _id: '2', name: 'Jane Smith' },
              category: 'Family Law',
              status: 'in_progress',
              budget: 2500,
              description: 'Need assistance with divorce settlement and child custody agreement.',
              createdAt: new Date('2023-11-10'),
              updatedAt: new Date('2023-11-15'),
              deadline: new Date('2023-12-31'),
              bids: 3
            },
            {
              _id: '2',
              title: 'Business Contract Review',
              client: { _id: '3', name: 'Robert Johnson' },
              lawyer: null,
              category: 'Corporate Law',
              status: 'open',
              budget: 800,
              description: 'Need a lawyer to review a business partnership agreement.',
              createdAt: new Date('2023-11-15'),
              updatedAt: new Date('2023-11-15'),
              deadline: new Date('2023-12-15'),
              bids: 2
            },
            {
              _id: '3',
              title: 'Trademark Registration',
              client: { _id: '4', name: 'Sarah Wilson' },
              lawyer: { _id: '5', name: 'Mike Brown' },
              category: 'Intellectual Property',
              status: 'completed',
              budget: 1500,
              description: 'Need to register a trademark for my new brand.',
              createdAt: new Date('2023-10-20'),
              updatedAt: new Date('2023-11-05'),
              completedAt: new Date('2023-11-05'),
              deadline: new Date('2023-12-01'),
              bids: 5
            },
            {
              _id: '4',
              title: 'Rental Agreement Dispute',
              client: { _id: '6', name: 'Emily Davis' },
              lawyer: null,
              category: 'Real Estate',
              status: 'open',
              budget: 600,
              description: 'Need legal advice on a rental agreement dispute with my landlord.',
              createdAt: new Date('2023-11-18'),
              updatedAt: new Date('2023-11-18'),
              deadline: new Date('2023-12-10'),
              bids: 0
            },
            {
              _id: '5',
              title: 'Employment Contract Review',
              client: { _id: '7', name: 'David Wilson' },
              lawyer: { _id: '8', name: 'Lisa Johnson' },
              category: 'Employment Law',
              status: 'in_progress',
              budget: 400,
              description: 'Need a lawyer to review an employment contract before signing.',
              createdAt: new Date('2023-11-12'),
              updatedAt: new Date('2023-11-14'),
              deadline: new Date('2023-11-30'),
              bids: 4
            },
          ];
          
          setCases(mockCases);
          setFilteredCases(mockCases);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching cases:', error);
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...cases];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(caseItem => caseItem.status === statusFilter);
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(caseItem => caseItem.category === categoryFilter);
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dateFilter === 'today') {
        result = result.filter(caseItem => {
          const caseDate = new Date(caseItem.createdAt);
          caseDate.setHours(0, 0, 0, 0);
          return caseDate.getTime() === today.getTime();
        });
      } else if (dateFilter === 'this_week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        
        result = result.filter(caseItem => {
          const caseDate = new Date(caseItem.createdAt);
          return caseDate >= weekAgo && caseDate <= today;
        });
      } else if (dateFilter === 'this_month') {
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        
        result = result.filter(caseItem => {
          const caseDate = new Date(caseItem.createdAt);
          return caseDate >= monthAgo && caseDate <= today;
        });
      }
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(caseItem => 
        caseItem.title.toLowerCase().includes(term) || 
        caseItem.description.toLowerCase().includes(term) ||
        (caseItem.client && caseItem.client.name.toLowerCase().includes(term)) ||
        (caseItem.lawyer && caseItem.lawyer.name.toLowerCase().includes(term))
      );
    }
    
    setFilteredCases(result);
  }, [cases, statusFilter, categoryFilter, dateFilter, searchTerm]);

  const handleStatusChange = async (caseId, newStatus) => {
    try {
      // In a real app, this would be an API call
      // await axios.put(`/api/admin/cases/${caseId}/status`, { status: newStatus });
      
      // Update local state
      setCases(cases.map(caseItem => 
        caseItem._id === caseId 
          ? { 
              ...caseItem, 
              status: newStatus,
              updatedAt: new Date()
            } 
          : caseItem
      ));
      
      // Show success message
      alert(`Case status updated to ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      console.error('Error updating case status:', error);
      alert('Failed to update case status. Please try again.');
    }
  };

  const handleDeleteCase = async (caseId) => {
    if (window.confirm('Are you sure you want to delete this case? This action cannot be undone.')) {
      try {
        // In a real app, this would be an API call
        // await axios.delete(`/api/admin/cases/${caseId}`);
        
        // Update local state
        setCases(cases.filter(caseItem => caseItem._id !== caseId));
        
        // Show success message
        alert('Case deleted successfully');
      } catch (error) {
        console.error('Error deleting case:', error);
        alert('Failed to delete case. Please try again.');
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Case Management</h2>
        <Button variant="primary" onClick={() => navigate('/admin/cases/new')}>
          + Add New Case
        </Button>
      </div>
      
      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text><FaSearch /></InputGroup.Text>
                <Form.Control 
                  type="text" 
                  placeholder="Search cases..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            
            <Col md={2}>
              <Form.Select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Form.Select>
            </Col>
            
            <Col md={3}>
              <Form.Select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Form.Select>
            </Col>
            
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text><FaCalendarAlt /></InputGroup.Text>
                <Form.Select 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                </Form.Select>
              </InputGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Cases Table */}
      <Card>
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Case Title</th>
                <th>Client</th>
                <th>Lawyer</th>
                <th>Category</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.length > 0 ? (
                filteredCases.map(caseItem => (
                  <tr key={caseItem._id}>
                    <td>
                      <div className="fw-medium">{caseItem.title}</div>
                      <small className="text-muted">
                        {caseItem.description.length > 50 
                          ? `${caseItem.description.substring(0, 50)}...` 
                          : caseItem.description}
                      </small>
                    </td>
                    <td>
                      {caseItem.client ? (
                        <a 
                          href={`#user-${caseItem.client._id}`} 
                          className="text-decoration-none"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/admin/users/${caseItem.client._id}`);
                          }}
                        >
                          {caseItem.client.name}
                        </a>
                      ) : '-'}
                    </td>
                    <td>
                      {caseItem.lawyer ? (
                        <a 
                          href={`#user-${caseItem.lawyer._id}`} 
                          className="text-decoration-none"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/admin/users/${caseItem.lawyer._id}`);
                          }}
                        >
                          {caseItem.lawyer.name}
                        </a>
                      ) : (
                        <span className="text-muted">Unassigned</span>
                      )}
                    </td>
                    <td>{caseItem.category}</td>
                    <td>{formatCurrency(caseItem.budget)}</td>
                    <td>{getStatusBadge(caseItem.status)}</td>
                    <td>{formatDate(caseItem.createdAt)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          title="View Details"
                          onClick={() => navigate(`/admin/cases/${caseItem._id}`)}
                        >
                          <FaEye />
                        </Button>
                        
                        <Dropdown>
                          <Dropdown.Toggle 
                            variant="outline-secondary" 
                            size="sm" 
                            id={`dropdown-actions-${caseItem._id}`}
                          />
                          <Dropdown.Menu>
                            <Dropdown.Item 
                              onClick={() => navigate(`/admin/cases/${caseItem._id}/edit`)}
                            >
                              <FaEdit className="me-2" /> Edit Case
                            </Dropdown.Item>
                            
                            {caseItem.status !== 'completed' && caseItem.status !== 'cancelled' && (
                              <>
                                <Dropdown.Divider />
                                <Dropdown.Header>Change Status</Dropdown.Header>
                                {caseItem.status !== 'open' && (
                                  <Dropdown.Item onClick={() => handleStatusChange(caseItem._id, 'open')}>
                                    Mark as Open
                                  </Dropdown.Item>
                                )}
                                {caseItem.status !== 'in_progress' && caseItem.lawyer && (
                                  <Dropdown.Item onClick={() => handleStatusChange(caseItem._id, 'in_progress')}>
                                    Mark as In Progress
                                  </Dropdown.Item>
                                )}
                                <Dropdown.Item 
                                  className="text-success" 
                                  onClick={() => handleStatusChange(caseItem._id, 'completed')}
                                >
                                  Mark as Completed
                                </Dropdown.Item>
                                <Dropdown.Item 
                                  className="text-danger" 
                                  onClick={() => handleStatusChange(caseItem._id, 'cancelled')}
                                >
                                  Cancel Case
                                </Dropdown.Item>
                              </>
                            )}
                            
                            <Dropdown.Divider />
                            <Dropdown.Item 
                              className="text-danger" 
                              onClick={() => handleDeleteCase(caseItem._id)}
                            >
                              <FaTrash className="me-2" /> Delete Case
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    No cases found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        
        {/* Pagination */}
        {filteredCases.length > 0 && (
          <Card.Footer className="d-flex justify-content-between align-items-center">
            <div className="text-muted">
              Showing <strong>1-{Math.min(10, filteredCases.length)}</strong> of <strong>{filteredCases.length}</strong> cases
            </div>
            
            <nav>
              <ul className="pagination mb-0">
                <li className="page-item disabled">
                  <button className="page-link">Previous</button>
                </li>
                <li className="page-item active">
                  <button className="page-link">1</button>
                </li>
                <li className="page-item">
                  <button className="page-link">2</button>
                </li>
                <li className="page-item">
                  <button className="page-link">3</button>
                </li>
                <li className="page-item">
                  <button className="page-link">Next</button>
                </li>
              </ul>
            </nav>
          </Card.Footer>
        )}
      </Card>
    </Container>
  );
};

export default AdminCases;
