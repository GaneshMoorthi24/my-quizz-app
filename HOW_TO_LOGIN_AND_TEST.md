# How to Login and Test Different User Types

This guide explains how to login and test Teacher, Student, Government, and Admin users.

## 🔐 Login Process

### Step 1: Access Login Page
1. Navigate to: `http://localhost:3000/login`
2. Enter your email and password
3. Click "Sign In"

### Step 2: Automatic Redirect
After successful login, the system automatically redirects you based on your user type:
- **Admin** → `/admin`
- **Teacher** → `/teacher`
- **Government** → `/government`
- **Student** → `/dashboard`

---

## 👥 User Type Detection

The system detects user type using:
1. **Role field** (`role` in database)
2. **Subscription plan** (`subscription_plan` in database)
3. **Admin flag** (`is_admin` in database)

### Detection Logic:
```typescript
- Admin: is_admin === true OR role === 'admin'
- Teacher: role === 'teacher' OR subscription_plan === 'standard'
- Government: role === 'government' OR role === 'govt'
- Student: Default (all others)
```

---

## 🧪 Creating Test Users

### Option 1: Via Registration (Frontend)

#### Create a Teacher User:
1. Go to `/pricing`
2. Click "Contact Sales" on **Standard Plan**
3. Sign up with email (e.g., `teacher@test.com`)
4. Backend should set `subscription_plan = 'standard'` or `role = 'teacher'`

#### Create a Student User (Free):
1. Go to `/pricing`
2. Click "Get Started Free" on **Free Plan**
3. Sign up with email (e.g., `student@test.com`)
4. Backend should set `subscription_plan = 'free'` or `role = 'student'`

#### Create a Student User (Pro):
1. Go to `/pricing`
2. Click "Start Pro Trial" on **Pro Plan**
3. Sign up with email (e.g., `studentpro@test.com`)
4. Backend should set `subscription_plan = 'pro'` or `role = 'student'`

#### Create a Government User:
1. Go to `/pricing`
2. Click any plan (Free or Pro)
3. Sign up with email (e.g., `govt@test.com`)
4. **Manually update in database**: Set `role = 'government'`

### Option 2: Direct Database Update (Backend)

#### Using Laravel Tinker:
```bash
cd my-quizz-app-backend
php artisan tinker
```

#### Create Admin User:
```php
$admin = User::create([
    'name' => 'Admin User',
    'email' => 'admin@test.com',
    'password' => bcrypt('password123'),
    'is_admin' => true,
    'role' => 'admin',
    'subscription_plan' => 'free',
    'email_verified_at' => now()
]);
```

#### Create Teacher User:
```php
$teacher = User::create([
    'name' => 'Teacher User',
    'email' => 'teacher@test.com',
    'password' => bcrypt('password123'),
    'is_admin' => false,
    'role' => 'teacher',
    'subscription_plan' => 'standard',
    'email_verified_at' => now()
]);
```

#### Create Student User (Free):
```php
$student = User::create([
    'name' => 'Student User',
    'email' => 'student@test.com',
    'password' => bcrypt('password123'),
    'is_admin' => false,
    'role' => 'student',
    'subscription_plan' => 'free',
    'email_verified_at' => now()
]);
```

#### Create Student User (Pro):
```php
$studentPro = User::create([
    'name' => 'Student Pro',
    'email' => 'studentpro@test.com',
    'password' => bcrypt('password123'),
    'is_admin' => false,
    'role' => 'student',
    'subscription_plan' => 'pro',
    'email_verified_at' => now()
]);
```

#### Create Government User:
```php
$govt = User::create([
    'name' => 'Government User',
    'email' => 'govt@test.com',
    'password' => bcrypt('password123'),
    'is_admin' => false,
    'role' => 'government',
    'subscription_plan' => 'pro', // or 'free'
    'email_verified_at' => now()
]);
```

---

## 🔍 How to Check User Type After Login

### Method 1: Check Browser Console
After login, open browser console (F12) and check:
```javascript
// Check stored user
const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
console.log('User:', user);
console.log('Role:', user.role);
console.log('Plan:', user.subscription_plan);
console.log('Is Admin:', user.is_admin);
```

### Method 2: Check Network Tab
1. Open DevTools → Network tab
2. Login
3. Check the `/api/user` request response
4. Look for `role`, `subscription_plan`, `is_admin` fields

### Method 3: Check Current Route
After login, check the URL:
- `/admin` → Admin user
- `/teacher` → Teacher user
- `/government` → Government user
- `/dashboard` → Student user

---

## 🐛 Fixing 401 Unauthorized Errors

If you see `401 (Unauthorized)` errors in console:

### Issue: Token Missing or Expired
**Solution:**
1. Clear browser storage:
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   ```
2. Logout and login again
3. Make sure backend is running on `http://localhost:8000`

