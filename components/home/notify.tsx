import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { globalFont } from '../../utils/const';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

const NotificationSettings = () => {
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  return (
    <View style={styles.container}>
          <Ionicons name="arrow-back" size={30} color="white" onPress={() => navigation.goBack()} />

      <Text style={styles.header}>Thông Báo</Text>
      
      <View style={styles.setting}>
        <Text style={styles.text}>Nhắc nhở</Text>
        <Switch
          value={reminderEnabled}
          onValueChange={setReminderEnabled}
        />
      </View>

      <View style={styles.setting}>
        <Text style={styles.text}>Kèm âm thanh</Text>
        <Switch
          value={soundEnabled}
          onValueChange={setSoundEnabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    flex: 1,
    backgroundColor: '#02929A',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: globalFont,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    fontFamily: globalFont,

  },
  text: {
    fontSize: 16,
    color: '#000',
    fontFamily: globalFont,

  },
});

export default NotificationSettings;
