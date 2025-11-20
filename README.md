# PayTrack by Tini

A modern, elegant payment tracking application for learning programs. Built with Next.js, TypeScript, Tailwind CSS, MongoDB, and Paystack integration.

## Features

- **Modern Authentication**: Google OAuth integration with NextAuth.js
- **Flexible Payment Schedules**: Support for daily, weekly, monthly, and one-time payments
- **Beautiful UI**: Dark theme with blue accents, modern and minimal design
- **Payment Processing**: Integrated with Paystack for secure payments
- **Progress Tracking**: Visual progress bars and payment history
- **Email Notifications**: Automated payment reminders via Gmail
- **Admin Dashboard**: Comprehensive admin interface for tracking all users and payments
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, MongoDB with Mongoose
- **Authentication**: NextAuth.js with Google Provider
- **Payments**: Paystack integration
- **Email**: Nodemailer with Gmail SMTP
- **Database**: MongoDB Atlas

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd paytrack
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env.local
```

Fill in your environment variables in `.env.local`:

```env
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# MongoDB Atlas
MONGODB_URI=your-mongodb-atlas-connection-string-here

# Paystack (Get from Paystack Dashboard)
PAYSTACK_SECRET_KEY=your-paystack-secret-key-here
PAYSTACK_PUBLIC_KEY=your-paystack-public-key-here

# Gmail SMTP (Use Gmail App Password)
GMAIL_USER=your-gmail-address@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password-here

# Admin Access
ADMIN_EMAIL=your-admin-email@gmail.com
```

### 4. Third-Party Setup

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create credentials (OAuth 2.0 Client ID)
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env.local`

#### MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user
4. Get connection string and add to `.env.local`
5. Whitelist your IP address

#### Paystack Setup

1. Create account at [Paystack](https://paystack.com)
2. Get your secret and public keys from the dashboard
3. Add keys to `.env.local`

#### Gmail SMTP Setup

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use your Gmail and app password in `.env.local`

### 5. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Usage

### For Users

1. **Sign in** with your Google account
2. **Add a program** with details like name, cost, duration, and payment schedule
3. **Make payments** through Paystack integration
4. **Track progress** with visual progress bars and payment history
5. **Receive email reminders** for upcoming payments

### For Admins

1. Set your email as `ADMIN_EMAIL` in environment variables
2. Access admin dashboard at `/admin`
3. View all users, programs, and payments
4. Send manual payment reminders
5. Monitor revenue and statistics

## API Endpoints

### Authentication

- `GET/POST /api/auth/*` - NextAuth.js endpoints

### Programs

- `GET /api/programs` - Get user's programs
- `POST /api/programs` - Create new program

### Payments

- `POST /api/payments/initialize` - Initialize Paystack payment
- `GET /api/payments/verify` - Verify payment callback

### Admin (Admin only)

- `GET /api/admin/stats` - Get admin statistics
- `POST /api/admin/send-reminder` - Send payment reminder

### Cron Jobs

- `GET /api/cron/send-reminders` - Send automated reminders

## Deployment

### Environment Variables

Ensure all production environment variables are set:

- `NEXTAUTH_URL` should be your production domain
- All API keys should be production keys
- `ADMIN_EMAIL` should be your admin email

### Database

- Ensure MongoDB Atlas is properly configured
- Database will auto-create collections on first use

### Automated Tasks (Cron Jobs)

Set up the following cron jobs for automated system management:

1. **Payment Reminders**: `/api/cron/send-reminders` - Daily at 9 AM
2. **Program Management**: `/api/cron/manage-programs` - Every hour

The program management cron handles:

- Freezing programs that miss payment deadlines (only after first payment)
- Admin notifications for all automated actions

**Payment Flow**:

- Programs start with no payment deadline after approval
- Payment schedule begins only after the first payment is made
- Subsequent payments follow the chosen schedule (daily/weekly/monthly)

Example cron setup:

```bash
# Payment reminders (daily at 9 AM)
0 9 * * * curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://yourapp.com/api/cron/send-reminders

# Program management (hourly)
0 * * * * curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://yourapp.com/api/cron/manage-programs
```

Add `CRON_SECRET=your-secure-secret` to your environment variables for cron job authentication.

### Email Notifications

Set up a cron job to call `/api/cron/send-reminders` daily to send automatic payment reminders.

## Project Structure

```
src/
├── app/                    # App router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── admin/             # Admin dashboard
│   └── dashboard/         # User dashboard
├── components/            # React components
│   ├── admin/             # Admin components
│   └── dashboard/         # Dashboard components
├── lib/                   # Utility libraries
│   ├── auth.ts            # NextAuth configuration
│   ├── mongodb.ts         # Database connection
│   ├── email.ts           # Email utilities
│   └── utils.ts           # Helper functions
├── models/                # MongoDB models
│   ├── Program.ts         # Program schema
│   └── Payment.ts         # Payment schema
└── types/                 # TypeScript type definitions
```

## Features in Detail

### Payment Schedules

- **Daily**: Users pay a daily amount based on monthly cost ÷ 30
- **Weekly**: Users pay weekly based on monthly cost ÷ 4
- **Monthly**: Users pay the full monthly amount
- **Once**: Users pay the entire program cost upfront

### Email Notifications

- Payment confirmation emails after successful payments
- Payment reminder emails for overdue payments
- Beautiful HTML email templates with branding

### Admin Features

- View all users and their programs
- Monitor payment schedules and overdue accounts
- Send manual payment reminders
- Track total revenue and statistics

## Security

- Environment variables for sensitive data
- NextAuth.js for secure authentication
- Paystack handles payment security
- Input validation on all forms
- Admin-only routes protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is built for educational and business purposes.

---

**PayTrack by Tini** - Making learning payment tracking elegant and simple.
