"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Feature = {
  icon: string;
  title: string;
  description: string;
};

type HowItWorksStep = {
  step: string;
  title: string;
  description: string;
};

type Stat = {
  number: string;
  label: string;
};

type Testimonial = {
  name: string;
  role: string;
  content: string;
  avatar: string;
};

const FEATURES: Feature[] = [
  {
    icon: "🧠",
    title: "AI-Powered Explanations",
    description:
      "Get instant, detailed explanations for every question. Understand concepts, not just answers.",
  },
  {
    icon: "📊",
    title: "Detailed Analytics",
    description:
      "Track your performance by subject, topic, and difficulty. Identify weak areas and improve faster.",
  },
  {
    icon: "📚",
    title: "Past Papers Library",
    description:
      "Access thousands of past exam papers. Practice with real questions from UPSC, SSC, Banking, and more.",
  },
  {
    icon: "⚡",
    title: "Instant Results",
    description:
      "Get your scores immediately after completing a quiz. Review answers and explanations on the spot.",
  },
  {
    icon: "🎯",
    title: "Weak Area Analysis",
    description:
      "AI identifies your weak topics and suggests focused practice. Study smarter, not harder.",
  },
  {
    icon: "📱",
    title: "Study Anywhere",
    description:
      "Access your quizzes on any device. Study on your phone, tablet, or computer.",
  },
];

const HOW_IT_WORKS: HowItWorksStep[] = [
  {
    step: "01",
    title: "Sign Up Free",
    description:
      "Create your account in seconds. No credit card required. Start with our free plan.",
  },
  {
    step: "02",
    title: "Choose Your Quiz",
    description:
      "Browse our library of past papers and mock tests. Filter by exam, subject, or difficulty.",
  },
  {
    step: "03",
    title: "Practice & Learn",
    description:
      "Take quizzes with real-time feedback. Get AI explanations for every question you attempt.",
  },
  {
    step: "04",
    title: "Track Progress",
    description:
      "Monitor your performance with detailed analytics. See your improvement over time.",
  },
];

