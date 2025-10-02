'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore, functions } from '@/firebase/client';
import { httpsCallable } from 'firebase/functions';

type Step = 1 | 2 | 3 | 4;

interface OnboardingData {
  // Step 1: Basic Info
  age: string;
  sex: 'male' | 'female' | '';
  heightCm: string;

  // Step 2: Body Composition
  weightKg: string;
  bodyFatPercentage: string;

  // Step 3: Goals & Diet History
  goal: 'fat_loss' | 'reverse_diet' | '';
  dietHistory: 'low' | 'medium' | 'high' | 'perpetual' | '';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra' | '';
}

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, refreshUserData } = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [calculatedPlan, setCalculatedPlan] = useState<any>(null);

  const [formData, setFormData] = useState<OnboardingData>({
    age: '',
    sex: '',
    heightCm: '',
    weightKg: '',
    bodyFatPercentage: '',
    goal: '',
    dietHistory: '',
    activityLevel: '',
  });

  const updateField = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (currentStep: Step): boolean => {
    switch (currentStep) {
      case 1:
        return !!(formData.age && formData.sex && formData.heightCm);
      case 2:
        return !!(formData.weightKg && formData.bodyFatPercentage);
      case 3:
        return !!(formData.goal && formData.dietHistory && formData.activityLevel);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!validateStep(step)) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (step === 3) {
      calculatePlan();
    } else {
      setStep((prev) => Math.min(prev + 1, 4) as Step);
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1) as Step);
  };

  const calculatePlan = async () => {
    setLoading(true);
    try {
      const calculatePlanFn = httpsCallable(functions, 'calculatePlan');
      const result = await calculatePlanFn({
        age: parseInt(formData.age),
        sex: formData.sex,
        heightCm: parseFloat(formData.heightCm),
        weightKg: parseFloat(formData.weightKg),
        bodyFatPercentage: parseFloat(formData.bodyFatPercentage),
        goal: formData.goal,
        dietHistory: formData.dietHistory,
        activityLevel: formData.activityLevel,
      });

      setCalculatedPlan(result.data);
      setStep(4);
    } catch (error: any) {
      console.error('Error calculating plan:', error);
      toast({
        title: 'Calculation Error',
        description: error.message || 'Failed to calculate your plan. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const completeonboarding = async () => {
    if (!user || !calculatedPlan) return;

    setLoading(true);
    try {
      // Update user document
      await updateDoc(doc(firestore, 'users', user.uid), {
        onboardingComplete: true,
        age: parseInt(formData.age),
        sex: formData.sex,
        heightCm: parseFloat(formData.heightCm),
        currentWeightKg: parseFloat(formData.weightKg),
        bodyFatPercentage: parseFloat(formData.bodyFatPercentage),
        goal: formData.goal,
        dietHistory: formData.dietHistory,
        activityLevel: formData.activityLevel,
        currentPlan: calculatedPlan,
        updatedAt: new Date().toISOString(),
      });

      await refreshUserData();

      toast({
        title: 'Welcome to Atlas!',
        description: 'Your personalized plan is ready.',
      });

      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-display uppercase text-slate-200 mb-2">
                Basic Information
              </h2>
              <p className="text-slate-400 text-sm">
                Let's start with your basic profile
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => updateField('age', e.target.value)}
                  className="
                    bg-slate-50 dark:bg-slate-700
                    border border-slate-300 dark:border-slate-600
                    text-slate-800 dark:text-slate-200
                    rounded-lg px-4 py-2.5
                  "
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sex">Biological Sex</Label>
                <Select value={formData.sex} onValueChange={(value: any) => updateField('sex', value)}>
                  <SelectTrigger className="
                    bg-slate-50 dark:bg-slate-700
                    border border-slate-300 dark:border-slate-600
                    text-slate-800 dark:text-slate-200
                    rounded-lg px-4 py-2.5
                  ">
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  value={formData.heightCm}
                  onChange={(e) => updateField('heightCm', e.target.value)}
                  className="
                    bg-slate-50 dark:bg-slate-700
                    border border-slate-300 dark:border-slate-600
                    text-slate-800 dark:text-slate-200
                    rounded-lg px-4 py-2.5
                  "
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-display uppercase text-slate-200 mb-2">
                Body Composition
              </h2>
              <p className="text-slate-400 text-sm">
                Current weight and body fat percentage
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Current Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70.0"
                  value={formData.weightKg}
                  onChange={(e) => updateField('weightKg', e.target.value)}
                  className="
                    bg-slate-50 dark:bg-slate-700
                    border border-slate-300 dark:border-slate-600
                    text-slate-800 dark:text-slate-200
                    rounded-lg px-4 py-2.5
                  "
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bodyFat">Body Fat Percentage (%)</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  placeholder="20.0"
                  value={formData.bodyFatPercentage}
                  onChange={(e) => updateField('bodyFatPercentage', e.target.value)}
                  className="
                    bg-slate-50 dark:bg-slate-700
                    border border-slate-300 dark:border-slate-600
                    text-slate-800 dark:text-slate-200
                    rounded-lg px-4 py-2.5
                  "
                />
                <p className="text-xs text-slate-500">
                  Use DEXA, scale estimates, or visual comparison charts
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-display uppercase text-slate-200 mb-2">
                Goals & History
              </h2>
              <p className="text-slate-400 text-sm">
                Your objectives and dieting background
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal">Primary Goal</Label>
                <Select value={formData.goal} onValueChange={(value: any) => updateField('goal', value)}>
                  <SelectTrigger className="
                    bg-slate-50 dark:bg-slate-700
                    border border-slate-300 dark:border-slate-600
                    text-slate-800 dark:text-slate-200
                    rounded-lg px-4 py-2.5
                  ">
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fat_loss">Fat Loss</SelectItem>
                    <SelectItem value="reverse_diet">Reverse Diet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietHistory">Diet History</Label>
                <Select value={formData.dietHistory} onValueChange={(value: any) => updateField('dietHistory', value)}>
                  <SelectTrigger className="
                    bg-slate-50 dark:bg-slate-700
                    border border-slate-300 dark:border-slate-600
                    text-slate-800 dark:text-slate-200
                    rounded-lg px-4 py-2.5
                  ">
                    <SelectValue placeholder="Select diet history" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (0-3 months)</SelectItem>
                    <SelectItem value="medium">Medium (3-6 months)</SelectItem>
                    <SelectItem value="high">High (6-12 months)</SelectItem>
                    <SelectItem value="perpetual">Perpetual (12+ months)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">
                  Time spent in calorie deficit in the past year
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity">Activity Level</Label>
                <Select value={formData.activityLevel} onValueChange={(value: any) => updateField('activityLevel', value)}>
                  <SelectTrigger className="
                    bg-slate-50 dark:bg-slate-700
                    border border-slate-300 dark:border-slate-600
                    text-slate-800 dark:text-slate-200
                    rounded-lg px-4 py-2.5
                  ">
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (1.2x)</SelectItem>
                    <SelectItem value="light">Light (1.375x)</SelectItem>
                    <SelectItem value="moderate">Moderate (1.55x)</SelectItem>
                    <SelectItem value="very">Very Active (1.725x)</SelectItem>
                    <SelectItem value="extra">Extra Active (1.9x)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-display uppercase text-slate-200 mb-2">
                Your Personalized Plan
              </h2>
              <p className="text-slate-400 text-sm">
                Science-based calculations tailored to your profile
              </p>
            </div>

            {calculatedPlan && (
              <div className="space-y-4">
                {/* TDEE Card */}
                <Card className="
                  bg-gradient-to-br from-brand/20 to-accent/20
                  border border-brand/30
                  rounded-xl p-6
                ">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                      Total Daily Energy Expenditure
                    </span>
                    <span className="material-symbols-outlined text-brand">
                      local_fire_department
                    </span>
                  </div>
                  <div className="text-4xl font-display font-bold text-slate-200 metric">
                    {calculatedPlan.tdee}
                    <span className="text-lg text-slate-400 ml-2">kcal</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    BMR: {calculatedPlan.bmr} kcal • Adaptation: {calculatedPlan.metabolicAdaptation}%
                  </p>
                </Card>

                {/* Macros Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <Card className="
                    bg-slate-800/60 backdrop-blur-lg
                    border border-slate-700/60
                    rounded-xl p-4
                  ">
                    <div className="text-center">
                      <div className="text-2xl font-display font-bold text-slate-200 metric">
                        {calculatedPlan.macros.proteinG}g
                      </div>
                      <div className="text-xs text-slate-400 uppercase tracking-wide mt-1">
                        Protein
                      </div>
                    </div>
                  </Card>

                  <Card className="
                    bg-slate-800/60 backdrop-blur-lg
                    border border-slate-700/60
                    rounded-xl p-4
                  ">
                    <div className="text-center">
                      <div className="text-2xl font-display font-bold text-slate-200 metric">
                        {calculatedPlan.macros.fatG}g
                      </div>
                      <div className="text-xs text-slate-400 uppercase tracking-wide mt-1">
                        Fat
                      </div>
                    </div>
                  </Card>

                  <Card className="
                    bg-slate-800/60 backdrop-blur-lg
                    border border-slate-700/60
                    rounded-xl p-4
                  ">
                    <div className="text-center">
                      <div className="text-2xl font-display font-bold text-slate-200 metric">
                        {calculatedPlan.macros.carbsG}g
                      </div>
                      <div className="text-xs text-slate-400 uppercase tracking-wide mt-1">
                        Carbs
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Target Calories */}
                <Card className="
                  bg-slate-800/60 backdrop-blur-lg
                  border border-slate-700/60
                  rounded-xl p-4
                ">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Daily Calorie Target</span>
                    <span className="text-xl font-display font-bold text-slate-200 metric">
                      {calculatedPlan.targetCalories} kcal
                    </span>
                  </div>
                </Card>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ProtectedRoute requireOnboarding={false}>
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Step {step} of 4</span>
              <span className="text-sm text-slate-400">{Math.round((step / 4) * 100)}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand to-accent transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Main Card */}
          <Card className="
            bg-white/60 dark:bg-slate-900/60
            backdrop-blur-2xl
            border border-white/20 dark:border-slate-700/60
            rounded-2xl
            shadow-2xl shadow-black/20 dark:shadow-black/40
            p-8
          ">
            {renderStep()}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700/60">
              <Button
                onClick={prevStep}
                disabled={step === 1 || loading}
                variant="ghost"
                className="
                  text-slate-400 hover:text-slate-200
                  disabled:opacity-30
                "
              >
                ← Back
              </Button>

              {step < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={loading}
                  className="
                    bg-brand hover:bg-brand-light
                    text-white font-semibold
                    rounded-lg px-6 py-2
                    transition-colors duration-200
                  "
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Calculating...
                    </span>
                  ) : step === 3 ? (
                    'Calculate Plan'
                  ) : (
                    'Continue →'
                  )}
                </Button>
              ) : (
                <Button
                  onClick={completeonboarding}
                  disabled={loading}
                  className="
                    bg-brand hover:bg-brand-light
                    text-white font-semibold
                    rounded-lg px-6 py-2
                    transition-colors duration-200
                  "
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Saving...
                    </span>
                  ) : (
                    'Start Training →'
                  )}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
