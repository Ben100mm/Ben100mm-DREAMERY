# Deployment Guide

**Dreamery Homepage - Production Deployment**

## Overview

This guide covers deploying the Dreamery Homepage to production environments.

## Prerequisites

### Server Requirements
- **OS**: Ubuntu 20.04+ or CentOS 8+
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: Minimum 50GB SSD
- **CPU**: Minimum 2 cores, Recommended 4+ cores

### Software Requirements
- **Node.js**: 18.0.0+
- **Python**: 3.8+
- **PostgreSQL**: 13+
- **Nginx**: Latest stable version
- **SSL Certificate**: Valid SSL certificate

## Environment Setup

### 1. Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python and pip
sudo apt install python3 python3-pip python3-venv -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Nginx
sudo apt install nginx -y
```

### 2. Database Setup
```bash
# Create database user
sudo -u postgres createuser --interactive dreamery_user
sudo -u postgres createdb dreamery_production

# Set up database permissions
sudo -u postgres psql -c "ALTER USER dreamery_user PASSWORD 'secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE dreamery_production TO dreamery_user;"
```

### 3. Application Deployment
```bash
# Clone repository
git clone https://github.com/Ben100mm/Ben100mm-dreamery-operating-software.git
cd dreamery-homepage

# Install dependencies
npm ci --production
cd server && pip install -r requirements.txt

# Build frontend
npm run build
```

## Configuration

### Environment Variables

#### Frontend (.env.production)
```bash
REACT_APP_ENV=production
REACT_APP_API_URL=https://api.dreamery.com
REACT_APP_APPLE_MAPS_JWT_TOKEN=production_jwt_token
```

#### Backend (server/.env.production)
```bash
FLASK_ENV=production
DATABASE_URL=postgresql://dreamery_user:secure_password@localhost:5432/dreamery_production
SECRET_KEY=production_secret_key_here
REALTOR_API_KEY=production_realtor_api_key
APPLE_MAPS_JWT_TOKEN=production_apple_maps_token
```

### Database Migration
```bash
# Run production migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

## Web Server Configuration

### Nginx Configuration
```nginx
# /etc/nginx/sites-available/dreamery
server {
    listen 80;
    server_name dreamery.com www.dreamery.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dreamery.com www.dreamery.com;

    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;

    # Frontend
    location / {
        root /var/www/dreamery-homepage/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API
    location /api/ {
        proxy_pass http://localhost:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
}
```

### Enable Site
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/dreamery /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Process Management

### PM2 Configuration
```json
// ecosystem.config.js
{
  "apps": [
    {
      "name": "dreamery-frontend",
      "script": "serve",
      "args": "-s build -l 3000",
      "env": {
        "NODE_ENV": "production"
      }
    },
    {
      "name": "dreamery-backend",
      "script": "python",
      "args": "start_realtor_api.py",
      "cwd": "./server",
      "env": {
        "FLASK_ENV": "production"
      }
    }
  ]
}
```

### Start Services
```bash
# Install PM2
npm install -g pm2

# Start applications
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup
```

## SSL Certificate

### Let's Encrypt (Recommended)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d dreamery.com -d www.dreamery.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring

### Health Checks
```bash
# Frontend health
curl https://dreamery.com

# API health
curl https://dreamery.com/api/realtor/health

# Database connection
psql -h localhost -U dreamery_user -d dreamery_production -c "SELECT 1;"
```

### Log Monitoring
```bash
# Application logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx -f
```

## Backup Strategy

### Database Backup
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U dreamery_user dreamery_production > /backups/dreamery_$DATE.sql

# Keep only last 30 days
find /backups -name "dreamery_*.sql" -mtime +30 -delete
```

### Application Backup
```bash
# Backup application files
tar -czf /backups/dreamery-app_$(date +%Y%m%d).tar.gz /var/www/dreamery-homepage
```

## Security Checklist

### Server Security
- [ ] Firewall configured (UFW)
- [ ] SSH key authentication only
- [ ] Regular security updates
- [ ] Fail2ban installed
- [ ] SSL certificate installed
- [ ] Security headers configured

### Application Security
- [ ] Environment variables secured
- [ ] API endpoints protected
- [ ] Database credentials secured
- [ ] CORS properly configured
- [ ] Error handling configured
- [ ] Input validation implemented

### Monitoring
- [ ] Log monitoring set up
- [ ] Health checks configured
- [ ] Backup strategy implemented
- [ ] Performance monitoring
- [ ] Security scanning

## Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs dreamery-backend

# Restart services
pm2 restart all
```

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -h localhost -U dreamery_user -d dreamery_production

# Check database logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

#### Nginx Issues
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Reload configuration
sudo systemctl reload nginx
```

## Performance Optimization

### Frontend Optimization
- Enable gzip compression in Nginx
- Configure browser caching
- Use CDN for static assets
- Implement lazy loading

### Backend Optimization
- Configure database connection pooling
- Implement Redis caching
- Enable query optimization
- Monitor API response times

---

**Classification**: INTERNAL USE ONLY  
**Access**: AUTHORIZED PERSONNEL ONLY
