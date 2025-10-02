'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export default function ResetPasswordPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      toast({
        title: 'Email sent!',
        description: 'Check your inbox for password reset instructions.',
      });
    } catch (error: any) {
      let errorMessage = 'Failed to send reset email. Please try again.';

      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
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

        {/* Reset Password Card */}
        <Card className="
          bg-white/60 dark:bg-slate-900/60
          backdrop-blur-2xl
          border border-white/20 dark:border-slate-700/60
          rounded-2xl
          shadow-2xl shadow-black/20 dark:shadow-black/40
          p-8
        ">
          {emailSent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl text-green-500">
                  check_circle
                </span>
              </div>
              <h2 className="text-2xl font-sans font-bold text-slate-200">
                Email Sent
              </h2>
              <p className="text-slate-400">
                We&apos;ve sent password reset instructions to <span className="text-slate-200 font-semibold">{email}</span>
              </p>
              <p className="text-sm text-slate-500">
                Didn&apos;t receive the email? Check your spam folder or try again.
              </p>
              <div className="pt-4 space-y-3">
                <Button
                  onClick={() => setEmailSent(false)}
                  className="
                    w-full
                    bg-slate-200 dark:bg-slate-700
                    text-slate-800 dark:text-slate-200
                    hover:bg-slate-300 dark:hover:bg-slate-600
                    rounded-lg px-6 py-3
                    transition-colors duration-200
                  "
                >
                  Send Again
                </Button>
                <Link href="/login" className="block">
                  <Button
                    variant="ghost"
                    className="
                      w-full
                      bg-transparent
                      text-brand hover:text-brand-light
                      border border-slate-300 dark:border-slate-600
                      hover:border-brand/50
                      rounded-lg px-6 py-3
                      transition-all duration-200
                    "
                  >
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-sans font-bold text-slate-200 mb-2">
                Reset Password
              </h2>
              <p className="text-slate-400 mb-6">
                Enter your email address and we&apos;ll send you instructions to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                      Sending...
                    </span>
                  ) : (
                    'Send Reset Email'
                  )}
                </Button>
              </form>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
                >
                  ← Back to login
                </Link>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
