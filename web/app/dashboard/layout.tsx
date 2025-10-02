'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requireOnboarding={true}>
      <div className="min-h-screen bg-slate-950">
        <Sidebar />
        <main className="ml-20 min-h-screen">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
