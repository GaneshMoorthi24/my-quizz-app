import api from './api';

export async function registerUser(name, email, password) {
  const res = await api.post('/register', { name, email, password });
  return res.data;
}

export async function loginUser(email, password) {
    const res = await api.post('/login', { email, password });
    localStorage.setItem('token', res.data.access_token); // store token
    return res.data;
  }

export async function getUser() {
  try {
    // Auth header is automatically added by api interceptor
    const res = await api.get('/user');
    return res.data;
  } catch (error) {
    // Log error for debugging
    const errorMessage = error?.response?.data || error?.message || 'Unknown error';
    const errorStatus = error?.response?.status;
    console.error('getUser error:', errorStatus, errorMessage);
    throw error;
  }
}

export async function logout() {
  // Auth header is automatically added by api interceptor
  await api.post('/logout', {});

  // Remove token from localStorage
  localStorage.removeItem('token');
}

export async function loginWithGoogle(googleToken) {
  const res = await api.post('/auth/google', { token: googleToken });
  localStorage.setItem('token', res.data.access_token);
  return res.data;
}
