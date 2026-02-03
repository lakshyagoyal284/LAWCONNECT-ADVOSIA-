import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FormControl
} from 'react-bootstrap';
import { FaArrowLeft, FaUser, FaDollarSign, FaCalendarAlt, FaFileAlt, FaUpload } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreateCaseForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [clients, setClients] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    clientId: '',
    lawyerId: '',
    category: '',
    budget: '',
    deadline: '',
    description: '',
    priority: 'medium',
    status: 'open',
    isUrgent: false
  });

  // Available categories
  const categories = [
    'Family Law',
    'Criminal Law',
    'Corporate Law',
    'Real Estate',
    'Intellectual Property',
    'Employment Law',
    'Immigration',
    'Tax Law',
    'Personal Injury',
    'Bankruptcy',
    'Estate Planning',
    'DUI/DWI',
    'Civil Rights',
    'Environmental Law',
    'Health Care Law',
    'International Law',
    'Entertainment Law',
    'Military Law',
    'Education Law',
    'Other'
  ];

  // Fetch clients and lawyers
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In a real app, these would be API calls
        // const [clientsRes, lawyersRes] = await Promise.all([
        //   axios.get('/api/users?role=client'),
        //   axios.get('/api/users?role=lawyer')
        // ]);
        
        // Mock data
        setTimeout(() => {
          const mockClients = [
            { _id: '1', name: 'John Doe', email: 'john@example.com' },
            { _id: '2', name: 'Sarah Johnson', email: 'sarah@example.com' },
            { _id: '3', name: 'Michael Brown', email: 'michael@example.com' },
          ];
          
          const mockLawyers = [
            { _id: 'l1', name: 'Jane Smith', specialization: 'Family Law', rating: 4.8 },
            { _id: 'l2', name: 'Robert Johnson', specialization: 'Corporate Law', rating: 4.6 },
            { _id: 'l3', name: 'Emily Davis', specialization: 'Real Estate', rating: 4.9 },
          ];
          
          setClients(mockClients);
          setLawyers(mockLawyers);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

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
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
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
      // selectedFiles.forEach(file => {
      //   formDataToSend.append('documents', file);
      // });
      // 
      // const response = await axios.post('/api/cases', formDataToSend, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setSuccess('Case created successfully!');
      
      // Reset form
      setFormData({
        title: '',
        clientId: '',
        lawyerId: '',
        category: '',
        budget: '',
        deadline: '',
        description: '',
        priority: 'medium',
        status: 'open',
        isUrgent: false
      });
      setSelectedFiles([]);
      
      // Redirect to cases list after 2 seconds
      setTimeout(() => {
        navigate('/admin/cases');
      }, 2000);
      
    } catch (err) {
      console.error('Error creating case:', err);
      setError('Failed to create case. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading form data...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button 
        variant="outline-secondary" 
        className="mb-4" 
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="me-2" /> Back
      </Button>
      
      <h2 className="mb-4">Create New Case</h2>
      
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
                    placeholder="E.g., Divorce Settlement, Contract Review, etc."
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
                  placeholder="Provide detailed information about the case..."
                  style={{ height: '200px' }}
                />
              </div>
            </Form.Group>
            
            <Row>
              <Col md={4}>
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
              
              <Col md={4}>
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
            </Row>
            
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3" controlId="budget">
                  <Form.Label>Estimated Budget (USD)</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaDollarSign /></InputGroup.Text>
                    <FormControl 
                      type="number" 
                      name="budget" 
                      value={formData.budget} 
                      onChange={handleChange} 
                      placeholder="e.g. 1000"
                      min="0"
                      step="100"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group className="mb-3" controlId="deadline">
                  <Form.Label>Deadline (Optional)</Form.Label>
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
            </Row>
            
            <Form.Group className="mb-3" controlId="isUrgent">
              <Form.Check 
                type="checkbox" 
                label="Mark as Urgent" 
                name="isUrgent"
                checked={formData.isUrgent}
                onChange={handleChange}
              />
            </Form.Group>
          </Card.Body>
        </Card>
        
        <Card className="mb-4">
          <Card.Header className="bg-light">
            <h5 className="mb-0">Documents</h5>
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Upload Documents (Optional)</Form.Label>
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
              
              {selectedFiles.length > 0 && (
                <div className="mt-3">
                  <h6>Selected Files:</h6>
                  <ul className="list-group">
                    {selectedFiles.map((file, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
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
                          onClick={() => removeFile(index)}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Form.Group>
          </Card.Body>
        </Card>
        
        <div className="d-flex justify-content-end gap-2 mb-5">
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate('/admin/cases')}
            disabled={isSubmitting}
          >
            Cancel
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
                Creating Case...
              </>
            ) : (
              'Create Case'
            )}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default CreateCaseForm;
