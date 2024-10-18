import { StyleSheet, Text, View, Image, Button, TouchableOpacity } from "react-native"
import { ImagesAssets } from "../../assets/images/ImagesAssets";
import AntDesign from '@expo/vector-icons/AntDesign';
import { globalFont } from "../../utils/const";
import { useNavigation } from '@react-navigation/native';
import {  NavigationProp } from '@react-navigation/native'
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native';
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        textAlign: 'center',
        backgroundColor: '#02929A',
        padding: 30
    },
    boxlogo: {
        marginTop: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        height: 300,
        width: 300,
    },
    boxtext: {

    },
    text: {
        fontSize: 30,
        fontFamily: globalFont,
        color: '#fff',
        fontWeight: 'bold',
    },
    boxtextinfo: {
        
        marginTop: 30,
    },
    boxtextinfodetail: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 20
    },
    textinfo: {
        fontSize: 14,
        fontFamily: globalFont,
        color: '#fff',
        marginLeft: 20

    },
    boxbutton: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f7',
        padding: 15,
        borderRadius: 10
    },
    buttonText: {
        fontSize: 16,
        color: '#000',
        textTransform: 'uppercase',
        fontWeight: 'bold',

    }
  });

const StartedLoginScreen = () => {
    const navigation: NavigationProp<RootStackParamList> = useNavigation();
    return (
       
        <SafeAreaView  style={styles.container}>
             <StatusBar barStyle="light-content" backgroundColor="#02929A" hidden={true}/>
            <View style={styles.boxlogo}>
                
            <Image
                style={styles.logo}
                source={ImagesAssets.imagelogo}
            />
            </View>
            <View>
            <Text  style={styles.text}>
                Điều làm cho
            </Text>
            <Text  style={styles.text}>
                Capy3ra khác biệt ? 
            </Text>
            </View>
            <View style={styles.boxtextinfo}>
                <View style={styles.boxtextinfodetail}>
                    <AntDesign name="bulb1" size={20} color="white" />
                    <Text style={styles.textinfo}>Học từ vựng liên quan đến đời sống.</Text>
                </View>
                <View style={styles.boxtextinfodetail}>
                    <AntDesign name="book" size={20} color="white" />
                    <Text style={styles.textinfo}>Nhớ lâu hơn, học nhanh hơn.</Text>
                </View>
                <View style={styles.boxtextinfodetail}>
                    <AntDesign name="earth" size={20} color="white" />
                    <Text style={styles.textinfo}>Học mọi lúc, học mọi nơi.</Text>
                </View>
            </View>
            <View style={styles.boxbutton}>
                <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate("LoginScreen")}>
                    <Text style={styles.buttonText}>Bắt đầu</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView >
    )
}

export default StartedLoginScreen;