# Projecost - Global Project Cost Calculator

Projecost is a global project cost calculator platform designed to help artists, freelancers, and agencies provide transparent, consistent, and regionally adjusted pricing estimates for their digital and remote services.

## Features

- Smart Project Cost Estimator
- Global Pricing Engine with country-specific adjustments
- Service & Package Management
- Role-Based User System
- Global Country Database
- Quote Builder + Export
- Analytics Dashboard
- API & Embeddable Widget
- User Profile & Business Settings
- Localization & Multi-language Support

## Tech Stack

### Frontend
- React.js with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- React Hook Form for form handling
- Axios for API requests
- Recharts for data visualization

### Backend
- Node.js with Express.js
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- RESTful API architecture

## Project Structure

```
projecost/
├── frontend/               # React frontend
│   ├── public/             # Static files
│   ├── src/                # Source code
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context providers
│   │   ├── layouts/        # Layout components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   ├── App.tsx         # Main App component
│   │   └── main.tsx        # Entry point
│   ├── .env                # Environment variables
│   ├── index.html          # HTML template
│   ├── package.json        # Dependencies
│   ├── tailwind.config.js  # Tailwind CSS config
│   ├── tsconfig.json       # TypeScript config
│   └── vite.config.ts      # Vite config
│
├── backend/                # Node.js backend
│   ├── src/                # Source code
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Entry point
│   ├── .env                # Environment variables
│   ├── package.json        # Dependencies
│   └── tsconfig.json       # TypeScript config
│
└── shared/                 # Shared code between frontend and backend
    └── types/              # TypeScript type definitions
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/projecost.git
cd projecost
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Create .env files in both frontend and backend directories with the necessary environment variables.

### Running the Application

1. Start the backend server
```bash
cd backend
npm run dev
```

2. Start the frontend development server
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## License

This project is licensed under the MIT License - see the LICENSE file for details.