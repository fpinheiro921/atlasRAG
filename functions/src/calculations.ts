/**
 * Core calculation logic for TDEE, BMR, and macro allocation
 * Based on the Müller equation and Layne Norton methodology
 */

import { OnboardingInput, CalculatedPlan, MacroPlan, DietHistory, Sex } from "./types";
import * as logger from "firebase-functions/logger";

/**
 * Get metabolic adaptation factor based on dieting history
 */
function getMetabolicAdaptationFactor(dietHistory: DietHistory): number {
  const factors = {
    low: 0,
    medium: 0.05,
    high: 0.10,
    perpetual: 0.20,
  };
  return factors[dietHistory] || 0;
}

/**
 * Calculate Lean Body Mass (LBM) and Fat Mass (FM)
 */
function calculateBodyComposition(bodyWeightKg: number, bodyFatPercentage: number) {
  const fatMass = bodyWeightKg * (bodyFatPercentage / 100);
  const leanBodyMass = bodyWeightKg - fatMass;
  return { lbmKg: leanBodyMass, fmKg: fatMass };
}

/**
 * Calculate BMR using the Müller equation
 * BMR = (13.587 × LBM) + (9.613 × FM) + (198 × Sex) – (3.351 × Age) + 674
 * Sex: 1 for male, 0 for female
 */
function calculateMullerBMR(lbmKg: number, fmKg: number, sex: Sex, age: number): number {
  const sexValue = sex === "male" ? 1 : 0;
  const bmr = (13.587 * lbmKg) + (9.613 * fmKg) + (198 * sexValue) - (3.351 * age) + 674;
  return Math.round(bmr);
}

/**
 * Apply metabolic adaptation to BMR
 */
function applyMetabolicAdaptation(bmr: number, adaptationFactor: number): number {
  return Math.round(bmr * (1 - adaptationFactor));
}

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 */
function calculateTDEE(bmr: number, activityFactor: number): number {
  return Math.round(bmr * activityFactor);
}

/**
 * Calculate target calories based on goal type
 */
function calculateTargetCalories(tdee: number, goalType: string): number {
  switch (goalType) {
    case "fat_loss":
      // 10% deficit for fat loss
      return Math.round(tdee * 0.90);
    case "reverse_dieting":
      // Start at maintenance, will increase gradually
      return tdee;
    case "maintenance":
      return tdee;
    default:
      return tdee;
  }
}

/**
 * Calculate protein target based on LBM and goal
 * For fat loss: 2.4-2.8 g/kg LBM (using 2.6 as middle ground)
 * For maintenance/reverse: 2.0-2.3 g/kg LBM (using 2.15)
 */
function calculateProteinTarget(lbmKg: number, goalType: string): number {
  const proteinPerKgLBM = goalType === "fat_loss" ? 2.6 : 2.15;
  return Math.round(lbmKg * proteinPerKgLBM);
}

/**
 * Calculate macronutrient distribution
 * Priority: Protein > Fat (minimum 20% of calories) > Carbs (remaining)
 */
function calculateMacros(targetCalories: number, proteinG: number): MacroPlan {
  // Protein calories (4 kcal/g)
  const proteinCalories = proteinG * 4;

  // Minimum fat (20% of total calories)
  const minFatCalories = targetCalories * 0.20;
  const minFatG = Math.round(minFatCalories / 9);

  // Remaining calories for carbs and fats (using 50/50 split)
  const remainingCalories = targetCalories - proteinCalories;
  const carbCalories = remainingCalories * 0.50;
  const fatCalories = remainingCalories * 0.50;

  // Ensure fat meets minimum
  const finalFatG = Math.max(minFatG, Math.round(fatCalories / 9));
  const finalFatCalories = finalFatG * 9;

  // Recalculate carbs with adjusted fat
  const finalCarbCalories = targetCalories - proteinCalories - finalFatCalories;
  const finalCarbG = Math.round(finalCarbCalories / 4);

  return {
    caloriesTarget: targetCalories,
    proteinTargetG: proteinG,
    carbsTargetG: Math.max(0, finalCarbG),
    fatTargetG: finalFatG,
  };
}

/**
 * Main calculation function for onboarding
 */
