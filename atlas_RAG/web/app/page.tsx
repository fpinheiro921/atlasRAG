'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function LandingPage() {
  const router = useRouter();
  const { user, userData, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && userData) {
      // Redirect authenticated users
      if (userData.onboardingComplete) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
    }
  }, [user, userData, loading, router]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand border-t-transparent mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-display font-extrabold uppercase text-slate-200 mb-4">
            Atlas
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-2">
            Science-Based Fitness & Nutrition
          </p>
          <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto">
            Systematic, evidence-backed nutrition management for sustainable fat loss and metabolic recovery
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-slide-up">
          <Card className="
            bg-white/60 dark:bg-slate-900/60
            backdrop-blur-2xl
            border border-white/20 dark:border-slate-700/60
            rounded-2xl
            shadow-2xl shadow-black/20 dark:shadow-black/40
            p-6
          ">
            <div className="flex items-center justify-center w-14 h-14 bg-brand/20 rounded-xl mb-4">
              <span className="material-symbols-outlined text-3xl text-brand">
                calculate
              </span>
            </div>
            <h3 className="text-xl font-sans font-bold text-slate-200 mb-2">
              Precision TDEE
            </h3>
            <p className="text-sm text-slate-400">
              Evidence-based calculations using the Müller equation, accounting for metabolic adaptation
            </p>
          </Card>

          <Card className="
            bg-white/60 dark:bg-slate-900/60
            backdrop-blur-2xl
            border border-white/20 dark:border-slate-700/60
            rounded-2xl
            shadow-2xl shadow-black/20 dark:shadow-black/40
            p-6
          ">
            <div className="flex items-center justify-center w-14 h-14 bg-accent/20 rounded-xl mb-4">
              <span className="material-symbols-outlined text-3xl text-accent">
                trending_up
              </span>
            </div>
            <h3 className="text-xl font-sans font-bold text-slate-200 mb-2">
              Weekly Adaptation
            </h3>
            <p className="text-sm text-slate-400">
              Dynamic macro adjustments based on your progress and metabolic response
            </p>
          </Card>

          <Card className="
            bg-white/60 dark:bg-slate-900/60
            backdrop-blur-2xl
            border border-white/20 dark:border-slate-700/60
            rounded-2xl
            shadow-2xl shadow-black/20 dark:shadow-black/40
            p-6
          ">
            <div className="flex items-center justify-center w-14 h-14 bg-brand/20 rounded-xl mb-4">
              <span className="material-symbols-outlined text-3xl text-brand">
                psychology
              </span>
            </div>
            <h3 className="text-xl font-sans font-bold text-slate-200 mb-2">
              AI Coach
            </h3>
            <p className="text-sm text-slate-400">
              24/7 guidance powered by scientific literature and personalized to your journey
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="
          bg-white/60 dark:bg-slate-900/60
          backdrop-blur-2xl
          border border-white/20 dark:border-slate-700/60
          rounded-2xl
          shadow-2xl shadow-black/20 dark:shadow-black/40
          p-8 md:p-12
          text-center
          animate-scale-in
        ">
          <h2 className="text-3xl md:text-4xl font-display font-bold uppercase text-slate-200 mb-4">
            Ready to Transform?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Join Atlas and experience the power of evidence-based nutrition coaching backed by real science.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button className="
                bg-brand hover:bg-brand-light
                text-white font-semibold
                rounded-lg px-8 py-3
                transition-colors duration-200
                shadow-lg shadow-brand/30
                focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-slate-950
                w-full sm:w-auto
              ">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button className="
                bg-transparent
                text-brand hover:text-brand-light
                border border-slate-300 dark:border-slate-600
                hover:border-brand/50
                rounded-lg px-8 py-3
                transition-all duration-200
                w-full sm:w-auto
              ">
                Log In
              </Button>
            </Link>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-slate-500">
          <p>Built with science. Powered by AI. Made for results.</p>
        </div>
      </div>
    </div>
  );
}
