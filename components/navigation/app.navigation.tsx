import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from '../login/login';
import TeachScreen from '../home/teachscreen';
import CourseScreen from '../home/coursescreen';
import StartedLoginScreen from '../login/startlogin';
import HomeScreen from '../home/homescreen';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Step 1: Define the stack navigator
const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StartedLoginScreen" component={StartedLoginScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="TeachScreen" component={TeachScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
};

// Step 2: Use the stack navigator inside the drawer navigator
const AppNavigation = () => {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      {/* Use Stack Navigator as a screen in Drawer Navigator */}
      <Drawer.Screen name="Home" component={StackNavigator} options={{ title: "Trang chủ" }} />
      <Drawer.Screen name="CourseScreen" component={CourseScreen} options={{ title: "Các khóa học" }} />
    </Drawer.Navigator>
  );
};

export default AppNavigation;
