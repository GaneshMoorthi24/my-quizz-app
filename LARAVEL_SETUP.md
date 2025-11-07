# Laravel Backend Setup Guide

## 📁 Recommended Laravel Project Structure

```
quiz-platform-api/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/
│   │   │   │   ├── AuthController.php
│   │   │   │   └── PasswordResetController.php
│   │   │   ├── QuizController.php
│   │   │   ├── QuestionController.php
│   │   │   ├── AttemptController.php
│   │   │   ├── AIGeneratorController.php
│   │   │   ├── AnalyticsController.php
│   │   │   └── Teacher/
│   │   │       ├── QuizManagementController.php
│   │   │       └── StudentProgressController.php
│   │   └── Middleware/
│   │       ├── EnsureUserIsTeacher.php
│   │       └── EnsureUserIsStudent.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Quiz.php
│   │   ├── Question.php
│   │   ├── Attempt.php
│   │   ├── AttemptAnswer.php
│   │   ├── Institution.php
│   │   └── PerformanceAnalytic.php
│   ├── Services/
│   │   ├── AIGeneratorService.php
│   │   ├── QuizService.php
│   │   ├── AnalyticsService.php
│   │   └── PDFGeneratorService.php
│   └── Requests/
│       ├── StoreQuizRequest.php
│       ├── StoreQuestionRequest.php
│       └── GenerateQuestionsRequest.php
├── database/
│   ├── migrations/
│   │   ├── 2024_01_01_000001_create_users_table.php
│   │   ├── 2024_01_01_000002_create_institutions_table.php
│   │   ├── 2024_01_01_000003_create_quizzes_table.php
│   │   ├── 2024_01_01_000004_create_questions_table.php
│   │   ├── 2024_01_01_000005_create_attempts_table.php
│   │   ├── 2024_01_01_000006_create_attempt_answers_table.php
│   │   └── 2024_01_01_000007_create_performance_analytics_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── UserSeeder.php
│       └── QuizSeeder.php
├── routes/
│   └── api.php
└── config/
    └── services.php
```

---

## 🗄️ Database Migrations

### Users Table
```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->enum('role', ['student', 'teacher', 'admin'])->default('student');
    $table->foreignId('institution_id')->nullable()->constrained();
    $table->enum('subscription_type', ['free', 'premium'])->default('free');
    $table->rememberToken();
    $table->timestamps();
});
```

### Quizzes Table
```php
Schema::create('quizzes', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->string('subject');
    $table->string('topic')->nullable();
    $table->enum('difficulty', ['easy', 'medium', 'hard'])->default('medium');
    $table->enum('exam_type', ['TNPSC', 'SSC', 'UPSC', 'School', 'College', 'General'])->default('General');
    $table->integer('total_questions');
    $table->integer('time_limit'); // in minutes
    $table->foreignId('created_by')->constrained('users');
    $table->text('description')->nullable();
    $table->boolean('is_published')->default(false);
    $table->timestamps();
});
```

### Questions Table
```php
Schema::create('questions', function (Blueprint $table) {
    $table->id();
    $table->foreignId('quiz_id')->constrained()->onDelete('cascade');
    $table->text('question_text');
    $table->enum('type', ['MCQ', 'TrueFalse', 'ShortAnswer'])->default('MCQ');
    $table->json('options'); // For MCQ: {"A": "...", "B": "...", "C": "...", "D": "..."}
    $table->string('correct_answer');
    $table->text('explanation')->nullable();
    $table->enum('difficulty', ['easy', 'medium', 'hard'])->default('medium');
    $table->string('topic')->nullable();
    $table->boolean('ai_generated')->default(false);
    $table->integer('order')->default(0);
    $table->timestamps();
});
```

### Attempts Table
```php
Schema::create('attempts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained();
    $table->foreignId('quiz_id')->constrained();
    $table->timestamp('started_at');
    $table->timestamp('submitted_at')->nullable();
    $table->integer('score')->default(0);
    $table->integer('total_questions');
    $table->integer('correct_answers')->default(0);
    $table->integer('time_spent')->nullable(); // in seconds
    $table->json('answers')->nullable(); // Store all answers
    $table->timestamps();
});
```

### Attempt Answers Table
```php
Schema::create('attempt_answers', function (Blueprint $table) {
    $table->id();
    $table->foreignId('attempt_id')->constrained()->onDelete('cascade');
    $table->foreignId('question_id')->constrained();
    $table->text('selected_answer');
    $table->boolean('is_correct')->default(false);
    $table->integer('time_spent')->nullable(); // in seconds
    $table->timestamps();
});
```

---

## 🎯 Key Controllers

