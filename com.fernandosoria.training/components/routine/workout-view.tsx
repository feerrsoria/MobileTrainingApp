import React, { useState } from 'react';
import { View } from 'react-native';
import { Appbar, Button, Card, Divider, List, Text, TextInput } from 'react-native-paper';
import { Exercise, Set, UserConfig } from '@/src/domain/types';
import { TrainingPlan } from '@/src/domain/entities/TrainingPlan';
import { TonnageCalculatorServiceImpl } from '@/src/domain/services/implementations/TonnageCalculatorServiceImpl';
import { Weight } from '@/src/domain/valueObjects/Weight';
import { ProgressionEngine } from '@/src/domain/services/ProgressionEngine';
import { Linear5x5Strategy } from '@/src/domain/services/progressionStrategies/Linear5x5Strategy';
import { WaveOndulantStrategy } from '@/src/domain/services/progressionStrategies/WaveOndulantStrategy';
import { AppLogger } from '@/src/infrastructure/services/AppLogger';

interface WorkoutViewProps {
  trainingPlan: TrainingPlan;
  userConfig: UserConfig;
}

const WorkoutView: React.FC<WorkoutViewProps> = ({ trainingPlan, userConfig }) => {
  const logger = new AppLogger();
  const tonnageCalculator = new TonnageCalculatorServiceImpl(logger);
  const progressionEngine = new ProgressionEngine();
  progressionEngine.registerStrategy("Linear5x5", new Linear5x5Strategy());
  progressionEngine.registerStrategy("WaveOndulant", new WaveOndulantStrategy());

  const [currentSets, setCurrentSets] = useState<{ [exerciseName: string]: { weight: string, reps: string, rpe: string }[] }>({});

  const currentSession = trainingPlan.mesocycles[0]?.microcycles[0]?.sessions[0];

  const handleSetChange = (exerciseName: string, setIndex: number, field: string, value: string) => {
    setCurrentSets(prev => ({
      ...prev,
      [exerciseName]: [
        ...(prev[exerciseName] || []),
        { ...((prev[exerciseName] || [])[setIndex] || {}), [field]: value },
      ],
    }));
  };

  const calculateTonnage = (exerciseName: string) => {
    if (!currentSets[exerciseName]) return 0;
    return currentSets[exerciseName].reduce((total, set) => {
      const weight = Weight.fromKg(parseFloat(set.weight) || 0);
      return total + tonnageCalculator.calculateTonnage(weight, parseInt(set.reps) || 0, 1);
    }, 0);
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Workout" />
      </Appbar.Header>
      <View style={{ padding: 16 }}>
        {currentSession ? (
          <Card>
            <Card.Title title={`Day ${currentSession.sessionNumber}`} />
            <Card.Content>
              <List.Section>
                {currentSession.exercises.map((exercise: Exercise, idx: number) => (
                  <List.Accordion
                    key={idx}
                    title={exercise.name}
                    description={`Tonnage: ${calculateTonnage(exercise.name).toFixed(2)}`}
                    left={(props: any) => <List.Icon {...props} icon="weight-lifter" />}
                  >
                    {exercise.sets.map((set: Set, setIdx: number) => (
                      <View key={setIdx} style={{ padding: 8 }}>
                        <TextInput
                          label="Weight"
                          value={currentSets[exercise.name]?.[setIdx]?.weight || ''}
                          onChangeText={text => handleSetChange(exercise.name, setIdx, 'weight', text)}
                          keyboardType="numeric"
                        />
                        <TextInput
                          label="Reps"
                          value={currentSets[exercise.name]?.[setIdx]?.reps || ''}
                          onChangeText={text => handleSetChange(exercise.name, setIdx, 'reps', text)}
                          keyboardType="numeric"
                        />
                        <TextInput
                          label="RPE"
                          value={currentSets[exercise.name]?.[setIdx]?.rpe || ''}
                          onChangeText={text => handleSetChange(exercise.name, setIdx, 'rpe', text)}
                          keyboardType="numeric"
                        />
                        <Divider style={{ marginVertical: 8 }} />
                      </View>
                    ))}
                    <Button mode="contained" onPress={() => {
                      if (currentSession && userConfig) {
                        const suggestion = progressionEngine.suggestProgression(
                          userConfig.trainingObjective === "Strength" ? "Linear5x5" : "WaveOndulant",
                          trainingPlan.mesocycles[0]?.microcycles[0]?.sessions || [],
                          exercise.name,
                          {
                            id: userConfig.id,
                            name: userConfig.name,
                            level: userConfig.trainingLevel,
                          }
                        );
                        if (suggestion) {
                          alert(`Next time for ${exercise.name}: ${suggestion.suggestedRepetitions} reps at ${suggestion.suggestedWeight}kg`);
                        } else {
                          alert("No progression suggestion available.");
                        }
                      }
                    }}>
                      Complete Workout
                    </Button>
                  </List.Accordion>
                ))}
              </List.Section>
            </Card.Content>
          </Card>
        ) : (
          <Text>No workout scheduled for today.</Text>
        )}
      </View>
    </View>
  );
};

export default WorkoutView;
