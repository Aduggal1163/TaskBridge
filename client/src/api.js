import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
axios.defaults.timeout = 10000; // 10 second timeout

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const { token } = JSON.parse(auth);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Teams API
export async function fetchTeams() {
  const { data } = await axios.get('/teams');
  return data;
}

export async function createTeam(payload) {
  const { data } = await axios.post('/teams', payload);
  return data;
}

export async function addTeamMember(teamId, userId) {
  const { data } = await axios.post(`/teams/${teamId}/members`, { userId });
  return data;
}

export async function removeTeamMember(teamId, userId) {
  const { data } = await axios.delete(`/teams/${teamId}/members/${userId}`);
  return data;
}

// Projects API
export async function fetchProjects() {
  const { data } = await axios.get('/projects');
  return data;
}

export async function createProject(payload) {
  const { data } = await axios.post('/projects', payload);
  return data;
}

export async function updateProject(id, payload) {
  const { data } = await axios.patch(`/projects/${id}`, payload);
  return data;
}

export async function deleteProject(id) {
  const { data } = await axios.delete(`/projects/${id}`);
  return data;
}

// Tasks API
export async function fetchTasks() {
  const { data } = await axios.get('/tasks');
  return data;
}

export async function fetchMyTasks() {
  const { data } = await axios.get('/tasks/my');
  return data;
}

export async function createTask(payload) {
  const { data } = await axios.post('/tasks', payload);
  return data;
}

export async function updateTaskStatus(id, status) {
  const { data } = await axios.patch(`/tasks/${id}/status`, { status });
  return data;
}

export async function updateTask(id, payload) {
  const { data } = await axios.patch(`/tasks/${id}`, payload);
  return data;
}

export async function deleteTask(id) {
  const { data } = await axios.delete(`/tasks/${id}`);
  return data;
}

// Users API
export async function fetchUsers() {
  const { data } = await axios.get('/auth/users');
  return data;
}

export async function updateUserRole(userId, role) {
  const { data } = await axios.patch(`/auth/users/${userId}/role`, { role });
  return data;
}

export async function deleteUser(userId) {
  const { data } = await axios.delete(`/auth/users/${userId}`);
  return data;
}

// Dashboard API
export async function fetchDashboardStats() {
  const { data } = await axios.get('/dashboard/stats');
  return data;
}

// Activity Log API
export async function fetchActivityLogs(limit = 10) {
  const { data } = await axios.get(`/activity?limit=${limit}`);
  return data;
}

// Error handling utility
export function handleApiError(error) {
  // Log detailed error for debugging
  console.group('🚨 API Error Details');
  console.error('Error:', error);
  console.error('Response:', error.response?.data);
  console.error('Status:', error.response?.status);
  console.error('URL:', error.config?.url);
  console.error('Method:', error.config?.method);
  console.groupEnd();

  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.message || 'An error occurred';
    
    switch (status) {
      case 401:
        return 'Authentication required. Please log in again.';
      case 403:
        return 'Access denied. You don\'t have permission for this action.';
      case 404:
        return 'Resource not found.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return message;
    }
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error. Please check your connection and ensure the backend is running.';
  } else {
    // Something else happened
    return 'An unexpected error occurred';
  }
}