### AuthController.php
```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'sometimes|in:student,teacher',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'] ?? 'student',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
```

### QuizController.php
```php
<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    public function index(Request $request)
    {
        $query = Quiz::where('is_published', true);

        if ($request->has('subject')) {
            $query->where('subject', $request->subject);
        }

        if ($request->has('difficulty')) {
            $query->where('difficulty', $request->difficulty);
        }

        if ($request->has('exam_type')) {
            $query->where('exam_type', $request->exam_type);
        }

        $quizzes = $query->with('createdBy:id,name')
            ->paginate(15);

        return response()->json($quizzes);
    }

    public function show($id)
    {
        $quiz = Quiz::with(['questions' => function($query) {
            $query->orderBy('order');
        }])->findOrFail($id);

        return response()->json($quiz);
    }
}
```

### AttemptController.php
```php
<?php

namespace App\Http\Controllers;

use App\Models\Attempt;
use App\Models\Quiz;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AttemptController extends Controller
{
    public function start(Request $request, $quizId)
    {
        $quiz = Quiz::findOrFail($quizId);

        $attempt = Attempt::create([
            'user_id' => $request->user()->id,
            'quiz_id' => $quiz->id,
            'started_at' => now(),
            'total_questions' => $quiz->total_questions,
        ]);

        return response()->json([
            'attempt' => $attempt,
            'quiz' => $quiz->load('questions'),
        ]);
    }

    public function saveAnswer(Request $request, $attemptId)
    {
        $validated = $request->validate([
            'question_id' => 'required|exists:questions,id',
            'selected_answer' => 'required|string',
        ]);

        $attempt = Attempt::findOrFail($attemptId);
        $question = Question::findOrFail($validated['question_id']);

        $isCorrect = $question->correct_answer === $validated['selected_answer'];

        $attempt->attemptAnswers()->updateOrCreate(
            ['question_id' => $validated['question_id']],
            [
                'selected_answer' => $validated['selected_answer'],
                'is_correct' => $isCorrect,
            ]
        );

        return response()->json(['message' => 'Answer saved']);
    }

    public function submit(Request $request, $attemptId)
    {
        $attempt = Attempt::findOrFail($attemptId);

        if ($attempt->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $correctAnswers = $attempt->attemptAnswers()->where('is_correct', true)->count();
        $score = ($correctAnswers / $attempt->total_questions) * 100;

        $attempt->update([
            'submitted_at' => now(),
            'correct_answers' => $correctAnswers,
            'score' => round($score, 2),
            'time_spent' => now()->diffInSeconds($attempt->started_at),
        ]);

        // Update performance analytics
        $this->updatePerformanceAnalytics($attempt);

        return response()->json([
            'attempt' => $attempt->load('quiz', 'attemptAnswers.question'),
            'score' => $score,
            'correct_answers' => $correctAnswers,
            'total_questions' => $attempt->total_questions,
        ]);
    }

    private function updatePerformanceAnalytics($attempt)
    {
        // Implementation for updating analytics
        // This would track performance by subject, topic, difficulty
    }
}
```

---

## 🔧 Configuration Files

### config/services.php
```php
return [
    // ... other services

    'openai' => [
        'api_key' => env('OPENAI_API_KEY'),
        'model' => env('OPENAI_MODEL', 'gpt-4'),
    ],
];
```

### routes/api.php
```php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\AttemptController;
use App\Http\Controllers\AIGeneratorController;

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Quizzes
    Route::get('/quizzes', [QuizController::class, 'index']);
    Route::get('/quizzes/{id}', [QuizController::class, 'show']);

    // Attempts
    Route::post('/quizzes/{id}/start', [AttemptController::class, 'start']);
    Route::post('/attempts/{id}/answer', [AttemptController::class, 'saveAnswer']);
    Route::post('/attempts/{id}/submit', [AttemptController::class, 'submit']);
    Route::get('/attempts/{id}/result', [AttemptController::class, 'result']);

    // Teacher routes
    Route::middleware('teacher')->group(function () {
        Route::post('/teacher/quizzes', [QuizController::class, 'store']);
        Route::put('/teacher/quizzes/{id}', [QuizController::class, 'update']);
        Route::delete('/teacher/quizzes/{id}', [QuizController::class, 'destroy']);
        Route::post('/ai/generate-questions', [AIGeneratorController::class, 'generate']);
    });
});
```

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
composer install

# Set up environment
cp .env.example .env
php artisan key:generate

# Configure database in .env, then:
php artisan migrate
php artisan db:seed

# Start development server
php artisan serve

# Generate API documentation (optional)
php artisan l5-swagger:generate
```

---

This structure provides a solid foundation for your quiz platform backend! 🎯

