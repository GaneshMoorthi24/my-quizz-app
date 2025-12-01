"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import "../login/style.css";
import { resetPassword } from "@/lib/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');
    
    if (emailParam) setEmail(decodeURIComponent(emailParam));
    if (tokenParam) setToken(tokenParam);
    
    if (!emailParam || !tokenParam) {
      setErrorMessage("Invalid or missing reset link. Please request a new password reset.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password !== passwordConfirmation) {
      setErrorMessage("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await resetPassword(email, token, password, passwordConfirmation);
      setSuccessMessage(result.message || "Password has been reset successfully!");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      console.error("Reset password error:", error);
      setErrorMessage(
        error.response?.data?.message ||
        "Failed to reset password. Please try again or request a new reset link."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-container">
            <span className="material-symbols-outlined logo-icon">school</span>
            <h1 className="logo-text">QuizPlatform</h1>
          </div>
          <h2 className="auth-title">Reset Password</h2>
          <p className="auth-subtitle">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errorMessage && (
            <div className="error-message">
              <span className="material-symbols-outlined">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="error-message" style={{ background: "rgba(80, 227, 194, 0.1)", borderColor: "#50E3C2", color: "#50E3C2" }}>
              <span className="material-symbols-outlined" style={{ color: "#50E3C2" }}>check_circle</span>
              <span>{successMessage}</span>
            </div>
          )}

          <div className="form-group">
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                className={`form-input ${email ? 'has-value' : ''} ${
                  focusedField === 'email' ? 'focused' : ''
                }`}
                value={email}
                readOnly
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
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
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={`form-input ${password ? 'has-value' : ''} ${
                  focusedField === 'password' ? 'focused' : ''
                }`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                required
              />
              <label htmlFor="password" className={`floating-label ${password || focusedField === "password" ? "active" : ""}`}>
                <span className="material-symbols-outlined label-icon">lock</span>
                <span className="label-text">New Password</span>
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

          <div className="form-group">
            <div className="input-wrapper">
              <input
                type={showPasswordConfirmation ? 'text' : 'password'}
                id="passwordConfirmation"
                className={`form-input ${passwordConfirmation ? 'has-value' : ''} ${
                  focusedField === 'passwordConfirmation' ? 'focused' : ''
                }`}
                value={passwordConfirmation}
                onChange={(e) => {
                  setPasswordConfirmation(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                onFocus={() => setFocusedField('passwordConfirmation')}
                onBlur={() => setFocusedField(null)}
                required
              />
              <label htmlFor="passwordConfirmation" className={`floating-label ${passwordConfirmation || focusedField === "passwordConfirmation" ? "active" : ""}`}>
                <span className="material-symbols-outlined label-icon">lock</span>
                <span className="label-text">Confirm New Password</span>
              </label>
              <div className="input-border"></div>
              <div className="input-highlight"></div>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                tabIndex={-1}
              >
                <span className="material-symbols-outlined">
                  {showPasswordConfirmation ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`submit-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading || !token || !email}
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined spin">sync</span>
                <span>Resetting...</span>
              </>
            ) : (
              <>
                <span>Reset Password</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </>
            )}
          </button>

          <div className="auth-footer">
            <Link href="/login" className="auth-link">
              <span className="material-symbols-outlined">arrow_back</span>
              <span>Back to Login</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

