'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '@/firebase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update display name
      await updateProfile(userCredential.user, {
        displayName: formData.name,
      });

      // Create user document in Firestore
      await setDoc(doc(firestore, 'users', userCredential.user.uid), {
        name: formData.name,
        email: formData.email,
        createdAt: new Date().toISOString(),
        onboardingComplete: false,
      });

      toast({
        title: 'Welcome to Atlas!',
        description: 'Your account has been created successfully.',
      });

      // Redirect to onboarding
      router.push('/onboarding');
    } catch (error: any) {
      let errorMessage = 'Failed to create account. Please try again.';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak.';
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

        {/* Signup Card */}
        <Card className="
          bg-white/60 dark:bg-slate-900/60
          backdrop-blur-2xl
          border border-white/20 dark:border-slate-700/60
          rounded-2xl
          shadow-2xl shadow-black/20 dark:shadow-black/40
          p-8
        ">
          <h2 className="text-2xl font-sans font-bold text-slate-200 mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              <Label htmlFor="password">Password</Label>
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-brand hover:text-brand-light font-semibold transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
