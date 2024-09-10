import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';
import { globalFont } from './utils/const';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigation from './components/navigation/app.navigation';

SplashScreen.preventAutoHideAsync();

const App = () =>{
  const [loaded, error] = useFonts({
    [globalFont]: require('./assets/fonts/Poppins-Regular.ttf'),
  });
  useEffect(() => {
  if (loaded || error) {
  SplashScreen.hideAsync();
  }
  }, [loaded, error]);
  if (!loaded && !error) {
  return null;
  }
 

return (
  <NavigationContainer>  
     <AppNavigation />
  </NavigationContainer>
)
}


const styles = StyleSheet.create({
  container: {

    
  },
});

export default App;