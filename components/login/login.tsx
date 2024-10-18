import { StyleSheet, Text, View, Image, Button, TouchableOpacity } from "react-native"
import { ImagesAssets } from "../../assets/images/ImagesAssets"
import { globalFont } from "../../utils/const"
import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
    GoogleSignin,
    GoogleSigninButton,
    isErrorWithCode,
    statusCodes,
  } from '@react-native-google-signin/google-signin';
  GoogleSignin.configure({
    webClientId: '1043874943091-q6sc9588lul637gjhqhinq0vlg4923sc.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
    scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
    iosClientId: '1043874943091-13abkutjv0ediq8ndmcc0huf1d62o17c.apps.googleusercontent.com', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  });
  import { useUser } from '../home/UserContext.js';
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        backgroundColor: '#02929A',
        padding: 30
    },
    boxlogin: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20
    },
    boxloginfacebook: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20
    },
    imagelogin: {
        width: 30,
        height: 30
    },
    textlogin: {
        marginLeft: 20,
        fontSize: 16,
        fontFamily: globalFont
    },
    textloginfacebook: {
        color: '#fff',
        marginLeft: 20,
        fontSize: 16,
        fontFamily: globalFont
    },
    iconfacebook: {
        marginLeft: 20
    }
})


const LoginScreen = () => {
    const navigation: NavigationProp<RootStackParamList> = useNavigation();
    const { setUserInfo } = useUser();
    const signIn = async () => {

        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
            setUserInfo(userInfo);
            navigation.navigate("HomeScreen");
        } catch (error: any) {  
          if (isErrorWithCode(error)) {
            switch (error.code) {
              case statusCodes.SIGN_IN_CANCELLED:
                console.log("Error: ", error);
    
                break;
              case statusCodes.IN_PROGRESS:
                console.log("Error: ", error);
    
                break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    console.log("Error: ", error);
    
                    break;
              default:
                console.log("Error: ", error);
    
            }
          } else {
            console.log("Error: ", error);
    
          }
        }
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.boxlogin} onPress={signIn}>
            <Image
                source={ImagesAssets.imagegg}
                style={styles.imagelogin}
            />
            <Text  style={styles.textlogin}>Đăng nhập bằng Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.boxloginfacebook} onPress={()=> navigation.navigate("HomeScreen")}>
            <Ionicons name="logo-facebook" size={30} color="white" style={styles.iconfacebook} />
            <Text  style={styles.textloginfacebook}>Đăng nhập bằng Facebook</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LoginScreen;