import React from 'react';
import { View } from 'react-native';
import { Card, Text } from 'react-native-paper';

const ProfileScreen = () => {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Card>
        <Card.Content>
          <Text>Profile Screen</Text>
        </Card.Content>
      </Card>
    </View>
  );
};

export default ProfileScreen;
