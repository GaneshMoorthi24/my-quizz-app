"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import "./style.css";
import { registerUser } from "@/lib/auth";

interface ParticleStyle {
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
}

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [particleStyles, setParticleStyles] = useState<ParticleStyle[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Get plan from URL parameter
  const planParam = searchParams?.get('plan') || 'free';
  const selectedPlan = planParam === 'institute' ? 'standard' : planParam; // Normalize institute to standard

  // Generate particle styles only on client side to avoid hydration mismatch
  useEffect(() => {
    const styles: ParticleStyle[] = Array.from({ length: 25 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${3 + Math.random() * 4}s`,
    }));
    setParticleStyles(styles);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error message when user starts typing
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await registerUser(formData.name, formData.email, formData.password, selectedPlan);
      alert("Account created successfully! Please check your email for verification link.");
      // Redirect to login with plan info for better UX
      router.push(`/login?plan=${selectedPlan}`);
    } catch (error: any) {
      console.error("❌ Registration failed:", error);
  
      // Handle Laravel validation errors
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
  
        if (errors?.email) {
          setErrorMessage(errors.email[0]); // e.g. "The email has already been taken."
        } else if (errors?.password) {
          setErrorMessage(errors.password[0]);
        } else if (errors?.name) {
          setErrorMessage(errors.name[0]);
        } else {
          setErrorMessage(error.response.data.message || "Validation error occurred.");
        }
      } else {
        setErrorMessage("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-dismiss error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div className="signup-container">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="gradient-orb orb-4"></div>
        <div className="particles">
          {particleStyles.map((style, i) => (
            <div key={i} className="particle" style={style}></div>
          ))}
        </div>
        <div className="quiz-icon-animation icon-1">
          <span className="material-symbols-outlined">school</span>
        </div>
        <div className="quiz-icon-animation icon-2">
          <span className="material-symbols-outlined">quiz</span>
        </div>
        <div className="quiz-icon-animation icon-3">
          <span className="material-symbols-outlined">lightbulb</span>
        </div>
        <div className="quiz-icon-animation icon-4">
          <span className="material-symbols-outlined">auto_awesome</span>
        </div>
        <div className="quiz-icon-animation icon-5">
          <span className="material-symbols-outlined">fact_check</span>
        </div>
        <div className="quiz-icon-animation icon-6">
          <span className="material-symbols-outlined">assignment</span>
        </div>
        <div className="quiz-icon-animation icon-7">
          <span className="material-symbols-outlined">check_circle</span>
        </div>
        <div className="quiz-icon-animation icon-8">
          <span className="material-symbols-outlined">menu_book</span>
        </div>
        <div className="quiz-icon-animation icon-9">
          <span className="material-symbols-outlined">emoji_events</span>
        </div>
        <div className="quiz-icon-animation icon-10">
          <span className="material-symbols-outlined">analytics</span>
        </div>
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>
      </div>

      {/* Signup Card */}
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-container">
            <span className="material-symbols-outlined logo-icon">school</span>
            <h1 className="logo-text">QuizPlatform</h1>
          </div>
          <h2 className="auth-title">Create Your Account</h2>
          <p className="auth-subtitle">Join us and start your learning adventure</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Animated Error Message */}
          {errorMessage && (
            <div className="error-message-container">
              <div className="error-message">
                <span className="material-symbols-outlined error-icon">error</span>
                <span className="error-text">{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Name Field */}
          <div className="form-group">
            <div className="input-wrapper">
              <input
                type="text"
                id="name"
                name="name"
                className={`form-input ${formData.name ? 'has-value' : ''} ${
                  focusedField === 'name' ? 'focused' : ''
                }`}
                value={formData.name}
                onChange={handleChange}
                onFocus={() => {
                  setFocusedField('name');
                  if (errorMessage) setErrorMessage(null);
                }}
                onBlur={() => setFocusedField(null)}
                required
              />
              <label
                htmlFor="name"
                className={`floating-label ${
                  formData.name || focusedField === 'name' ? 'active' : ''
                }`}
              >
                <span className="material-symbols-outlined label-icon">person</span>
                <span className="label-text">Full Name</span>
              </label>
              <div className="input-border"></div>
              <div className="input-highlight"></div>
            </div>
          </div>

          {/* Email Field */}
          <div className="form-group">
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                className={`form-input ${formData.email ? 'has-value' : ''} ${
                  focusedField === 'email' ? 'focused' : ''
                }`}
                value={formData.email}
                onChange={handleChange}
                onFocus={() => {
                  setFocusedField('email');
                  if (errorMessage) setErrorMessage(null);
                }}
                onBlur={() => setFocusedField(null)}
                required
              />
              <label
                htmlFor="email"
                className={`floating-label ${
                  formData.email || focusedField === 'email' ? 'active' : ''
                }`}
              >
                <span className="material-symbols-outlined label-icon">email</span>
                <span className="label-text">Email Address</span>
              </label>
              <div className="input-border"></div>
              <div className="input-highlight"></div>
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className={`form-input ${formData.password ? 'has-value' : ''} ${
                  focusedField === 'password' ? 'focused' : ''
                }`}
                value={formData.password}
                onChange={handleChange}
                onFocus={() => {
                  setFocusedField('password');
                  if (errorMessage) setErrorMessage(null);
                }}
                onBlur={() => setFocusedField(null)}
                required
                minLength={6}
              />
              <label
                htmlFor="password"
                className={`floating-label ${
                  formData.password || focusedField === 'password' ? 'active' : ''
                }`}
              >
                <span className="material-symbols-outlined label-icon">lock</span>
                <span className="label-text">Password</span>
              </label>
              <div className="input-border"></div>
              <div className="input-highlight"></div>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                <span className="material-symbols-outlined">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            <p className="form-hint">Must be at least 6 characters</p>
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                className={`form-input ${formData.confirmPassword ? 'has-value' : ''} ${
                  focusedField === 'confirmPassword' ? 'focused' : ''
                }`}
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => {
                  setFocusedField('confirmPassword');
                  if (errorMessage) setErrorMessage(null);
                }}
                onBlur={() => setFocusedField(null)}
                required
              />
              <label
                htmlFor="confirmPassword"
                className={`floating-label ${
                  formData.confirmPassword || focusedField === 'confirmPassword' ? 'active' : ''
                }`}
              >
                <span className="material-symbols-outlined label-icon">lock</span>
                <span className="label-text">Confirm Password</span>
              </label>
              <div className="input-border"></div>
              <div className="input-highlight"></div>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                <span className="material-symbols-outlined">
                  {showConfirmPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="terms-checkbox">
              <input type="checkbox" required />
              <span>
                I agree to the{' '}
                <Link href="#" className="terms-link">
                  Terms & Conditions
                </Link>
              </span>
            </label>
          </div>

          <button type="submit" className={`submit-button ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="material-symbols-outlined spin">refresh</span>
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <span className="material-symbols-outlined">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link href="/login" className="auth-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
