'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { label: 'Tracking', href: '/tracking', icon: 'edit_note' },
  { label: 'Progress', href: '/progress', icon: 'trending_up' },
  { label: 'AI Coach', href: '/coach', icon: 'psychology' },
  { label: 'Settings', href: '/settings', icon: 'settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { userData } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
      router.push('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/60 flex flex-col z-50">
      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b border-slate-700/60">
        <Link href="/dashboard">
          <span className="text-2xl font-display font-extrabold uppercase text-brand">
            A
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`
                  mx-2 p-3 rounded-xl
                  flex flex-col items-center justify-center gap-1
                  transition-all duration-200
                  group
                  ${
                    isActive
                      ? 'bg-brand/20 text-brand'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }
                `}
              >
                <span className="material-symbols-outlined text-2xl">
                  {item.icon}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-tight">
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-700/60 space-y-2">
        {/* User Avatar */}
        <div className="flex items-center justify-center mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm uppercase">
              {userData?.name?.charAt(0) || 'U'}
            </span>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="
            w-full p-2 rounded-lg
            text-slate-400 hover:text-red-400
            hover:bg-slate-800/60
            transition-all duration-200
            flex items-center justify-center
          "
          title="Sign Out"
        >
          <span className="material-symbols-outlined text-xl">
            logout
          </span>
        </button>
      </div>
    </aside>
  );
}
