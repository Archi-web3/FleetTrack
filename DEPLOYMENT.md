# 🚀 FleetTrack Deployment Guide

This guide covers deploying FleetTrack to production environments.

---

## 📋 Pre-Deployment Checklist

- [ ] MongoDB instance configured and accessible
- [ ] Node.js 18+ installed on server
- [ ] Domain name configured (optional but recommended)
- [ ] SSL certificate obtained (Let's Encrypt recommended)
- [ ] Environment variables configured
- [ ] Firewall rules configured

---

## 🔧 Environment Setup

### 1. Server Requirements

**Minimum Requirements:**
- CPU: 2 cores
- RAM: 4 GB
- Storage: 20 GB SSD
- OS: Ubuntu 20.04+ / Debian 11+ / Windows Server 2019+

**Recommended for Production:**
- CPU: 4 cores
- RAM: 8 GB
- Storage: 50 GB SSD
- OS: Ubuntu 22.04 LTS

### 2. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB 6
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2 for process management
sudo npm install -g pm2
```

---

## 📦 Application Deployment

### 1. Clone Repository

```bash
cd /var/www
sudo git clone https://github.com/Archi-web3/FleetTrack.git
cd FleetTrack
```

### 2. Configure Backend

```bash
cd Angular/backend

# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

**Production `.env` configuration:**
```env
PORT=3000
NODE_ENV=production

# MongoDB with authentication
MONGODB_URI=mongodb://fleettrack_user:STRONG_PASSWORD@localhost:27017/fleettrack?authSource=admin

# Strong JWT secret (generate with: openssl rand -base64 32)
JWT_SECRET=your_generated_secret_here
JWT_EXPIRES_IN=7d

# Production origins
ALLOWED_ORIGINS=https://yourdomain.com,https://m.yourdomain.com

# File uploads
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/var/www/FleetTrack/uploads

# Logging
LOG_LEVEL=warn

# Security
FORCE_HTTPS=true
SESSION_SECRET=your_session_secret_here

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Install Dependencies

```bash
# Backend
cd /var/www/FleetTrack/Angular/backend
npm ci --production

# Web app
cd ../gestion-des-deplacements
npm ci --production

# Mobile PWA
cd ../e-logbook
npm ci --production
```

### 4. Build Frontend Applications

```bash
# Build web management interface
cd /var/www/FleetTrack/Angular/gestion-des-deplacements
npm run build

# Build mobile PWA
cd ../e-logbook
npm run build
```

---

## 🔐 MongoDB Security

### Create Database User

```bash
mongosh

use admin
db.createUser({
  user: "fleettrack_user",
  pwd: "STRONG_PASSWORD_HERE",
  roles: [
    { role: "readWrite", db: "fleettrack" }
  ]
})

# Enable authentication
exit
```

Edit MongoDB config:
```bash
sudo nano /etc/mongod.conf
```

Add:
```yaml
security:
  authorization: enabled
```

Restart MongoDB:
```bash
sudo systemctl restart mongod
```

---

## 🌐 Web Server Configuration

### Option A: Nginx (Recommended)

Install Nginx:
```bash
sudo apt install -y nginx
```

Create configuration:
```bash
sudo nano /etc/nginx/sites-available/fleettrack
```

**Nginx configuration:**
```nginx
# Backend API
upstream backend {
    server localhost:3000;
}

# Web Management Interface
server {
    listen 80;
    server_name yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Web app
    location / {
        root /var/www/FleetTrack/Angular/gestion-des-deplacements/dist/gestion-des-deplacements;
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Mobile PWA
server {
    listen 443 ssl http2;
    server_name m.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        root /var/www/FleetTrack/Angular/e-logbook/dist/e-logbook;
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/fleettrack /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### SSL Certificate (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d m.yourdomain.com
```

---

## 🔄 Process Management with PM2

### Start Backend

```bash
cd /var/www/FleetTrack/Angular/backend

# Start with PM2
pm2 start server.js --name fleettrack-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Run the command that PM2 outputs
```

### PM2 Useful Commands

```bash
# View logs
pm2 logs fleettrack-api

# Restart
pm2 restart fleettrack-api

# Stop
pm2 stop fleettrack-api

# Monitor
pm2 monit

# List processes
pm2 list
```

---

## 🔍 Monitoring & Maintenance

### Log Management

```bash
# Backend logs
pm2 logs fleettrack-api --lines 100

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Database Backup

Create backup script:
```bash
sudo nano /usr/local/bin/backup-fleettrack.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/backups/fleettrack"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
mongodump --uri="mongodb://fleettrack_user:PASSWORD@localhost:27017/fleettrack" --out="$BACKUP_DIR/backup_$DATE"

# Keep only last 7 days
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +
```

Make executable and schedule:
```bash
sudo chmod +x /usr/local/bin/backup-fleettrack.sh
sudo crontab -e

# Add daily backup at 2 AM
0 2 * * * /usr/local/bin/backup-fleettrack.sh
```

---

## 🔄 Updates & Deployment

### Update Application

```bash
cd /var/www/FleetTrack

# Pull latest changes
git pull origin main

# Update backend
cd Angular/backend
npm ci --production
pm2 restart fleettrack-api

# Rebuild and deploy frontend
cd ../gestion-des-deplacements
npm ci --production
npm run build

cd ../e-logbook
npm ci --production
npm run build
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check logs
pm2 logs fleettrack-api

# Check MongoDB connection
mongosh --eval "db.adminCommand('ping')"

# Verify environment variables
cat Angular/backend/.env
```

### Frontend not loading
```bash
# Check Nginx configuration
sudo nginx -t

# Check file permissions
ls -la /var/www/FleetTrack/Angular/gestion-des-deplacements/dist

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Database connection issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Test connection
mongosh -u fleettrack_user -p --authenticationDatabase admin
```

---

## 📊 Performance Optimization

### Enable Gzip Compression (Nginx)

Add to nginx configuration:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
```

### MongoDB Indexes

```javascript
// Connect to MongoDB
mongosh -u fleettrack_user -p

use fleettrack

// Create indexes for better performance
db.mouvements.createIndex({ "date_depart": -1 })
db.mouvements.createIndex({ "base_id": 1 })
db.logbook.createIndex({ "vehicule_id": 1, "date": -1 })
db.utilisateurs.createIndex({ "email": 1 }, { unique: true })
```

---

## 🔒 Security Best Practices

- ✅ Use HTTPS everywhere
- ✅ Keep Node.js and dependencies updated
- ✅ Use strong passwords for database
- ✅ Enable MongoDB authentication
- ✅ Configure firewall (UFW)
- ✅ Regular backups
- ✅ Monitor logs for suspicious activity
- ✅ Use environment variables for secrets
- ✅ Implement rate limiting
- ✅ Keep system packages updated

---

## 📞 Support

For deployment issues, check:
1. Application logs (`pm2 logs`)
2. Nginx logs (`/var/log/nginx/`)
3. MongoDB logs (`/var/log/mongodb/`)
4. System logs (`journalctl -xe`)

---

**Last Updated**: December 2024
