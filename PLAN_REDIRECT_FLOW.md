# Plan-Based Redirect Flow

This document explains how users are redirected to the correct page based on their subscription plan.

## Plan Flow Overview

### 1. **Pricing Page** (`/pricing`)
When a user clicks on a plan:
- **Free Plan** → `/signup?plan=free`
- **Pro Plan** → `/signup?plan=pro`
- **Standard Plan** (Institute) → `/signup?plan=standard`

### 2. **Signup Page** (`/signup`)
- Reads `plan` parameter from URL
- Normalizes plan names (`institute` → `standard`)
- Sends plan to backend during registration
- After successful registration → `/login?plan={plan}`

### 3. **Login Page** (`/login`)
After successful login, redirects based on:
- **Admin** → `/admin`
- **Standard Plan** (Teacher) → `/teacher`
- **Pro Plan** → `/dashboard` (uses ProLayout automatically)
- **Free Plan** → `/dashboard` (uses standard DashboardLayout)

## Plan Detection Logic

The system uses `detectPlan()` from `lib/plan-utils.ts`:

```typescript
detectPlan(user) // Returns: 'free' | 'pro' | 'standard'
```

**Plan Name Normalization:**
- `standard`, `teacher`, `institute` → `standard`
- `pro`, `premium` → `pro`
- Everything else → `free`

## Registration Flow

1. User clicks plan on pricing page
2. Redirected to `/signup?plan={planId}`
3. Signup page reads plan from URL
4. Plan is sent to backend: `subscription_plan: normalizedPlan`
5. After registration → `/login?plan={plan}`

## Login Flow

1. User logs in with email/password
2. Backend returns user object with `subscription_plan`
3. Frontend detects plan using `detectPlan(user)`
4. Redirects to appropriate dashboard:
   - `standard` → `/teacher` (TeacherLayout)
   - `pro` → `/dashboard` (ProLayout via DashboardLayout)
   - `free` → `/dashboard` (DashboardLayout)

## Layout Selection

### Free Plan
- **Layout**: `DashboardLayout` (standard mode)
- **Route**: `/dashboard`
- **UI**: Normal, clean design

### Pro Plan
- **Layout**: `ProLayout` (automatically selected in DashboardLayout)
- **Route**: `/dashboard`
- **UI**: Advanced animations, smooth transitions

### Standard Plan (Teacher)
- **Layout**: `TeacherLayout`
- **Route**: `/teacher`
- **UI**: Premium design with best-in-class effects

## Backend Requirements

The backend should:
1. Accept `subscription_plan` in registration request
2. Store plan in user record (`subscription_plan` or `subscription_type` field)
3. Return plan in user object on login/me endpoints

## Testing Plan Redirects

### Test Free Plan
1. Go to `/pricing`
2. Click "Get Started Free"
3. Sign up → Should redirect to `/login?plan=free`
4. Login → Should redirect to `/dashboard` (standard UI)

### Test Pro Plan
1. Go to `/pricing`
2. Click "Start Pro Trial"
3. Sign up → Should redirect to `/login?plan=pro`
4. Login → Should redirect to `/dashboard` (Pro UI with animations)

### Test Standard Plan (Teacher)
1. Go to `/pricing`
2. Click "Contact Sales" on Standard Plan
3. Sign up → Should redirect to `/login?plan=standard`
4. Login → Should redirect to `/teacher` (Premium UI)

## Plan Parameter Mapping

| Pricing Page ID | Signup Parameter | Normalized Plan | Redirect After Login |
|----------------|------------------|-----------------|---------------------|
| `free` | `free` | `free` | `/dashboard` |
| `pro` | `pro` | `pro` | `/dashboard` (ProLayout) |
| `institute` | `standard` | `standard` | `/teacher` |

## Notes

- Plan detection is case-insensitive
- Plan names are normalized for consistency
- If plan is not set, defaults to `free`
- Admin users always go to `/admin` regardless of plan

