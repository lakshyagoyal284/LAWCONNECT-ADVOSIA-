import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Alert, 
  Spinner,
  FormControl,
  InputGroup,
  ProgressBar
} from 'react-bootstrap';
import { 
  FaArrowLeft, 
  FaPlus, 
  FaTimes, 
  FaPaperclip, 
  FaTrash,
  FaInfoCircle
} from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreateCase = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    budget: '',
    deadline: '',
    isUrgent: false,
    isConfidential: false
  });
  
  const [documents, setDocuments] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({
    title: false,
    category: false,
    description: false,
    budget: false,
    deadline: false
  });

  // Categories for the case
  const categories = [
    'Family Law',
    'Criminal Law',
    'Corporate Law',
    'Real Estate',
    'Intellectual Property',
    'Employment Law',
    'Immigration',
    'Personal Injury',
    'Bankruptcy',
    'Tax Law',
    'Other'
  ];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Mark the field as touched
    if (name in touched) {
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
    }
  };

  // Handle rich text editor changes
  const handleDescriptionChange = (value) => {
    setFormData(prev => ({
      ...prev,
      description: value
    }));
    setTouched(prev => ({
      ...prev,
      description: true
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate files
    const validFiles = files.filter(file => {
      const fileSizeMB = file.size / (1024 * 1024); // Convert to MB
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (!validTypes.includes(file.type)) {
        setError(`Unsupported file type: ${file.name}. Please upload PDF or Word documents.`);
        return false;
      }
      
      if (fileSizeMB > 10) {
        setError(`File too large: ${file.name}. Maximum size is 10MB.`);
        return false;
      }
      
      return true;
    });
    
    // Add to documents if valid
    setDocuments(prev => [
      ...prev,
      ...validFiles.map(file => ({
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: file.type,
        uploaded: new Date().toISOString(),
        status: 'pending'
      }))
    ]);
    
    // Reset file input
    e.target.value = null;
  };

  // Remove a document
  const removeDocument = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  // Simulate file upload
  const uploadFiles = async () => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          clearInterval(interval);
          setDocuments(prev => 
            prev.map(doc => ({
              ...doc,
              status: 'uploaded'
            }))
          );
          resolve(true);
        }
        setUploadProgress(progress);
      }, 200);
    });
  };

  // Form validation
  const validateForm = () => {
    const errors = [];
    
    if (!formData.title.trim()) errors.push('Title is required');
    if (!formData.category) errors.push('Category is required');
    if (!formData.description || formData.description === '<p>\n</p>') {
      errors.push('Description is required');
    }
    if (!formData.budget || isNaN(formData.budget) || formData.budget <= 0) {
      errors.push('Please enter a valid budget amount');
    }
    if (!formData.deadline) {
      errors.push('Deadline is required');
    } else if (new Date(formData.deadline) < new Date()) {
      errors.push('Deadline must be in the future');
    }
    
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Mark all fields as touched
    setTouched({
      title: true,
      category: true,
      description: true,
      budget: true,
      deadline: true
    });
    
    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join('. ') + '.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload files first (in a real app, this would be an API call)
      if (documents.length > 0) {
        await uploadFiles();
      }
      
      // Prepare case data (in a real app, this would be sent to the server)
      const caseData = {
        ...formData,
        documents: documents.map(doc => ({
          name: doc.name,
          size: doc.size,
          type: doc.type,
          uploaded: doc.uploaded
        })),
        status: 'pending',
        createdAt: new Date().toISOString(),
        id: 'case-' + Date.now()
      };
      
      console.log('Submitting case:', caseData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to case detail page
      navigate(`/client/cases/${caseData.id}`);
      
    } catch (err) {
      console.error('Error submitting case:', err);
      setError('Failed to submit case. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if a field has an error
  const hasError = (field) => {
    return touched[field] && !formData[field];
  };

  return (
    <Container className="py-4">
      <Button 
        variant="outline-secondary" 
        onClick={() => navigate(-1)} 
        className="mb-4"
      >
        <FaArrowLeft className="me-2" /> Back to Dashboard
      </Button>

      <h2 className="mb-4">Create New Case</h2>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          <FaTimes className="me-2" />
          {error}
        </Alert>
      )}
      
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-4">Case Information</h5>
                
                {/* Case Title */}
                <Form.Group className="mb-4">
                  <Form.Label>Case Title <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    isInvalid={hasError('title')}
                    placeholder="E.g., Divorce Settlement Agreement"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a title for your case.
                  </Form.Control.Feedback>
                </Form.Group>
                
                {/* Category */}
                <Form.Group className="mb-4">
                  <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    isInvalid={hasError('category')}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select a category.
                  </Form.Control.Feedback>
                </Form.Group>
                
                {/* Description */}
                <Form.Group className="mb-4">
                  <Form.Label>Case Description <span className="text-danger">*</span></Form.Label>
                  <div className={hasError('description') ? 'border border-danger rounded' : ''}>
                    <ReactQuill
                      theme="snow"
                      value={formData.description}
                      onChange={handleDescriptionChange}
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          ['link', 'clean'],
                          ['blockquote', 'code-block']
                        ]
                      }}
                      className="bg-white"
                      style={{ minHeight: '200px' }}
                    />
                  </div>
                  {hasError('description') && (
                    <div className="text-danger small mt-1">
                      Please provide a description of your case.
                    </div>
                  )}
                </Form.Group>
                
                {/* Budget and Deadline */}
                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Budget ($) <span className="text-danger">*</span></Form.Label>
                      <InputGroup>
                        <InputGroup.Text>$</InputGroup.Text>
                        <FormControl
                          type="number"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          isInvalid={hasError('budget')}
                          min="0"
                          step="0.01"
                          placeholder="E.g., 1000"
                        />
                      </InputGroup>
                      <Form.Text className="text-muted">
                        Estimated legal fees you're willing to pay
                      </Form.Text>
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid budget amount.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Deadline <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        isInvalid={hasError('deadline') || (touched.deadline && new Date(formData.deadline) < new Date())}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <Form.Control.Feedback type="invalid">
                        {hasError('deadline') 
                          ? 'Please select a deadline.' 
                          : 'Deadline must be in the future.'}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                {/* Additional Options */}
                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    id="isUrgent"
                    name="isUrgent"
                    label="This is an urgent matter"
                    checked={formData.isUrgent}
                    onChange={handleChange}
                    className="mb-2"
                  />
                  <Form.Check
                    type="checkbox"
                    id="isConfidential"
                    name="isConfidential"
                    label="Mark as confidential"
                    checked={formData.isConfidential}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
            
            {/* Documents Section */}
            <Card className="mb-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">Case Documents</h5>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <FaPaperclip className="me-1" /> Add Files
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    style={{ display: 'none' }}
                  />
                </div>
                
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small>Uploading files...</small>
                      <small>{Math.round(uploadProgress)}%</small>
                    </div>
                    <ProgressBar now={uploadProgress} />
                  </div>
                )}
                
                {documents.length > 0 ? (
                  <div className="border rounded">
                    {documents.map((doc) => (
                      <div 
                        key={doc.id} 
                        className="d-flex justify-content-between align-items-center p-3 border-bottom"
                      >
                        <div className="d-flex align-items-center">
                          <FaFileAlt className="text-primary me-2" />
                          <div>
                            <div className="fw-medium">{doc.name}</div>
                            <small className="text-muted">{doc.size}</small>
                          </div>
                        </div>
                        <Button 
                          variant="link" 
                          className="text-danger p-0"
                          onClick={() => removeDocument(doc.id)}
                          disabled={isSubmitting}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 border rounded bg-light">
                    <FaPaperclip size={32} className="text-muted mb-2" />
                    <p className="mb-0 text-muted">
                      No documents attached. Click 'Add Files' to upload supporting documents.
                    </p>
                    <small className="text-muted">
                      Supported formats: PDF, DOC, DOCX (Max 10MB per file)
                    </small>
                  </div>
                )}
              </Card.Body>
            </Card>
            
            {/* Submit Button */}
            <div className="d-flex justify-content-end gap-3 mb-5">
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate(-1)}
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
                    Submitting...
                  </>
                ) : (
                  'Submit Case'
                )}
              </Button>
            </div>
          </Col>
          
          <Col lg={4}>
            <Card className="sticky-top" style={{ top: '20px' }}>
              <Card.Body>
                <h6 className="mb-3">
                  <FaInfoCircle className="me-2 text-primary" />
                  Tips for a Great Case Posting
                </h6>
                <ul className="small text-muted">
                  <li className="mb-2">
                    <strong>Be specific</strong> about your legal needs and desired outcomes.
                  </li>
                  <li className="mb-2">
                    <strong>Include all relevant details</strong> to help lawyers understand your situation.
                  </li>
                  <li className="mb-2">
                    <strong>Set a realistic budget</strong> based on the complexity of your case.
                  </li>
                  <li className="mb-2">
                    <strong>Upload supporting documents</strong> (e.g., contracts, notices, correspondence).
                  </li>
                  <li className="mb-2">
                    <strong>Be responsive</strong> to lawyer inquiries to get the best matches.
                  </li>
                </ul>
                
                <hr className="my-3" />
                
                <div className="bg-light p-3 rounded">
                  <h6>Need help?</h6>
                  <p className="small mb-2">
                    Our support team is here to assist you with creating your case.
                  </p>
                  <Button variant="outline-primary" size="sm">
                    Contact Support
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default CreateCase;
