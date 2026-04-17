import { IRepository } from "./IRepository";
import { UserConfig } from "../../domain/types";
import { TrainingPlan } from "../../domain/entities/TrainingPlan";
import { db } from "../db";

export class SQLiteRepository implements IRepository {
  constructor() {
    db.execAsync(
      "CREATE TABLE IF NOT EXISTS user_config (id INTEGER PRIMARY KEY NOT NULL, config TEXT NOT NULL);"
    );
    db.execAsync(
      "CREATE TABLE IF NOT EXISTS training_plan (id INTEGER PRIMARY KEY NOT NULL, plan TEXT NOT NULL);"
    );
  }

  async saveUserConfig(userConfig: UserConfig): Promise<void> {
    const configStr = JSON.stringify(userConfig);
    await db.runAsync("INSERT OR REPLACE INTO user_config (id, config) VALUES (1, ?);", configStr);
  }

  async getUserConfig(): Promise<UserConfig | null> {
    const result = await db.getFirstAsync("SELECT config FROM user_config WHERE id = 1;");
    if (result) {
      return JSON.parse((result as any).config);
    }
    return null;
  }

  async saveTrainingPlan(trainingPlan: TrainingPlan): Promise<void> {
    const planStr = JSON.stringify(trainingPlan);
    await db.runAsync("INSERT OR REPLACE INTO training_plan (id, plan) VALUES (1, ?);", planStr);
  }

  async getTrainingPlan(): Promise<TrainingPlan | null> {
    const result = await db.getFirstAsync("SELECT plan FROM training_plan WHERE id = 1;");
    if (result) {
      return JSON.parse((result as any).plan);
    }
    return null;
  }
}
