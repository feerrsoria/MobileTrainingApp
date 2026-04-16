import { Set, TrainingObjective } from "../types";

export interface Session {
  sessionNumber: number;
  exercises: { name: string; sets: Set[]; }[];
  isDeload?: boolean; // Indicates if this is a deload session
}

export interface Microcycle {
  weekNumber: number;
  sessions: Session[];
}

export interface Mesocycle {mesocycleNumber: number;microcycles: Microcycle[];}

export interface TrainingPlan {
  objective: TrainingObjective;
  mesocycles: Mesocycle[];
}
