import { ProgressionEngine } from "../services/ProgressionEngine";
import { WaveOndulantStrategy } from "../services/progressionStrategies/WaveOndulantStrategy";
import { Session } from "../entities/TrainingPlan";
import { User } from "../entities/User";
import { TrainingLevel } from "../types";

describe("WaveOndulantStrategy", () => {
  let progressionEngine: ProgressionEngine;
  let waveStrategy: WaveOndulantStrategy;
  let mockUser: User;

  beforeEach(() => {
    progressionEngine = new ProgressionEngine();
    waveStrategy = new WaveOndulantStrategy();
    progressionEngine.registerStrategy("WaveOndulant", waveStrategy);

    mockUser = { id: "1", name: "Test User", level: TrainingLevel.Beginner };
  });

  const exerciseName = "Deadlift";

  it("should suggest starting values for Week 1 when no history exists", () => {
    const history: Session[] = [];
    const suggestion = progressionEngine.suggestProgression(
      "WaveOndulant",
      history,
      exerciseName,
      mockUser
    );

    expect(suggestion).toBeDefined();
    expect(suggestion?.suggestedRepetitions).toBe(8);
    expect(suggestion?.suggestedSets).toBe(3);
    expect(suggestion?.notes).toContain("Start of a new wave cycle (Week 1: 8 reps).");
  });

  it("should progress through Week 1, 2, 3 with increasing load", () => {
    let history: Session[] = [];
    let suggestion;

    // Week 1
    history.push({
      sessionNumber: 1,
      exercises: [
        { name: exerciseName, sets: [{ reps: 8, weight: 100 }, { reps: 8, weight: 100 }, { reps: 8, weight: 100 }] }
      ],
    });
    suggestion = progressionEngine.suggestProgression("WaveOndulant", history, exerciseName, mockUser);
    expect(suggestion?.suggestedRepetitions).toBe(7); // Next is Week 2 reps
    expect(suggestion?.suggestedWeight).toBeCloseTo(100 * (1 + 0.025)); // Load increase
    expect(suggestion?.notes).toContain("Progressive week (Week 2: 7 reps).");

    // Week 2
    history.push({
      sessionNumber: 2,
      exercises: [
        { name: exerciseName, sets: [{ reps: 7, weight: 102.5 }, { reps: 7, weight: 102.5 }, { reps: 7, weight: 102.5 }] }
      ],
    });
    suggestion = progressionEngine.suggestProgression("WaveOndulant", history, exerciseName, mockUser);
    expect(suggestion?.suggestedRepetitions).toBe(6); // Next is Week 3 reps
    expect(suggestion?.suggestedWeight).toBeCloseTo(102.5 * (1 + 0.025)); // Load increase
    expect(suggestion?.notes).toContain("Progressive week (Week 3: 6 reps).");

    // Week 3
    history.push({
      sessionNumber: 3,
      exercises: [
        { name: exerciseName, sets: [{ reps: 6, weight: 105.0625 }, { reps: 6, weight: 105.0625 }, { reps: 6, weight: 105.0625 }] }
      ],
    });
    suggestion = progressionEngine.suggestProgression("WaveOndulant", history, exerciseName, mockUser);
    expect(suggestion?.suggestedRepetitions).toBe(6); // Next is Week 4 reps (deload)
    expect(suggestion?.suggestedWeight).toBeCloseTo(100); // Deload to Week 1 load
    expect(suggestion?.notes).toContain("Deload week (Week 4: 6 reps with Week 1 load).");
  });

  it("should start a new cycle after Week 4 deload", () => {
    let history: Session[] = [
      {
        sessionNumber: 1,
        exercises: [
          { name: exerciseName, sets: [{ reps: 8, weight: 100 }, { reps: 8, weight: 100 }, { reps: 8, weight: 100 }] }
        ],
      },
      {
        sessionNumber: 2,
        exercises: [
          { name: exerciseName, sets: [{ reps: 7, weight: 102.5 }, { reps: 7, weight: 102.5 }, { reps: 7, weight: 102.5 }] }
        ],
      },
      {
        sessionNumber: 3,
        exercises: [
          { name: exerciseName, sets: [{ reps: 6, weight: 105.0625 }, { reps: 6, weight: 105.0625 }, { reps: 6, weight: 105.0625 }] }
        ],
      },
      {
        sessionNumber: 4,
        exercises: [
          { name: exerciseName, sets: [{ reps: 6, weight: 100 }, { reps: 6, weight: 100 }, { reps: 6, weight: 100 }] }
        ],
      },
    ];

    const suggestion = progressionEngine.suggestProgression(
      "WaveOndulant",
      history,
      exerciseName,
      mockUser
    );

    expect(suggestion).toBeDefined();
    expect(suggestion?.suggestedRepetitions).toBe(8); // Start Week 1 reps again
    expect(suggestion?.suggestedWeight).toBeCloseTo(100 * (1 + 0.025)); // Load increase from previous cycle's week 3
    expect(suggestion?.notes).toContain("Progressive week (Week 1: 8 reps).");
  });
});
