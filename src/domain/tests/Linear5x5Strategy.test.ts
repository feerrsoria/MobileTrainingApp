import { ProgressionEngine } from "../services/ProgressionEngine";
import { Linear5x5Strategy } from "../services/progressionStrategies/Linear5x5Strategy";
import { Session } from "../entities/TrainingPlan";
import { User } from "../entities/User";
import { TrainingLevel } from "../types";

describe("Linear5x5Strategy", () => {
  let progressionEngine: ProgressionEngine;
  let linearStrategy: Linear5x5Strategy;
  let mockUser: User;

  beforeEach(() => {
    progressionEngine = new ProgressionEngine();
    linearStrategy = new Linear5x5Strategy();
    progressionEngine.registerStrategy("Linear5x5", linearStrategy);

    mockUser = { id: "1", name: "Test User", level: TrainingLevel.Beginner };
  });

  const exerciseName = "Squat";

  it("should suggest starting values when no history exists", () => {
    const history: Session[] = [];
    const suggestion = progressionEngine.suggestProgression(
      "Linear5x5",
      history,
      exerciseName,
      mockUser
    );

    expect(suggestion).toBeDefined();
    expect(suggestion?.suggestedRepetitions).toBe(5);
    expect(suggestion?.suggestedSets).toBe(5);
    expect(suggestion?.notes).toContain("No history found");
  });

  it("should suggest increasing load after a successful session", () => {
    const history: Session[] = [
      {
        sessionNumber: 1,
        exercises: [
          { name: exerciseName, sets: [{ reps: 5, weight: 100 }, { reps: 5, weight: 100 }, { reps: 5, weight: 100 }, { reps: 5, weight: 100 }, { reps: 5, weight: 100 }] }
        ],
      },
    ];

    const suggestion = progressionEngine.suggestProgression(
      "Linear5x5",
      history,
      exerciseName,
      mockUser
    );

    expect(suggestion).toBeDefined();
    expect(suggestion?.suggestedWeight).toBeCloseTo(100 * (1 + 0.05));
    expect(suggestion?.notes).toContain("Increased load");
  });

  it("should maintain load after one failed session (not consecutive failures)", () => {
    const history: Session[] = [
      {
        sessionNumber: 1,
        exercises: [
          { name: exerciseName, sets: [{ reps: 5, weight: 100 }, { reps: 5, weight: 100 }, { reps: 5, weight: 100 }, { reps: 5, weight: 100 }, { reps: 5, weight: 100 }] }
        ],
      },
      {
        sessionNumber: 2,
        exercises: [
          { name: exerciseName, sets: [{ reps: 5, weight: 105 }, { reps: 5, weight: 105 }, { reps: 4, weight: 105, repsFailed: 1 }, { reps: 5, weight: 105 }, { reps: 5, weight: 105 }] }
        ],
      },
    ];

    const suggestion = progressionEngine.suggestProgression(
      "Linear5x5",
      history,
      exerciseName,
      mockUser
    );

    expect(suggestion).toBeDefined();
    expect(suggestion?.suggestedWeight).toBeCloseTo(105);
    expect(suggestion?.notes).toContain("Maintain current load");
  });

  it("should suggest decreasing load after two consecutive failed sessions", () => {
    const history: Session[] = [
      {
        sessionNumber: 1,
        exercises: [
          { name: exerciseName, sets: [{ reps: 5, weight: 100 }, { reps: 5, weight: 100 }, { reps: 5, weight: 100 }, { reps: 5, weight: 100 }, { reps: 5, weight: 100 }] }
        ],
      },
      {
        sessionNumber: 2,
        exercises: [
          { name: exerciseName, sets: [{ reps: 5, weight: 105 }, { reps: 5, weight: 105 }, { reps: 4, weight: 105, repsFailed: 1 }, { reps: 5, weight: 105 }, { reps: 5, weight: 105 }] }
        ],
      },
      {
        sessionNumber: 3,
        exercises: [
          { name: exerciseName, sets: [{ reps: 5, weight: 105 }, { reps: 4, weight: 105, repsFailed: 1 }, { reps: 4, weight: 105, repsFailed: 1 }, { reps: 4, weight: 105, repsFailed: 1 }, { reps: 4, weight: 105, repsFailed: 1 }] }
        ],
      },
    ];

    const suggestion = progressionEngine.suggestProgression(
      "Linear5x5",
      history,
      exerciseName,
      mockUser
    );

    expect(suggestion).toBeDefined();
    expect(suggestion?.suggestedWeight).toBeCloseTo(105 * (1 - 0.10));
    expect(suggestion?.notes).toContain("Reduced load");
  });

  it("should suggest increasing load after a successful session following failures", () => {
    const history: Session[] = [
      {
        sessionNumber: 1,
        exercises: [
          { name: exerciseName, sets: [{ reps: 5, weight: 100 }, { reps: 5, weight: 100 }, { reps: 5, weight: 100 }, { reps: 5, weight: 100 }, { reps: 5, weight: 100 }] }
        ],
      },
      {
        sessionNumber: 2,
        exercises: [
          { name: exerciseName, sets: [{ reps: 5, weight: 105 }, { reps: 5, weight: 105 }, { reps: 4, weight: 105, repsFailed: 1 }, { reps: 5, weight: 105 }, { reps: 5, weight: 105 }] }
        ],
      },
      {
        sessionNumber: 3,
        exercises: [
          { name: exerciseName, sets: [{ reps: 5, weight: 105 }, { reps: 4, weight: 105, repsFailed: 1 }, { reps: 4, weight: 105, repsFailed: 1 }, { reps: 4, weight: 105, repsFailed: 1 }, { reps: 4, weight: 105, repsFailed: 1 }] }
        ],
      },
      {
        sessionNumber: 4,
        exercises: [
          { name: exerciseName, sets: [{ reps: 5, weight: 94.5 }, { reps: 5, weight: 94.5 }, { reps: 5, weight: 94.5 }, { reps: 5, weight: 94.5 }, { reps: 5, weight: 94.5 }] }
        ],
      },
    ];

    const suggestion = progressionEngine.suggestProgression(
      "Linear5x5",
      history,
      exerciseName,
      mockUser
    );

    expect(suggestion).toBeDefined();
    expect(suggestion?.suggestedWeight).toBeCloseTo(94.5 * (1 + 0.05));
    expect(suggestion?.notes).toContain("Increased load");
  });
});
