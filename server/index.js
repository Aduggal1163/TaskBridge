import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/db.js';
import passport from 'passport';
import { configurePassport } from './config/passport.js';
import authRoutes from './routes/auth.js';
import teamRoutes from './routes/teams.js';
import projectRoutes from './routes/projects.js';
import taskRoutes from './routes/tasks.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { attachIo } from './services/activity.js';

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(passport.initialize());
configurePassport(passport);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectToDatabase(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/project_collab');
    console.log('Connected to MongoDB');
    const server = http.createServer(app);
    const io = new SocketIOServer(server, {
      cors: { origin: process.env.CLIENT_URL || '*', credentials: true },
    });
    attachIo(io);
    io.on('connection', (socket) => {
      console.log('Socket connected', socket.id);
      socket.on('disconnect', () => console.log('Socket disconnected', socket.id));
    });
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();


