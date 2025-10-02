// Shared types for Cloud Functions

export type Sex = "male" | "female";
export type DietHistory = "low" | "medium" | "high" | "perpetual";
export type GoalType = "fat_loss" | "reverse_dieting" | "maintenance";

export interface OnboardingInput {
  age: number;
  sex: Sex;
  bodyWeightKg: number;
  bodyFatPercentage: number;
  goalType: GoalType;
  dietHistory: DietHistory;
  activityFactor: number;
}

export interface MacroPlan {
  caloriesTarget: number;
  proteinTargetG: number;
  carbsTargetG: number;
  fatTargetG: number;
}

export interface CalculatedPlan {
  lbmKg: number;
  fmKg: number;
  bmr: number;
  adjustedBmr: number;
  tdee: number;
  targetCalories: number;
  macros: MacroPlan;
  metabolicAdaptationFactor: number;
}

export interface WeeklyCheckInData {
  userId: string;
  currentWeightAvg: number;
  previousWeightAvg: number;
  goalType: GoalType;
  currentPlan: MacroPlan;
}

export interface WeeklyAdjustment {
  shouldAdjust: boolean;
  reason: string;
  newPlan?: MacroPlan;
  recommendation: string;
}

export interface RagQueryRequest {
  query: string;
  userId: string;
  userContext?: {
    weightKg?: number;
    goalType?: GoalType;
    activePlan?: MacroPlan;
  };
}

export interface RagQueryResponse {
  response: string;
  sources?: string[];
}
