# AIDE Platform - Deployment Guide

This guide provides step-by-step instructions for deploying the AIDE platform to production.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] API keys obtained (Google Gemini, Hugging Face)
- [ ] Tests passing locally
- [ ] Build completes without errors
- [ ] Security audit completed
- [ ] Performance testing done

## Environment Setup

### 1. Database Setup

Create a MySQL database:
```sql
CREATE DATABASE aide_platform;
CREATE USER 'aide_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON aide_platform.* TO 'aide_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. API Keys

Obtain the following API keys:

**Google Gemini Pro**
1. Go to https://ai.google.dev
2. Create a new API key
3. Add to `.env`: `GOOGLE_API_KEY=your-key`

**Hugging Face**
1. Go to https://huggingface.co/settings/tokens
2. Create a new access token
3. Add to `.env`: `HUGGING_FACE_API_KEY=your-token`

### 3. Environment Variables

Create `.env.production`:
```env
# Database
DATABASE_URL=mysql://aide_user:secure_password@db-host:3306/aide_platform

# Authentication
JWT_SECRET=your-very-secure-random-secret-key
OAUTH_SERVER_URL=https://api.manus.im

# AI APIs
GOOGLE_API_KEY=your-google-gemini-key
HUGGING_FACE_API_KEY=your-hugging-face-token

# Frontend
VITE_APP_TITLE=AIDE Platform
VITE_APP_LOGO=/logo.png
NODE_ENV=production
```

## Deployment Options

### Option 1: Vercel Deployment

**Recommended for most users**

1. Push code to GitHub
```bash
git add .
git commit -m "Initial AIDE platform deployment"
git push origin main
```

2. Connect to Vercel
- Go to https://vercel.com
- Click "New Project"
- Select your GitHub repository
- Import project

3. Configure environment variables
- In Vercel dashboard, go to Settings > Environment Variables
- Add all variables from `.env.production`

4. Deploy
- Vercel automatically deploys on push
- Monitor deployment in Vercel dashboard

### Option 2: Railway Deployment

**Alternative cloud platform**

1. Install Railway CLI
```bash
npm install -g @railway/cli
```

2. Login to Railway
```bash
railway login
```

3. Create new project
```bash
railway init
```

4. Add environment variables
```bash
railway variables set DATABASE_URL=mysql://...
railway variables set GOOGLE_API_KEY=...
# Add all other variables
```

5. Deploy
```bash
railway up
```

### Option 3: Self-Hosted Deployment

**For maximum control**

1. Prepare server
- Ubuntu 20.04+ recommended
- Node.js 18+ installed
- MySQL 8.0+ installed
- Nginx for reverse proxy

2. Clone and setup
```bash
git clone https://github.com/yourusername/aide-platform.git
cd aide-platform
pnpm install
```

3. Build application
```bash
pnpm build
```

4. Configure Nginx
```nginx
server {
    listen 80;
    server_name aide.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. Start application with PM2
```bash
npm install -g pm2
pm2 start "pnpm start" --name "aide-platform"
pm2 save
pm2 startup
```

6. Enable HTTPS with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d aide.example.com
```

## Database Migrations

Run migrations on deployment:
```bash
pnpm db:push
```

This will:
1. Generate migration files
2. Apply pending migrations
3. Update database schema

## Monitoring and Logging

### Application Monitoring

Set up monitoring with:
- **Vercel Analytics**: Automatic with Vercel
- **Sentry**: Error tracking
- **DataDog**: Performance monitoring

### Log Management

Configure logging:
```typescript
// server/_core/index.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Database Monitoring

Monitor database performance:
- Query execution times
- Connection pool usage
- Slow query logs

## Performance Optimization

### Frontend Optimization
- Enable gzip compression
- Minify CSS and JavaScript
- Optimize images
- Use CDN for static assets

### Backend Optimization
- Database query optimization
- Connection pooling
- Caching strategies
- API rate limiting

### Database Optimization
- Add indexes on frequently queried columns
- Optimize query patterns
- Archive old build history
- Prune old agent memories

## Backup and Recovery

### Automated Backups

Set up daily backups:
```bash
# MySQL backup script
mysqldump -u aide_user -p aide_platform > /backups/aide_$(date +%Y%m%d).sql
```

### Recovery Procedure

Restore from backup:
```bash
mysql -u aide_user -p aide_platform < /backups/aide_20240101.sql
```

## Security Hardening

### API Security
- Enable CORS restrictions
- Implement rate limiting
- Add request validation
- Use HTTPS only

### Database Security
- Use strong passwords
- Enable SSL connections
- Restrict database access
- Regular security updates

### Application Security
- Keep dependencies updated
- Run security audits
- Implement CSP headers
- Enable HSTS

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy)
- Deploy multiple instances
- Shared database connection pool

### Vertical Scaling
- Increase server resources
- Optimize database indexes
- Implement caching layer

### Database Scaling
- Read replicas for queries
- Write master for mutations
- Sharding for large datasets

## Troubleshooting Deployment

### Common Issues

**Database Connection Failed**
```bash
# Check database connectivity
mysql -h db-host -u aide_user -p -e "SELECT 1"
```

**API Keys Not Working**
- Verify keys are correct
- Check API quotas
- Verify network connectivity

**Build Failures**
```bash
# Clear cache and rebuild
rm -rf dist node_modules
pnpm install
pnpm build
```

**Memory Issues**
- Increase Node.js heap size
- Optimize memory usage
- Implement garbage collection

## Post-Deployment

### Verification
- [ ] Application loads successfully
- [ ] Database connection working
- [ ] API endpoints responding
- [ ] Authentication working
- [ ] Agent system functional

### Monitoring
- [ ] Set up alerts
- [ ] Monitor error rates
- [ ] Track performance metrics
- [ ] Review logs regularly

### Documentation
- [ ] Document deployment process
- [ ] Create runbooks
- [ ] Document API changes
- [ ] Update team wiki

## Rollback Procedure

If deployment fails:

1. Identify issue
2. Revert to previous version
```bash
git revert HEAD
git push origin main
```

3. Redeploy
4. Investigate root cause
5. Fix and test locally
6. Deploy again

## Support

For deployment issues:
- Check logs: `pnpm logs`
- Review error messages
- Consult troubleshooting section
- Contact support team
