import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { SYNCHRONICITY_SYMBOL } from '../../utils/symbols';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

interface LandingPageProps {
  onAuthSuccess: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      }
      onAuthSuccess();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-bg via-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - App description and visual */}
        <div className="text-center lg:text-left space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start space-x-3">
              <div className="text-6xl">{SYNCHRONICITY_SYMBOL}</div>
              <h1 className="text-4xl lg:text-5xl font-bold text-brand-text font-serif">
                Project Archetype
              </h1>
            </div>
            <p className="text-xl text-brand-subtle leading-relaxed">
              Discover the narrative patterns that shape your life through AI-powered archetype analysis
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold text-brand-text mb-3 font-serif">
                🎭 Uncover Your Story
              </h3>
              <p className="text-brand-subtle">
                Complete a personalized character sheet and let our AI identify the prominent tropes and archetypes in your current life situation.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold text-brand-text mb-3 font-serif">
                💬 Guided Conversations
              </h3>
              <p className="text-brand-subtle">
                Engage in meaningful dialogue with AI that understands your unique narrative patterns and helps you explore your identity.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold text-brand-text mb-3 font-serif">
                ✨ Evolving Understanding
              </h3>
              <p className="text-brand-subtle">
                Your character sheet grows and adapts as you discover new aspects of yourself through conversation and reflection.
              </p>
            </div>
          </div>

          {/* Synchronicity symbol visualization */}
          <div className="hidden lg:flex justify-center">
            <div className="relative">
              <div className="text-9xl text-brand-primary/20 animate-pulse">
                {SYNCHRONICITY_SYMBOL}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl text-brand-accent animate-spin-slow">
                  ✨
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="flex justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">{SYNCHRONICITY_SYMBOL}</div>
              <h2 className="text-2xl font-bold text-brand-text font-serif">
                {isLogin ? 'Welcome Back' : 'Begin Your Journey'}
              </h2>
              <p className="text-brand-subtle mt-2">
                {isLogin ? 'Continue exploring your archetypes' : 'Create your account to start'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-brand-text mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-subtle w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-brand-text mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-subtle w-5 h-5" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-subtle hover:text-brand-text transition"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-opacity-90 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-brand-primary hover:text-brand-secondary transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;