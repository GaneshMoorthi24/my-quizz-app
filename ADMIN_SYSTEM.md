# Admin System Documentation

## Overview
This document describes the admin system implementation for the quiz application. The admin system allows administrators to manage exams, question papers, questions, and handle PDF imports.

## Features Implemented

### 1. Admin Authentication
- Admin role checking via `lib/admin-auth.js`
- Automatic redirect for non-admin users
- Protected admin routes using `AdminLayout` component

### 2. Admin Pages

#### `/admin` - Admin Dashboard
- Overview statistics (total exams, papers, questions, imports)
- Quick action buttons
- Recent imports list
- Stats cards with visual indicators

#### `/admin/exams` - Exams Management
- List all exams (LDC, UDC, etc.)
- Create new exam (modal form)
- Edit existing exam
- Delete exam
- View exam details and paper count

#### `/admin/exams/[examId]` - Exam Detail
- List all question papers for an exam
- Create new question paper (year, title)
- Edit question paper
- Delete question paper
- Navigate to paper management

#### `/admin/papers/[paperId]` - Paper Detail
- List all questions in a paper
- View question details (text, options, correct answer, explanation)
- Edit individual questions
- Delete questions
- Upload PDF button
- Add question manually button

#### `/admin/papers/[paperId]/upload` - PDF Upload & Parsing
- Upload PDF file
- Automatic parsing after upload
- Review parsed questions
- Edit parsed questions before saving
- Save all questions to database
- Error handling for upload/parse failures

#### `/admin/questions/[questionId]` - Question Editor
- Create new question
- Edit existing question
- Manage question text, options (A, B, C, D)
- Set correct answer
- Add explanation
- Set difficulty level

#### `/admin/imports` - Import History
- View all PDF imports
- Status indicators (completed, failed, parsing)
- File names and paper associations
- Error messages for failed imports
- Date and time of imports
- Link to associated papers

### 3. API Services

#### `lib/api/admin.js`
- **examsApi**: CRUD operations for exams
- **papersApi**: CRUD operations for question papers
- **questionsApi**: CRUD operations for questions
- **uploadApi**: PDF upload and parsing
- **importsApi**: Import history retrieval

### 4. Components

#### `components/AdminLayout.tsx`
- Shared admin layout with sidebar navigation
- Admin role verification
- User profile display
- Logout functionality
- Navigation items:
  - Dashboard
  - Exams
  - Import History

## API Endpoints Required (Backend)

The following API endpoints need to be implemented in your Laravel backend:

### Exams
```
GET    /api/admin/exams              - List all exams
GET    /api/admin/exams/{id}         - Get exam details
POST   /api/admin/exams              - Create exam
PUT    /api/admin/exams/{id}         - Update exam
DELETE /api/admin/exams/{id}         - Delete exam
```

### Question Papers
```
GET    /api/admin/exams/{examId}/papers        - List papers for exam
GET    /api/admin/papers/{id}                  - Get paper details
POST   /api/admin/exams/{examId}/papers        - Create paper
PUT    /api/admin/papers/{id}                  - Update paper
DELETE /api/admin/papers/{id}                  - Delete paper
```

### Questions
```
GET    /api/admin/papers/{paperId}/questions   - List questions for paper
GET    /api/admin/questions/{id}               - Get question details
POST   /api/admin/papers/{paperId}/questions   - Create question
PUT    /api/admin/questions/{id}               - Update question
DELETE /api/admin/questions/{id}               - Delete question
```

### PDF Upload & Parsing
```
POST   /api/admin/papers/{paperId}/upload              - Upload PDF
POST   /api/admin/papers/{paperId}/parse/{uploadId}    - Parse PDF
GET    /api/admin/papers/{paperId}/parse/{uploadId}    - Get parsed questions
POST   /api/admin/papers/{paperId}/parse/{uploadId}/save - Save parsed questions
```

### Import History
```
GET    /api/admin/imports          - List all imports
GET    /api/admin/imports/{id}     - Get import details
```

## Database Schema (Recommended)

### exams
- id
- name (e.g., "LDC", "UDC")
- code (e.g., "LDC-2024")
- description
- created_at
- updated_at

### question_papers
- id
- exam_id (foreign key)
- title
- year
- created_at
- updated_at

### questions
- id
- paper_id (foreign key)
- question_text
- options (JSON: {A: "...", B: "...", C: "...", D: "..."})
- correct_answer (A, B, C, or D)
- explanation
- difficulty (easy, medium, hard)
- created_at
- updated_at

### imports
- id
- paper_id (foreign key)
- file_name
- file_path
- status (pending, parsing, completed, failed)
- questions_count
- error_message
- created_at
- updated_at

## Authentication

All admin API endpoints require:
- Valid authentication token (Bearer token)
- User role must be 'admin'

The token is automatically added to requests via the API interceptor in `lib/api.js`.

## Usage

### Accessing Admin Panel
1. Log in as an admin user
2. Click "Admin Panel" link in the dashboard sidebar (visible only for admin users)
3. Or navigate directly to `/admin`

### Creating an Exam
1. Go to `/admin/exams`
2. Click "Create Exam"
3. Fill in exam name, code, and description
4. Click "Create"

### Adding Questions via PDF
1. Go to an exam → Select a paper
2. Click "Upload PDF"
3. Select PDF file
4. Wait for parsing to complete
5. Review and edit parsed questions
6. Click "Save All Questions"

### Adding Questions Manually
1. Go to a paper detail page
2. Click "Add Question"
3. Fill in question text, options, correct answer
4. Optionally add explanation and difficulty
5. Click "Create Question"

## Styling

The admin system uses the same design system as the main application:
- Tailwind CSS with custom theme variables
- Material Symbols icons
- Consistent color scheme (primary, secondary, error, etc.)
- Responsive design

## Next Steps

1. **Backend Implementation**: Implement all API endpoints in Laravel
2. **PDF Parsing**: Integrate PDF parsing library (e.g., pdf-parse, PyPDF2, or external service)
3. **Error Handling**: Add comprehensive error handling and user feedback
4. **Validation**: Add client-side and server-side validation
5. **Testing**: Add unit tests and integration tests
6. **Permissions**: Implement fine-grained permissions if needed
7. **Bulk Operations**: Add bulk question import/export
8. **Search & Filter**: Add search and filter functionality for exams/papers/questions

## Notes

- All admin pages are client-side rendered ("use client")
- Admin layout automatically redirects non-admin users
- API calls include error handling but may need enhancement
- PDF parsing is assumed to be handled by the backend
- Import history tracks all PDF uploads and their status

