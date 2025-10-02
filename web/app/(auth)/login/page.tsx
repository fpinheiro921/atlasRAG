'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      router.push('/dashboard');
    } catch (error: any) {
      let errorMessage = 'Failed to log in. Please try again.';

      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-display font-extrabold uppercase text-slate-200 mb-2">
            Atlas
          </h1>
          <p className="text-slate-400">Science-based fitness & nutrition</p>
        </div>

        {/* Login Card */}
        <Card className="
          bg-white/60 dark:bg-slate-900/60
          backdrop-blur-2xl
          border border-white/20 dark:border-slate-700/60
          rounded-2xl
          shadow-2xl shadow-black/20 dark:shadow-black/40
          p-8
        ">
          <h2 className="text-2xl font-sans font-bold text-slate-200 mb-6">
            Log In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
                className="
                  bg-slate-50 dark:bg-slate-700
                  border border-slate-300 dark:border-slate-600
                  text-slate-800 dark:text-slate-200
                  placeholder:text-slate-500
                  rounded-lg px-4 py-2.5
                  focus:ring-2 focus:ring-brand focus:border-brand
                  transition-all duration-200
                "
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/reset-password"
                  className="text-sm text-brand hover:text-brand-light transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={loading}
                className="
                  bg-slate-50 dark:bg-slate-700
                  border border-slate-300 dark:border-slate-600
                  text-slate-800 dark:text-slate-200
                  placeholder:text-slate-500
                  rounded-lg px-4 py-2.5
                  focus:ring-2 focus:ring-brand focus:border-brand
                  transition-all duration-200
                "
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-brand hover:bg-brand-light
                text-white font-semibold
                rounded-lg px-6 py-3
                transition-colors duration-200
                shadow-lg shadow-brand/30
                focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-slate-950
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Logging in...
                </span>
              ) : (
                'Log In'
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-brand hover:text-brand-light font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
