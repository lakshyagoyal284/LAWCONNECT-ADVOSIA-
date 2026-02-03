import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Row, Col, Badge, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaUserEdit, FaUserTimes, FaUserCheck } from 'react-icons/fa';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call to fetch users
    const fetchUsers = async () => {
      try {
        // In a real app, this would be an API call
        // const { data } = await axios.get('/api/admin/users');
        
        // Mock data
        setTimeout(() => {
          const mockUsers = [
            { 
              _id: '1', 
              name: 'John Doe', 
              email: 'john@example.com', 
              role: 'client', 
              status: 'active',
              createdAt: new Date(),
              lastLogin: new Date()
            },
            { 
              _id: '2', 
              name: 'Jane Smith', 
              email: 'jane@example.com', 
              role: 'lawyer', 
              status: 'pending',
              verified: false,
              specialization: 'Family Law',
              experience: 5,
              createdAt: new Date(),
              lastLogin: new Date()
            },
            { 
              _id: '3', 
              name: 'Robert Johnson', 
              email: 'robert@example.com', 
              role: 'lawyer', 
              status: 'active',
              verified: true,
              specialization: 'Corporate Law',
              experience: 8,
              createdAt: new Date(),
              lastLogin: new Date()
            },
            { 
              _id: '4', 
              name: 'Sarah Wilson', 
              email: 'sarah@example.com', 
              role: 'client', 
              status: 'active',
              createdAt: new Date(),
              lastLogin: new Date()
            },
            { 
              _id: '5', 
              name: 'Mike Brown', 
              email: 'mike@example.com', 
              role: 'lawyer', 
              status: 'suspended',
              verified: true,
              specialization: 'Criminal Law',
              experience: 3,
              createdAt: new Date(),
              lastLogin: new Date()
            },
          ];
          
          setUsers(mockUsers);
          setFilteredUsers(mockUsers);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...users];
    
    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term) ||
        (user.specialization && user.specialization.toLowerCase().includes(term))
      );
    }
    
    setFilteredUsers(result);
  }, [users, roleFilter, statusFilter, searchTerm]);

  const handleVerifyLawyer = async (userId) => {
    try {
      // In a real app, this would be an API call
      // await axios.put(`/api/admin/users/${userId}/verify`);
      
      // Update local state
      setUsers(users.map(user => 
        user._id === userId ? { ...user, verified: true, status: 'active' } : user
      ));
    } catch (error) {
      console.error('Error verifying lawyer:', error);
    }
  };

  const handleSuspendUser = async (userId) => {
    try {
      // In a real app, this would be an API call
      // await axios.put(`/api/admin/users/${userId}/suspend`);
      
      // Update local state
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: 'suspended' } : user
      ));
    } catch (error) {
      console.error('Error suspending user:', error);
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      // In a real app, this would be an API call
      // await axios.put(`/api/admin/users/${userId}/activate`);
      
      // Update local state
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: 'active' } : user
      ));
    } catch (error) {
      console.error('Error activating user:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">Active</Badge>;
      case 'pending':
        return <Badge bg="warning" text="dark">Pending</Badge>;
      case 'suspended':
        return <Badge bg="danger">Suspended</Badge>;
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Management</h2>
      </div>
      
      {/* Filters */}
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <InputGroup>
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4} className="mb-3">
          <Form.Select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="client">Clients</option>
            <option value="lawyer">Lawyers</option>
            <option value="admin">Admins</option>
          </Form.Select>
        </Col>
        <Col md={4} className="mb-3">
          <Form.Select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </Form.Select>
        </Col>
      </Row>
      
      {/* Users Table */}
      <div className="table-responsive">
        <Table hover className="align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Specialization</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0 me-2">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                             style={{ width: '36px', height: '36px' }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <div className="fw-medium">{user.name}</div>
                        <small className="text-muted">ID: {user._id}</small>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <Badge bg={user.role === 'lawyer' ? 'info' : 'secondary'}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </td>
                  <td>{user.specialization || '-'}</td>
                  <td>{getStatusBadge(user.status)}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={() => navigate(`/admin/users/${user._id}`)}
                        title="View/Edit"
                      >
                        <FaUserEdit />
                      </Button>
                      
                      {user.role === 'lawyer' && !user.verified ? (
                        <Button 
                          variant="outline-success" 
                          size="sm" 
                          onClick={() => handleVerifyLawyer(user._id)}
                          title="Verify Lawyer"
                        >
                          <FaUserCheck />
                        </Button>
                      ) : user.status === 'active' ? (
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => handleSuspendUser(user._id)}
                          title="Suspend User"
                        >
                          <FaUserTimes />
                        </Button>
                      ) : (
                        <Button 
                          variant="outline-success" 
                          size="sm" 
                          onClick={() => handleActivateUser(user._id)}
                          title="Activate User"
                        >
                          <FaUserCheck />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No users found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      
      {/* Pagination would go here */}
      <div className="d-flex justify-content-end">
        <nav>
          <ul className="pagination">
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
      </div>
    </Container>
  );
};

export default AdminUsers;
