import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from '../login/login';
import TeachScreen from '../home/teachscreen';
import CourseScreen from '../home/coursescreen';
import StartedLoginScreen from '../login/startlogin';
import HomeScreen from '../home/homescreen';
import SettingScreen from '../home/setting';
import EditProfileScreen from '../home/editinfo';
import LanguageSelection from '../home/languages';
import NotificationSettings from '../home/notify';
import SettingLearningScreen from '../home/settinglearning';
import DetailCourseScreen from '../home/coursedetail';
import Leaderboard from '../home/leaderboard';
import DetailVocabularyDay from '../home/detailvocabularyday';
import CreateCourseScreen from '../home/createcourse';
import ReviewCourseScreen from '../home/reviewcourse';
import EditVocabularyScreen from '../home/editvocalbulary';
import editcourevocalbulary from '../home/editcourevocalbulary';
import Editcourevocalbulary from '../home/editcourevocalbulary';
import EditCourse from '../home/editcourse';


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
      <Stack.Screen name="SettingScreen" component={SettingScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="LanguageSelection" component={LanguageSelection} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
      <Stack.Screen name="SettingLearningScreen" component={SettingLearningScreen} />
      <Stack.Screen name="DetailCourseScreen" component={DetailCourseScreen} />
      <Stack.Screen name="Leaderboard" component={Leaderboard} />
      <Stack.Screen name="DetailVocabularyDay" component={DetailVocabularyDay} />
      <Stack.Screen name="CreateCourseScreen" component={CreateCourseScreen} />
      <Stack.Screen name="ReviewCourseScreen" component={ReviewCourseScreen} />
      <Stack.Screen name="EditVocabularyScreen" component={EditVocabularyScreen} />
      <Stack.Screen name="Editcourevocalbulary" component={Editcourevocalbulary} />
      <Stack.Screen name="CourseScreen" component={CourseScreen} />
      <Stack.Screen name="EditCourse" component={EditCourse} />

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
