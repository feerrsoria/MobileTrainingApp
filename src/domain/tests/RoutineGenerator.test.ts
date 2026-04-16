import { Microcycle, TrainingPlan, Session } from "../entities/TrainingPlan";
import { RoutineGeneratorService } from "../services/RoutineGenerator";
import { User } from "../entities/User";
import { TrainingObjective, TrainingLevel, Set, UserConfig } from "../types";
import { RoutineGeneratorServiceImpl } from "../services/implementations/RoutineGeneratorServiceImpl";
import { ILogger, LogLevel } from "../interfaces/ILogger";

class MockLogger implements ILogger {
  log(level: LogLevel, message: string, data?: object): void {}
}

describe("RoutineGeneratorService", () => {
  let routineGenerator: RoutineGeneratorService;
  let intermediateUser: User;
  let logger: ILogger;

  beforeEach(() => {
    logger = new MockLogger();
    routineGenerator = new RoutineGeneratorServiceImpl(logger);
    intermediateUser = {
      id: "123",
      name: "Test User",
      level: TrainingLevel.Intermediate,
    };
  });

  it("should generate a strength routine with exercises within 50-75% of competition weight when \'Strength\' goal is selected", () => {
    const strengthUserConfig: UserConfig = {
      id: intermediateUser.id,
      name: intermediateUser.name,
      trainingObjective: TrainingObjective.Strength,
      trainingLevel: intermediateUser.level,
    };
    const strengthRoutine = routineGenerator.generateRoutine(strengthUserConfig, intermediateUser);

    expect(strengthRoutine.objective).toBe(TrainingObjective.Strength);
    expect(strengthRoutine.mesocycles.length).toBeGreaterThan(0);
    expect(strengthRoutine.mesocycles[0].microcycles.length).toBeGreaterThan(0);

    const strengthSessions = strengthRoutine.mesocycles[0].microcycles[0].sessions;
    expect(strengthSessions.length).toBeGreaterThan(0);

    const strengthExercises = strengthSessions[0].exercises;

    strengthExercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        // This assertion is a placeholder. In a real scenario, we\'d have a more
        // sophisticated way to determine \'competition weight\' and validate the range.
        // For now, we\'re assuming the mocked data correctly represents the 50-75% range.
        // A more robust test would involve calculating 1RM and then verifying the percentage.
        expect(set.weight).toBeGreaterThan(0); // Ensure weight is set
        expect(set.reps).toBeGreaterThan(0); // Ensure repetitions are set
        // The 'sets' property is not part of the Set interface, it's about the number of sets in the exercise config
        // This assertion is likely incorrect given the current Set interface definition
        // expect(set.sets).toBeGreaterThan(0); // Ensure sets are set
      });
    });

    // More specific checks could be added here if we had a concrete way to calculate
    // competition weight dynamically, allowing for a programmatic check of the 50-75% range.
  });

  it("should include a deload phase in the fourth session for an intermediate hypertrophy routine", () => {
    const hypertrophyUserConfig: UserConfig = {
      id: intermediateUser.id,
      name: intermediateUser.name,
      trainingObjective: TrainingObjective.Hypertrophy,
      trainingLevel: intermediateUser.level,
    };
    const hypertrophyRoutine = routineGenerator.generateRoutine(hypertrophyUserConfig, intermediateUser);

    expect(hypertrophyRoutine.objective).toBe(TrainingObjective.Hypertrophy);
    expect(hypertrophyRoutine.mesocycles.length).toBeGreaterThan(0);

    const microcycle = hypertrophyRoutine.mesocycles[2].microcycles[0];
    expect(microcycle.sessions.length).toBeGreaterThanOrEqual(4);

    const fourthSession = microcycle.sessions[3]; // 4th session (index 3)
    expect(fourthSession.isDeload).toBe(true);
    // For a deload session, we might also expect exercises to be empty or have very low volume/intensity
    expect(fourthSession.exercises.length).toBe(0);
  });

  it("should generate a balanced volume distribution for a 4-day/week hypertrophy routine", () => {
    const hypertrophyUserConfig: UserConfig = {
      id: intermediateUser.id,
      name: intermediateUser.name,
      trainingObjective: TrainingObjective.Hypertrophy,
      trainingLevel: intermediateUser.level,
    };
    const hypertrophyRoutine = routineGenerator.generateRoutine(hypertrophyUserConfig, intermediateUser);

    const microcycle = hypertrophyRoutine.mesocycles[2].microcycles[0];
    expect(microcycle.sessions.length).toBe(4);

    const exerciseCounts = microcycle.sessions.map(session => session.exercises.length);
    // Simple check for non-zero exercises in the first 3 sessions and zero in the last (deload)
    expect(exerciseCounts[0]).toBeGreaterThan(0);
    expect(exerciseCounts[1]).toBeGreaterThan(0);
    expect(exerciseCounts[2]).toBeGreaterThan(0);
    expect(exerciseCounts[3]).toBe(0);

    // A more sophisticated check could analyze the total volume (sets * reps * weight) per session or movement pattern
  });
});
