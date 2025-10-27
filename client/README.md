# JIRA Project Management Platform

A modern, full-stack project management application built with MERN stack.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Git

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:5000`

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## 🔧 Configuration

### Backend Connection
The frontend is configured to connect to the backend at `http://localhost:5000/api` by default. If your backend runs on a different port or URL, you can:

1. Create a `.env.local` file in the client directory
2. Add the following line:
   ```
   VITE_API_URL=http://your-backend-url/api
   ```

### Environment Variables
- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api)
- `VITE_SOCKET_URL`: Socket.IO URL for real-time features (default: http://localhost:5000)

## 📱 Features

### Landing Page
- Modern hero section with call-to-action
- Feature showcase
- About us section
- Contact form
- Responsive design

### Authentication
- User registration and login
- Role-based access control (Admin, Project Manager, Team Member)
- Secure JWT token authentication
- Password protection

### Dashboard
- Real-time statistics
- Recent tasks and projects
- Quick action buttons
- Personalized welcome message

### Project Management
- Create and manage projects
- Assign projects to teams
- Project status tracking
- Team collaboration

### Task Management
- Kanban board interface
- Task assignment to team members
- Status updates (To Do, In Progress, Completed)
- Real-time updates

### Team Management
- Create and manage teams
- Add/remove team members
- Role-based permissions
- Team collaboration tools

### User Management (Admin)
- View all users
- Update user roles
- User statistics
- Role permission guide

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.IO** - Real-time communication

## 🔐 Authentication & Authorization

The application uses JWT tokens for authentication with the following roles:

- **Admin**: Full system access, user management
- **Project Manager**: Create projects, manage tasks, oversee teams
- **Team Member**: View assigned tasks, update task status

## 📊 Real-time Features

- Live activity updates
- Real-time task status changes
- Team collaboration notifications
- Dashboard statistics updates

## 🎨 UI/UX Features

- **Responsive Design**: Works on all device sizes
- **Modern Interface**: Clean, professional design
- **Loading States**: Smooth user experience
- **Error Handling**: User-friendly error messages
- **Empty States**: Helpful guidance when no data exists
- **Accessibility**: Proper focus states and keyboard navigation

## 🚀 Deployment

### Frontend Deployment
1. Build the production version:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to your hosting service

### Backend Deployment
1. Set up environment variables for production
2. Deploy to your preferred hosting service (Heroku, AWS, etc.)
3. Update the frontend's `VITE_API_URL` to point to your production backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check that both frontend and backend are running
2. Verify the API URL configuration
3. Check browser console for errors
4. Ensure MongoDB is running and accessible

For additional help, please open an issue in the repository.
