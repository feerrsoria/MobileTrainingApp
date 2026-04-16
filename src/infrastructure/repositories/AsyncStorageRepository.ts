import AsyncStorage from "@react-native-async-storage/async-storage";
import { IRepository } from "./IRepository";
import { UserConfig } from "../../domain/types";
import { TrainingPlan } from "../../domain/entities/TrainingPlan";

const USER_CONFIG_KEY = "userConfig";
const TRAINING_PLAN_KEY = "trainingPlan";

export class AsyncStorageRepository implements IRepository {
  async saveUserConfig(userConfig: UserConfig): Promise<void> {
    try {
      const jsonValue = JSON.stringify(userConfig);
      await AsyncStorage.setItem(USER_CONFIG_KEY, jsonValue);
    } catch (e) {
      console.error("Error saving user config", e);
    }
  }

  async getUserConfig(): Promise<UserConfig | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(USER_CONFIG_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error("Error getting user config", e);
      return null;
    }
  }

  async saveTrainingPlan(trainingPlan: TrainingPlan): Promise<void> {
    try {
      const jsonValue = JSON.stringify(trainingPlan);
      await AsyncStorage.setItem(TRAINING_PLAN_KEY, jsonValue);
    } catch (e) {
      console.error("Error saving training plan", e);
    }
  }

  async getTrainingPlan(): Promise<TrainingPlan | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(TRAINING_PLAN_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error("Error getting training plan", e);
      return null;
    }
  }
}
