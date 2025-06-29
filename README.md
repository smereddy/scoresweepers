# ScoreSweep

**Erase Credit Report Errors with AI Precision**

ScoreSweep is an AI-powered credit repair platform that helps users identify and dispute errors in their credit reports. Built with React, TypeScript, and Supabase, it features advanced AI analysis using GPT-4o and AWS Bedrock to detect inconsistencies and generate professional dispute letters.

🌐 **Live Demo**: [https://scoresweep.org](https://scoresweep.org)

## Features

### 🤖 AI-Powered Analysis
- **95% accuracy** in error detection using GPT-4o and AWS Bedrock
- Automatic scanning of credit reports for inconsistencies
- Pattern recognition for common credit report errors
- Confidence scoring for each identified issue

### 🔒 Bank-Level Security
- End-to-end encryption for all uploaded documents
- Automatic file deletion after 30 days
- No storage of SSNs or sensitive account numbers
- SOC 2 compliance ready

### 📄 Professional Documentation
- Auto-generated dispute letters with legal compliance
- Customizable templates for different dispute types
- Export options (PDF, Word)
- Phone script generation for bureau calls

### 🎯 User-Friendly Interface
- Drag & drop file upload
- Interactive error review and selection
- Real-time progress tracking
- Responsive design for all devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI/ML**: GPT-4o, AWS Bedrock
- **Deployment**: Netlify
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (optional for demo mode)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/scoresweep.git
   cd scoresweep
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   
   > **Note**: The app includes a demo mode that works without Supabase configuration

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Breadcrumbs.tsx
│   ├── DashboardLayout.tsx
│   ├── ErrorBoundary.tsx
│   ├── LoadingSpinner.tsx
│   ├── ProtectedRoute.tsx
│   ├── ReportRequestGuide.tsx
│   ├── StripeCheckout.tsx
│   └── SubscriptionStatus.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── data/              # Mock data and types
│   ├── auditWorkflow.ts
│   ├── consumerReportData.ts
│   ├── creditReportData.ts
│   ├── mockData.ts
│   └── reportingAgencies.ts
├── hooks/             # Custom React hooks
│   ├── useStripe.ts
│   └── useSubscription.ts
├── lib/               # Utilities and configurations
│   ├── config.ts
│   └── supabase.ts
├── pages/             # Page components
│   ├── audit/
│   │   ├── AuditGeneration.tsx
│   │   ├── AuditProcessing.tsx
│   │   ├── AuditReview.tsx
│   │   ├── AuditSetup.tsx
│   │   ├── AuditUpload.tsx
│   │   ├── AuditWizard.tsx
│   │   └── EnhancedAuditWizard.tsx
│   ├── dashboard/
│   │   ├── DashboardGenerate.tsx
│   │   ├── DashboardReview.tsx
│   │   └── DashboardUpload.tsx
│   ├── CancelPage.tsx
│   ├── Dashboard.tsx
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   └── SuccessPage.tsx
├── stripe-config.ts   # Stripe product configuration
└── App.tsx           # Main application component
```

## Key Features Walkthrough

### 1. Upload & Secure
- Drag & drop PDF upload interface
- Automatic file validation and security checks
- Bank-level encryption for data protection
- Sample file option for demo purposes

### 2. AI Analysis
- Real-time processing with progress indicators
- Comprehensive error detection across all report sections
- Interactive validation checklist
- Custom annotation system

### 3. Generate & Send
- Professional dispute letter generation
- Multiple template options
- Export functionality (PDF/Word)
- Phone script generation for bureau calls

## Database Schema

The application uses Supabase with the following main tables:

### `beta_waitlist`
- `id` (uuid, primary key)
- `name` (text, required)
- `email` (text, unique, required)
- `note` (text, optional)
- `status` (text, default 'pending')
- `created_at` (timestamp)

### Stripe Integration Tables
- `stripe_customers` - Links users to Stripe customers
- `stripe_subscriptions` - Manages subscription data
- `stripe_orders` - Stores order/purchase information

## Authentication

ScoreSweep supports multiple authentication methods:

- **Google OAuth** (primary method)
- **Magic Link** (email-based)
- **Demo Mode** (no authentication required)

The app automatically detects available authentication methods and falls back to demo mode when Supabase is not configured.

## Deployment

### Netlify (Recommended)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables in Netlify dashboard

3. **Configure redirects**
   
   The project includes a `_redirects` file for SPA routing:
   ```
   /*    /index.html   200
   /auth/callback    /index.html   200
   ```

### Environment Variables

For production deployment, set these environment variables:

```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

The project uses:
- **ESLint** for code linting
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Prettier** (recommended for formatting)

### Design System

- **Colors**: Custom blue/green gradient theme
- **Typography**: Plus Jakarta Sans (body), Space Grotesk (headings)
- **Components**: Consistent spacing (8px system), rounded corners, backdrop blur effects
- **Animations**: Framer Motion for smooth transitions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use semantic commit messages
- Ensure responsive design
- Test authentication flows
- Maintain accessibility standards

## Security Considerations

- All file uploads are encrypted in transit and at rest
- Sensitive data (SSNs, account numbers) are never stored
- Files are automatically deleted after 30 days
- Row Level Security (RLS) policies protect user data
- HTTPS enforced in production

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Email**: hello@scoresweep.org
- **Documentation**: [GitHub Wiki](https://github.com/yourusername/scoresweep/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/scoresweep/issues)

## Acknowledgments

- Built for Bolt World's Largest Hackathon
- Powered by Supabase and Netlify
- AI capabilities provided by OpenAI GPT-4o and AWS Bedrock
- Icons by Lucide React
- Fonts by Google Fonts

---

**ScoreSweep** - Empowering users to take control of their credit health through AI-powered error detection and professional dispute generation.