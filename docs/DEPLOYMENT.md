# Deployment Guide

This guide will help you deploy LawConnect to production.

## 🚀 Deployment Options

### Frontend Deployment Options

#### 1. Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

#### 2. Netlify
```bash
# Build
cd frontend
npm run build

# Deploy build folder to Netlify
```

#### 3. AWS S3 + CloudFront
```bash
# Build
npm run build

# Upload build folder to S3
# Configure CloudFront distribution
```

### Backend Deployment Options

#### 1. Railway (Recommended)
```bash
# Connect GitHub repository to Railway
# Configure environment variables
# Auto-deploy on push
```

#### 2. Heroku
```bash
# Install Heroku CLI
npm i -g heroku

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set DB_HOST=your-db-host
heroku config:set DB_USER=your-db-user
heroku config:set DB_PASSWORD=your-db-password
heroku config:set DB_NAME=your-db-name
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set RAZORPAY_KEY_ID=your-razorpay-key
heroku config:set RAZORPAY_KEY_SECRET=your-razorpay-secret

# Deploy
git push heroku main
```

#### 3. DigitalOcean
```bash
# Create Droplet
# Setup Node.js environment
# Configure Nginx reverse proxy
# Deploy using PM2
```

## 🗄️ Database Setup

### MySQL Database
```sql
-- Create database
CREATE DATABASE lawconnect_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'lawconnect_user'@'%' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON lawconnect_db.* TO 'lawconnect_user'@'%';
FLUSH PRIVILEGES;

-- Import schema
mysql -u lawconnect_user -p lawconnect_db < database/database.sql
```

### Database Connection
```env
DB_HOST=your-database-host
DB_USER=lawconnect_user
DB_PASSWORD=secure_password
DB_NAME=lawconnect_db
```

## 🔧 Environment Configuration

### Production Environment Variables
```env
# Database
DB_HOST=localhost
DB_USER=lawconnect_user
DB_PASSWORD=secure_password
DB_NAME=lawconnect_db

# JWT
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Razorpay (Live Mode)
RAZORPAY_KEY_ID=rzp_live_your_live_key_id
RAZORPAY_KEY_SECRET=your_live_secret_key

# Server
PORT=5004
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL=https://your-domain.com
```

## 🔒 SSL Certificate Setup

### Using Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🌐 Nginx Configuration

### Nginx Config for Backend
```nginx
server {
    listen 80;
    server_name your-api-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-api-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-api-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-api-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Nginx Config for Frontend
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;
    root /var/www/lawconnect/build;
    index index.html;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 💳 Razorpay Production Setup

### 1. Create Razorpay Account
1. Sign up at [razorpay.com](https://razorpay.com)
2. Complete KYC verification
3. Add bank account for settlements

### 2. Configure Webhooks
1. Go to Razorpay Dashboard → Webhooks
2. Add webhook URL: `https://your-api-domain.com/api/payments/complete`
3. Enable events:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`

### 3. Update Frontend Configuration
```javascript
// In frontend/src/components/payment/PaymentModal.js
const options = {
  key: 'rzp_live_your_live_key_id', // Use live key
  // ... other options
};
```

## 🔄 Process Management

### Using PM2
```bash
# Install PM2
npm install -g pm2

# Start backend
cd backend
pm2 start server.js --name "lawconnect-api"

# Start with cluster mode
pm2 start server.js -i max --name "lawconnect-api"

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup
```

### PM2 Configuration File
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'lawconnect-api',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5004
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

## 📊 Monitoring

### Application Monitoring
```bash
# PM2 Monitoring
pm2 monit

# Log monitoring
pm2 logs lawconnect-api

# Restart on failure
pm2 restart lawconnect-api
```

### Database Monitoring
```sql
-- Check database size
SELECT table_schema AS 'Database',
       ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'lawconnect_db';
```

## 🔍 Testing Deployment

### Health Check Endpoint
```javascript
// Add to server.js
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Test API
```bash
# Test health endpoint
curl https://your-api-domain.com/health

# Test authentication
curl -X POST https://your-api-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection
```bash
# Check MySQL service
sudo systemctl status mysql

# Check logs
sudo tail -f /var/log/mysql/error.log
```

#### 2. SSL Certificate
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew
```

#### 3. Nginx Configuration
```bash
# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

#### 4. PM2 Issues
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs

# Restart all apps
pm2 restart all
```

## 📈 Performance Optimization

### Backend Optimization
- Enable database query caching
- Implement Redis for session storage
- Use CDN for static assets
- Enable Gzip compression

### Frontend Optimization
- Code splitting and lazy loading
- Image optimization
- Service worker for caching
- Minify CSS and JavaScript

## 🔐 Security Checklist

- [ ] SSL certificate installed
- [ ] Environment variables configured
- [ ] Database credentials secured
- [ ] Firewall configured
- [ ] Rate limiting implemented
- [ ] Input validation enabled
- [ ] CORS properly configured
- [ ] Security headers set
- [ ] Regular backups configured
- [ ] Monitoring and logging enabled

## 📞 Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Test database connectivity
4. Check SSL certificate status
5. Monitor system resources

---

**Happy Deploying! 🚀**
