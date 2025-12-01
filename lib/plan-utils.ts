/**
 * Plan detection and UI utilities
 * Plans: Free, Pro, Standard (Teacher)
 * User Types: student, teacher, admin, government
 */

export type PlanType = 'free' | 'pro' | 'standard';
export type UserRole = 'student' | 'teacher' | 'admin' | 'government';

export interface PlanConfig {
  type: PlanType;
  name: string;
  hasAdvancedUI: boolean;
  hasAnimations: boolean;
  hasPremiumEffects: boolean;
  gradient: string;
  bgGradient: string;
  accentColor: string;
}

export function detectPlan(user: any): PlanType {
  const plan = user?.subscription_plan || user?.subscription_type || 'free';
  const planLower = String(plan).toLowerCase();
  
  // Normalize plan names
  if (planLower.includes('standard') || planLower.includes('teacher') || planLower.includes('institute')) {
    return 'standard';
  }
  if (planLower.includes('pro') || planLower.includes('premium')) {
    return 'pro';
  }
  return 'free';
}

export function detectUserRole(user: any): UserRole {
  // Check admin first
  const isAdmin = user?.is_admin === 1 || 
                 user?.is_admin === true || 
                 user?.is_admin === '1' ||
                 user?.role === 'admin';
  
  if (isAdmin) {
    return 'admin';
  }
  
  // Check role field
  const role = String(user?.role || '').toLowerCase();
  
  if (role === 'teacher' || role === 'standard') {
    return 'teacher';
  }
  
  if (role === 'government' || role === 'govt' || role === 'govt_exam') {
    return 'government';
  }
  
  // Check subscription plan for teacher
  const plan = detectPlan(user);
  if (plan === 'standard') {
    return 'teacher';
  }
  
  // Default to student
  return 'student';
}

export function getUserPanelPath(user: any): string {
  const role = detectUserRole(user);
  
  switch (role) {
    case 'admin':
      return '/admin';
    case 'teacher':
      return '/teacher';
    case 'government':
      return '/government';
    default: // student
      return '/dashboard';
  }
}

export function getPlanConfig(plan: PlanType): PlanConfig {
  switch (plan) {
    case 'standard':
      return {
        type: 'standard',
        name: 'Standard Plan',
        hasAdvancedUI: true,
        hasAnimations: true,
        hasPremiumEffects: true,
        gradient: 'from-slate-950 via-slate-900 to-indigo-950',
        bgGradient: 'from-slate-950/90 via-slate-900/80 to-indigo-950/90',
        accentColor: 'indigo',
      };
    case 'pro':
      return {
        type: 'pro',
        name: 'Pro Plan',
        hasAdvancedUI: true,
        hasAnimations: true,
        hasPremiumEffects: false,
        gradient: 'from-blue-50 via-cyan-50 to-indigo-50',
        bgGradient: 'from-blue-50/90 via-cyan-50/80 to-indigo-50/90',
        accentColor: 'blue',
      };
    default: // free
      return {
        type: 'free',
        name: 'Free Plan',
        hasAdvancedUI: false,
        hasAnimations: false,
        hasPremiumEffects: false,
        gradient: 'from-slate-50 to-blue-50',
        bgGradient: 'from-slate-50 to-blue-50',
        accentColor: 'slate',
      };
  }
}

export function usePlan(user: any): PlanConfig {
  const plan = detectPlan(user);
  return getPlanConfig(plan);
}

