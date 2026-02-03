import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Table, 
  Badge, 
  Button, 
  Form, 
  InputGroup, 
  Row, 
  Col, 
  Spinner,
  Dropdown,
  Pagination,
  Card,
  Alert
} from 'react-bootstrap';
import { 
  FaSearch, 
  FaFilter, 
  FaSort, 
  FaSortUp, 
  FaSortDown, 
  FaEye, 
  FaCheck, 
  FaTimes,
  FaUserTie,
  FaFileAlt,
  FaDollarSign,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaInfoCircle
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdminBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock data - in a real app, this would come from an API
  const mockBids = [
    {
      id: 'b1',
      caseId: 'c1',
      caseTitle: 'Divorce Settlement',
      lawyer: {
        id: 'l1',
        name: 'Jane Smith',
        specialization: 'Family Law',
        rating: 4.8,
        casesCompleted: 124
      },
      client: {
        id: 'c1',
        name: 'John Doe',
        email: 'john@example.com'
      },
      amount: 3000,
      status: 'pending',
      submittedAt: '2023-11-20T14:30:00Z',
      proposal: 'I have extensive experience in family law and can help you with your divorce settlement. I\'ve handled over 100 similar cases with a 95% success rate.',
      documents: ['proposal.pdf'],
      estimatedDuration: '4-6 weeks'
    },
    {
      id: 'b2',
      caseId: 'c2',
      caseTitle: 'Business Contract Review',
      lawyer: {
        id: 'l2',
        name: 'Robert Johnson',
        specialization: 'Corporate Law',
        rating: 4.6,
        casesCompleted: 89
      },
      client: {
        id: 'c2',
        name: 'Acme Corp',
        email: 'legal@acmecorp.com'
      },
      amount: 2500,
      status: 'accepted',
      submittedAt: '2023-11-18T09:15:00Z',
      proposal: 'As a corporate law specialist, I can thoroughly review your contract and suggest necessary modifications to protect your interests.',
      documents: ['proposal.pdf', 'resume.pdf'],
      estimatedDuration: '2 weeks'
    },
    {
      id: 'b3',
      caseId: 'c3',
      caseTitle: 'Real Estate Dispute',
      lawyer: {
        id: 'l3',
        name: 'Emily Davis',
        specialization: 'Real Estate Law',
        rating: 4.9,
        casesCompleted: 156
      },
      client: {
        id: 'c3',
        name: 'Sarah Williams',
        email: 'sarah@example.com'
      },
      amount: 4200,
      status: 'rejected',
      submittedAt: '2023-11-15T16:45:00Z',
      proposal: 'With my expertise in real estate law, I can help resolve your property dispute efficiently and effectively.',
      documents: [],
      estimatedDuration: '8-10 weeks'
    },
    {
      id: 'b4',
      caseId: 'c1',
      caseTitle: 'Divorce Settlement',
      lawyer: {
        id: 'l4',
        name: 'Michael Brown',
        specialization: 'Family Law',
        rating: 4.7,
        casesCompleted: 92
      },
      client: {
        id: 'c1',
        name: 'John Doe',
        email: 'john@example.com'
      },
      amount: 3500,
      status: 'pending',
      submittedAt: '2023-11-21T10:20:00Z',
      proposal: 'I specialize in amicable divorce settlements and can help you navigate this process with minimal conflict.',
      documents: ['proposal.pdf', 'certifications.pdf'],
      estimatedDuration: '6-8 weeks'
    },
    {
      id: 'b5',
      caseId: 'c4',
      caseTitle: 'Intellectual Property Dispute',
      lawyer: {
        id: 'l5',
        name: 'David Wilson',
        specialization: 'Intellectual Property',
        rating: 4.5,
        casesCompleted: 67
      },
      client: {
        id: 'c4',
        name: 'Tech Innovations Inc.',
        email: 'legal@techinnovations.com'
      },
      amount: 7500,
      status: 'accepted',
      submittedAt: '2023-11-10T11:30:00Z',
      proposal: 'I have successfully handled numerous IP cases and can help protect your intellectual property rights.',
      documents: ['proposal.pdf', 'case_studies.pdf'],
      estimatedDuration: '3-4 months'
    }
  ];

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchBids = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Simulate API call with filters and search
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Filter and sort the mock data
        let filteredBids = [...mockBids];
        
        // Apply search
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filteredBids = filteredBids.filter(bid => 
            bid.caseTitle.toLowerCase().includes(term) ||
            bid.lawyer.name.toLowerCase().includes(term) ||
            bid.client.name.toLowerCase().includes(term) ||
            bid.proposal.toLowerCase().includes(term)
          );
        }
        
        // Apply status filter
        if (filters.status !== 'all') {
          filteredBids = filteredBids.filter(bid => bid.status === filters.status);
        }
        
        // Apply sorting
        filteredBids.sort((a, b) => {
          let comparison = 0;
          
          if (filters.sortBy === 'date') {
            comparison = new Date(a.submittedAt) - new Date(b.submittedAt);
          } else if (filters.sortBy === 'amount') {
            comparison = a.amount - b.amount;
          } else if (filters.sortBy === 'lawyer') {
            comparison = a.lawyer.name.localeCompare(b.lawyer.name);
          } else if (filters.sortBy === 'case') {
            comparison = a.caseTitle.localeCompare(b.caseTitle);
          }
          
          return filters.sortOrder === 'asc' ? comparison : -comparison;
        });
        
        setBids(filteredBids);
      } catch (err) {
        console.error('Error fetching bids:', err);
        setError('Failed to load bids. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBids();
  }, [filters, searchTerm]);

  const handleStatusChange = async (bidId, newStatus) => {
    try {
      // In a real app, this would be an API call
      // await axios.put(`/api/admin/bids/${bidId}`, { status: newStatus });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setBids(bids.map(bid => 
        bid.id === bidId ? { ...bid, status: newStatus } : bid
      ));
    } catch (err) {
      console.error('Error updating bid status:', err);
      setError('Failed to update bid status. Please try again.');
    }
  };

  const handleSort = (sortBy) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy 
        ? prev.sortOrder === 'asc' ? 'desc' : 'asc' 
        : 'asc'
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return <Badge bg="success">Accepted</Badge>;
      case 'rejected':
        return <Badge bg="danger">Rejected</Badge>;
      case 'pending':
        return <Badge bg="warning" text="dark">Pending</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const getSortIcon = (column) => {
    if (filters.sortBy !== column) return <FaSort className="ms-1" />;
    return filters.sortOrder === 'asc' 
      ? <FaSortUp className="ms-1" /> 
      : <FaSortDown className="ms-1" />;
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBids = bids.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(bids.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading bids...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Bid Management</h2>
        <div>
          <Button variant="outline-secondary" className="me-2">
            <FaFilter className="me-1" /> Export
          </Button>
          <Button variant="primary">
            <FaFileAlt className="me-1" /> Generate Report
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          <FaExclamationTriangle className="me-2" />
          {error}
        </Alert>
      )}

      <Card className="mb-4">
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search bids..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filters.status}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, status: e.target.value }));
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Dropdown className="d-grid">
                <Dropdown.Toggle variant="outline-secondary">
                  <FaFilter className="me-1" /> More Filters
                </Dropdown.Toggle>
                <Dropdown.Menu className="p-3" style={{ width: '300px' }}>
                  <Form.Group className="mb-3">
                    <Form.Label>Amount Range</Form.Label>
                    <div className="d-flex align-items-center">
                      <Form.Control 
                        type="number" 
                        placeholder="Min" 
                        className="me-2"
                      />
                      <span>to</span>
                      <Form.Control 
                        type="number" 
                        placeholder="Max" 
                        className="ms-2"
                      />
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Date Range</Form.Label>
                    <div className="d-flex align-items-center">
                      <Form.Control 
                        type="date" 
                        className="me-2"
                      />
                      <span>to</span>
                      <Form.Control 
                        type="date" 
                        className="ms-2"
                      />
                    </div>
                  </Form.Group>
                  <Button variant="primary" size="sm" className="w-100">
                    Apply Filters
                  </Button>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>

          {bids.length === 0 ? (
            <div className="text-center py-5">
              <FaInfoCircle size={48} className="text-muted mb-3" />
              <h5>No bids found</h5>
              <p className="text-muted">
                {searchTerm || filters.status !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'There are no bids to display at the moment.'}
              </p>
              {searchTerm || filters.status !== 'all' ? (
                <Button 
                  variant="outline-primary" 
                  onClick={() => {
                    setSearchTerm('');
                    setFilters(prev => ({ ...prev, status: 'all' }));
                  }}
                >
                  Clear Filters
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead>
                  <tr>
                    <th 
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSort('case')}
                    >
                      Case {getSortIcon('case')}
                    </th>
                    <th>Lawyer</th>
                    <th>Client</th>
                    <th 
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSort('amount')}
                      className="text-end"
                    >
                      Amount {getSortIcon('amount')}
                    </th>
                    <th>Status</th>
                    <th 
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSort('date')}
                      className="text-end"
                    >
                      Submitted {getSortIcon('date')}
                    </th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBids.map((bid) => (
                    <tr key={bid.id}>
                      <td>
                        <div className="fw-bold">
                          <Link to={`/admin/cases/${bid.caseId}`} className="text-decoration-none">
                            {bid.caseTitle}
                          </Link>
                        </div>
                        <small className="text-muted">
                          {bid.estimatedDuration}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                               style={{ width: '32px', height: '32px', marginRight: '10px' }}>
                            {bid.lawyer.name.charAt(0)}
                          </div>
                          <div>
                            <div className="fw-medium">
                              <Link to={`/admin/users/${bid.lawyer.id}`} className="text-decoration-none">
                                {bid.lawyer.name}
                              </Link>
                            </div>
                            <small className="text-muted">{bid.lawyer.specialization}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center" 
                               style={{ width: '32px', height: '32px', marginRight: '10px' }}>
                            {bid.client.name.charAt(0)}
                          </div>
                          <div>
                            <div className="fw-medium">{bid.client.name}</div>
                            <small className="text-muted">{bid.client.email}</small>
                          </div>
                        </div>
                      </td>
                      <td className="text-end fw-bold">
                        {formatCurrency(bid.amount)}
                      </td>
                      <td>
                        {getStatusBadge(bid.status)}
                      </td>
                      <td className="text-end">
                        <div>{formatDate(bid.submittedAt)}</div>
                        <small className="text-muted">
                          {new Date(bid.submittedAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            as={Link}
                            to={`/admin/cases/${bid.caseId}?bid=${bid.id}`}
                            title="View Details"
                          >
                            <FaEye />
                          </Button>
                          {bid.status === 'pending' && (
                            <>
                              <Button 
                                variant="outline-success" 
                                size="sm" 
                                onClick={() => handleStatusChange(bid.id, 'accepted')}
                                title="Accept Bid"
                              >
                                <FaCheck />
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm" 
                                onClick={() => handleStatusChange(bid.id, 'rejected')}
                                title="Reject Bid"
                              >
                                <FaTimes />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              {totalPages > 1 && (
                <div className="d-flex justify-content-center">
                  <Pagination>
                    <Pagination.First 
                      onClick={() => setCurrentPage(1)} 
                      disabled={currentPage === 1} 
                    />
                    <Pagination.Prev 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                      disabled={currentPage === 1} 
                    />
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Pagination.Item 
                          key={pageNum}
                          active={pageNum === currentPage}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Pagination.Item>
                      );
                    })}
                    
                    <Pagination.Next 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                      disabled={currentPage === totalPages} 
                    />
                    <Pagination.Last 
                      onClick={() => setCurrentPage(totalPages)} 
                      disabled={currentPage === totalPages} 
                    />
                  </Pagination>
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Header className="bg-light">
          <h5 className="mb-0">Bid Statistics</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4} className="text-center">
              <h3 className="text-primary">{bids.filter(b => b.status === 'pending').length}</h3>
              <p className="text-muted mb-0">Pending Bids</p>
            </Col>
            <Col md={4} className="text-center">
              <h3 className="text-success">{bids.filter(b => b.status === 'accepted').length}</h3>
              <p className="text-muted mb-0">Accepted Bids</p>
            </Col>
            <Col md={4} className="text-center">
              <h3 className="text-danger">{bids.filter(b => b.status === 'rejected').length}</h3>
              <p className="text-muted mb-0">Rejected Bids</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminBids;