export function calculateOnboardingPlan(input: OnboardingInput): CalculatedPlan {
  logger.info("Starting onboarding calculation", { input });

  // Validation
  if (input.bodyFatPercentage < 3 || input.bodyFatPercentage > 60) {
    throw new Error("Body fat percentage must be between 3% and 60%");
  }

  if (input.age < 18 || input.age > 100) {
    throw new Error("Age must be between 18 and 100");
  }

  if (input.bodyWeightKg < 30 || input.bodyWeightKg > 300) {
    throw new Error("Body weight must be between 30kg and 300kg");
  }

  // Step 1: Calculate body composition
  const { lbmKg, fmKg } = calculateBodyComposition(input.bodyWeightKg, input.bodyFatPercentage);

  // Step 2: Calculate BMR using Müller equation
  const bmr = calculateMullerBMR(lbmKg, fmKg, input.sex, input.age);

  // Step 3: Apply metabolic adaptation
  const metabolicAdaptationFactor = getMetabolicAdaptationFactor(input.dietHistory);
  const adjustedBmr = applyMetabolicAdaptation(bmr, metabolicAdaptationFactor);

  // Step 4: Calculate TDEE
  const tdee = calculateTDEE(adjustedBmr, input.activityFactor);

  // Step 5: Calculate target calories based on goal
  const targetCalories = calculateTargetCalories(tdee, input.goalType);

  // Step 6: Calculate protein target
  const proteinTarget = calculateProteinTarget(lbmKg, input.goalType);

  // Step 7: Calculate full macro distribution
  const macros = calculateMacros(targetCalories, proteinTarget);

  const result: CalculatedPlan = {
    lbmKg: Math.round(lbmKg * 10) / 10,
    fmKg: Math.round(fmKg * 10) / 10,
    bmr,
    adjustedBmr,
    tdee,
    targetCalories,
    macros,
    metabolicAdaptationFactor,
  };

  logger.info("Onboarding calculation complete", { result });

  return result;
}

/**
 * Calculate weekly adjustment based on weight progress
 */
export function calculateWeeklyAdjustment(
  currentWeightAvg: number,
  previousWeightAvg: number,
  goalType: string,
  currentPlan: MacroPlan,
  bodyWeightKg: number
): { shouldAdjust: boolean; reason: string; newPlan?: MacroPlan; recommendation: string } {
  const weightChange = currentWeightAvg - previousWeightAvg;
  const weightChangePercentage = (weightChange / previousWeightAvg) * 100;

  logger.info("Weekly adjustment calculation", {
    currentWeightAvg,
    previousWeightAvg,
    weightChange,
    weightChangePercentage,
    goalType,
  });

  if (goalType === "fat_loss") {
    // For fat loss, we want 0.4-0.8% loss per week
    const targetLossPercentage = -0.6; // -0.6% as middle ground
    const isPlateaued = Math.abs(weightChange) < 0.1; // Less than 100g change

    if (isPlateaued) {
      // Plateau detected - suggest micro-adjustment
      const newCalories = currentPlan.caloriesTarget - 125;
      const carbReduction = 15; // Reduce carbs by 15g (60 kcal)
      const fatReduction = 7; // Reduce fat by 7g (63 kcal)

      return {
        shouldAdjust: true,
        reason: "Plateau detected (no weight change for 7+ days)",
        newPlan: {
          caloriesTarget: newCalories,
          proteinTargetG: currentPlan.proteinTargetG, // Protein stays the same
          carbsTargetG: currentPlan.carbsTargetG - carbReduction,
          fatTargetG: currentPlan.fatTargetG - fatReduction,
        },
        recommendation: "Reduce calories by 125 (15g carbs + 7g fat). Monitor for next 7 days.",
      };
    }

    if (weightChangePercentage > -0.3) {
      // Losing too slowly
      return {
        shouldAdjust: true,
        reason: `Weight loss too slow (${weightChangePercentage.toFixed(2)}%)`,
        newPlan: {
          caloriesTarget: currentPlan.caloriesTarget - 100,
          proteinTargetG: currentPlan.proteinTargetG,
          carbsTargetG: currentPlan.carbsTargetG - 12,
          fatTargetG: currentPlan.fatTargetG - 4,
        },
        recommendation: "Small calorie reduction. Continue monitoring.",
      };
    }

    // Progress is good
    return {
      shouldAdjust: false,
      reason: `Good progress (${weightChangePercentage.toFixed(2)}% change)`,
      recommendation: "Continue with current plan. Keep tracking consistently.",
    };
  } else if (goalType === "reverse_dieting") {
    // For reverse dieting, we want ≤ 0.2% gain per week (conservative)
    const maxAllowableGainPercentage = 0.2;

    if (weightChangePercentage <= maxAllowableGainPercentage) {
      // Metabolism adapting well - increase calories
      const calorieIncrease = Math.round(currentPlan.caloriesTarget * 0.02); // 2% increase
      const carbIncrease = 8;
      const fatIncrease = 2;

      return {
        shouldAdjust: true,
        reason: `Metabolism adapting well (${weightChangePercentage.toFixed(2)}% gain)`,
        newPlan: {
          caloriesTarget: currentPlan.caloriesTarget + calorieIncrease,
          proteinTargetG: currentPlan.proteinTargetG,
          carbsTargetG: currentPlan.carbsTargetG + carbIncrease,
          fatTargetG: currentPlan.fatTargetG + fatIncrease,
        },
        recommendation: "Increase calories by ~2%. You've earned this metabolic boost!",
      };
    }

    // Gaining too fast - hold steady
    return {
      shouldAdjust: false,
      reason: `Weight gain above threshold (${weightChangePercentage.toFixed(2)}%)`,
      recommendation: "Hold calories steady for 1-2 weeks to allow metabolism to catch up.",
    };
  }

  // Maintenance - no adjustments
  return {
    shouldAdjust: false,
    reason: "Maintenance mode - no adjustments needed",
    recommendation: "Continue monitoring weight trends.",
  };
}
