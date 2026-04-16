import { TrainingPlan } from "../entities/TrainingPlan";
import { User } from "../entities/User";
import { TrainingObjective, UserConfig } from "../types";

export interface RoutineGeneratorService {
  generateRoutine(userConfig: UserConfig, user: User): TrainingPlan;
}
