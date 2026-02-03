# API Documentation

## Base URL
```
Production: https://your-api-domain.com/api
Development: http://localhost:5004/api
```

## Authentication

All API endpoints (except login/register) require JWT token in Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📝 Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "client|lawyer"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client"
  }
}
```

#### Get User Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "client",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Cases

#### Get All Cases
```http
GET /cases
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Divorce Case",
    "description": "Need help with divorce proceedings",
    "category": "Family Law",
    "status": "open",
    "currency": "USD",
    "budget": "5000.00",
    "user_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get Case by ID
```http
GET /cases/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "title": "Divorce Case",
  "description": "Need help with divorce proceedings",
  "category": "Family Law",
  "status": "open",
  "currency": "USD",
  "budget": "5000.00",
  "user_id": 1,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

#### Create Case
```http
POST /cases
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Case",
  "description": "Case description",
  "category": "Criminal Law",
  "currency": "USD",
  "budget": "3000.00"
}
```

**Response:**
```json
{
  "message": "Case created successfully",
  "case": {
    "id": 2,
    "title": "New Case",
    "description": "Case description",
    "category": "Criminal Law",
    "status": "open",
    "currency": "USD",
    "budget": "3000.00",
    "user_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update Case
```http
PUT /cases/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Case",
  "description": "Updated description",
  "status": "in_progress"
}
```

#### Delete Case
```http
DELETE /cases/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Case deleted successfully"
}
```

### Bids

#### Get Bids for Case
```http
GET /bids/case/:caseId
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "case_id": 1,
    "lawyer_id": 2,
    "amount": "2000.00",
    "message": "I can help with this case",
    "status": "pending",
    "lawyer_name": "Jane Smith",
    "lawyer_email": "jane@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Create Bid
```http
POST /bids
Authorization: Bearer <token>
Content-Type: application/json

{
  "case_id": 1,
  "amount": "1500.00",
  "message": "I have experience in this area"
}
```

**Response:**
```json
{
  "message": "Bid submitted successfully",
  "bid": {
    "id": 2,
    "case_id": 1,
    "lawyer_id": 2,
    "amount": "1500.00",
    "message": "I have experience in this area",
    "status": "pending",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Accept Bid
```http
PUT /bids/:id/accept
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Bid accepted successfully"
}
```

#### Reject Bid
```http
PUT /bids/:id/reject
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Bid rejected successfully"
}
```

### Messages

#### Get Case Messages
```http
GET /messages/case/:caseId
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "case_id": 1,
    "sender_id": 1,
    "receiver_id": 2,
    "content": "Hello, I need help with my case",
    "sender_name": "John Doe",
    "created_at": "2024-01-01T00:00:00.000Z",
    "is_read": false
  }
]
```

#### Send Message
```http
POST /messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "caseId": 1,
  "content": "Thank you for your help",
  "receiverId": 2
}
```

**Response:**
```json
{
  "message": "Message sent successfully",
  "message": {
    "id": 2,
    "case_id": 1,
    "sender_id": 1,
    "receiver_id": 2,
    "content": "Thank you for your help",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Mark Messages as Read
```http
PUT /messages/read/:caseId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Messages marked as read"
}
```

### Payments

#### Create Chat Payment
```http
POST /payments/chat-access
Authorization: Bearer <token>
Content-Type: application/json

{
  "caseId": 1,
  "bidId": 1,
  "amount": 150
}
```

**Response:**
```json
{
  "message": "Payment order created successfully",
  "payment": {
    "id": 1,
    "amount": 150,
    "currency": "INR",
    "caseId": 1,
    "bidId": 1,
    "razorpay_order_id": "order_1234567890",
    "razorpay_key": "rzp_test_1DP5mmOlF5G5ag"
  }
}
```

#### Check Chat Access
```http
GET /payments/chat-access/:caseId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "hasChatAccess": true,
  "payment": {
    "id": 1,
    "amount": 150,
    "status": "completed",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Complete Payment (Webhook)
```http
POST /payments/complete
Content-Type: application/json

{
  "payment_id": 1,
  "status": "success",
  "payment_gateway_id": "pay_1234567890",
  "gateway_response": {
    "razorpay_payment_id": "pay_1234567890",
    "razorpay_order_id": "order_1234567890",
    "razorpay_signature": "signature123"
  }
}
```

**Response:**
```json
{
  "message": "Payment status updated successfully"
}
```

## 🚨 Error Responses

All errors return consistent format:

```json
{
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

### Common Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

### Example Error Response
```json
{
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": {
      "email": "Email is required",
      "password": "Password must be at least 6 characters"
    }
  }
}
```

## 🔒 Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per minute
- **File upload endpoints**: 10 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 📊 Pagination

List endpoints support pagination:

```http
GET /cases?page=1&limit=10&sort=created_at&order=desc
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🔍 Search & Filtering

### Search Cases
```http
GET /cases?search=divorce&category=Family Law&status=open
```

### Filter Bids
```http
GET /bids/case/1?status=pending&min_amount=1000&max_amount=5000
```

## 📡 WebSocket Events

Real-time chat using Socket.IO:

### Connection
```javascript
const socket = io('http://localhost:5004', {
  auth: { token: 'your-jwt-token' }
});
```

### Events

#### Join Case Room
```javascript
socket.emit('join_case', { caseId: 1 });
```

#### Send Message
```javascript
socket.emit('send_message', {
  caseId: 1,
  content: 'Hello!',
  receiverId: 2
});
```

#### Receive Message
```javascript
socket.on('new_message', (message) => {
  console.log('New message:', message);
});
```

#### Typing Indicators
```javascript
// Start typing
socket.emit('start_typing', { caseId: 1, receiverId: 2 });

// Stop typing
socket.emit('stop_typing', { caseId: 1, receiverId: 2 });

// Receive typing indicator
socket.on('user_typing', (data) => {
  console.log('User is typing:', data);
});
```

## 🧪 Testing

### Test with Postman

Import the Postman collection from `docs/postman-collection.json` to test all endpoints.

### Test with curl

```bash
# Test health endpoint
curl http://localhost:5004/api/test

# Test login
curl -X POST http://localhost:5004/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

---

**API Version:** v1.0.0  
**Last Updated:** 2024-01-01
