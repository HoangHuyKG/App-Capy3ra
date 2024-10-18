import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { globalFont } from './utils/const';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './components/home/UserContext';
import AppNavigation from './components/navigation/app.navigation';

SplashScreen.preventAutoHideAsync();

const App = () => {
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
    <UserProvider>

      <NavigationContainer>
        <AppNavigation />
      </NavigationContainer>
    </UserProvider>
  )
}


const styles = StyleSheet.create({
  container: {


  },
});
// web: 1043874943091-q6sc9588lul637gjhqhinq0vlg4923sc.apps.googleusercontent.com
// ios: 1043874943091-13abkutjv0ediq8ndmcc0huf1d62o17c.apps.googleusercontent.com
// ad: 1043874943091-d6i0sbn8uotoctsrl1nl1codpa6jt87n.apps.googleusercontent.com
export default App;