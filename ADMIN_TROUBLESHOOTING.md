# Admin Panel Troubleshooting Guide

## Issue: Redirecting to Login Page

If you're being redirected to the login page when accessing `/admin`, check the following:

### 1. Check if you're logged in
- Make sure you've logged in first by going to `/login`
- Check browser console for "No token found" message
- Verify that a token exists in localStorage: Open browser DevTools → Application → Local Storage → Check for `token` key

### 2. Check if your user has admin role
- The user's `role` field in the database must be set to `'admin'`
- Check your backend API `/api/user` endpoint - it should return: `{ id, name, email, role: 'admin', ... }`
- If your role is not 'admin', you'll be redirected to `/dashboard` instead

### 3. Check if backend API is running
- Make sure your Laravel backend is running on `http://localhost:8000`
- Check browser console for connection errors (ECONNREFUSED, Network Error)
- Verify the API endpoint `/api/user` exists and is accessible

### 4. Check API endpoint response
The `/api/user` endpoint should return a response like:
```json
{
  "id": 1,
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "admin",
  ...
}
```

### 5. Common Issues and Solutions

#### Issue: "No token found"
**Solution**: Log in first at `/login` page

#### Issue: "User is not admin"
**Solution**: Update your user's role in the database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

#### Issue: "Cannot connect to API server"
**Solution**: 
- Start your Laravel backend: `php artisan serve`
- Check if backend is running on port 8000
- Verify CORS settings in Laravel if accessing from different port

#### Issue: "401 Unauthorized"
**Solution**:
- Token might be expired or invalid
- Log out and log in again
- Check if token format is correct (Bearer token)

### 6. Debug Steps

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try accessing `/admin`
4. Check console messages:
   - "No token found" → Not logged in
   - "User is not admin" → Role issue
   - "401 Unauthorized" → Token issue
   - "Network Error" → Backend not running

5. Check Network tab:
   - Look for `/api/user` request
   - Check status code (200 = success, 401 = unauthorized, 500 = server error)
   - Check response body

### 7. Backend Requirements

Make sure your Laravel backend has:

1. **User Model** with `role` field:
```php
// migration
$table->enum('role', ['student', 'teacher', 'admin'])->default('student');
```

2. **API Route** for `/api/user`:
```php
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
```

3. **CORS Configuration** to allow requests from frontend

### 8. Testing Admin Access

1. Create an admin user in database:
```sql
INSERT INTO users (name, email, password, role, created_at, updated_at) 
VALUES ('Admin', 'admin@example.com', '$2y$10$...', 'admin', NOW(), NOW());
```

2. Log in with admin credentials
3. Access `/admin` - should work now

### 9. Quick Fix: Temporarily Bypass Admin Check

⚠️ **Only for development/testing!**

If you need to test the admin UI without backend, you can temporarily modify `components/AdminLayout.tsx`:

```typescript
// Temporary: Skip auth check
useEffect(() => {
  setUser({ id: 1, name: 'Admin', email: 'admin@test.com', role: 'admin' });
}, []);
```

Remember to remove this after testing!

### 10. Still Having Issues?

Check the browser console for detailed error messages. The updated code now logs:
- Token presence
- User data received
- User role
- API errors
- Network errors

This will help identify the exact issue.

