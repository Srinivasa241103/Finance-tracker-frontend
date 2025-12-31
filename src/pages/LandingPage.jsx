import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Shield,
  Target,
  PieChart,
  ArrowRight,
  CheckCircle,
  DollarSign,
  BarChart3,
  Sparkles
} from 'lucide-react';

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.scroll-animate').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">FinanceFlow</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">How It Works</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
              <Link to="/login" className="text-slate-600 hover:text-slate-900 transition-colors">Log In</Link>
              <Link to="/signup" className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-all hover:shadow-lg">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div
                className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 rounded-full"
                style={{
                  opacity: Math.max(0, 1 - scrollY / 300),
                  transform: `translateY(${scrollY * 0.3}px)`
                }}
              >
                <Sparkles className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-600 font-medium">AI-Powered Financial Insights - Coming Soon...</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Master Your Money,{' '}
                <span className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                  Achieve Your Dreams
                </span>
              </h1>

              <p className="text-xl text-slate-600 leading-relaxed">
                Track expenses, set goals, and understand your financial personality.
                Built for people who want simple, powerful money management.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="bg-slate-900 text-white px-8 py-4 rounded-lg hover:bg-slate-800 transition-all hover:shadow-xl flex items-center justify-center space-x-2 group">
                  <span className="font-medium">Start Free Trial</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="border-2 border-slate-200 text-slate-900 px-8 py-4 rounded-lg hover:border-slate-300 transition-all flex items-center justify-center space-x-2">
                  <span className="font-medium">Watch Demo</span>
                </button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm text-slate-600">No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm text-slate-600">Free 14-day trial</span>
                </div>
              </div>
            </div>

            {/* Hero Image/Dashboard Preview */}
            <div
              className="relative"
              style={{
                transform: `translateY(${scrollY * 0.2}px)`,
                opacity: Math.max(0, 1 - scrollY / 400)
              }}
            >
              <div className="bg-slate-50 rounded-2xl p-6 shadow-2xl border border-slate-200">
                <div className="space-y-4">
                  {/* Mini Dashboard Preview */}
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-slate-500">Total Balance</span>
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900">$12,458.50</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm text-emerald-600 font-medium">+12.5%</span>
                      <span className="text-sm text-slate-500">vs last month</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                      <div className="text-sm text-emerald-700 mb-1">Income</div>
                      <div className="text-2xl font-bold text-emerald-900">$5,240</div>
                    </div>
                    <div className="bg-rose-50 rounded-lg p-4 border border-rose-100">
                      <div className="text-sm text-rose-700 mb-1">Expenses</div>
                      <div className="text-2xl font-bold text-rose-900">$3,182</div>
                    </div>
                  </div>

                  {/* Chart Preview */}
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-slate-700">Spending Trend</span>
                      <BarChart3 className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex items-end justify-between space-x-2 h-24">
                      {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                        <div key={i} className="flex-1 bg-slate-900 rounded-t" style={{ height: `${height}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 border border-slate-200 animate-float">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Goal Complete</div>
                    <div className="text-sm font-bold text-slate-900">Vacation Fund</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-slate-100 rounded-full filter blur-3xl opacity-30 -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-100 rounded-full filter blur-3xl opacity-30 -z-10" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 scroll-animate opacity-0">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Everything you need to take control
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful features designed to make personal finance simple, smart, and stress-free.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="scroll-animate opacity-0 bg-white p-8 rounded-xl border border-slate-200 hover:border-slate-300 transition-all hover:shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 scroll-animate opacity-0">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Getting started is simple
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Three easy steps to financial clarity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="scroll-animate opacity-0 text-center" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center scroll-animate opacity-0" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center scroll-animate opacity-0">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Ready to transform your financial future?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Join thousands of users who've taken control of their money
          </p>
          <Link to="/signup" className="bg-slate-900 text-white px-12 py-5 rounded-lg hover:bg-slate-800 transition-all hover:shadow-xl text-lg font-medium inline-flex items-center space-x-2 group">
            <span>Start Your Free Trial</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-sm text-slate-500 mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900">FinanceFlow</span>
              </div>
              <p className="text-slate-600 text-sm">
                Your trusted partner in personal finance management.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-slate-900">Features</a></li>
                <li><a href="#" className="hover:text-slate-900">Pricing</a></li>
                <li><a href="#" className="hover:text-slate-900">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-slate-900">About</a></li>
                <li><a href="#" className="hover:text-slate-900">Blog</a></li>
                <li><a href="#" className="hover:text-slate-900">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-slate-900">Privacy</a></li>
                <li><a href="#" className="hover:text-slate-900">Terms</a></li>
                <li><a href="#" className="hover:text-slate-900">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
            <p>&copy; 2024 FinanceFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Data
const features = [
  {
    icon: <TrendingUp className="w-6 h-6 text-white" />,
    title: "Smart Expense Tracking",
    description: "Automatically categorize and analyze your spending patterns with AI-powered insights."
  },
  {
    icon: <Shield className="w-6 h-6 text-white" />,
    title: "Bank-Level Security",
    description: "Your financial data is encrypted and protected with industry-leading security standards."
  },
  {
    icon: <Target className="w-6 h-6 text-white" />,
    title: "Goal Setting & Tracking",
    description: "Set savings goals and track your progress with visual insights and milestones."
  },
  {
    icon: <PieChart className="w-6 h-6 text-white" />,
    title: "Financial Personality",
    description: "Discover your unique financial personality and get personalized recommendations."
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-white" />,
    title: "Detailed Analytics",
    description: "Understand where your money goes with comprehensive charts and reports."
  },
  {
    icon: <DollarSign className="w-6 h-6 text-white" />,
    title: "Multi-Currency Support",
    description: "Track finances across different currencies with automatic conversion rates."
  }
];

const steps = [
  {
    title: "Create Your Account",
    description: "Sign up in seconds with your email or social accounts. No credit card required."
  },
  {
    title: "Connect Your Accounts",
    description: "Link your bank accounts securely or manually enter transactions."
  },
  {
    title: "Get Insights & Save",
    description: "Receive personalized insights and start achieving your financial goals."
  }
];

const stats = [
  { value: "50K+", label: "Active Users" },
  { value: "$2.5M+", label: "Money Tracked" },
  { value: "98%", label: "User Satisfaction" },
  { value: "4.9/5", label: "App Rating" }
];

export default LandingPage;