const STATS: Stat[] = [
  { number: "50K+", label: "Active Students" },
  { number: "10K+", label: "Question Papers" },
  { number: "1M+", label: "Quiz Attempts" },
  { number: "500+", label: "Active Teachers" },
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Priya Sharma",
    role: "UPSC Aspirant",
    content:
      "My-Quizz helped me identify my weak areas in History. The AI explanations are incredibly detailed and helped me improve my score by 30%.",
    avatar: "👩‍🎓",
  },
  {
    name: "Rahul Kumar",
    role: "SSC CGL Student",
    content:
      "The past papers library is amazing! I can practice with real exam questions and track my progress. Highly recommended!",
    avatar: "👨‍💼",
  },
  {
    name: "Dr. Anjali Mehta",
    role: "Active Teacher",
    content:
      "We've been using My-Quizz for our classes. The AI question parser saves us hours, and students love the detailed analytics.",
    avatar: "👩‍🏫",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>(() =>
    HOW_IT_WORKS.map(() => false)
  );
  const pricingRef = useRef<HTMLElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const indexAttr = entry.target.getAttribute("data-index");
            if (indexAttr !== null) {
              const index = Number(indexAttr);
              setVisibleSteps((prev) => {
                if (prev[index]) return prev;
                const next = [...prev];
                next[index] = true;
                return next;
              });
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    stepRefs.current.forEach((step) => {
      if (step) {
        observer.observe(step);
      }
    });

    return () => observer.disconnect();
  }, []);

  const completedSteps = visibleSteps.filter(Boolean).length;
  const howItWorksProgress =
    (completedSteps / HOW_IT_WORKS.length) * 100 || 0;

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-sm shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                My-Quizz
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={scrollToPricing}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Pricing
              </button>
              <Link
                href="/login"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transform transition-all duration-300 hover:scale-105"
              >
                Start Free
              </Link>
            </div>
            <div className="md:hidden">
              <Link
                href="/signup"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-semibold text-sm"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Large, Bold Typography */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in">
              Practice smarter.
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Score higher.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in-delay">
              AI-powered quiz platform for competitive exams. Practice with real past papers, get instant explanations, and track your progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay-2">
              <button
                onClick={() => router.push("/signup")}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
              >
                Start Free Trial
              </button>
              <button
                onClick={scrollToPricing}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-blue-600 transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                View Pricing
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-6 animate-fade-in-delay-2">
              No credit card required • 10 free quiz attempts • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Bar */}
      <section className="bg-gray-50 py-12 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <div
                key={index}
                className="text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything you need to excel
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you study smarter and perform better
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes. No complicated setup, no learning curve.
            </p>
          </div>
          <div className="relative">
            <div className="hidden lg:block absolute left-4 right-4 top-[92px] h-1 bg-gray-200/60 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full how-it-works-line-fill bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"
                style={{ width: `${Math.max(howItWorksProgress, 8)}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative z-10">
              {HOW_IT_WORKS.map((step, index) => (
                <div
                  key={index}
                  ref={(el) => {
                    stepRefs.current[index] = el;
                  }}
                  data-index={index}
                  className={`how-step-card text-center p-8 rounded-2xl bg-white shadow-lg border border-gray-100${
                    visibleSteps[index] ? " visible" : ""
                  }`}
                >
                  <div className="text-6xl font-bold text-blue-100 mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                  <div className="mt-6 flex justify-center">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-semibold shadow-inner pulse-ring">
                      ↗
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => router.push("/signup")}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Loved by students and teachers
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands who are already improving their scores
            </p>
          </div>
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 min-h-[300px] flex flex-col justify-center">
              <div className="text-6xl mb-6 text-center">
                {TESTIMONIALS[activeTestimonial].avatar}
              </div>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 text-center leading-relaxed">
                "{TESTIMONIALS[activeTestimonial].content}"
              </p>
            <div className="text-center">
                <div className="font-bold text-gray-900 text-lg">
                  {TESTIMONIALS[activeTestimonial].name}
                </div>
                <div className="text-gray-600">
                  {TESTIMONIALS[activeTestimonial].role}
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-8">
              {TESTIMONIALS.map((_: Testimonial, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeTestimonial === index
                      ? "bg-blue-600 w-8"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* Pricing Section */}
      <section ref={pricingRef} className="py-20 lg:py-32 bg-gray-50">
        <PricingSection router={router} />
      </section>

      {/* Final CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to boost your exam scores?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join 50,000+ students already using My-Quizz to ace their exams
          </p>
          <button
            onClick={() => router.push("/signup")}
            className="bg-white text-blue-600 px-10 py-5 rounded-lg font-semibold text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
          >
            Start Free Trial
          </button>
          <p className="text-sm text-blue-100 mt-6">
            No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">My-Quizz</h3>
              <p className="text-gray-400 leading-relaxed">
                AI-powered quiz platform for competitive exams. Practice smarter, score higher.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={scrollToPricing}
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-white transition-colors">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 My-Quizz. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }
        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.4s both;
        }
        .how-step-card {
          opacity: 0;
          transform: translateY(60px) scale(0.92);
          filter: blur(6px);
          transition:
            opacity 0.6s ease,
            transform 0.6s ease,
            filter 0.6s ease;
        }
        .how-step-card.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
        }
        .pulse-ring {
          position: relative;
        }
        .pulse-ring::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          border: 1px solid rgba(59, 130, 246, 0.4);
          animation: pulse 2.4s ease-out infinite;
        }
        @keyframes pulse {
          0% {
            transform: scale(0.9);
            opacity: 0.8;
          }
          70% {
            transform: scale(1.4);
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }
        .how-it-works-line-fill {
          background-size: 200% 100%;
          animation: gradient-flow 4s linear infinite;
          transition: width 0.8s ease;
        }
        @keyframes gradient-flow {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
      `}</style>
    </div>
  );
}

