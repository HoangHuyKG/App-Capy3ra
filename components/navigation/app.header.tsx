import { StyleSheet, Text, View, Image, Button, TouchableOpacity } from "react-native"
import Octicons from '@expo/vector-icons/Octicons';
import { ImagesAssets } from "../../assets/images/ImagesAssets";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useUser } from "../home/UserContext";
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#02929A',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingTop: 20
    },
    imageuser: {
        height: 40,
        width: 40,
        backgroundColor: '#fff',
        borderRadius: 20
    },
    imagelogo: {
        height: 100,
        width: 100,
    },
    menu: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: 40,
        backgroundColor: '#fff',
        borderRadius: 20
    }
})
const AppHeader = () => {
    const navigation: any = useNavigation();
    const { userInfo } = useUser();
    console.log(userInfo)
    return (
        <View style={styles.container}>
            <View style={styles.menu} >
                <Octicons name="stack" size={30} color="black" onPress={() => navigation.openDrawer()} />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("HomeScreen", {userInfo})}>
                <Image
                    style={styles.imagelogo}
                    source={ImagesAssets.imagelogo}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("SettingScreen", {userInfo})}>
                <Image
                    style={styles.imageuser}
                    source={{ uri: userInfo?.data?.user?.photo}}

                />
            </TouchableOpacity>

        </View>
    )
}

export default AppHeader;