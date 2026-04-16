import { RPE_MAP } from "../constants/RpeMap";

export type Rpe = keyof typeof RPE_MAP;

export interface Set {
  reps: number;
  weight?: number;
  rpe?: Rpe;
  repsFailed?: number;
}

export enum TrainingObjective {
  Strength = "Strength",
  Hypertrophy = "Hypertrophy",
  Endurance = "Endurance",
}

export enum TrainingLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
}

export interface UserConfig {
  id: string;
  name: string;
  trainingObjective: TrainingObjective;
  trainingLevel: TrainingLevel;
  // Add other user-related configuration properties as needed
}

export enum MovementPattern {
  Squat = "Squat",
  Hinge = "Hinge",
  PushHorizontal = "Push Horizontal",
  PushVertical = "Push Vertical",
  PullHorizontal = "Pull Horizontal",
  PullVertical = "Pull Vertical",
  Lunge = "Lunge",
  Carry = "Carry",
  IsolationArm = "Isolation Arm",
  IsolationCore = "Isolation Core",
}

export interface Exercise {
  name: string;
  sets: Set[];
  movementPattern?: MovementPattern;
}
