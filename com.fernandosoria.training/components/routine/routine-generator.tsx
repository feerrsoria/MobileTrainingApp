import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Card, RadioButton, Text, TextInput } from 'react-native-paper';
import { TrainingObjective, TrainingLevel } from '@/src/domain/types';
import { User } from '@/src/domain/entities/User';
import { UserConfig } from '@/src/domain/types';
import { RoutineGeneratorServiceImpl } from '@/src/domain/services/implementations/RoutineGeneratorServiceImpl';
import { AppLogger } from '@/src/infrastructure/services/AppLogger';
import { LogLevel } from '@/src/domain/interfaces/ILogger';
import { SQLiteRepository } from '@/src/infrastructure/repositories/SQLiteRepository';
import { router } from 'expo-router';

const RoutineGenerator = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
const [trainingObjective, setTrainingObjective] = useState<TrainingObjective>(TrainingObjective.Strength);
const [trainingLevel, setTrainingLevel] = useState<TrainingLevel>(TrainingLevel.Beginner);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleGenerateRoutine = async () => {
    if (name && trainingObjective && trainingLevel) {
      const user: User = { id: '1', name, level: trainingLevel };
      const userConfig: UserConfig = { id: '1', name, trainingObjective, trainingLevel };

      const logger = new AppLogger();
      const routineGenerator = new RoutineGeneratorServiceImpl(logger);
      const trainingPlan = routineGenerator.generateRoutine(userConfig, user);

      const repository = new SQLiteRepository();
      await repository.saveUserConfig(userConfig);
      await repository.saveTrainingPlan(trainingPlan);

      router.replace('/(tabs)');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {step === 1 && (
        <Card>
          <Card.Content>
            <Text>What is your name?</Text>
            <TextInput label="Name" value={name} onChangeText={setName} />
            <Button mode="contained" onPress={handleNext}>Next</Button>
          </Card.Content>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <Card.Content>
            <Text>What is your training goal?</Text>
            <RadioButton.Group onValueChange={(value) => setTrainingObjective(value as TrainingObjective)} value={trainingObjective}>
              <RadioButton.Item label="Strength" value={TrainingObjective.Strength} />
              <RadioButton.Item label="Hypertrophy" value={TrainingObjective.Hypertrophy} />
              <RadioButton.Item label="Endurance" value={TrainingObjective.Endurance} />
            </RadioButton.Group>
            <Button onPress={handlePrevious}>Previous</Button>
            <Button mode="contained" onPress={handleNext}>Next</Button>
          </Card.Content>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <Card.Content>
            <Text>What is your training level?</Text>
            <RadioButton.Group onValueChange={(value) => setTrainingLevel(value as TrainingLevel)} value={trainingLevel}>
              <RadioButton.Item label="Beginner" value={TrainingLevel.Beginner} />
              <RadioButton.Item label="Intermediate" value={TrainingLevel.Intermediate} />
              <RadioButton.Item label="Advanced" value={TrainingLevel.Advanced} />
            </RadioButton.Group>
            <Button onPress={handlePrevious}>Previous</Button>
            <Button mode="contained" onPress={handleGenerateRoutine}>Generate Routine</Button>
          </Card.Content>
        </Card>
      )}
    </View>
  );
};

export default RoutineGenerator;
