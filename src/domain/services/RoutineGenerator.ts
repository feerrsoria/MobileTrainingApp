import { TrainingPlan } from "../entities/TrainingPlan";
import { User } from "../entities/User";
import { TrainingObjective } from "../types";

export interface RoutineGeneratorService {
  generateRoutine(objective: TrainingObjective, user: User): TrainingPlan;
}
