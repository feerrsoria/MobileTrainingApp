import { useState, useEffect } from "react";
import { TrainingPlan } from "../../domain/entities/TrainingPlan";
import { UserConfig } from "../../domain/types";
import { IRepository } from "../../infrastructure/repositories/IRepository";

export const useRoutine = (repository: IRepository) => {
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(null);
  const [userConfig, setUserConfig] = useState<UserConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [plan, config] = await Promise.all([
          repository.getTrainingPlan(),
          repository.getUserConfig(),
        ]);
        setTrainingPlan(plan);
        setUserConfig(config);
      } catch (e) {
        setError("Failed to load routine data");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [repository]);

  return { trainingPlan, userConfig, isLoading, error };
};
