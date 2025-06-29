# Security Policy

## Supported Versions

We actively support the following versions of ScoreSweep:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously at ScoreSweep. If you discover a security vulnerability, please follow these steps:

### 1. Do Not Create Public Issues

Please **do not** create public GitHub issues for security vulnerabilities. This helps protect users while we work on a fix.

### 2. Contact Us Directly

Send security reports to: **security@scoresweep.org**

Include the following information:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Any suggested fixes (if available)

### 3. Response Timeline

- **Initial Response**: Within 24 hours
- **Status Update**: Within 72 hours
- **Fix Timeline**: Varies based on severity (see below)

### 4. Severity Levels

#### Critical (Fix within 24-48 hours)
- Remote code execution
- SQL injection
- Authentication bypass
- Data exposure of sensitive information

#### High (Fix within 1 week)
- Cross-site scripting (XSS)
- Cross-site request forgery (CSRF)
- Privilege escalation
- Significant data leaks

#### Medium (Fix within 2 weeks)
- Information disclosure
- Denial of service
- Weak cryptography

#### Low (Fix within 1 month)
- Minor information leaks
- Non-exploitable bugs with security implications

## Security Measures

### Data Protection

#### Encryption
- **In Transit**: All data transmitted over HTTPS/TLS 1.3
- **At Rest**: Database encryption managed by Supabase
- **File Uploads**: Encrypted storage with automatic deletion after 30 days

#### Data Handling
- **SSN/Account Numbers**: Never stored in our systems
- **Credit Reports**: Processed in memory only, not persisted
- **User Data**: Minimal collection, maximum protection

### Authentication & Authorization

#### Multi-Factor Authentication
- Google OAuth integration
- Email/password with secure password requirements
- Session management with JWT tokens

#### Access Control
- Row Level Security (RLS) policies
- User data isolation
- Principle of least privilege

### Infrastructure Security

#### Hosting & CDN
- **Netlify**: Enterprise-grade security and DDoS protection
- **Supabase**: SOC 2 Type II compliant infrastructure
- **Global CDN**: Distributed content delivery with edge security

#### Database Security
- **PostgreSQL**: Industry-standard database security
- **Connection Encryption**: All database connections encrypted
- **Backup Encryption**: Automated encrypted backups

### Application Security

#### Input Validation
```typescript
// Example: Email validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Example: File upload validation
const validateFileUpload = (file: File): boolean => {
  const allowedTypes = ['application/pdf'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  return allowedTypes.includes(file.type) && file.size <= maxSize;
};
```

#### Output Encoding
- React's built-in XSS protection
- Sanitized HTML rendering
- Safe URL construction

#### CSRF Protection
- SameSite cookie attributes
- CSRF tokens for state-changing operations
- Origin validation

### Payment Security

#### PCI Compliance
- **Stripe Integration**: PCI DSS Level 1 compliant
- **No Card Storage**: Card data never touches our servers
- **Secure Checkout**: Stripe-hosted payment forms

#### Webhook Security
```typescript
// Webhook signature verification
const signature = req.headers.get('stripe-signature');
const event = stripe.webhooks.constructEvent(
  body, 
  signature, 
  webhookSecret
);
```

## Security Best Practices

### For Developers

#### Code Review
- All code changes require review
- Security-focused review for sensitive areas
- Automated security scanning in CI/CD

#### Dependencies
- Regular dependency updates
- Vulnerability scanning with npm audit
- Minimal dependency footprint

#### Environment Variables
```bash
# ✅ Good - Server-side only
STRIPE_SECRET_KEY=sk_live_...

# ❌ Bad - Client-side exposure
VITE_STRIPE_SECRET_KEY=sk_live_...
```

#### Error Handling
```typescript
// ✅ Good - Generic error messages
catch (error) {
  console.error('Database error:', error); // Log details server-side
  return { error: 'An error occurred' }; // Generic client message
}

// ❌ Bad - Exposing internal details
catch (error) {
  return { error: error.message }; // Could expose sensitive info
}
```

### For Users

#### Account Security
- Use strong, unique passwords
- Enable two-factor authentication when available
- Regularly review account activity
- Sign out from shared devices

#### Data Protection
- Only upload legitimate credit reports
- Verify URLs before entering sensitive information
- Report suspicious activity immediately

## Incident Response

### Detection
- Automated monitoring and alerting
- User reports and feedback
- Security scanning and audits

### Response Process
1. **Immediate Assessment** - Severity and impact evaluation
2. **Containment** - Isolate affected systems
3. **Investigation** - Root cause analysis
4. **Remediation** - Fix implementation and testing
5. **Communication** - User notification if required
6. **Post-Incident** - Review and process improvement

### Communication
- **Critical Issues**: Immediate notification via email and status page
- **Non-Critical**: Included in regular security updates
- **Transparency**: Public disclosure after fix deployment

## Compliance

### Standards
- **SOC 2 Type II** - Infrastructure compliance via Supabase
- **GDPR** - European data protection compliance
- **CCPA** - California privacy rights compliance
- **FCRA** - Fair Credit Reporting Act compliance

### Data Retention
- **User Data**: Retained while account is active
- **Credit Reports**: Automatically deleted after 30 days
- **Logs**: Retained for 90 days for security monitoring
- **Backups**: Encrypted and retained per compliance requirements

### User Rights
- **Data Access**: Request copy of personal data
- **Data Correction**: Update incorrect information
- **Data Deletion**: Request account and data deletion
- **Data Portability**: Export personal data

## Security Audits

### Internal Audits
- Monthly security reviews
- Quarterly penetration testing
- Annual compliance assessments

### External Audits
- Third-party security assessments
- Compliance audits
- Bug bounty programs (planned)

## Contact Information

### Security Team
- **Email**: security@scoresweep.org
- **Response Time**: 24 hours maximum
- **Encryption**: PGP key available upon request

### General Support
- **Email**: hello@scoresweep.org
- **Documentation**: GitHub repository
- **Status Page**: status.scoresweep.org (planned)

## Acknowledgments

We appreciate the security research community and will acknowledge researchers who responsibly disclose vulnerabilities:

- Public recognition (with permission)
- Hall of fame listing
- Potential bounty rewards (program TBD)

---

**Last Updated**: January 2025

This security policy is reviewed and updated regularly to reflect current best practices and emerging threats.