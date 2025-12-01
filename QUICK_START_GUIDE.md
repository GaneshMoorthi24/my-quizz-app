# Quick Start Guide - Login and Test All User Types

## 🚀 Quick Setup

### Step 1: Run Backend Migrations
```bash
cd my-quizz-app-backend
php artisan migrate
```

This will add `role` and `subscription_plan` columns to users table.

### Step 2: Create Test Users

Run this in Laravel Tinker (`php artisan tinker`):

```php
use App\Models\User;

// Admin User
User::create([
    'name' => 'Admin User',
    'email' => 'admin@test.com',
    'password' => bcrypt('password'),
    'is_admin' => true,
    'role' => 'admin',
    'subscription_plan' => 'free',
    'email_verified_at' => now()
]);

// Teacher User
User::create([
    'name' => 'Teacher User',
    'email' => 'teacher@test.com',
    'password' => bcrypt('password'),
    'is_admin' => false,
    'role' => 'teacher',
    'subscription_plan' => 'standard',
    'email_verified_at' => now()
]);

// Student Free
User::create([
    'name' => 'Student Free',
    'email' => 'student@test.com',
    'password' => bcrypt('password'),
    'is_admin' => false,
    'role' => 'student',
    'subscription_plan' => 'free',
    'email_verified_at' => now()
]);

// Student Pro
User::create([
    'name' => 'Student Pro',
    'email' => 'studentpro@test.com',
    'password' => bcrypt('password'),
    'is_admin' => false,
    'role' => 'student',
    'subscription_plan' => 'pro',
    'email_verified_at' => now()
]);

// Government User
User::create([
    'name' => 'Government User',
    'email' => 'govt@test.com',
    'password' => bcrypt('password'),
    'is_admin' => false,
    'role' => 'government',
    'subscription_plan' => 'pro',
    'email_verified_at' => now()
]);
```

### Step 3: Start Servers

**Backend:**
```bash
cd my-quizz-app-backend
php artisan serve
# Runs on http://localhost:8000
```

**Frontend:**
```bash
cd my-quizz-app
npm run dev
# Runs on http://localhost:3000
```

### Step 4: Test Login

1. Go to `http://localhost:3000/login`
2. Use test credentials:

| User Type | Email | Password | Redirects To |
|-----------|-------|----------|-------------|
| **Admin** | admin@test.com | password | `/admin` |
| **Teacher** | teacher@test.com | password | `/teacher` |
| **Student (Free)** | student@test.com | password | `/dashboard` |
| **Student (Pro)** | studentpro@test.com | password | `/dashboard` (Pro UI) |
| **Government** | govt@test.com | password | `/government` |

---

## 🔍 How to Verify User Type

### After Login, Check Browser Console:
```javascript
// Open DevTools (F12) → Console tab
const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
console.log('User Role:', user.role);
console.log('Subscription Plan:', user.subscription_plan);
console.log('Is Admin:', user.is_admin);
```

### Check Network Tab:
1. Open DevTools → Network tab
2. Login
3. Find `/api/user` request
4. Check response for `role`, `subscription_plan`, `is_admin`

---

## 🐛 Fix 401 Errors

If you see `401 Unauthorized` errors:

### Solution 1: Clear Storage
```javascript
// In browser console
localStorage.clear();
sessionStorage.clear();
// Then login again
```

### Solution 2: Verify Email
```bash
cd my-quizz-app-backend
php artisan tinker
```
```php
$user = User::where('email', 'your@email.com')->first();
$user->email_verified_at = now();
$user->save();
```

### Solution 3: Disable Email Verification (Development)
In `.env`:
```
REQUIRE_EMAIL_VERIFICATION=false
```

---

## ✅ Verification Checklist

After login, verify:

- [ ] **Admin** → URL is `/admin`, sees admin dashboard
- [ ] **Teacher** → URL is `/teacher`, sees premium teacher UI
- [ ] **Student Free** → URL is `/dashboard`, sees standard UI
- [ ] **Student Pro** → URL is `/dashboard`, sees Pro UI with animations
- [ ] **Government** → URL is `/government`, sees government exam dashboard
- [ ] No 401 errors in console
- [ ] User object contains correct `role` and `subscription_plan`

---

## 📝 Registration Flow

### Via Frontend:
1. Go to `/pricing`
2. Select a plan:
   - **Free Plan** → Creates student with `subscription_plan = 'free'`
   - **Pro Plan** → Creates student with `subscription_plan = 'pro'`
   - **Standard Plan** → Creates teacher with `subscription_plan = 'standard'`
3. Fill registration form
4. Backend automatically sets `role` based on plan

### Manual Role Assignment:
After registration, update in database:
```php
$user = User::where('email', 'user@example.com')->first();
$user->role = 'government'; // or 'teacher', 'student', 'admin'
$user->subscription_plan = 'pro'; // or 'free', 'standard'
$user->save();
```

---

## 🎯 Quick Test Commands

### Check All Users:
```bash
php artisan tinker
```
```php
User::select('id', 'name', 'email', 'role', 'subscription_plan', 'is_admin')->get();
```

### Update User Role:
```php
$user = User::where('email', 'user@example.com')->first();
$user->role = 'teacher';
$user->subscription_plan = 'standard';
$user->save();
```

### Verify Email for All Users:
```php
User::whereNull('email_verified_at')->update(['email_verified_at' => now()]);
```

---

## 📚 More Information

- **Full Guide**: See `HOW_TO_LOGIN_AND_TEST.md`
- **System Documentation**: See `FOUR_PANEL_SYSTEM.md`
- **Plan-Based UI**: See `PLAN_BASED_UI.md`

---

## 🆘 Troubleshooting

### Issue: Always redirects to `/dashboard`
**Fix:** Check user `role` field in database

### Issue: 401 errors
**Fix:** Clear browser storage and login again

### Issue: Email verification blocking
**Fix:** Set `email_verified_at` or disable verification

### Issue: Backend not responding
**Fix:** Check if `php artisan serve` is running on port 8000

