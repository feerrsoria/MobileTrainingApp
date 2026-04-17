export enum ProgressionType {
  Linear = "Linear",
  Wave = "Wave",
  DoubleProgression = "Double Progression",
}

export interface ProgressionRule {
  type: ProgressionType;
  // Add more properties as needed for specific progression rules
  // e.g., percentageIncrease: number; for Linear progression
}

export interface Progression {
  rules: ProgressionRule[];
}