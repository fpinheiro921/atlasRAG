'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const { userData } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<any>(null);

  useEffect(() => {
    if (userData?.currentPlan) {
      setCurrentPlan(userData.currentPlan);
    }
  }, [userData]);

  if (!currentPlan) {
    return (
      <div className="p-6 md:p-12 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand border-t-transparent mx-auto mb-4" />
          <p className="text-slate-400">Loading your plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-display font-extrabold uppercase text-slate-200 mb-2">
          Dashboard
        </h1>
        <p className="text-slate-400">
          Welcome back, {userData?.name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
        {/* TDEE Card */}
        <Card className="
          bg-white/60 dark:bg-slate-900/60
          backdrop-blur-2xl
          border border-white/20 dark:border-slate-700/60
          rounded-2xl
          shadow-2xl shadow-black/20 dark:shadow-black/40
          p-6
        ">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              TDEE
            </span>
            <span className="material-symbols-outlined text-brand text-xl">
              local_fire_department
            </span>
          </div>
          <div className="text-3xl font-display font-bold text-slate-200 metric">
            {currentPlan.tdee}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            kcal/day
          </div>
        </Card>

        {/* Target Calories Card */}
        <Card className="
          bg-white/60 dark:bg-slate-900/60
          backdrop-blur-2xl
          border border-white/20 dark:border-slate-700/60
          rounded-2xl
          shadow-2xl shadow-black/20 dark:shadow-black/40
          p-6
        ">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Target
            </span>
            <span className="material-symbols-outlined text-accent text-xl">
              target
            </span>
          </div>
          <div className="text-3xl font-display font-bold text-slate-200 metric">
            {currentPlan.targetCalories}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            kcal/day
          </div>
        </Card>

        {/* Current Weight Card */}
        <Card className="
          bg-white/60 dark:bg-slate-900/60
          backdrop-blur-2xl
          border border-white/20 dark:border-slate-700/60
          rounded-2xl
          shadow-2xl shadow-black/20 dark:shadow-black/40
          p-6
        ">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Weight
            </span>
            <span className="material-symbols-outlined text-brand text-xl">
              monitor_weight
            </span>
          </div>
          <div className="text-3xl font-display font-bold text-slate-200 metric">
            {userData?.currentWeightKg?.toFixed(1) || '-'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            kg
          </div>
        </Card>

        {/* Body Fat Card */}
        <Card className="
          bg-white/60 dark:bg-slate-900/60
          backdrop-blur-2xl
          border border-white/20 dark:border-slate-700/60
          rounded-2xl
          shadow-2xl shadow-black/20 dark:shadow-black/40
          p-6
        ">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Body Fat
            </span>
            <span className="material-symbols-outlined text-accent text-xl">
              percent
            </span>
          </div>
          <div className="text-3xl font-display font-bold text-slate-200 metric">
            {userData?.bodyFatPercentage?.toFixed(1) || '-'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            percent
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Macros Card */}
        <Card className="
          lg:col-span-2
          bg-white/60 dark:bg-slate-900/60
          backdrop-blur-2xl
          border border-white/20 dark:border-slate-700/60
          rounded-2xl
          shadow-2xl shadow-black/20 dark:shadow-black/40
          p-8
        ">
          <h2 className="text-2xl font-display uppercase text-slate-200 mb-6">
            Daily Macros
          </h2>

          <div className="space-y-6">
            {/* Protein */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400 uppercase tracking-wide">Protein</span>
                <span className="text-xl font-display font-bold text-slate-200 metric">
                  {currentPlan.macros.proteinG}g
                </span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand to-brand-light"
                  style={{ width: '0%' }}
                />
              </div>
              <div className="text-xs text-slate-500 mt-1">
                0g / {currentPlan.macros.proteinG}g
              </div>
            </div>

            {/* Fat */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400 uppercase tracking-wide">Fat</span>
                <span className="text-xl font-display font-bold text-slate-200 metric">
                  {currentPlan.macros.fatG}g
                </span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-accent-light"
                  style={{ width: '0%' }}
                />
              </div>
              <div className="text-xs text-slate-500 mt-1">
                0g / {currentPlan.macros.fatG}g
              </div>
            </div>

            {/* Carbs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400 uppercase tracking-wide">Carbs</span>
                <span className="text-xl font-display font-bold text-slate-200 metric">
                  {currentPlan.macros.carbsG}g
                </span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand to-accent"
                  style={{ width: '0%' }}
                />
              </div>
              <div className="text-xs text-slate-500 mt-1">
                0g / {currentPlan.macros.carbsG}g
              </div>
            </div>
          </div>

          <Link href="/tracking">
            <Button className="
              w-full mt-6
              bg-brand hover:bg-brand-light
              text-white font-semibold
              rounded-lg px-6 py-3
              transition-colors duration-200
            ">
              Log Food
            </Button>
          </Link>
        </Card>

        {/* Quick Actions */}
        <Card className="
          bg-white/60 dark:bg-slate-900/60
          backdrop-blur-2xl
          border border-white/20 dark:border-slate-700/60
          rounded-2xl
          shadow-2xl shadow-black/20 dark:shadow-black/40
          p-8
        ">
          <h2 className="text-2xl font-display uppercase text-slate-200 mb-6">
            Quick Actions
          </h2>

          <div className="space-y-3">
            <Link href="/tracking">
              <Button className="
                w-full
                bg-slate-800/60
                text-slate-200
                hover:bg-slate-700/60
                border border-slate-700/60
                rounded-lg px-4 py-3
                transition-all duration-200
                flex items-center gap-3
                justify-start
              ">
                <span className="material-symbols-outlined text-brand">
                  edit_note
                </span>
                <span className="font-semibold">Log Weight</span>
              </Button>
            </Link>

            <Link href="/coach">
              <Button className="
                w-full
                bg-slate-800/60
                text-slate-200
                hover:bg-slate-700/60
                border border-slate-700/60
                rounded-lg px-4 py-3
                transition-all duration-200
                flex items-center gap-3
                justify-start
              ">
                <span className="material-symbols-outlined text-accent">
                  psychology
                </span>
                <span className="font-semibold">Ask AI Coach</span>
              </Button>
            </Link>

            <Link href="/progress">
              <Button className="
                w-full
                bg-slate-800/60
                text-slate-200
                hover:bg-slate-700/60
                border border-slate-700/60
                rounded-lg px-4 py-3
                transition-all duration-200
                flex items-center gap-3
                justify-start
              ">
                <span className="material-symbols-outlined text-brand">
                  trending_up
                </span>
                <span className="font-semibold">View Progress</span>
              </Button>
            </Link>
          </div>

          {/* Goal Info */}
          <div className="mt-6 pt-6 border-t border-slate-700/60">
            <div className="text-sm text-slate-400 mb-2">Current Goal</div>
            <div className="text-lg font-semibold text-slate-200 capitalize">
              {userData?.goal?.replace('_', ' ')}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
