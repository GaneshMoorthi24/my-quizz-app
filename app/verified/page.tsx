"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import "./style.css";

export default function VerifiedPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: 'check_circle',
          title: 'Email Verified!',
          subtitle: 'Your email has been successfully verified.',
          message: 'You can now log in to your account and start your learning journey.',
          color: 'success',
          bgGradient: 'linear-gradient(135deg, #50E3C2 0%, #4A90E2 100%)',
        };
      case 'already':
        return {
          icon: 'verified',
          title: 'Already Verified',
          subtitle: 'Your email was already verified.',
          message: 'You can log in to your account anytime.',
          color: 'primary',
          bgGradient: 'linear-gradient(135deg, #4A90E2 0%, #6ba5e8 100%)',
        };
      case 'error':
      case 'failed':
        return {
          icon: 'error',
          title: 'Verification Failed',
          subtitle: 'Unable to verify your email.',
          message: 'The verification link may be invalid or expired. Please try again.',
          color: 'error',
          bgGradient: 'linear-gradient(135deg, #E35050 0%, #C0392B 100%)',
        };
      default:
        return {
          icon: 'info',
          title: 'Verification',
          subtitle: 'Processing your verification...',
          message: 'Please wait while we verify your email.',
          color: 'primary',
          bgGradient: 'linear-gradient(135deg, #4A90E2 0%, #6ba5e8 100%)',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="verified-container">

      {/* Verified Card */}
      <div className="verified-card">
        <div className="verified-header">
          <div className="logo-container">
            <span className="material-symbols-outlined logo-icon">school</span>
            <h1 className="logo-text">QuizPlatform</h1>
          </div>
        </div>

        <div className="verification-content">
          {/* Icon Container */}
          <div className={`icon-container ${config.color}`}>
            <div className="icon-circle">
              <span className="material-symbols-outlined verification-icon">
                {config.icon}
              </span>
            </div>
          </div>

          {/* Title and Subtitle */}
          <h2 className="verification-title">{config.title}</h2>
          <p className="verification-subtitle">{config.subtitle}</p>
          <p className="verification-message">{config.message}</p>

          {/* Action Button */}
          <div className="verification-actions">
            {status === 'error' || status === 'failed' ? (
              <Link href="/signup" className="action-button secondary">
                <span className="material-symbols-outlined">person_add</span>
                <span>Sign Up Again</span>
              </Link>
            ) : (
              <Link href="/login" className="action-button primary">
                <span>Go to Login</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            )}
          </div>

          {/* Additional Links */}
          <div className="verification-footer">
            <Link href="/" className="footer-link">
              <span className="material-symbols-outlined">home</span>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
