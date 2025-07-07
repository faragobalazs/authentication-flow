# Authentication Flow

A modern authentication system built with React, Node.js, and Express featuring a responsive login form with dark/light theme toggle.

## Features

- **Responsive Design**: Built with PrimeFlex for mobile-first responsive layout
- **Theme Toggle**: Dark and light theme support with smooth transitions
- **Modern UI**: Clean, professional interface using PrimeReact components
- **Full-Stack**: Frontend (React + Vite) and Backend (Node.js + Express)
- **Authentication Ready**: Login form with username and password fields

## Tech Stack

### Frontend

- React 19
- Vite
- PrimeReact (UI Components)
- PrimeFlex (CSS Utilities)
- PrimeIcons (Icon Library)
- Sass (CSS Preprocessor)

### Backend

- Node.js
- Express.js

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd authentication-flow
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd frontend && npm install

   # Install backend dependencies
   cd ../backend && npm install
   ```

3. **Run the development servers**

   ```bash
   # From the root directory
   npm run dev
   ```

   This will start:

   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only the frontend
- `npm run dev:backend` - Start only the backend with nodemon
- `npm run install:all` - Install dependencies for all packages

## Project Structure

```
authentication-flow/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── App.jsx          # Main application component
│   │   ├── App.scss         # Styles
│   │   └── main.jsx         # Application entry point
│   ├── index.html           # HTML template
│   └── package.json         # Frontend dependencies
├── backend/                  # Express backend server
│   ├── index.js             # Server entry point
│   └── package.json         # Backend dependencies
├── package.json             # Root package.json with scripts
└── README.md               # This file
```

## Features in Detail

### Theme System

- **Dark Theme**: Dark background (#1a1a1a) with white text
- **Light Theme**: White background with dark text
- **Toggle**: Sun/moon icon in the top right corner
- **Persistent**: Theme state managed with React hooks

### Login Form

- **Username Field**: Text input with proper labeling
- **Password Field**: Secure password input with toggle mask
- **Responsive**: Adapts to different screen sizes
- **Accessible**: Proper ARIA labels and form structure

### Styling

- **PrimeFlex**: Utility-first CSS framework
- **Custom Shadows**: Theme-aware shadow effects
- **Smooth Transitions**: CSS transitions for theme changes
- **Modern Design**: Clean, professional appearance

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Author

Jordan Apps | AuthFlow
