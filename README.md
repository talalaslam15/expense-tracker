# 💰 Expense Tracker

A modern, full-stack expense tracking application built with React, TypeScript, and Supabase. Track your expenses and income with real-time cloud synchronization across all your devices.

![Expense Tracker](https://img.shields.io/badge/React-18+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-Styling-blue.svg)

## ✨ Features

- 🔐 **User Authentication** - Secure email/password authentication
- 💳 **Expense & Income Tracking** - Add, view, and delete transactions
- 🌍 **Multi-Currency Support** - USD and PKR with proper formatting
- ☁️ **Cloud Synchronization** - Real-time data sync across devices
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 📊 **Statistics Dashboard** - View total income, expenses, and balance
- 🔄 **Data Migration** - Automatic migration from localStorage to cloud
- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS and shadcn/ui
- 🔒 **Secure** - Row Level Security (RLS) ensures data privacy

## 🚀 Demo

Coming Soon

## 📸 Screenshots

Coming soon

## 🛠️ Tech Stack

- **Frontend:**

  - [React 19](https://reactjs.org/) - UI library
  - [TypeScript](https://www.typescriptlang.org/) - Type safety
  - [Vite](https://vitejs.dev/) - Build tool
  - [Tailwind CSS](https://tailwindcss.com/) - Styling
  - [shadcn/ui](https://ui.shadcn.com/) - UI components
  - [Lucide React](https://lucide.dev/) - Icons
  - [Sonner](https://sonner.emilkowal.ski/) - Toast notifications
  - [date-fns](https://date-fns.org/) - Date utilities

- **Backend:**
  - [Supabase](https://supabase.com/) - Backend as a Service
  - PostgreSQL - Database
  - Row Level Security (RLS) - Data security
  - Real-time subscriptions - Live updates

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/talalaslam15/expense-tracker.git
   cd expense-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Supabase credentials:

   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Set up the database**

   Run the SQL commands from `SUPABASE_SETUP.md` in your Supabase SQL editor to create the necessary tables and security policies.

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to `http://localhost:5173` to see the application.

## 📁 Project Structure

```
expense-tracker/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components (shadcn/ui)
│   │   ├── AuthForm.tsx  # Authentication form
│   │   ├── ExpenseForm.tsx
│   │   ├── ExpenseList.tsx
│   │   ├── ExpenseStats.tsx
│   │   ├── Header.tsx
│   │   └── CurrencySelector.tsx
│   ├── contexts/         # React contexts
│   │   └── AuthContext.tsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useAuth.ts
│   │   └── use-mobile.ts
│   ├── lib/             # Utility libraries
│   │   └── utils.ts
│   ├── utils/           # Utility functions
│   │   ├── database.ts  # Database operations
│   │   └── supabase.ts  # Supabase client
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── .env.example        # Environment variables template
├── SUPABASE_SETUP.md  # Database setup instructions
└── README.md          # This file
```

## 🗄️ Database Schema

The application uses three main tables:

### expenses

- Stores all income and expense transactions
- Linked to users via `user_id`
- Includes amount, description, category, date, and type

### user_preferences

- Stores user-specific settings like currency preferences
- One record per user

### auth.users

- Built-in Supabase authentication table
- Manages user accounts and sessions

See `SUPABASE_SETUP.md` for detailed setup instructions.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Key Features Explained

### Authentication

- Email/password authentication via Supabase Auth
- Automatic session management
- Secure user registration and login

### Data Migration

- Seamlessly migrates existing localStorage data to Supabase on first login
- Preserves user data when switching to cloud storage

### Currency Support

- Multi-currency support (USD, PKR)
- Proper formatting with or without decimals
- User preferences saved in the cloud

### Security

- Row Level Security (RLS) ensures users can only access their own data
- Secure API endpoints through Supabase
- Protected routes and authentication checks

## 🚀 Deployment

### Deploy to Vercel

1. **Connect your repository to Vercel**
2. **Add environment variables** in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. **Deploy** - Vercel will automatically build and deploy your app

### Deploy to Netlify

1. **Connect your repository to Netlify**
2. **Set build command**: `npm run build`
3. **Set publish directory**: `dist`
4. **Add environment variables** in Netlify dashboard
5. **Deploy**

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Supabase](https://supabase.com/) for the amazing backend platform
- [Lucide](https://lucide.dev/) for the clean icons
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ by [Talal Aslam](https://github.com/talalaslam15)
