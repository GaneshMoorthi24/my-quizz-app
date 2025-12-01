# Four-Panel System Documentation

This document describes the complete four-panel system for the QuizPlatform application.

## System Overview

The platform supports **4 distinct user panels**:

1. **🟩 TEACHER PANEL** - Content creators who create quizzes
2. **🟦 STUDENT PANEL** - General students (learners under teachers or self-learners)
3. **🟥 GOVERNMENT EXAM USERS** - Competitive exam preparation (TNPSC, SSC, RRB, etc.)
4. **🟧 ADMIN PANEL** - Platform owner/administrator

---

## 1. 🟩 TEACHER PANEL

### Purpose
For teachers who create quizzes, manage students, and conduct assessments.

### Access
- **Route**: `/teacher/*`
- **Plan**: Standard Plan (subscription_plan: 'standard')
- **Layout**: `TeacherLayout` (Premium UI)

### Features
- ✅ Create quizzes (manual + AI-assisted)
- ✅ Upload PDF → Auto-generate questions
- ✅ Create question bank
- ✅ Manage student groups
- ✅ Add/remove students
- ✅ Assign tests to students/groups
- ✅ View quiz results
- ✅ Download reports (PDF/Excel)
- ✅ Analytics dashboard
- ✅ Subscription management (Standard Plan)
- ✅ Certificate management
- ✅ Live test monitoring

### Screens
- `/teacher` - Teacher Dashboard
- `/teacher/quizzes` - My Quizzes / Create Quiz
- `/teacher/pdf-upload` - Upload PDF
- `/teacher/question-bank` - Question Bank
- `/teacher/groups` - Student Groups
- `/teacher/assignments` - Assign Quiz
- `/teacher/live-monitor` - Live Monitoring
- `/teacher/results` - Quiz Results
- `/teacher/performance` - Student Performance Analytics
- `/teacher/certificates` - Certificate Management
- `/teacher/profile` - Profile Settings
- `/teacher/billing` - Subscription & Billing

---

## 2. 🟦 STUDENT PANEL

### Purpose
For students who attend teacher-created quizzes OR attempt learning quizzes.

### Access
- **Route**: `/dashboard/*`
- **Plans**: Free Plan or Pro Plan
- **Layout**: 
  - Free: `DashboardLayout` (standard UI)
  - Pro: `ProLayout` (advanced animations)

### Features
- ✅ Attend teacher quizzes
- ✅ Practice mode
- ✅ View results
- ✅ Wrong questions review
- ✅ AI Explanation (Pro Plan only)
- ✅ Past papers access (Pro Plan only)
- ✅ Daily quizzes
- ✅ Certificates
- ✅ Profile management
- ✅ Subscription management (Free/Pro)

### Screens
- `/dashboard` - Student Dashboard
- `/quizzes` - Available Quizzes
- `/analytics` - Performance Analytics
- `/profile` - Profile Settings
- `/settings` - Account Settings

### Plan Differences

#### Free Plan
- Limited quiz attempts
- Basic leaderboard
- No AI explanations
- Limited past papers

#### Pro Plan
- Unlimited quiz attempts
- AI explanations
- Full past papers access
- Advanced analytics
- Priority support

---

## 3. 🟥 GOVERNMENT EXAM USERS

### Purpose
For users preparing for competitive government exams (TNPSC, SSC, RRB, Banking, etc.).

### Access
- **Route**: `/government/*`
- **Plans**: Free Plan or Pro Plan
- **Layout**: `GovernmentLayout` (plan-aware UI)

### Features
- ✅ Choose government exam (TNPSC, SSC, RRB, TNUSRB, Banking, UPSC)
- ✅ Take previous year papers
- ✅ Model tests
- ✅ Current affairs quiz
- ✅ Unlimited attempts (Pro only)
- ✅ AI explanation (Pro only)
- ✅ Leaderboard
- ✅ Exam-wise performance tracking
- ✅ Subscription management (Free/Pro)

### Screens
- `/government` - Government Exam Dashboard
- `/government/exams` - Select Exam
- `/government/exams/[examId]` - Specific Exam (TNPSC, SSC, etc.)
- `/government/papers` - Previous Year Papers
- `/government/model-tests` - Model Exams
- `/government/current-affairs` - Current Affairs Quiz
- `/government/results` - My Results
- `/government/leaderboard` - Leaderboard
- `/government/subscription` - Subscription Management

### Supported Exams
- **TNPSC**: Group 1, Group 2, Group 4, VAO, Combined Engineering Services
- **SSC**: CGL, CHSL, MTS, CPO, JE
- **RRB**: NTPC, Group D, ALP, JE, Technician
- **TNUSRB**: SI, Constable, Fireman, Jail Warder
- **Banking**: IBPS PO, IBPS Clerk, SBI PO, SBI Clerk, RBI Grade B
- **UPSC**: Civil Services, IFS, IES, CDS, NDA