// Pricing Section Component
function PricingSection({ router }: { router: any }) {
  const [isYearly, setIsYearly] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const plans = [
    {
      id: "free",
      name: "Free Plan",
      subtitle: "For students who want to try (1 paper limit)",
      monthlyPrice: 0,
      yearlyPrice: 0,
      colorClass: "text-green-500",
      gradient: "from-green-400 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      borderColor: "border-green-300",
      features: [
        "Attend 1 quiz/question paper only",
        "View score immediately",
        "Basic leaderboard",
        "No AI explanation",
        "No past papers access",
        "No certificate",
        "Limited revision questions",
      ],
      ctaText: "Get Started Free",
      popular: false,
    },
    {
      id: "pro",
      name: "Pro Plan",
      subtitle: "For serious students (full access + AI)",
      monthlyPrice: 199,
      yearlyPrice: 999,
      colorClass: "text-blue-500",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-300",
      features: [
        "Unlimited quiz attempts",
        "Unlimited question papers",
        "Full access to all past papers",
        "AI explanation for answers",
        "Practice mode + exam mode",
        "Analytical report (accuracy, time analysis)",
        "Detailed performance graph",
        "Bookmark questions",
        "Retry incorrectly answered questions",
        "Daily challenge quizzes",
        "Certificates after completing quiz",
        "Ad-free learning",
        "Priority support",
      ],
      ctaText: "Start Pro Trial",
      popular: true,
    },
    {
      id: "institute",
      name: "Standard Plan",
      subtitle: "For teachers who want to create exams",
      monthlyPrice: 799,
      yearlyPrice: 5999,
      colorClass: "text-orange-500",
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-50 to-amber-50",
      borderColor: "border-orange-300",
      features: [
        "Create unlimited quizzes",
        "Add unlimited students",
        "Question bank creation",
        "PDF upload → auto question generation",
        "AI assistance for creating MCQs",
        "Schedule exams with start + end time",
        "Student group management",
        "Export results (PDF/Excel)",
        "Advanced analytics",
        "Anti-cheat mode",
        "Leaderboard control",
        "Certificates issuing",
        "Private & public quiz modes",
        "Branding (teacher logo)",
        "Priority support",
      ],
      ctaText: "Contact Sales",
      popular: false,
    },
  ];

  const handleGetStarted = (planId: string) => {
    if (planId === "free") {
      router.push("/signup");
    } else if (planId === "pro") {
      router.push("/signup?plan=pro");
    } else {
      router.push("/signup?plan=institute");
    }
  };

  return (
    <div className="bg-white pt-5">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the plan that's right for you. Upgrade or downgrade anytime.
        </p>
      </div>

      {/* Pricing Toggle */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex items-center bg-white rounded-full p-1 shadow-lg border border-gray-200">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
              !isYearly
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 relative ${
              isYearly
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative transform transition-all duration-500 ${
                hoveredCard === plan.id ? "scale-105 z-10" : "scale-100"
              } ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
              onMouseEnter={() => setHoveredCard(plan.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              <div
                className={`bg-white rounded-2xl shadow-xl border-2 ${
                  plan.popular
                    ? `${plan.borderColor} border-4 shadow-2xl`
                    : "border-gray-200"
                } overflow-hidden h-full flex flex-col transition-all duration-500 hover:shadow-2xl`}
              >
                <div
                  className={`bg-gradient-to-r ${plan.bgGradient} p-6 border-b border-gray-200`}
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{plan.subtitle}</p>
                </div>
                <div className="p-6 pb-4">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">
                      ₹{isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    {plan.monthlyPrice > 0 && (
                      <span className="text-gray-600 ml-2">
                        /{isYearly ? "year" : "month"}
                      </span>
                    )}
                  </div>
                  {isYearly && plan.monthlyPrice > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      ₹{Math.round(plan.yearlyPrice / 12)}/month billed annually
                    </p>
                  )}
                </div>
                <div className="px-6 pb-6 flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg
                          className={`w-5 h-5 ${plan.colorClass} mr-3 mt-0.5 flex-shrink-0`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 pt-0">
                  <button
                    onClick={() => handleGetStarted(plan.id)}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white bg-gradient-to-r ${plan.gradient} transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95`}
                  >
                    {plan.ctaText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
