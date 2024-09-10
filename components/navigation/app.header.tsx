import { StyleSheet, Text, View, Image, Button, TouchableOpacity } from "react-native"
import Octicons from '@expo/vector-icons/Octicons';
import { ImagesAssets } from "../../assets/images/ImagesAssets";
import { NavigationProp, useNavigation } from "@react-navigation/native";
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
    return (
        <View style={styles.container}>
            <View style={styles.menu} >
                <Octicons name="stack" size={30} color="black"  onPress={()=>navigation.openDrawer()}/>
            </View>
            <Image
                style={styles.imagelogo}
                source={ImagesAssets.imagelogo}
            />
            <Image
                style={styles.imageuser}
                source={ImagesAssets.unknowuser}
            />
        </View>
    )
}

export default AppHeader;