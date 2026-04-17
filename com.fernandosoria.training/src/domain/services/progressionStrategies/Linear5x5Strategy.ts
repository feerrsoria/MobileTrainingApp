import { ProgressionStrategy, ProgressionSuggestion } from "../ProgressionEngine";
import { Session } from "../../entities/TrainingPlan";
import { User } from "../../entities/User";

export class Linear5x5Strategy implements ProgressionStrategy {
  private readonly TARGET_REPS_PER_SET = 5;
  private readonly TARGET_SETS = 5;
  private readonly LOAD_INCREASE_PERCENTAGE = 0.05; // 5% increase
  private readonly LOAD_DECREASE_PERCENTAGE = 0.10; // 10% decrease
  private readonly FAILURE_THRESHOLD = 2; // 2 consecutive failures

  suggestProgression(history: Session[], exerciseName: string, user: User): ProgressionSuggestion {
    const relevantSessions = history.filter(session =>
      session.exercises.some(ex => ex.name === exerciseName)
    );

    if (relevantSessions.length === 0) {
      return {
        suggestedRepetitions: this.TARGET_REPS_PER_SET,
        suggestedSets: this.TARGET_SETS,
        notes: "No history found. Start with a suitable weight for 5x5."
      };
    }

    const lastSession = relevantSessions[relevantSessions.length - 1];
    const lastExercise = lastSession.exercises.find(ex => ex.name === exerciseName);
    const lastRecordedWeight = lastExercise?.sets.find(set => set.weight !== undefined)?.weight;

    // Check for consecutive failures
    let consecutiveFailures = 0;
    for (let i = relevantSessions.length - 1; i >= 0; i--) {
      const session = relevantSessions[i];
      const exercise = session.exercises.find(ex => ex.name === exerciseName);
      if (exercise) {
        const failedSets = exercise.sets.filter(set => set.repsFailed && set.repsFailed > 0);
        if (failedSets.length > 0) {
          consecutiveFailures++;
        } else {
          break; // Reset consecutive failures if a session was successful
        }
      }
      if (consecutiveFailures >= this.FAILURE_THRESHOLD) {
        if (lastRecordedWeight) {
          const newWeight = lastRecordedWeight * (1 - this.LOAD_DECREASE_PERCENTAGE);
          return {
            suggestedRepetitions: this.TARGET_REPS_PER_SET,
            suggestedSets: this.TARGET_SETS,
            suggestedWeight: newWeight,
            notes: `Reduced load by ${this.LOAD_DECREASE_PERCENTAGE * 100}% due to ${this.FAILURE_THRESHOLD} consecutive failures.`
          };
        } else {
          return {
            suggestedRepetitions: this.TARGET_REPS_PER_SET,
            suggestedSets: this.TARGET_SETS,
            notes: `No weight recorded, suggest starting light after ${this.FAILURE_THRESHOLD} consecutive failures.`
          };
        }
      }
    }

    // Check for successful completion to increase load
    if (lastExercise) {
      const allSetsCompletedSuccessfully = lastExercise.sets.length === this.TARGET_SETS &&
        lastExercise.sets.every(set => set.reps >= this.TARGET_REPS_PER_SET && (!set.repsFailed || set.repsFailed === 0));

      if (allSetsCompletedSuccessfully) {
        if (lastRecordedWeight) {
          const newWeight = lastRecordedWeight * (1 + this.LOAD_INCREASE_PERCENTAGE);
          return {
            suggestedRepetitions: this.TARGET_REPS_PER_SET,
            suggestedSets: this.TARGET_SETS,
            suggestedWeight: newWeight,
            notes: `Increased load by ${this.LOAD_INCREASE_PERCENTAGE * 100}% due to successful completion.`
          };
        } else {
          return {
            suggestedRepetitions: this.TARGET_REPS_PER_SET,
            suggestedSets: this.TARGET_SETS,
            notes: "Successful completion, but no weight recorded. Suggest increasing load from a suitable starting weight."
          };
        }
      }
    }

    // Default: maintain current load if no clear progression/regression rules apply
    return {
      suggestedRepetitions: this.TARGET_REPS_PER_SET,
      suggestedSets: this.TARGET_SETS,
      suggestedWeight: lastRecordedWeight,
      notes: "Maintain current load."
    };
  }
}