---

## 4. 🟧 ADMIN PANEL

### Purpose
For platform administrators to manage the entire system.

### Access
- **Route**: `/admin/*`
- **Role**: Admin (is_admin = true or role = 'admin')
- **Layout**: `AdminLayout`

### Features
- ✅ Manage teachers
- ✅ Manage students
- ✅ Manage government exam content
- ✅ Manage quizzes
- ✅ Approve teachers
- ✅ Manage subscriptions
- ✅ Payments report
- ✅ Push notifications
- ✅ Dashboard overview
- ✅ CMS (about us, contact, banners)

### Screens
- `/admin` - Admin Dashboard
- `/admin/teachers` - Teachers List
- `/admin/students` - Students List
- `/admin/exams` - Exams Management
- `/admin/papers` - Question Papers
- `/admin/questions` - Questions Management
- `/admin/imports` - Import History
- `/admin/payments` - Payments Report
- `/admin/subscriptions` - Subscriptions Management
- `/admin/cms` - Content Management
- `/admin/settings` - Platform Settings

---

## User Role Detection

The system uses `detectUserRole()` from `lib/plan-utils.ts`:

```typescript
detectUserRole(user) // Returns: 'student' | 'teacher' | 'admin' | 'government'
```

### Detection Logic

1. **Admin**: `is_admin === true` OR `role === 'admin'`
2. **Teacher**: `role === 'teacher'` OR `subscription_plan === 'standard'`
3. **Government**: `role === 'government'` OR `role === 'govt'` OR `role === 'govt_exam'`
4. **Student**: Default (all other users)

---

## Login Redirect Flow

After successful login, users are redirected using `getUserPanelPath()`:

```typescript
getUserPanelPath(user) // Returns correct panel path
```

### Redirect Mapping

| User Role | Redirect Path | Layout |
|-----------|--------------|--------|
| **Admin** | `/admin` | AdminLayout |
| **Teacher** | `/teacher` | TeacherLayout (Premium) |
| **Government** | `/government` | GovernmentLayout |
| **Student** | `/dashboard` | DashboardLayout / ProLayout |

---

## Registration Flow

### Plan Selection
Users select a plan during registration:
- **Free Plan** → Student or Government user (free)
- **Pro Plan** → Student or Government user (pro)
- **Standard Plan** → Teacher user

### Role Assignment
- Plan-based: `standard` plan → Teacher role
- Explicit: Backend can set `role` field directly
- Default: All others → Student role

---

## Plan-Based UI

### Free Plan
- Standard UI
- Basic features
- Limited access

### Pro Plan
- Advanced animations
- Smooth transitions
- Full feature access
- Enhanced UI

### Standard Plan (Teacher)
- Premium UI (best design)
- Advanced animations
- Particle effects
- Premium shadows and glows

---

## Access Control

### Route Protection
Each panel layout checks:
1. User authentication
2. User role/plan
3. Redirects if unauthorized

### Feature Gating
- Pro features require Pro Plan
- Teacher features require Standard Plan
- Admin features require Admin role

---

## API Integration Points

### User Object Structure
```typescript
{
  id: number;
  name: string;
  email: string;
  role?: 'student' | 'teacher' | 'admin' | 'government';
  is_admin?: boolean;
  subscription_plan?: 'free' | 'pro' | 'standard';
  subscription_type?: string;
}
```

### Backend Requirements
1. Store `role` field in users table
2. Store `subscription_plan` field
3. Return user object with role/plan on login
4. Support role-based middleware

---

## Testing Checklist

### Teacher Panel
- [ ] Standard plan user → `/teacher`
- [ ] Can create quizzes
- [ ] Can upload PDFs
- [ ] Can manage students
- [ ] Premium UI displays correctly

### Student Panel
- [ ] Free plan user → `/dashboard` (standard UI)
- [ ] Pro plan user → `/dashboard` (Pro UI)
- [ ] Can attend quizzes
- [ ] Pro features gated correctly

### Government Panel
- [ ] Government role user → `/government`
- [ ] Can select exams
- [ ] Can access previous papers
- [ ] Pro features work correctly

### Admin Panel
- [ ] Admin user → `/admin`
- [ ] Can manage all entities
- [ ] Access control works

---

## Future Enhancements

1. **Role Switching**: Allow users with multiple roles
2. **Institution Management**: Group teachers/students
3. **Advanced Analytics**: Cross-panel analytics
4. **Notification System**: Panel-specific notifications
5. **Mobile Apps**: Native apps for each panel

