import { StyleSheet, Text, View, Image, Button, TouchableOpacity } from "react-native"
import { ImagesAssets } from "../../assets/images/ImagesAssets"
import { globalFont } from "../../utils/const"
import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationProp, useNavigation } from "@react-navigation/native";

ImagesAssets
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
    
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.boxlogin} onPress={()=> navigation.navigate("HomeScreen")}>
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