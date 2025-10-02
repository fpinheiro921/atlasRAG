'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export function ProtectedRoute({ children, requireOnboarding = false }: ProtectedRouteProps) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not authenticated - redirect to login
      if (!user) {
        router.push('/login');
        return;
      }

      // If onboarding is required and not completed - redirect to onboarding
      if (requireOnboarding && userData && !userData.onboardingComplete) {
        router.push('/onboarding');
        return;
      }

      // If onboarding is complete but user is on onboarding page - redirect to dashboard
      if (!requireOnboarding && userData && userData.onboardingComplete && window.location.pathname === '/onboarding') {
        router.push('/dashboard');
      }
    }
  }, [user, userData, loading, router, requireOnboarding]);

  // Show loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand border-t-transparent mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated or onboarding not complete
  if (!user) {
    return null;
  }

  if (requireOnboarding && userData && !userData.onboardingComplete) {
    return null;
  }

  return <>{children}</>;
}
