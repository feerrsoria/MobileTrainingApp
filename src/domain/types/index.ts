export enum TrainingObjective {
  Hypertrophy = "Hypertrophy",
  Strength = "Strength",
  WeightLoss = "WeightLoss",
}

export enum TrainingLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
}

export interface UserConfig {
  // Define properties for user configuration
  preferredUnit: "kg" | "lbs";
  // ... other user preferences
}

export interface Set {
  repetitions: number;
  sets: number;
  weight?: number; // Optional if RPE is used
  rpe?: number; // Rate of Perceived Exertion
  repsFailed?: number; // Repetitions in reserve
}

export interface Exercise {
  name: string;
  sets: Set[];
}

export interface Routine {
  objective: TrainingObjective;
  level: TrainingLevel;
  exercises: Exercise[];
  // ... other routine properties
}