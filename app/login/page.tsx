"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import "./style.css";
import { getUser, loginUser, loginWithGoogle, resendVerificationEmail } from "@/lib/auth";
import { detectPlan, detectUserRole, getUserPanelPath } from "@/lib/plan-utils";

interface ParticleStyle {
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
}

// Google Identity Services types
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: any) => void }) => void;
          renderButton: (element: HTMLElement | null, config: any) => void;
          prompt: () => void;
        };
        oauth2?: any;
      };
    };
  }
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [particleStyles, setParticleStyles] = useState<ParticleStyle[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [emailResent, setEmailResent] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  
  // Get plan from URL if coming from signup
  const planFromUrl = searchParams?.get('plan');




  // Generate particle styles only on client side to avoid hydration mismatch
  useEffect(() => {
    const styles: ParticleStyle[] = Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${3 + Math.random() * 4}s`,
    }));
    setParticleStyles(styles);

    // Load saved email if remember me was previously checked
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleGoogleSignIn = async (response: any) => {
    setIsGoogleLoading(true);
    setErrorMessage(null);

    try {
      // response.credential is the JWT token from Google
      const credential = response.credential || response;
      const result = await loginWithGoogle(credential);
      
      // Store token and user (Google login defaults to remember me - localStorage)
      if (result.user) {
        localStorage.setItem('user', JSON.stringify(result.user));
      }
      
      // Use centralized function to get correct panel path
      const panelPath = getUserPanelPath(result.user);
      router.push(panelPath);
    } catch (error: any) {
      console.error('❌ Google login failed:', error);
      if (error.response?.status === 401 || error.response?.status === 422) {
        setErrorMessage('Google sign-in failed. Please try again or use email/password.');
      } else {
        setErrorMessage('Google sign-in failed. Please try again.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Initialize Google Sign-In
  useEffect(() => {
    const initGoogleSignIn = () => {
      if (typeof window === 'undefined' || !googleButtonRef.current) return;
      
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
      if (!clientId) {
        console.warn('Google Client ID not found. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your environment variables.');
        // Show a fallback button if Client ID is not set
        return;
      }

      // Check if Google script is loaded
      if (window.google && window.google.accounts && window.google.accounts.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleSignIn,
          });
          
          // Hide custom button and render Google's button
          const customButton = googleButtonRef.current?.querySelector('.google-signin-custom-button');
          if (customButton) {
            (customButton as HTMLElement).style.display = 'none';
          }
          
          window.google.accounts.id.renderButton(
            googleButtonRef.current,
            {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: 'signin_with',
              width: '100%',
            }
          );
        } catch (error) {
          console.error('Error initializing Google Sign-In:', error);
        }
      }
    };

    // Load Google Identity Services script
    if (typeof window !== 'undefined') {
      // Check if script is already loaded
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      
      if (!existingScript && !window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          // Wait a bit for Google to be fully ready
          setTimeout(initGoogleSignIn, 100);
        };
        script.onerror = () => {
          console.error('Failed to load Google Sign-In script');
        };
        document.head.appendChild(script);
      } else if (window.google) {
        // Script already loaded, initialize immediately
        setTimeout(initGoogleSignIn, 100);
      } else if (existingScript) {
        // Script is loading, wait for it
        existingScript.addEventListener('load', () => {
          setTimeout(initGoogleSignIn, 100);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (isLoading) return;
    setIsLoading(true);
    setErrorMessage('');
    setEmailResent(false);
  
    try {
      // 1️⃣ Login to backend
      const result = await loginUser(email, password);
  
      // 2️⃣ Store token and user based on remember me preference
      if (rememberMe) {
        // Store in localStorage (persists across browser sessions)
        localStorage.setItem('token', result.access_token);
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('remembered_email', email);
      } else {
        // Store in sessionStorage (cleared when browser closes)
        sessionStorage.setItem('token', result.access_token);
        sessionStorage.setItem('user', JSON.stringify(result.user));
        // Remove from localStorage if it exists
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('remembered_email');
      }
  
      // 3️⃣ Redirect based on user role and plan
      // Use centralized function to get correct panel path
      const panelPath = getUserPanelPath(result.user);
      router.push(panelPath);
    } catch (error: any) {
      console.error('❌ Login failed:', error);
  
      if (error.response?.status === 401) {
        setErrorMessage('Invalid email or password.');
        setEmailResent(false);
      } else if (error.response?.status === 403) {
        // Check if email was automatically resent
        if (error.response?.data?.email_resent) {
          setErrorMessage(error.response.data.message || 'A new verification email has been sent to your email address. Please check your inbox and verify your email before logging in.');
          setEmailResent(true);
        } else {
          setErrorMessage('Please verify your email before logging in.');
          setEmailResent(false);
        }
      } else {
        setErrorMessage('Something went wrong. Please try again.');
        setEmailResent(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email || resendingEmail) return;
    
    setResendingEmail(true);
    setErrorMessage(null);
    
    try {
      const result = await resendVerificationEmail(email);
      setErrorMessage(result.message || 'Verification email has been sent! Please check your inbox.');
      setEmailResent(true);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Failed to resend verification email. Please try again.');
      setEmailResent(false);
    } finally {
      setResendingEmail(false);
    }
  };
  
  

  // Auto-dismiss error message after 5 seconds (but keep success messages longer)
  useEffect(() => {
    if (errorMessage) {
      const dismissTime = emailResent ? 10000 : 5000; // Keep success messages for 10 seconds
      const timer = setTimeout(() => {
        setErrorMessage(null);
        setEmailResent(false);
      }, dismissTime);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, emailResent]);
  
  

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
          {/* Animated Error Message */}
          {errorMessage && (
            <div className="error-message-container">
              <div className="error-message">
                <span className={`material-symbols-outlined error-icon ${emailResent ? 'success' : ''}`}>
                  {emailResent ? 'mark_email_read' : 'error'}
                </span>
                <div style={{ flex: 1 }}>
                  <span className={`error-text ${emailResent ? 'success-text' : ''}`}>{errorMessage}</span>
                  {!emailResent && errorMessage.includes('verify') && email && (
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={resendingEmail}
                      className="resend-verification-button"
                      style={{
                        marginTop: '12px',
                        padding: '8px 16px',
                        background: 'rgba(74, 144, 226, 0.1)',
                        border: '2px solid #4A90E2',
                        borderRadius: '8px',
                        color: '#4A90E2',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: resendingEmail ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.3s ease',
                        width: '100%',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        if (!resendingEmail) {
                          e.currentTarget.style.background = 'rgba(74, 144, 226, 0.2)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!resendingEmail) {
                          e.currentTarget.style.background = 'rgba(74, 144, 226, 0.1)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      {resendingEmail ? (
                        <>
                          <span className="material-symbols-outlined" style={{ fontSize: '16px', animation: 'spin 1s linear infinite' }}>refresh</span>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>mail</span>
                          <span>Resend Verification Email</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Google Sign-In Button */}
          <div className="google-signin-container">
            <div ref={googleButtonRef} className="google-signin-button">
              {/* Fallback custom button - will be replaced by Google's official button when script loads */}
              <button
                type="button"
                onClick={() => {
                  // Redirect to Laravel’s Google login route
                  window.location.href = "http://localhost:8000/auth/google";
                }}
                className="google-signin-custom-button"
                disabled={isGoogleLoading}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginRight: "8px" }}
                >
                  <path
                    d="M17.64 9.20454C17.64 8.56636 17.5827 7.95272 17.4764 7.36363H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20454Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M9 18C11.43 18 13.467 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4204 9 14.4204C6.65455 14.4204 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z"
                    fill="#34A853"
                  />
                  <path
                    d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65455 3.57955 9 3.57955Z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>

            </div>
            {isGoogleLoading && (
              <div className="google-loading">
                <span className="material-symbols-outlined spin">refresh</span>
                Signing in with Google...
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="divider">
            <span>or</span>
          </div>

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
                if (errorMessage) {
                  setErrorMessage(null);
                  setEmailResent(false);
                }
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
                if (errorMessage) {
                  setErrorMessage(null);
                  setEmailResent(false);
                }
              }}
              onFocus={() => setFocusedField('password')}
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
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <Link href="/forgot-password" className="forgot-password">
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

