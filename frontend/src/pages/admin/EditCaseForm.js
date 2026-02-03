import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Form, 
  Button, 
  Card, 
  Row, 
  Col, 
  Alert, 
  Spinner,
  InputGroup,
  FormControl,
  Badge,
  ListGroup
} from 'react-bootstrap';
import { 
  FaArrowLeft, 
  FaSave, 
  FaTrash, 
  FaPaperclip, 
  FaTimes,
  FaFileAlt,
  FaUpload,
  FaUser,
  FaDollarSign,
  FaCalendarAlt
} from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditCaseForm = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingFiles, setExistingFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [removedFiles, setRemovedFiles] = useState([]);
  
  // Categories would be the same as in CreateCaseForm
  const categories = [
    'Family Law', 'Criminal Law', 'Corporate Law', 'Real Estate', 
    'Intellectual Property', 'Employment Law', 'Immigration', 'Tax Law',
    'Personal Injury', 'Bankruptcy', 'Estate Planning', 'DUI/DWI',
    'Civil Rights', 'Environmental Law', 'Health Care Law', 'Other'
  ];

  const [formData, setFormData] = useState({
    title: '',
    clientId: '',
    clientName: '',
    lawyerId: '',
    lawyerName: '',
    category: '',
    budget: '',
    deadline: '',
    description: '',
    priority: 'medium',
    status: 'open',
    isUrgent: false
  });

  // Mock clients and lawyers - in a real app, these would come from an API
  const [clients] = useState([
    { _id: '1', name: 'John Doe', email: 'john@example.com' },
    { _id: '2', name: 'Sarah Johnson', email: 'sarah@example.com' },
    { _id: '3', name: 'Michael Brown', email: 'michael@example.com' },
  ]);

  const [lawyers] = useState([
    { _id: 'l1', name: 'Jane Smith', specialization: 'Family Law', rating: 4.8 },
    { _id: 'l2', name: 'Robert Johnson', specialization: 'Corporate Law', rating: 4.6 },
    { _id: 'l3', name: 'Emily Davis', specialization: 'Real Estate', rating: 4.9 },
  ]);

  // Fetch case data
  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call
        // const { data } = await axios.get(`/api/cases/${caseId}`);
        
        // Mock data - simulate API call
        setTimeout(() => {
          const mockCase = {
            _id: caseId,
            title: 'Divorce Settlement',
            client: { _id: '1', name: 'John Doe', email: 'john@example.com' },
            lawyer: { _id: 'l1', name: 'Jane Smith' },
            category: 'Family Law',
            status: 'in_progress',
            budget: 2500,
            description: 'Need assistance with divorce settlement and child custody agreement.',
            priority: 'high',
            isUrgent: true,
            deadline: '2023-12-31',
            documents: [
              { id: 'doc1', name: 'Marriage_Certificate.pdf', size: '2.4 MB', uploaded: '2023-11-10' },
              { id: 'doc2', name: 'Financial_Statement.pdf', size: '1.8 MB', uploaded: '2023-11-12' }
            ]
          };
          
          setFormData({
            title: mockCase.title,
            clientId: mockCase.client._id,
            clientName: mockCase.client.name,
            lawyerId: mockCase.lawyer?._id || '',
            lawyerName: mockCase.lawyer?.name || '',
            category: mockCase.category,
            budget: mockCase.budget,
            deadline: mockCase.deadline,
            description: mockCase.description,
            priority: mockCase.priority,
            status: mockCase.status,
            isUrgent: mockCase.isUrgent || false
          });
          
          setExistingFiles(mockCase.documents || []);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching case:', err);
        setError('Failed to load case data. Please try again.');
        setLoading(false);
      }
    };

    fetchCaseData();
  }, [caseId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDescriptionChange = (value) => {
    setFormData(prev => ({
      ...prev,
      description: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles(prev => [...prev, ...files]);
  };

  const removeExistingFile = (fileId) => {
    setRemovedFiles(prev => [...prev, fileId]);
    setExistingFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const removeNewFile = (index) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.clientId || !formData.category || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // In a real app, this would be an API call
      // const formDataToSend = new FormData();
      // formDataToSend.append('caseData', JSON.stringify(formData));
      // newFiles.forEach(file => {
      //   formDataToSend.append('documents', file);
      // });
      // formDataToSend.append('removedFiles', JSON.stringify(removedFiles));
      // 
      // await axios.put(`/api/cases/${caseId}`, formDataToSend, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setSuccess('Case updated successfully!');
      
      // Redirect to case detail after 1.5 seconds
      setTimeout(() => {
        navigate(`/admin/cases/${caseId}`);
      }, 1500);
      
    } catch (err) {
      console.error('Error updating case:', err);
      setError('Failed to update case. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCase = async () => {
    if (window.confirm('Are you sure you want to delete this case? This action cannot be undone.')) {
      try {
        // In a real app, this would be an API call
        // await axios.delete(`/api/cases/${caseId}`);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Redirect to cases list
        navigate('/admin/cases');
      } catch (err) {
        console.error('Error deleting case:', err);
        setError('Failed to delete case. Please try again.');
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

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading case data...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button 
          variant="outline-secondary" 
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="me-2" /> Back
        </Button>
        <div>
          <Button 
            variant="outline-danger" 
            className="me-2"
            onClick={handleDeleteCase}
            disabled={isSubmitting}
          >
            <FaTrash className="me-1" /> Delete Case
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="me-1" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <h2 className="mb-4">
        Edit Case: {formData.title}
        <span className="ms-3">
          {getStatusBadge(formData.status)}
        </span>
      </h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <Card.Header className="bg-light">
            <h5 className="mb-0">Case Information</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3" controlId="title">
                  <Form.Label>Case Title <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    required 
                  />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3" controlId="category">
                  <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                  <Form.Select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Case Description <span className="text-danger">*</span></Form.Label>
              <div className="border rounded">
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  style={{ height: '200px' }}
                />
              </div>
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="clientId">
                  <Form.Label>Client <span className="text-danger">*</span></Form.Label>
                  <Form.Select 
                    name="clientId" 
                    value={formData.clientId} 
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a client</option>
                    {clients.map(client => (
                      <option key={client._id} value={client._id}>
                        {client.name} ({client.email})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3" controlId="lawyerId">
                  <Form.Label>Assign to Lawyer (Optional)</Form.Label>
                  <Form.Select 
                    name="lawyerId" 
                    value={formData.lawyerId} 
                    onChange={handleChange}
                  >
                    <option value="">Select a lawyer (optional)</option>
                    {lawyers.map(lawyer => (
                      <option key={lawyer._id} value={lawyer._id}>
                        {lawyer.name} ({lawyer.specialization}) - ★{lawyer.rating}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="status">
                  <Form.Label>Status</Form.Label>
                  <Form.Select 
                    name="status" 
                    value={formData.status} 
                    onChange={handleChange}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="on_hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3" controlId="priority">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select 
                    name="priority" 
                    value={formData.priority} 
                    onChange={handleChange}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3" controlId="isUrgent">
                  <Form.Label>Urgency</Form.Label>
                  <div className="mt-2">
                    <Form.Check 
                      type="switch"
                      id="urgent-switch"
                      label="Mark as Urgent"
                      name="isUrgent"
                      checked={formData.isUrgent}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="budget">
                  <Form.Label>Budget (USD)</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaDollarSign /></InputGroup.Text>
                    <FormControl 
                      type="number" 
                      name="budget" 
                      value={formData.budget} 
                      onChange={handleChange} 
                      min="0"
                      step="100"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3" controlId="deadline">
                  <Form.Label>Deadline</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaCalendarAlt /></InputGroup.Text>
                    <FormControl 
                      type="date" 
                      name="deadline" 
                      value={formData.deadline} 
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        <Card className="mb-4">
          <Card.Header className="bg-light">
            <h5 className="mb-0">Documents</h5>
          </Card.Header>
          <Card.Body>
            {/* Existing Files */}
            {existingFiles.length > 0 && (
              <div className="mb-4">
                <h6>Current Documents</h6>
                <ListGroup>
                  {existingFiles.map(file => (
                    <ListGroup.Item key={file.id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <FaFileAlt className="text-primary me-2" />
                        {file.name}
                        <small className="text-muted ms-2">({file.size})</small>
                      </div>
                      <Button 
                        variant="link" 
                        className="text-danger p-0"
                        onClick={() => removeExistingFile(file.id)}
                        title="Remove file"
                      >
                        <FaTimes />
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}
            
            {/* New Files */}
            <div className="mb-3">
              <Form.Label>Upload Additional Documents</Form.Label>
              <div className="border rounded p-4 text-center">
                <FaFileAlt size={32} className="text-muted mb-2" />
                <p className="text-muted mb-3">Drag & drop files here or click to browse</p>
                <div className="d-flex justify-content-center">
                  <div className="btn btn-outline-primary">
                    <FaUpload className="me-2" />
                    Select Files
                    <Form.Control
                      type="file"
                      className="d-none"
                      multiple
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <p className="small text-muted mt-2 mb-0">
                  Max file size: 10MB. Supported formats: PDF, DOC, DOCX, JPG, PNG
                </p>
              </div>
              
              {newFiles.length > 0 && (
                <div className="mt-3">
                  <h6>New Files to Upload:</h6>
                  <ListGroup>
                    {newFiles.map((file, index) => (
                      <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                        <div>
                          <FaFileAlt className="text-primary me-2" />
                          {file.name}
                          <small className="text-muted ms-2">
                            ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                          </small>
                        </div>
                        <Button 
                          variant="link" 
                          className="text-danger p-0"
                          onClick={() => removeNewFile(index)}
                          title="Remove file"
                        >
                          <FaTimes />
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
        
        <div className="d-flex justify-content-between mb-5">
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate(`/admin/cases/${caseId}`)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          <div>
            <Button 
              variant="outline-danger me-2"
              onClick={handleDeleteCase}
              disabled={isSubmitting}
            >
              <FaTrash className="me-1" /> Delete Case
            </Button>
            
            <Button 
              variant="primary" 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="me-1" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </Form>
    </Container>
  );
};

export default EditCaseForm;
