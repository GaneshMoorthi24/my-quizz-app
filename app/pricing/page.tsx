"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const router = useRouter();
  const [isYearly, setIsYearly] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const plans = [
    {
      id: "free",
      name: "Free Plan",
      subtitle: "For students who want to try (1 paper limit)",
      monthlyPrice: 0,
      yearlyPrice: 0,
      color: "green",
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
      color: "blue",
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
      color: "orange",
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

  const faqs = [
    {
      question: "Can I switch plans later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, UPI, and net banking for Indian customers.",
    },
    {
      question: "Is there a free trial for Pro Plan?",
      answer: "Yes, we offer a 7-day free trial for the Pro Plan. No credit card required.",
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
    },
    {
      question: "Do you offer discounts for annual plans?",
      answer: "Yes! Annual plans save you up to 17% compared to monthly billing. The Pro Plan is ₹199/month or ₹999/year, and the Standard Plan is ₹799/month or ₹5999/year.",
    },
    {
      question: "What happens to my data if I cancel?",
      answer: "Your data is safe. You can export all your progress, bookmarks, and analytics before canceling. We keep your data for 30 days after cancellation.",
    },
  ];

  const handleGetStarted = (planId: string) => {
    if (planId === "free") {
      router.push("/signup?plan=free");
    } else if (planId === "pro") {
      router.push("/signup?plan=pro");
    } else {
      // Standard/Institute plan (for teachers)
      router.push("/signup?plan=standard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-light via-white to-background-light">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20 pb-16">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            Choose the right plan for your learning
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 animate-fade-in-delay">
            Whether you're practicing past papers or teaching students, My-Quizz has the perfect plan for you.
          </p>
        </div>
      </div>

      {/* Pricing Toggle */}
      <div className="flex justify-center mb-12 animate-fade-in-delay-2">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative transform transition-all duration-500 ${
                hoveredCard === plan.id ? "scale-105 z-10" : "scale-100"
              } ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
              onMouseEnter={() => setHoveredCard(plan.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                animationDelay: `${index * 150}ms`,
              }}
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
                {/* Card Header */}
                <div
                  className={`bg-gradient-to-r ${plan.bgGradient} p-6 border-b border-gray-200`}
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{plan.subtitle}</p>
                </div>

                {/* Price */}
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

                {/* Features */}
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

                {/* CTA Button */}
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

      {/* Feature Comparison Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Compare Plans
          </h2>
          <p className="text-gray-600 text-lg">
            See what's included in each plan
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Features</th>
                  <th className="px-6 py-4 text-center font-semibold">Free</th>
                  <th className="px-6 py-4 text-center font-semibold bg-blue-700">Pro</th>
                  <th className="px-6 py-4 text-center font-semibold">Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">PDF Uploads</td>
                  <td className="px-6 py-4 text-center">1 PDF</td>
                  <td className="px-6 py-4 text-center bg-blue-50">Unlimited</td>
                  <td className="px-6 py-4 text-center">Unlimited</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">Quiz Attempts</td>
                  <td className="px-6 py-4 text-center">10/month</td>
                  <td className="px-6 py-4 text-center bg-blue-50">Unlimited</td>
                  <td className="px-6 py-4 text-center">Unlimited</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">Question Papers Access</td>
                  <td className="px-6 py-4 text-center">Limited</td>
                  <td className="px-6 py-4 text-center bg-blue-50">All Past Papers</td>
                  <td className="px-6 py-4 text-center">All Past Papers</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">AI Explanations</td>
                  <td className="px-6 py-4 text-center">—</td>
                  <td className="px-6 py-4 text-center bg-blue-50">✓</td>
                  <td className="px-6 py-4 text-center">✓</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">Analytics</td>
                  <td className="px-6 py-4 text-center">Basic</td>
                  <td className="px-6 py-4 text-center bg-blue-50">Detailed</td>
                  <td className="px-6 py-4 text-center">Detailed</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">AI PDF Parser</td>
                  <td className="px-6 py-4 text-center">—</td>
                  <td className="px-6 py-4 text-center bg-blue-50">—</td>
                  <td className="px-6 py-4 text-center">✓</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">Manual Question Editor</td>
                  <td className="px-6 py-4 text-center">—</td>
                  <td className="px-6 py-4 text-center bg-blue-50">—</td>
                  <td className="px-6 py-4 text-center">✓</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">Multiple Admins</td>
                  <td className="px-6 py-4 text-center">—</td>
                  <td className="px-6 py-4 text-center bg-blue-50">—</td>
                  <td className="px-6 py-4 text-center">✓</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">Priority Support</td>
                  <td className="px-6 py-4 text-center">—</td>
                  <td className="px-6 py-4 text-center bg-blue-50">—</td>
                  <td className="px-6 py-4 text-center">✓</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">Branding & Custom Domain</td>
                  <td className="px-6 py-4 text-center">—</td>
                  <td className="px-6 py-4 text-center bg-blue-50">—</td>
                  <td className="px-6 py-4 text-center">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-lg">
            Everything you need to know about our plans
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 py-16 mb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to boost your learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students and teachers already using My-Quizz
          </p>
          <button
            onClick={() => router.push("/signup")}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
          >
            Get Started Now
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="text-center pb-8">
        <button
          onClick={() => router.push("/login")}
          className="text-blue-600 hover:text-blue-700 font-semibold mr-4"
        >
          Already have an account? Sign in
        </button>
      </div>

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
        .animation-delay-4000 {
          animation-delay: 4s;
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
      `}</style>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
      >
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        <svg
          className={`w-5 h-5 text-blue-600 transform transition-transform duration-300 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-4 text-gray-600">{answer}</div>
      </div>
    </div>
  );
}

