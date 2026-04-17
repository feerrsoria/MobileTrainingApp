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

    const lastCycleWeek = relevantSessions.length % this.WEEKS_IN_CYCLE;

    if (lastCycleWeek === 0) { // Completed a full cycle, starting a new one.
        const lastCycleWeek3Session = relevantSessions[relevantSessions.length - 2];
        const lastCycleWeek3Exercise = lastCycleWeek3Session.exercises.find(ex => ex.name === exerciseName);
        const lastCycleWeek3Weight = lastCycleWeek3Exercise?.sets.find(set => set.weight !== undefined)?.weight;

        return {
            suggestedRepetitions: this.WEEK_REPS[0],
            suggestedSets: 3,
            suggestedWeight: lastCycleWeek3Weight ? lastCycleWeek3Weight * (1 + this.LOAD_INCREASE_PERCENTAGE) : undefined,
            notes: `Progressive week (Week 1: ${this.WEEK_REPS[0]} reps).`,
        };
    }

    if (lastCycleWeek === this.WEEKS_IN_CYCLE - 1) { // End of week 3, suggest deload for week 4
        const week1SessionInCurrentCycle = relevantSessions[relevantSessions.length - 3];
        const week1Weight = week1SessionInCurrentCycle?.exercises.find(ex => ex.name === exerciseName)?.sets.find(set => set.weight !== undefined)?.weight;

        return {
            suggestedRepetitions: 6,
            suggestedSets: 3,
            suggestedWeight: week1Weight || lastRecordedWeight,
            notes: "Deload week (Week 4: 6 reps with Week 1 load).",
        };
    }

    // Progressive weeks (Week 1, 2)
    const nextSuggestedReps = this.WEEK_REPS[lastCycleWeek];
    let newWeight = lastRecordedWeight;

    const lastSessionCompletedSuccessfully = lastExercise?.sets.every(
      set => (!set.repsFailed || set.repsFailed === 0) && set.weight !== undefined
    ) || false;

    if (lastSessionCompletedSuccessfully && lastRecordedWeight) {
        newWeight = lastRecordedWeight * (1 + this.LOAD_INCREASE_PERCENTAGE);
    }

    return {
        suggestedRepetitions: nextSuggestedReps,
        suggestedSets: 3,
        suggestedWeight: newWeight,
        notes: `Progressive week (Week ${lastCycleWeek + 1}: ${nextSuggestedReps} reps).`,
    };
  }
}
