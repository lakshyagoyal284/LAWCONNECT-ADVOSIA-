# Database Schema Documentation

## Database Overview

**Database Name:** `lawconnect_db`  
**Engine:** MySQL 8.0+  
**Character Set:** utf8mb4  
**Collation:** utf8mb4_unicode_ci

## 📋 Tables

### 1. users

User accounts and authentication data.

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('client', 'lawyer', 'admin') DEFAULT 'client',
  phone VARCHAR(20),
  profile_image VARCHAR(500),
  bio TEXT,
  experience_years INT,
  specialization TEXT,
  education TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);
```

**Columns:**
- `id` - Primary key
- `name` - User's full name
- `email` - Unique email address
- `password` - Hashed password (bcrypt)
- `role` - User role (client/lawyer/admin)
- `phone` - Phone number
- `profile_image` - Profile picture URL
- `bio` - User biography
- `experience_years` - Years of experience (lawyers)
- `specialization` - Areas of specialization (lawyers)
- `education` - Educational background
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### 2. cases

Legal cases created by clients.

```sql
CREATE TABLE cases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category ENUM('Family Law', 'Criminal Law', 'Corporate Law', 'Intellectual Property', 'Real Estate', 'Immigration', 'Employment', 'Tax', 'Bankruptcy', 'Other') NOT NULL,
  status ENUM('open', 'in_progress', 'closed', 'cancelled') DEFAULT 'open',
  currency VARCHAR(10) DEFAULT 'USD',
  budget DECIMAL(10,2),
  deadline DATE,
  location VARCHAR(255),
  is_remote BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_category (category),
  INDEX idx_client (user_id)
);
```

**Columns:**
- `id` - Primary key
- `user_id` - Client ID (foreign key)
- `title` - Case title
- `description` - Case description
- `category` - Legal category
- `status` - Case status
- `currency` - Currency code
- `budget` - Budget amount
- `deadline` - Case deadline
- `location` - Physical location
- `is_remote` - Remote work allowed
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### 3. bids

Bids submitted by lawyers for cases.

```sql
CREATE TABLE bids (
  id INT AUTO_INCREMENT PRIMARY KEY,
  case_id INT NOT NULL,
  lawyer_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  message TEXT,
  status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
  FOREIGN KEY (lawyer_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_case_bids (case_id, status),
  INDEX idx_lawyer_bids (lawyer_id),
  UNIQUE KEY unique_case_lawyer (case_id, lawyer_id)
);
```

**Columns:**
- `id` - Primary key
- `case_id` - Case ID (foreign key)
- `lawyer_id` - Lawyer ID (foreign key)
- `amount` - Bid amount
- `message` - Bid message/proposal
- `status` - Bid status
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### 4. messages

Chat messages between users.

```sql
CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  case_id INT NOT NULL,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  content TEXT NOT NULL,
  message_type ENUM('text', 'file') DEFAULT 'text',
  file_url VARCHAR(500),
  file_name VARCHAR(255),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_case_messages (case_id, created_at),
  INDEX idx_user_messages (sender_id, receiver_id, created_at)
);
```

**Columns:**
- `id` - Primary key
- `case_id` - Case ID (foreign key)
- `sender_id` - Sender ID (foreign key)
- `receiver_id` - Receiver ID (foreign key)
- `content` - Message content
- `message_type` - Message type (text/file)
- `file_url` - File URL (if applicable)
- `file_name` - File name (if applicable)
- `is_read` - Read status
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### 5. payments

Payment records for chat access.

```sql
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  case_id INT NOT NULL,
  user_id INT NOT NULL,
  bid_id INT,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  payment_type ENUM('chat_access', 'milestone', 'final_payment') DEFAULT 'chat_access',
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  payment_gateway_id VARCHAR(255),
  gateway_response TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (bid_id) REFERENCES bids(id) ON DELETE SET NULL,
  INDEX idx_case_payments (case_id, status),
  INDEX idx_user_payments (user_id, status)
);
```

**Columns:**
- `id` - Primary key
- `case_id` - Case ID (foreign key)
- `user_id` - User ID (foreign key)
- `bid_id` - Bid ID (foreign key)
- `amount` - Payment amount
- `currency` - Currency code
- `payment_type` - Payment type
- `status` - Payment status
- `payment_gateway_id` - Gateway transaction ID
- `gateway_response` - Gateway response data
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## 🔗 Relationships

### Entity Relationship Diagram

```
users (1) ──────── (N) cases
  │                     │
  │                     │
  │                     (1)
  │                     │
  │                     │
  │                (N) bids (N)
  │                     │
  │                     │
  │                     (1)
  │                     │
  │                     │
  └───────── (N) messages (N) ──────┘
                     │
                     │
                (N) payments
                     │
                     (1)
                     cases
