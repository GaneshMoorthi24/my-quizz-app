# Implementation Guide - Quick Start

## 🚀 Getting Started with Backend Integration

### Step 1: Set Up Laravel Backend

```bash
# Create new Laravel project
composer create-project laravel/laravel quiz-platform-api

cd quiz-platform-api

# Install required packages
composer require laravel/sanctum
composer require spatie/laravel-permission
composer require guzzlehttp/guzzle

# Set up database
php artisan migrate
php artisan db:seed
```

### Step 2: Configure CORS for Next.js

In `config/cors.php`:
```php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000'], // Your Next.js URL
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

### Step 3: Create API Routes

In `routes/api.php`:
```php
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/quizzes', [QuizController::class, 'index']);
    Route::get('/quizzes/{id}', [QuizController::class, 'show']);
    Route::post('/quizzes/{id}/start', [AttemptController::class, 'start']);
    Route::post('/attempts/{id}/answer', [AttemptController::class, 'saveAnswer']);
    Route::post('/attempts/{id}/submit', [AttemptController::class, 'submit']);
});
```

---

## 🔌 Frontend API Integration

### Create API Client

Create `lib/api-client.ts`:

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Create API Service Functions

Create `lib/api/quizzes.ts`:

```typescript
import apiClient from '../api-client';

export const quizApi = {
  // Get all quizzes
  getAll: async (filters?: { subject?: string; difficulty?: string }) => {
    const response = await apiClient.get('/quizzes', { params: filters });
    return response.data;
  },

  // Get quiz by ID
  getById: async (id: string) => {
    const response = await apiClient.get(`/quizzes/${id}`);
    return response.data;
  },

  // Start quiz attempt
  startAttempt: async (quizId: string) => {
    const response = await apiClient.post(`/quizzes/${quizId}/start`);
    return response.data;
  },

  // Save answer
  saveAnswer: async (attemptId: string, questionId: string, answer: string) => {
    const response = await apiClient.post(`/attempts/${attemptId}/answer`, {
      question_id: questionId,
      selected_answer: answer,
    });
    return response.data;
  },

  // Submit quiz
  submitQuiz: async (attemptId: string) => {
    const response = await apiClient.post(`/attempts/${attemptId}/submit`);
    return response.data;
  },
};
```

### Update Dashboard to Use API

Update `app/dashboard/page.tsx`:

```typescript
"use client";

import { useState, useEffect } from "react";
import { quizApi } from "@/lib/api/quizzes";

export default function DashboardPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await quizApi.getAll();
        setQuizzes(data);
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // ... rest of component
}
```

---

## 🔐 Authentication Integration

### Create Auth Service

Create `lib/api/auth.ts`:

```typescript
import apiClient from '../api-client';

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('auth_token', token);
    return { token, user };
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    const response = await apiClient.post('/auth/register', userData);
    const { token, user } = response.data;
    localStorage.setItem('auth_token', token);
    return { token, user };
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('auth_token');
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};
```

### Update Login Page

Update `app/login/page.tsx`:

```typescript
import { authApi } from "@/lib/api/auth";

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    await authApi.login(email, password);
    router.push("/dashboard");
  } catch (error) {
    // Handle error (show toast, etc.)
    console.error('Login failed:', error);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 🤖 AI Question Generator Integration

### Backend Service

Create `app/Services/AIGeneratorService.php`:

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIGeneratorService
{
    private $apiKey;
    private $apiUrl = 'https://api.openai.com/v1/chat/completions';

    public function __construct()
    {
        $this->apiKey = config('services.openai.api_key');
    }

    public function generateQuestions($topic, $subject, $count = 10, $difficulty = 'medium', $examType = 'general')
    {
        $prompt = $this->buildPrompt($topic, $subject, $count, $difficulty, $examType);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl, [
                'model' => 'gpt-4',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are an expert exam question generator. Generate questions in JSON format.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'temperature' => 0.7,
            ]);

            if ($response->successful()) {
                return $this->parseResponse($response->json());
            }

            throw new \Exception('AI API request failed');
        } catch (\Exception $e) {
            Log::error('AI Generation Error: ' . $e->getMessage());
            throw $e;
        }
    }

    private function buildPrompt($topic, $subject, $count, $difficulty, $examType)
    {
        return "Generate {$count} multiple-choice questions for {$examType} exam on the topic: {$topic} in {$subject} subject.
        
        Difficulty level: {$difficulty}
        
        Requirements:
        - Each question should have 4 options (A, B, C, D)
        - Mark the correct answer
        - Provide a brief explanation (2-3 sentences)
        - Questions should be relevant to {$examType} exam pattern
        
        Return the response in JSON format:
        {
            \"questions\": [
                {
                    \"question\": \"...\",
                    \"options\": {
                        \"A\": \"...\",
                        \"B\": \"...\",
                        \"C\": \"...\",
                        \"D\": \"...\"
                    },
                    \"correct_answer\": \"A\",
                    \"explanation\": \"...\"
                }
            ]
        }";
    }

    private function parseResponse($response)
    {
        $content = $response['choices'][0]['message']['content'];
        $json = json_decode($content, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            // Try to extract JSON from markdown code blocks
            preg_match('/```json\s*(.*?)\s*```/s', $content, $matches);
            if (isset($matches[1])) {
                $json = json_decode($matches[1], true);
            }
        }

        return $json['questions'] ?? [];
    }
}
```

### Frontend Integration

Create `lib/api/ai.ts`:

```typescript
import apiClient from '../api-client';

export const aiApi = {
  generateQuestions: async (params: {
    topic: string;
    subject: string;
    count: number;
    difficulty: 'easy' | 'medium' | 'hard';
    examType?: string;
  }) => {
    const response = await apiClient.post('/ai/generate-questions', params);
    return response.data;
  },

  generateFromSyllabus: async (syllabus: string, examType: string) => {
    const formData = new FormData();
    formData.append('syllabus', syllabus);
    formData.append('exam_type', examType);

    const response = await apiClient.post('/ai/generate-from-syllabus', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
```

---

## 📊 State Management with Zustand

Create `store/useAuthStore.ts`:

```typescript
import { create } from 'zustand';
import { authApi } from '@/lib/api/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    const { token, user } = await authApi.login(email, password);
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    await authApi.logout();
    set({ user: null, token: null, isAuthenticated: false });
  },

  register: async (userData) => {
    const { token, user } = await authApi.register(userData);
    set({ user, token, isAuthenticated: true });
  },

  checkAuth: async () => {
    try {
      const user = await authApi.getCurrentUser();
      set({ user, isAuthenticated: true });
    } catch {
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));
```

---

## 🎯 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend (.env)
```env
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=quiz_platform
DB_USERNAME=root
DB_PASSWORD=

OPENAI_API_KEY=your_openai_api_key_here

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
```

---

## 📝 Next Steps Checklist

- [ ] Set up Laravel backend project
- [ ] Configure database and run migrations
- [ ] Implement authentication endpoints
- [ ] Create API client in Next.js
- [ ] Connect login/signup to backend
- [ ] Replace static quiz data with API calls
- [ ] Implement quiz attempt flow with backend
- [ ] Set up AI service integration
- [ ] Add error handling and loading states
- [ ] Implement protected routes middleware

---

## 🐛 Common Issues & Solutions

### CORS Errors
- Ensure Laravel CORS config allows your Next.js origin
- Check `config/cors.php` settings

### Authentication Token Issues
- Verify token is stored in localStorage
- Check token expiration handling
- Ensure Bearer token format in headers

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check Laravel server is running on correct port
- Verify API routes are registered

---

**Ready to start building!** 🚀

