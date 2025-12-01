import api from './api';

export async function registerUser(name, email, password, subscriptionPlan = 'free') {
  // Normalize plan names: institute -> standard
  const normalizedPlan = subscriptionPlan === 'institute' ? 'standard' : subscriptionPlan;
  const res = await api.post('/register', { 
    name, 
    email, 
    password,
    subscription_plan: normalizedPlan 
  });
  return res.data;
}

export async function loginUser(email, password) {
    const res = await api.post('/login', { email, password });
    
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

  // Remove token from both storages
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('remembered_email');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
}

export async function loginWithGoogle(googleToken) {
  const res = await api.post('/auth/google', { token: googleToken });
  // Google login defaults to remember me (localStorage) for convenience
  localStorage.setItem('token', res.data.access_token);
  return res.data;
}

export async function resendVerificationEmail(email) {
  const res = await api.post('/resend-verification', { email });
  return res.data;
}

export async function forgotPassword(email) {
  const res = await api.post('/forgot-password', { email });
  return res.data;
}

export async function resetPassword(email, token, password, passwordConfirmation) {
  const res = await api.post('/reset-password', {
    email,
    token,
    password,
    password_confirmation: passwordConfirmation
  });
  return res.data;
}