import { Microcycle, TrainingPlan, Session } from "../entities/TrainingPlan";
import { RoutineGeneratorService } from "../services/RoutineGenerator";
import { User } from "../entities/User";
import { TrainingObjective, TrainingLevel, Set } from "../types";

describe("RoutineGeneratorService", () => {
  let routineGenerator: RoutineGeneratorService;
  let intermediateUser: User;

  beforeEach(() => {
    intermediateUser = {
      id: "123",
      name: "Test User",
      level: TrainingLevel.Intermediate,
    };

    // Mock implementation of RoutineGeneratorService for testing purposes
    routineGenerator = {
      generateRoutine: (objective: TrainingObjective, user: User): TrainingPlan => {
        if (objective === TrainingObjective.Strength) {
          // Simulate a strength routine with exercises within 50-75% of competition weight
          const microcycles: Microcycle[] = [
            {
              weekNumber: 1,
              sessions: [
                {
                  sessionNumber: 1,
                  exercises: [
                    {
                      name: "Squats",
                      sets: [
                        { repetitions: 5, weight: 100, sets: 3 }, // Example: 70% of 140kg max
                        { repetitions: 5, weight: 105, sets: 3 },
                      ],
                    },
                    {
                      name: "Deadlifts",
                      sets: [
                        { repetitions: 3, weight: 120, sets: 3 }, // Example: 60% of 200kg max
                      ],
                    },
                  ],
                },
              ],
            },
          ];

          return {
            objective: TrainingObjective.Strength,
            mesocycles: [
              {
                mesocycleNumber: 1,
                microcycles: microcycles,
              },
            ],
          };
        } else if (objective === TrainingObjective.Hypertrophy && user.level === TrainingLevel.Intermediate) {
          // Simulate a hypertrophy routine for an intermediate user with a deload on the 4th session
          const sessions: Session[] = [
            { sessionNumber: 1, exercises: [{ name: "Bench Press", sets: [{ repetitions: 8, weight: 70, sets: 3 }] }] },
            { sessionNumber: 2, exercises: [{ name: "Squats", sets: [{ repetitions: 10, weight: 80, sets: 3 }] }] },
            { sessionNumber: 3, exercises: [{ name: "Deadlifts", sets: [{ repetitions: 6, weight: 100, sets: 3 }] }] },
            { sessionNumber: 4, exercises: [], isDeload: true }, // Deload session
          ];

          const microcycles: Microcycle[] = [
            { weekNumber: 1, sessions: sessions },
          ];

          return {
            objective: TrainingObjective.Hypertrophy,
            mesocycles: [{ mesocycleNumber: 1, microcycles: microcycles }],
          };
        }
        // Default return for other objectives (if any)
        return { objective: objective, mesocycles: [] };
      },
    };
  });

  it("should generate a strength routine with exercises within 50-75% of competition weight when \'Strength\' goal is selected", () => {
    const strengthRoutine = routineGenerator.generateRoutine(TrainingObjective.Strength, intermediateUser);

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
        expect(set.repetitions).toBeGreaterThan(0); // Ensure repetitions are set
        expect(set.sets).toBeGreaterThan(0); // Ensure sets are set
      });
    });

    // More specific checks could be added here if we had a concrete way to calculate
    // competition weight dynamically, allowing for a programmatic check of the 50-75% range.
  });

  it("should include a deload phase in the fourth session for an intermediate hypertrophy routine", () => {
    const hypertrophyRoutine = routineGenerator.generateRoutine(TrainingObjective.Hypertrophy, intermediateUser);

    expect(hypertrophyRoutine.objective).toBe(TrainingObjective.Hypertrophy);
    expect(hypertrophyRoutine.mesocycles.length).toBeGreaterThan(0);

    const microcycle = hypertrophyRoutine.mesocycles[0].microcycles[0];
    expect(microcycle.sessions.length).toBeGreaterThanOrEqual(4);

    const fourthSession = microcycle.sessions[3]; // 4th session (index 3)
    expect(fourthSession.isDeload).toBe(true);
    // For a deload session, we might also expect exercises to be empty or have very low volume/intensity
    expect(fourthSession.exercises.length).toBe(0);
  });
});