```

### Relationship Details

1. **users → cases** (One-to-Many)
   - One client can create multiple cases
   - Each case belongs to one client

2. **users → bids** (One-to-Many)
   - One lawyer can submit multiple bids
   - Each bid belongs to one lawyer

3. **cases → bids** (One-to-Many)
   - One case can receive multiple bids
   - Each bid belongs to one case

4. **users → messages** (One-to-Many)
   - One user can send multiple messages
   - Each message belongs to one sender

5. **cases → messages** (One-to-Many)
   - One case can have multiple messages
   - Each message belongs to one case

6. **users → payments** (One-to-Many)
   - One user can make multiple payments
   - Each payment belongs to one user

7. **cases → payments** (One-to-Many)
   - One case can have multiple payments
   - Each payment belongs to one case

## 📊 Indexes

### Performance Indexes

```sql
-- Users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Cases table
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_category ON cases(category);
CREATE INDEX idx_cases_client ON cases(user_id);

-- Bids table
CREATE INDEX idx_bids_case ON bids(case_id, status);
CREATE INDEX idx_bids_lawyer ON bids(lawyer_id);

-- Messages table
CREATE INDEX idx_messages_case ON messages(case_id, created_at);
CREATE INDEX idx_messages_users ON messages(sender_id, receiver_id, created_at);

-- Payments table
CREATE INDEX idx_payments_case ON payments(case_id, status);
CREATE INDEX idx_payments_user ON payments(user_id, status);
```

## 🔍 Sample Queries

### Common Queries

#### Get User with Cases
```sql
SELECT u.*, c.title, c.status, c.created_at as case_date
FROM users u
LEFT JOIN cases c ON u.id = c.user_id
WHERE u.id = ?;
```

#### Get Case with Bids and Lawyer Info
```sql
SELECT c.*, 
       b.id as bid_id, 
       b.amount as bid_amount, 
       b.status as bid_status,
       l.name as lawyer_name,
       l.email as lawyer_email
FROM cases c
LEFT JOIN bids b ON c.id = b.case_id
LEFT JOIN users l ON b.lawyer_id = l.id
WHERE c.id = ?;
```

#### Get Chat Messages for Case
```sql
SELECT m.*, 
       s.name as sender_name,
       r.name as receiver_name
FROM messages m
JOIN users s ON m.sender_id = s.id
JOIN users r ON m.receiver_id = r.id
WHERE m.case_id = ?
ORDER BY m.created_at ASC;
```

#### Get User Payment History
```sql
SELECT p.*, c.title as case_title
FROM payments p
JOIN cases c ON p.case_id = c.id
WHERE p.user_id = ?
ORDER BY p.created_at DESC;
```

#### Get Lawyer Statistics
```sql
SELECT 
    COUNT(DISTINCT c.id) as total_cases,
    COUNT(b.id) as total_bids,
    COUNT(CASE WHEN b.status = 'accepted' THEN 1 END) as accepted_bids,
    AVG(b.amount) as avg_bid_amount
FROM users u
LEFT JOIN bids b ON u.id = b.lawyer_id
LEFT JOIN cases c ON b.case_id = c.id
WHERE u.id = ? AND u.role = 'lawyer';
```

## 🛡️ Data Integrity

### Constraints

1. **Foreign Key Constraints**
   - Ensure referential integrity
   - Cascade delete for related data
   - Prevent orphaned records

2. **Unique Constraints**
   - Email uniqueness in users table
   - Case-lawyer combination uniqueness in bids

3. **Check Constraints**
   - Enum values for status fields
   - Positive values for amounts
   - Valid date ranges

### Triggers (Optional)

```sql
-- Update case status when bid is accepted
DELIMITER //
CREATE TRIGGER update_case_status_on_bid_accept
AFTER UPDATE ON bids
FOR EACH ROW
BEGIN
    IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
        UPDATE cases SET status = 'in_progress' WHERE id = NEW.case_id;
    END IF;
END//
DELIMITER ;

-- Auto-update timestamps
DELIMITER //
CREATE TRIGGER update_cases_timestamp
BEFORE UPDATE ON cases
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//
DELIMITER ;
```

## 📈 Performance Considerations

### Optimization Tips

1. **Indexing Strategy**
   - Index frequently queried columns
   - Composite indexes for complex queries
   - Avoid over-indexing

2. **Query Optimization**
   - Use EXPLAIN to analyze queries
   - Avoid SELECT * in production
   - Use LIMIT for pagination

3. **Data Archiving**
   - Archive old messages
   - Clean up failed payments
   - Compress large text fields

4. **Connection Pooling**
   - Configure connection pool size
   - Monitor connection usage
   - Handle connection timeouts

## 🔧 Maintenance

### Regular Tasks

```sql
-- Clean up old messages (older than 1 year)
DELETE FROM messages WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);

-- Archive completed cases
UPDATE cases SET status = 'archived' 
WHERE status = 'closed' AND updated_at < DATE_SUB(NOW(), INTERVAL 6 MONTHS);

-- Optimize tables
OPTIMIZE TABLE users, cases, bids, messages, payments;

-- Check table integrity
CHECK TABLE users, cases, bids, messages, payments;
```

### Backup Strategy

```bash
# Full database backup
mysqldump -u root -p lawconnect_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Compressed backup
mysqldump -u root -p lawconnect_db | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Restore database
mysql -u root -p lawconnect_db < backup_20240101_120000.sql
```

---

**Schema Version:** v1.0.0  
**Last Updated:** 2024-01-01
