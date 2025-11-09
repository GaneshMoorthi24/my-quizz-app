import { getUser } from './auth';

/**
 * Check if the current user is an admin
 * @returns {Promise<boolean>}
 */
export async function isAdmin() {
  try {
    const user = await getUser();
    return user?.role === 'admin';
  } catch (error) {
    return false;
  }
}

/**
 * Get current user (with admin check)
 * @returns {Promise<Object|null>}
 */
export async function getAdminUser() {
  try {
    const user = await getUser();
    if (user?.role === 'admin') {
      return user;
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Require admin access - redirects if not admin
 * @param {Function} router - Next.js router instance
 */
export async function requireAdmin(router) {
  const admin = await isAdmin();
  if (!admin) {
    router.push('/dashboard');
    return false;
  }
  return true;
}

