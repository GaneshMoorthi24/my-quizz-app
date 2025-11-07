"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./style.css";

interface ParticleStyle {
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [particleStyles, setParticleStyles] = useState<ParticleStyle[]>([]);

  // Generate particle styles only on client side to avoid hydration mismatch
  useEffect(() => {
    const styles: ParticleStyle[] = Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${3 + Math.random() * 4}s`,
    }));
    setParticleStyles(styles);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirect to dashboard after successful login
    router.push("/dashboard");
  };

  return (
    <div className="login-container">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="particles">
          {particleStyles.map((style, i) => (
            <div key={i} className="particle" style={style}></div>
          ))}
        </div>
        <div className="quiz-icon-animation icon-1">
          <span className="material-symbols-outlined">quiz</span>
        </div>
        <div className="quiz-icon-animation icon-2">
          <span className="material-symbols-outlined">school</span>
        </div>
        <div className="quiz-icon-animation icon-3">
          <span className="material-symbols-outlined">lightbulb</span>
        </div>
        <div className="quiz-icon-animation icon-4">
          <span className="material-symbols-outlined">fact_check</span>
        </div>
        <div className="quiz-icon-animation icon-5">
          <span className="material-symbols-outlined">assignment</span>
        </div>
        <div className="quiz-icon-animation icon-6">
          <span className="material-symbols-outlined">check_circle</span>
        </div>
        <div className="quiz-icon-animation icon-7">
          <span className="material-symbols-outlined">menu_book</span>
        </div>
        <div className="quiz-icon-animation icon-8">
          <span className="material-symbols-outlined">emoji_events</span>
        </div>
        <div className="quiz-icon-animation icon-9">
          <span className="material-symbols-outlined">analytics</span>
        </div>
        <div className="quiz-icon-animation icon-10">
          <span className="material-symbols-outlined">assessment</span>
        </div>
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      {/* Login Card */}
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-container">
            <span className="material-symbols-outlined logo-icon">school</span>
            <h1 className="logo-text">QuizPlatform</h1>
          </div>
          <h2 className="auth-title">Welcome Back!</h2>
          <p className="auth-subtitle">Sign in to continue your learning journey</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                className={`form-input ${email ? "has-value" : ""} ${focusedField === "email" ? "focused" : ""}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                required
              />
              <label htmlFor="email" className={`floating-label ${email || focusedField === "email" ? "active" : ""}`}>
                <span className="material-symbols-outlined label-icon">email</span>
                <span className="label-text">Email Address</span>
              </label>
              <div className="input-border"></div>
              <div className="input-highlight"></div>
            </div>
          </div>

          <div className="form-group">
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`form-input ${password ? "has-value" : ""} ${focusedField === "password" ? "focused" : ""}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                required
              />
              <label htmlFor="password" className={`floating-label ${password || focusedField === "password" ? "active" : ""}`}>
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
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <Link href="#" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className={`submit-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined spin">refresh</span>
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <span className="material-symbols-outlined">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="auth-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

