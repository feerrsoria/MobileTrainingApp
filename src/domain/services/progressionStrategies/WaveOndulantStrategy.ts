import { ProgressionStrategy, ProgressionSuggestion } from "../ProgressionEngine";
import { Session } from "../../entities/TrainingPlan";
import { User } from "../../entities/User";

export class WaveOndulantStrategy implements ProgressionStrategy {
  private readonly WEEKS_IN_CYCLE = 4; // 3 progressive weeks + 1 deload week
  private readonly WEEK_REPS = [8, 7, 6]; // Reps for Week 1, 2, 3
  private readonly LOAD_INCREASE_PERCENTAGE = 0.025; // 2.5% increase for progressive weeks

  suggestProgression(history: Session[], exerciseName: string, user: User): ProgressionSuggestion {
    const relevantSessions = history.filter(session =>
      session.exercises.some(ex => ex.name === exerciseName)
    );

    if (relevantSessions.length === 0) {
      // If no history, suggest starting values for Week 1
      return {
        suggestedRepetitions: this.WEEK_REPS[0],
        suggestedSets: 3, // Default sets, could be configurable
        notes: "Start of a new wave cycle (Week 1: 8 reps)."
      };
    }

    // Sort sessions by sessionNumber to ensure correct order
    relevantSessions.sort((a, b) => a.sessionNumber - b.sessionNumber);

    const lastSession = relevantSessions[relevantSessions.length - 1];
    const lastExercise = lastSession.exercises.find(ex => ex.name === exerciseName);
    const lastRecordedWeight = lastExercise?.sets.find(set => set.weight !== undefined)?.weight;

    // Determine the current week in the cycle based on the last session
    // Session numbers are 1-based. Modulo WEEKS_IN_CYCLE will give 0 for the 4th week, 1 for 1st, etc.
    let currentWeekInCycle = lastSession.sessionNumber % this.WEEKS_IN_CYCLE;
    if (currentWeekInCycle === 0) {
      currentWeekInCycle = this.WEEKS_IN_CYCLE; // Map 0 to 4 for Week 4
    }

    // Check if the last session was completed successfully
    const lastSessionCompletedSuccessfully = lastExercise?.sets.every(
      set => (!set.repsFailed || set.repsFailed === 0) && set.weight !== undefined
    ) || false;

    if (currentWeekInCycle === this.WEEKS_IN_CYCLE) {
      // Deload week (Week 4)
      // Suggest 6 reps with Week 1 load. Need to find Week 1 load from the current cycle.
      const currentCycleStartSessionNumber = lastSession.sessionNumber - (currentWeekInCycle - 1);
      const week1SessionInCurrentCycle = relevantSessions.find(
        session => session.sessionNumber === currentCycleStartSessionNumber
      );

      const week1Weight = week1SessionInCurrentCycle?.exercises.find(ex => ex.name === exerciseName)?.sets.find(set => set.weight !== undefined)?.weight;

      return {
        suggestedRepetitions: 6,
        suggestedSets: 3, // Default sets
        suggestedWeight: week1Weight || lastRecordedWeight, // Fallback to last recorded weight if Week 1 weight not found
        notes: "Deload week (Week 4: 6 reps with Week 1 load).",
      };
    } else {
      // Progressive weeks (Week 1, 2, 3)
      const nextWeekInCycle = currentWeekInCycle + 1;
      const nextSuggestedReps = this.WEEK_REPS[nextWeekInCycle - 1];
      let newWeight = lastRecordedWeight;

      if (lastSessionCompletedSuccessfully && lastRecordedWeight) {
        newWeight = lastRecordedWeight * (1 + this.LOAD_INCREASE_PERCENTAGE);
      }

      return {
        suggestedRepetitions: nextSuggestedReps,
        suggestedSets: 3,
        suggestedWeight: newWeight,
        notes: `Progressive week (Week ${nextWeekInCycle}: ${nextSuggestedReps} reps).`,
      };
    }
  }
}
