# Plan-Based UI System

This document explains the three-tier plan-based UI system implemented in the QuizPlatform.

## Plan Tiers

### 1. **Free Plan** - Normal UI
- **Target Users**: Students on free tier
- **UI Style**: Clean, standard design (current implementation)
- **Features**:
  - Standard gradient backgrounds
  - Basic transitions
  - No advanced animations
  - Simple card designs

**Layout**: `DashboardLayout` (standard mode)

### 2. **Pro Plan** - Advanced, Smooth, Animated UI
- **Target Users**: Students who upgraded to Pro
- **UI Style**: Advanced animations, smooth transitions, professional polish
- **Features**:
  - Animated background elements (floating orbs)
  - Enhanced hover effects with scale/rotate transforms
  - Smooth backdrop blur transitions
  - Gradient animations
  - Pulse effects on interactive elements
  - Professional color scheme (blue-cyan-indigo)

**Layout**: `ProLayout` (enhanced with animations)

### 3. **Standard Plan** - Premium UI (Best Design)
- **Target Users**: Teachers
- **UI Style**: Most premium, sophisticated, best-in-class design
- **Features**:
  - Dark theme with premium gradients (slate-indigo-purple)
  - Multiple floating orb animations
  - Particle field effects
  - Animated gradient mesh overlays
  - Advanced hover states with glow effects
  - Premium shadow effects
  - Smooth backdrop blur with depth
  - Gradient text animations
  - Scale and rotate transforms on interactions
  - Pulse animations on status indicators

**Layout**: `TeacherLayout` (premium mode)

## Implementation

### Plan Detection
```typescript
// lib/plan-utils.ts
detectPlan(user) // Returns: 'free' | 'pro' | 'standard'
getPlanConfig(plan) // Returns plan configuration
```

### Layout Selection
- **Free Plan**: Uses `DashboardLayout` (standard mode)
- **Pro Plan**: Uses `ProLayout` (automatically selected in DashboardLayout)
- **Standard Plan**: Uses `TeacherLayout` (for `/teacher/*` routes)

### Key Files
- `lib/plan-utils.ts` - Plan detection and configuration
- `components/ProLayout.tsx` - Pro Plan layout with animations
- `components/TeacherLayout.tsx` - Standard Plan layout (premium)
- `components/DashboardLayout.tsx` - Free Plan layout (standard)
- `app/globals.css` - Premium animation keyframes

## Plan Detection Logic

The system detects plans from:
1. `user.subscription_plan`
2. `user.subscription_type`
3. Falls back to 'free' if not set

Plan name normalization:
- `standard`, `teacher`, `institute` → `standard`
- `pro`, `premium` → `pro`
- Everything else → `free`

## Visual Differences

### Free Plan
- Light background: `from-slate-50 to-blue-50`
- Standard cards with simple shadows
- Basic hover states

### Pro Plan
- Light gradient: `from-blue-50 via-cyan-50 to-indigo-50`
- Animated floating orbs in background
- Enhanced hover effects (scale, rotate)
- Pulse animations on status indicators
- Smooth backdrop blur transitions

### Standard Plan (Teacher)
- Dark gradient: `from-slate-950 via-slate-900 to-indigo-950`
- Multiple floating orbs with different speeds
- Particle field animation
- Animated gradient mesh overlays
- Premium glow effects on hover
- Advanced shadow effects
- Gradient text animations

## Usage Example

```typescript
import { usePlan, detectPlan } from '@/lib/plan-utils';

const user = await getUser();
const plan = detectPlan(user); // 'free' | 'pro' | 'standard'
const config = usePlan(user);

if (config.hasAnimations) {
  // Apply premium animations
}
```

## Future Enhancements

- Add plan-based feature flags
- Implement plan upgrade prompts
- Add plan-specific color themes
- Create plan-based component variants

