import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Tab, Nav, Alert } from 'react-bootstrap';
import { FaArrowLeft, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaUserCheck, FaUserTimes } from 'react-icons/fa';

const AdminUserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    // Simulate API call to fetch user details
    const fetchUser = async () => {
      try {
        // In a real app, this would be an API call
        // const { data } = await axios.get(`/api/admin/users/${userId}`);
        
        // Mock data
        setTimeout(() => {
          const mockUser = {
            _id: userId,
            name: userId === '2' ? 'Jane Smith' : 'John Doe',
            email: userId === '2' ? 'jane@example.com' : 'john@example.com',
            role: userId === '2' ? 'lawyer' : 'client',
            status: 'pending',
            phone: '+1 (555) 123-4567',
            address: '123 Legal St, Suite 100, New York, NY 10001',
            bio: userId === '2' 
              ? 'Experienced family law attorney with over 5 years of practice. Specializing in divorce, child custody, and adoption cases.'
              : 'Business owner looking for legal consultation for contract review.',
            specialization: userId === '2' ? 'Family Law' : null,
            experience: userId === '2' ? 5 : 0,
            education: userId === '2' ? [
              'Juris Doctor, Harvard Law School, 2018',
              'Bachelor of Arts in Political Science, Columbia University, 2015'
            ] : [],
            cases: userId === '2' ? [
              { id: '1', title: 'Divorce Case', status: 'completed', client: 'Robert Johnson', date: '2023-05-15' },
              { id: '2', title: 'Child Custody', status: 'in_progress', client: 'Sarah Wilson', date: '2023-09-22' },
            ] : [
              { id: '3', title: 'Business Contract Review', status: 'completed', lawyer: 'Jane Smith', date: '2023-10-10' },
            ],
            documents: userId === '2' ? [
              { id: '1', name: 'Bar Certificate', type: 'certification', date: '2022-01-15' },
              { id: '2', name: 'ID Verification', type: 'id', date: '2022-01-10' },
            ] : [],
            createdAt: '2023-01-10T10:30:00Z',
            lastLogin: '2023-11-15T14:22:10Z',
          };
          
          setUser(mockUser);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching user:', error);
        setAlert({
          show: true,
          message: 'Failed to load user details. Please try again later.',
          variant: 'danger'
        });
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleVerify = async () => {
    try {
      // In a real app, this would be an API call
      // await axios.put(`/api/admin/users/${userId}/verify`);
      
      setUser(prev => ({
        ...prev,
        status: 'active',
        verified: true
      }));
      
      setAlert({
        show: true,
        message: 'Lawyer verified successfully!',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error verifying lawyer:', error);
      setAlert({
        show: true,
        message: 'Failed to verify lawyer. Please try again.',
        variant: 'danger'
      });
    }
  };

  const handleSuspend = async () => {
    try {
      // In a real app, this would be an API call
      // await axios.put(`/api/admin/users/${userId}/suspend`);
      
      setUser(prev => ({
        ...prev,
        status: 'suspended'
      }));
      
      setAlert({
        show: true,
        message: 'User suspended successfully!',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error suspending user:', error);
      setAlert({
        show: true,
        message: 'Failed to suspend user. Please try again.',
        variant: 'danger'
      });
    }
  };

  const handleActivate = async () => {
    try {
      // In a real app, this would be an API call
      // await axios.put(`/api/admin/users/${userId}/activate`);
      
      setUser(prev => ({
        ...prev,
        status: 'active'
      }));
      
      setAlert({
        show: true,
        message: 'User activated successfully!',
        variant: 'success'
      });
    } catch (error) {
      console.error('Error activating user:', error);
      setAlert({
        show: true,
        message: 'Failed to activate user. Please try again.',
        variant: 'danger'
      });
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

  if (!user) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          User not found. <Link to="/admin/users">Back to users</Link>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button 
        variant="outline-secondary" 
        className="mb-3" 
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="me-2" /> Back to Users
      </Button>
      
      {alert.show && (
        <Alert 
          variant={alert.variant} 
          onClose={() => setAlert(prev => ({ ...prev, show: false }))} 
          dismissible
          className="mb-4"
        >
          {alert.message}
        </Alert>
      )}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">{user.name}</h2>
          <div className="d-flex align-items-center mt-2">
            {getStatusBadge(user.status)}
            <span className="ms-2 text-muted">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div>
          {user.role === 'lawyer' && !user.verified && (
            <Button variant="success" className="me-2" onClick={handleVerify}>
              <FaUserCheck className="me-1" /> Verify Lawyer
            </Button>
          )}
          
          {user.status === 'active' ? (
            <Button variant="outline-danger" onClick={handleSuspend}>
              <FaUserTimes className="me-1" /> Suspend Account
            </Button>
          ) : (
            <Button variant="outline-success" onClick={handleActivate}>
              <FaUserCheck className="me-1" /> Activate Account
            </Button>
          )}
        </div>
      </div>
      
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body className="text-center">
              <div className="mb-3">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                     style={{ width: '120px', height: '120px', fontSize: '48px' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <h4>{user.name}</h4>
              <p className="text-muted">
                {user.role === 'lawyer' 
                  ? `${user.specialization} Lawyer` 
                  : 'Client'}
              </p>
              
              <hr />
              
              <div className="text-start">
                <p>
                  <FaEnvelope className="me-2 text-muted" />
                  <a href={`mailto:${user.email}`} className="text-decoration-none">
                    {user.email}
                  </a>
                </p>
                
                {user.phone && (
                  <p>
                    <FaPhone className="me-2 text-muted" />
                    <a href={`tel:${user.phone.replace(/[^\d+]/g, '')}`} className="text-decoration-none">
                      {user.phone}
                    </a>
                  </p>
                )}
                
                {user.address && (
                  <p className="mb-0">
                    <FaMapMarkerAlt className="me-2 text-muted" />
                    <small>{user.address}</small>
                  </p>
                )}
              </div>
              
              {user.role === 'lawyer' && user.experience > 0 && (
                <div className="mt-3">
                  <p className="mb-1">
                    <FaBriefcase className="me-2 text-muted" />
                    {user.experience}+ years of experience
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
          
          {user.role === 'lawyer' && user.documents && user.documents.length > 0 && (
            <Card className="mb-4">
              <Card.Header>Documents</Card.Header>
              <Card.Body>
                <ul className="list-unstyled">
                  {user.documents.map(doc => (
                    <li key={doc.id} className="mb-2">
                      <a 
                        href={`#view-${doc.id}`} 
                        className="d-flex justify-content-between align-items-center text-decoration-none"
                        onClick={(e) => {
                          e.preventDefault();
                          // In a real app, this would open a document viewer or download
                          alert(`Viewing document: ${doc.name}`);
                        }}
                      >
                        <span>{doc.name}</span>
                        <Badge bg="light" text="secondary" className="text-uppercase">
                          {doc.type}
                        </Badge>
                      </a>
                      <small className="text-muted d-block">
                        Uploaded: {new Date(doc.date).toLocaleDateString()}
                      </small>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          )}
        </Col>
        
        <Col md={8}>
          <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <Card>
              <Card.Header>
                <Nav variant="tabs" className="border-0">
                  <Nav.Item>
                    <Nav.Link eventKey="profile">Profile</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="activity">Activity</Nav.Link>
                  </Nav.Item>
                  {user.role === 'lawyer' && (
                    <Nav.Item>
                      <Nav.Link eventKey="reviews">Reviews</Nav.Link>
                    </Nav.Item>
                  )}
                  <Nav.Item>
                    <Nav.Link eventKey="settings">Settings</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body>
                <Tab.Content>
                  <Tab.Pane eventKey="profile">
                    <h5 className="mb-3">About</h5>
                    <p>{user.bio || 'No bio provided.'}</p>
                    
                    {user.role === 'lawyer' && user.education && user.education.length > 0 && (
                      <div className="mt-4">
                        <h5 className="mb-3">Education</h5>
                        <ul className="list-unstyled">
                          {user.education.map((edu, index) => (
                            <li key={index} className="mb-2">
                              <div className="d-flex">
                                <div className="me-3 text-primary">
                                  <FaGraduationCap size={20} />
                                </div>
                                <div>
                                  <p className="mb-0">{edu}</p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="activity">
                    <h5 className="mb-3">Recent Activity</h5>
                    {user.cases && user.cases.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Case</th>
                              <th>{user.role === 'lawyer' ? 'Client' : 'Lawyer'}</th>
                              <th>Date</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {user.cases.map(caseItem => (
                              <tr key={caseItem.id}>
                                <td>
                                  <a 
                                    href={`#case-${caseItem.id}`} 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      // In a real app, this would navigate to the case details
                                      alert(`Viewing case: ${caseItem.title}`);
                                    }}
                                    className="text-decoration-none"
                                  >
                                    {caseItem.title}
                                  </a>
                                </td>
                                <td>{user.role === 'lawyer' ? caseItem.client : caseItem.lawyer}</td>
                                <td>{new Date(caseItem.date).toLocaleDateString()}</td>
                                <td>
                                  {caseItem.status === 'completed' ? (
                                    <Badge bg="success">Completed</Badge>
                                  ) : caseItem.status === 'in_progress' ? (
                                    <Badge bg="info">In Progress</Badge>
                                  ) : (
                                    <Badge bg="warning" text="dark">Pending</Badge>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p>No recent activity found.</p>
                    )}
                    
                    <div className="mt-4">
                      <h5 className="mb-3">Account Information</h5>
                      <dl className="row">
                        <dt className="col-sm-4">Account Created</dt>
                        <dd className="col-sm-8">
                          {new Date(user.createdAt).toLocaleString()}
                        </dd>
                        
                        <dt className="col-sm-4">Last Login</dt>
                        <dd className="col-sm-8">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                        </dd>
                        
                        <dt className="col-sm-4">Email Verified</dt>
                        <dd className="col-sm-8">
                          {user.emailVerified ? (
                            <Badge bg="success">Verified</Badge>
                          ) : (
                            <Badge bg="warning" text="dark">Pending</Badge>
                          )}
                        </dd>
                        
                        {user.role === 'lawyer' && (
                          <>
                            <dt className="col-sm-4">Verification Status</dt>
                            <dd className="col-sm-8">
                              {user.verified ? (
                                <Badge bg="success">Verified</Badge>
                              ) : (
                                <Badge bg="warning" text="dark">Pending Review</Badge>
                              )}
                            </dd>
                            
                            <dt className="col-sm-4">Specialization</dt>
                            <dd className="col-sm-8">{user.specialization || 'Not specified'}</dd>
                            
                            <dt className="col-sm-4">Experience</dt>
                            <dd className="col-sm-8">{user.experience} years</dd>
                          </>
                        )}
                      </dl>
                    </div>
                  </Tab.Pane>
                  
                  {user.role === 'lawyer' && (
                    <Tab.Pane eventKey="reviews">
                      <h5 className="mb-3">Client Reviews</h5>
                      {user.reviews && user.reviews.length > 0 ? (
                        <div className="reviews-list">
                          {[1, 2, 3].map((_, index) => (
                            <div key={index} className="border-bottom pb-3 mb-3">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <div>
                                  <span className="fw-medium">Client {index + 1}</span>
                                  <div className="text-warning">
                                    {'★'.repeat(5 - index)}
                                    {'☆'.repeat(index)}
                                  </div>
                                </div>
                                <small className="text-muted">
                                  {new Date(Date.now() - (index * 30 * 24 * 60 * 60 * 1000)).toLocaleDateString()}
                                </small>
                              </div>
                              <p className="mb-0">
                                {index % 3 === 0 
                                  ? 'Great lawyer, very professional and helpful!' 
                                  : index % 3 === 1 
                                    ? 'Good service, but a bit slow to respond.'
                                    : 'Excellent work, highly recommended!'}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>No reviews yet.</p>
                      )}
                      
                      <div className="mt-4">
                        <h6>Rating Summary</h6>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="d-flex align-items-center mb-2">
                              <span className="me-2">5 Stars</span>
                              <div className="progress flex-grow-1" style={{ height: '20px' }}>
                                <div 
                                  className="progress-bar bg-warning" 
                                  role="progressbar" 
                                  style={{ width: '70%' }}
                                  aria-valuenow="70" 
                                  aria-valuemin="0" 
                                  aria-valuemax="100"
                                ></div>
                              </div>
                              <span className="ms-2">70%</span>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                              <span className="me-2">4 Stars</span>
                              <div className="progress flex-grow-1" style={{ height: '20px' }}>
                                <div 
                                  className="progress-bar bg-warning" 
                                  role="progressbar" 
                                  style={{ width: '20%' }}
                                  aria-valuenow="20" 
                                  aria-valuemin="0" 
                                  aria-valuemax="100"
                                ></div>
                              </div>
                              <span className="ms-2">20%</span>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                              <span className="me-2">3 Stars</span>
                              <div className="progress flex-grow-1" style={{ height: '20px' }}>
                                <div 
                                  className="progress-bar bg-warning" 
                                  role="progressbar" 
                                  style={{ width: '10%' }}
                                  aria-valuenow="10" 
                                  aria-valuemin="0" 
                                  aria-valuemax="100"
                                ></div>
                              </div>
                              <span className="ms-2">10%</span>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                              <span className="me-2">2 Stars</span>
                              <div className="progress flex-grow-1" style={{ height: '20px' }}>
                                <div 
                                  className="progress-bar bg-warning" 
                                  role="progressbar" 
                                  style={{ width: '0%' }}
                                  aria-valuenow="0" 
                                  aria-valuemin="0" 
                                  aria-valuemax="100"
                                ></div>
                              </div>
                              <span className="ms-2">0%</span>
                            </div>
                            <div className="d-flex align-items-center">
                              <span className="me-2">1 Star</span>
                              <div className="progress flex-grow-1" style={{ height: '20px' }}>
                                <div 
                                  className="progress-bar bg-warning" 
                                  role="progressbar" 
                                  style={{ width: '0%' }}
                                  aria-valuenow="0" 
                                  aria-valuemin="0" 
                                  aria-valuemax="100"
                                ></div>
                              </div>
                              <span className="ms-2">0%</span>
                            </div>
                          </div>
                          <div className="col-md-6 text-center">
                            <div className="display-4">4.6</div>
                            <div className="text-warning mb-2">
                              {'★'.repeat(4)}☆
                            </div>
                            <p className="text-muted mb-0">Based on 15 reviews</p>
                          </div>
                        </div>
                      </div>
                    </Tab.Pane>
                  )}
                  
                  <Tab.Pane eventKey="settings">
                    <h5 className="mb-4">Account Settings</h5>
                    
                    <form>
                      <div className="mb-3">
                        <label htmlFor="accountStatus" className="form-label">Account Status</label>
                        <select 
                          className="form-select" 
                          id="accountStatus"
                          value={user.status}
                          disabled
                        >
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="emailNotifications" className="form-label">Email Notifications</label>
                        <div className="form-check form-switch">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="emailNotifications" 
                            defaultChecked 
                          />
                          <label className="form-check-label" htmlFor="emailNotifications">
                            Receive email notifications
                          </label>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="twoFactorAuth" className="form-label">Two-Factor Authentication</label>
                        <div className="form-check form-switch">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="twoFactorAuth" 
                          />
                          <label className="form-check-label" htmlFor="twoFactorAuth">
                            Enable two-factor authentication
                          </label>
                        </div>
                        <div className="form-text">
                          Add an extra layer of security to your account
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-end mt-4">
                        <button type="button" className="btn btn-outline-secondary me-2">
                          Reset Password
                        </button>
                        <button type="button" className="btn btn-primary">
                          Save Changes
                        </button>
                      </div>
                    </form>
                    
                    <hr className="my-4" />
                    
                    <div>
                      <h6 className="text-danger mb-3">Danger Zone</h6>
                      <div className="border border-danger rounded p-3">
                        <h6>Delete Account</h6>
                        <p className="text-muted">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <button 
                          className="btn btn-outline-danger"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
                              alert('Account deletion requested. This would delete the account in a real application.');
                            }
                          }}
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminUserDetail;
