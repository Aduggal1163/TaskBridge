// API Health Check Utility
// This helps debug API connectivity issues

export async function checkApiHealth() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/health`);
    if (response.ok) {
      return { status: 'healthy', message: 'API is accessible' };
    } else {
      return { status: 'unhealthy', message: `API returned ${response.status}` };
    }
  } catch (error) {
    return { 
      status: 'unreachable', 
      message: `Cannot reach API: ${error.message}` 
    };
  }
}

export function logApiError(context, error) {
  console.group(`🚨 API Error in ${context}`);
  console.error('Error:', error);
  console.error('Response:', error.response?.data);
  console.error('Status:', error.response?.status);
  console.error('Config:', error.config);
  console.groupEnd();
}
