import { RoutineGeneratorService } from "../RoutineGenerator";
import { TrainingObjective, TrainingLevel, UserConfig, Set, Exercise, MovementPattern } from "../../types";
import { Microcycle, TrainingPlan, Session, Mesocycle } from "../../entities/TrainingPlan";
import { User } from "../../entities/User";
import { ILogger, LogLevel } from "../../interfaces/ILogger";

export class RoutineGeneratorServiceImpl implements RoutineGeneratorService {
  constructor(private readonly logger: ILogger) {}

  generateRoutine(userConfig: UserConfig, user: User): TrainingPlan {
    this.logger.log(LogLevel.SUCCESS, "Generating routine", { userConfig, user });
    const mesocycles: Mesocycle[] = [];

    if (userConfig.trainingObjective === TrainingObjective.Strength) {
      // Strength routine logic
      // Accumulation (6 weeks)
      mesocycles.push(this.generateStrengthBlock(userConfig, user, 6, "Accumulation", 0.50, 0.65)); // 50-65% volume
      // Intensification (4 weeks)
      mesocycles.push(this.generateStrengthBlock(userConfig, user, 4, "Intensification", 0.65, 0.75)); // 65-75% volume
      // Realization/Tapering (2 weeks)
      mesocycles.push(this.generateStrengthBlock(userConfig, user, 2, "Realization/Tapering", 0.40, 0.50)); // 40-50% volume (deload)

    } else if (userConfig.trainingObjective === TrainingObjective.Hypertrophy) {
      // Hypertrophy routine logic
      // Accumulation (6 weeks)
      mesocycles.push(this.generateHypertrophyBlock(userConfig, user, 6, "Accumulation"));
      // Intensification (4 weeks)
      mesocycles.push(this.generateHypertrophyBlock(userConfig, user, 4, "Intensification"));
      // Realization/Tapering (2 weeks)
      mesocycles.push(this.generateHypertrophyBlock(userConfig, user, 2, "Realization/Tapering", true)); // Deload
    }

    return {
      objective: userConfig.trainingObjective,
      mesocycles: mesocycles,
    };
  }

  private generateStrengthBlock(userConfig: UserConfig, user: User, weeks: number, blockName: string, minVolume: number, maxVolume: number): Mesocycle {
    const microcycles: Microcycle[] = [];
    for (let i = 1; i <= weeks; i++) {
      const sessions: Session[] = [];
      // For simplicity, let's assume 3 sessions per week for strength for now
      for (let j = 1; j <= 3; j++) {
        sessions.push({
          sessionNumber: j,
          exercises: [
            { name: "Squats", sets: [{ reps: 5, weight: 100 * (minVolume + (maxVolume - minVolume) * (i / weeks)) }], movementPattern: MovementPattern.Squat },
            { name: "Bench Press", sets: [{ reps: 5, weight: 80 * (minVolume + (maxVolume - minVolume) * (i / weeks)) }], movementPattern: MovementPattern.PushHorizontal },
            { name: "Deadlifts", sets: [{ reps: 3, weight: 120 * (minVolume + (maxVolume - minVolume) * (i / weeks)) }], movementPattern: MovementPattern.Hinge },
          ],
        });
      }
      microcycles.push({ weekNumber: i, sessions: sessions });
    }
    return { mesocycleNumber: 1, microcycles: microcycles }; // Placeholder mesocycleNumber
  }

  private generateHypertrophyBlock(userConfig: UserConfig, user: User, weeks: number, blockName: string, isDeload: boolean = false): Mesocycle {
    const microcycles: Microcycle[] = [];
    for (let i = 1; i <= weeks; i++) {
      const sessions: Session[] = [];
      // For simplicity, let's assume 4 sessions per week for hypertrophy for now
      for (let j = 1; j <= 4; j++) {
        let exercises: Exercise[] = [];

        if (isDeload && j === 4) {
          // Fourth session of a deload week
          exercises = []; // Empty exercises for deload
        } else {
          // Hypertrophy exercises (1-2 compounds + 1-3 isolation per group, 6-12 reps, 10-20 series/week)
          exercises.push({ name: "Incline Dumbbell Press", sets: this.generateSets(8, 12, 3, 50), movementPattern: MovementPattern.PushHorizontal });
          exercises.push({ name: "Lateral Raises", sets: this.generateSets(10, 15, 3, 10), movementPattern: MovementPattern.IsolationArm });
          exercises.push({ name: "Squats", sets: this.generateSets(6, 10, 4, 80), movementPattern: MovementPattern.Squat });
        }

        sessions.push({
          sessionNumber: j,
          exercises: exercises,
          isDeload: (isDeload && j === 4) // Mark deload session
        });
      }
      microcycles.push({ weekNumber: i, sessions: sessions });
    }
    return { mesocycleNumber: 1, microcycles: microcycles }; // Placeholder mesocycleNumber
  }

  private generateSets(minReps: number, maxReps: number, numSets: number, baseWeight: number): Set[] {
    const sets: Set[] = [];
    for (let i = 0; i < numSets; i++) {
      sets.push({
        reps: Math.floor(Math.random() * (maxReps - minReps + 1)) + minReps,
        weight: baseWeight,
      });
    }
    return sets;
  }
}