### Issue: Email Not Verified
**Solution:**
1. Check if email verification is required
2. Use Laravel Tinker to verify email:
   ```php
   $user = User::where('email', 'your@email.com')->first();
   $user->email_verified_at = now();
   $user->save();
   ```

### Issue: Backend Not Running
**Solution:**
```bash
cd my-quizz-app-backend
php artisan serve
# Should run on http://localhost:8000
```

---

## 📋 Quick Test Checklist

### Test Admin Login:
- [ ] Create admin user (is_admin = true)
- [ ] Login with admin credentials
- [ ] Should redirect to `/admin`
- [ ] Should see admin dashboard

### Test Teacher Login:
- [ ] Create teacher user (role = 'teacher' OR subscription_plan = 'standard')
- [ ] Login with teacher credentials
- [ ] Should redirect to `/teacher`
- [ ] Should see premium teacher UI

### Test Student Login (Free):
- [ ] Create student user (role = 'student', subscription_plan = 'free')
- [ ] Login with student credentials
- [ ] Should redirect to `/dashboard`
- [ ] Should see standard UI

### Test Student Login (Pro):
- [ ] Create student user (role = 'student', subscription_plan = 'pro')
- [ ] Login with student credentials
- [ ] Should redirect to `/dashboard`
- [ ] Should see Pro UI with animations

### Test Government Login:
- [ ] Create government user (role = 'government')
- [ ] Login with government credentials
- [ ] Should redirect to `/government`
- [ ] Should see government exam dashboard

---

## 🔧 Backend Updates Needed

### Update Registration Endpoint

The `AuthController::register()` method needs to accept and store:
- `subscription_plan` (from frontend)
- `role` (can be inferred from plan or set explicitly)

**Current Issue:** Registration doesn't store `subscription_plan` or `role`.

**Fix Required:** Update `app/Http/Controllers/AuthController.php`:
```php
public function register(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|unique:users',
        'password' => 'required|string|min:6',
        'subscription_plan' => 'nullable|string|in:free,pro,standard',
        'role' => 'nullable|string|in:student,teacher,admin,government',
    ]);

    // Determine role from plan if not provided
    $role = $request->role;
    if (!$role) {
        if ($request->subscription_plan === 'standard') {
            $role = 'teacher';
        } else {
            $role = 'student';
        }
    }

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => bcrypt($request->password),
        'subscription_plan' => $request->subscription_plan ?? 'free',
        'role' => $role,
    ]);

    event(new Registered($user));

    return response()->json([
        'message' => 'User registered successfully!',
        'user' => $user
    ], 201);
}
```

### Update User Model

Make sure `User.php` has these fields in `$fillable`:
```php
protected $fillable = [
    'name',
    'email',
    'password',
    'is_admin',
    'role',
    'subscription_plan',
    'is_teacher', // if using this field
];
```

---

## 🎯 Quick Test Script

Run this in Laravel Tinker to create all test users at once:

```php
// Admin
User::create([
    'name' => 'Admin Test',
    'email' => 'admin@test.com',
    'password' => bcrypt('password'),
    'is_admin' => true,
    'role' => 'admin',
    'subscription_plan' => 'free',
    'email_verified_at' => now()
]);

// Teacher
User::create([
    'name' => 'Teacher Test',
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

// Government
User::create([
    'name' => 'Government Test',
    'email' => 'govt@test.com',
    'password' => bcrypt('password'),
    'is_admin' => false,
    'role' => 'government',
    'subscription_plan' => 'pro',
    'email_verified_at' => now()
]);
```

**All test users password:** `password`

---

## ✅ Verification Steps

After creating users, verify:

1. **Check Database:**
   ```sql
   SELECT id, name, email, role, subscription_plan, is_admin, email_verified_at 
   FROM users;
   ```

2. **Test Login:**
   - Go to `/login`
   - Use test credentials
   - Check redirect URL
   - Verify correct panel loads

3. **Check Console:**
   - No 401 errors
   - User object contains correct role/plan
   - Token is stored

---

## 🚨 Common Issues

### Issue: Always redirects to `/dashboard`
**Cause:** User role not set correctly
**Fix:** Update user in database with correct `role` field

### Issue: 401 errors on every request
**Cause:** Token not being sent or expired
**Fix:** Clear storage and login again

### Issue: Email verification blocking login
**Fix:** Set `email_verified_at` in database or disable email verification in `.env`:
```
REQUIRE_EMAIL_VERIFICATION=false
```

---

## 📞 Need Help?

If you're still having issues:
1. Check backend logs: `my-quizz-app-backend/storage/logs/laravel.log`
2. Check browser console for errors
3. Verify backend is running on port 8000
4. Verify database connection
5. Check user table structure matches expected fields

