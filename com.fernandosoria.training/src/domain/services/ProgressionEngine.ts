import { Session } from "../entities/TrainingPlan";
import { User } from "../entities/User";

export interface ProgressionSuggestion {
  suggestedRepetitions: number;
  suggestedSets: number;
  suggestedWeight?: number;
  notes?: string;
}

export interface ProgressionStrategy {
  suggestProgression(history: Session[], exerciseName: string, user: User): ProgressionSuggestion;
}

export class ProgressionEngine {
  private strategies: Map<string, ProgressionStrategy>;

  constructor() {
    this.strategies = new Map<string, ProgressionStrategy>();
  }

  registerStrategy(name: string, strategy: ProgressionStrategy): void {
    this.strategies.set(name, strategy);
  }

  getStrategy(name: string): ProgressionStrategy | undefined {
    return this.strategies.get(name);
  }

  suggestProgression(
    strategyName: string,
    history: Session[],
    exerciseName: string,
    user: User
  ): ProgressionSuggestion | undefined {
    const strategy = this.getStrategy(strategyName);
    if (strategy) {
      return strategy.suggestProgression(history, exerciseName, user);
    }
    console.warn(`No progression strategy found for: ${strategyName}`);
    return undefined;
  }
}
