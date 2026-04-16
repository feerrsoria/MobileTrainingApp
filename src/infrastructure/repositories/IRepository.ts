import { UserConfig } from "../../domain/types";
import { TrainingPlan } from "../../domain/entities/TrainingPlan";

export interface IRepository {
  saveUserConfig(userConfig: UserConfig): Promise<void>;
  getUserConfig(): Promise<UserConfig | null>;
  saveTrainingPlan(trainingPlan: TrainingPlan): Promise<void>;
  getTrainingPlan(): Promise<TrainingPlan | null>;
}
