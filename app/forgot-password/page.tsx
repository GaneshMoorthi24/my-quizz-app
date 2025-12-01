"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../login/style.css";
import { forgotPassword } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await forgotPassword(email);
      setSuccessMessage(result.message || "If that email address exists in our system, we will send a password reset link.");
      setEmail("");
    } catch (error: any) {
      console.error("Forgot password error:", error);
      setErrorMessage(
        error.response?.data?.message ||
        "Failed to send password reset email. Please try again."
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
          <h2 className="auth-title">Forgot Password?</h2>
          <p className="auth-subtitle">
            Enter your email address and we'll send you a link to reset your password.
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                  if (successMessage) setSuccessMessage(null);
                }}
                onFocus={() => setFocusedField('email')}
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

          <button
            type="submit"
            className={`submit-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined spin">sync</span>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span>Send Reset Link</span>
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

