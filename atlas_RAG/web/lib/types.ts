import { Timestamp } from 'firebase/firestore';

// ============================================
// User & Profile Types
// ============================================

export type Sex = 'male' | 'female';
export type DietHistory = 'low' | 'medium' | 'high' | 'perpetual';

export interface UserProfile {
  age: number;
  sex: Sex;
  dietHistory: DietHistory;
  metabolicAdaptationFactor: number;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Timestamp;
  profile: UserProfile;
}

// ============================================
// Goal Types
// ============================================

export type GoalType = 'fat_loss' | 'reverse_dieting' | 'maintenance';

export interface MacroPlan {
  caloriesTarget: number;
  proteinTargetG: number;
  carbsTargetG: number;
  fatTargetG: number;
}

export interface Goal {
  id: string;
  type: GoalType;
  isActive: boolean;
  startDate: Timestamp;
  startWeightKg: number;
  activePlan: MacroPlan;
}

// ============================================
// Tracking Types
// ============================================

export interface DailyCheckIn {
  id: string;
  date: Timestamp;
  weightKg: number;
}

export interface FoodLogEntry {
  id: string;
  date: Timestamp;
  mealName: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

// ============================================
// Calculation Types
// ============================================

export interface OnboardingInput {
  age: number;
  sex: Sex;
  bodyWeightKg: number;
  bodyFatPercentage: number;
  goalType: GoalType;
  dietHistory: DietHistory;
  activityFactor: number;
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

// ============================================
// Chat & RAG Types
// ============================================

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: Timestamp;
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

// ============================================
// Weekly Check-in Types
// ============================================

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
