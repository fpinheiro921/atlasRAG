'use client';

import { Card } from '@/components/ui/card';

export default function TrackingPage() {
  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-display font-extrabold uppercase text-slate-200 mb-2">
          Daily Tracking
        </h1>
        <p className="text-slate-400">
          Log your weight and food intake
        </p>
      </div>

      <Card className="
        bg-white/60 dark:bg-slate-900/60
        backdrop-blur-2xl
        border border-white/20 dark:border-slate-700/60
        rounded-2xl
        shadow-2xl shadow-black/20 dark:shadow-black/40
        p-8
        text-center
      ">
        <span className="material-symbols-outlined text-6xl text-slate-600 mb-4 block">
          construction
        </span>
        <h2 className="text-2xl font-display uppercase text-slate-200 mb-2">
          Coming Soon
        </h2>
        <p className="text-slate-400">
          Tracking features are under development
        </p>
      </Card>
    </div>
  );
}
