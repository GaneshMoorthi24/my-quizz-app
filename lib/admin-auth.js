import { getUser } from './auth';

/**
 * Check if a user object represents an admin
 * Handles both is_admin (1, true, '1') and role === 'admin'
 * @param {Object} user - User object to check
 * @returns {boolean}
 */
export function checkIsAdmin(user) {
  if (!user) return false;
  
  return user.is_admin === 1 || 
         user.is_admin === true || 
         user.is_admin === '1' ||
         user.role === 'admin';
}

/**
 * Check if the current user is an admin
 * @returns {Promise<boolean>}
 */
export async function isAdmin() {
  try {
    const user = await getUser();
    return checkIsAdmin(user);
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
    if (checkIsAdmin(user)) {
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

