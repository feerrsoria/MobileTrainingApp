import React from 'react';
import { View, Text, Button } from 'react-native';

const OnboardingScreen = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to the Training App!</Text>
      <Text>Let's create your first routine.</Text>
      <Button title="Get Started" onPress={onComplete} />
    </View>
  );
};

export default OnboardingScreen;