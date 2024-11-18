
import { StyleSheet, Text, View, Image, Button, TouchableOpacity } from "react-native"
import AppHeader from "../navigation/app.header"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { globalFont } from "../../utils/const";
import ModalLearnOrTeach from "../modal/modal.learnorteach";
import { useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e6f4f5',
    },
    boxchange: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 20,
        marginLeft: 20,
        padding: 10,
        backgroundColor: '#02929A',
        width: 200,
        borderRadius: 10
    },
    boxchangetext: {
        color: '#fff',
        fontFamily: globalFont
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333', // Darker color for the title text
        fontFamily: globalFont

    },
    description: {
        fontSize: 16,
        textAlign: 'justify',
        color: '#555', // Gray color for description text
        marginBottom: 30,
        fontFamily: globalFont

    },
    button: {
        backgroundColor: '#02929A', // Teal button color
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: globalFont
    },
    box: {
        display: 'flex',
        alignItems: 'center',
        marginHorizontal: 20,
    },
})
const TeachScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const navigation: NavigationProp<RootStackParamList> = useNavigation();

    return (
        <View style={styles.container}>
            <AppHeader />
            <TouchableOpacity style={styles.boxchange} onPress={() => setModalVisible(true)}>
                <FontAwesome name="graduation-cap" size={20} color="white" />
                <Text style={styles.boxchangetext}>Đang dạy</Text>
                <MaterialIcons name="arrow-drop-down" size={24} color="white" />
            </TouchableOpacity>
            <ModalLearnOrTeach
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
            />
            <View style={styles.box}>
                <Text style={styles.title}>Ở đây chưa có khóa học nào!</Text>
                <Text style={styles.description}>
                    Bạn vẫn chưa tạo ra một khóa học nào. Để tạo một khóa học, chia sẻ với bạn bè hoặc học viên và xem các thống kê, hãy nhấn vào nút bên dưới.
                </Text>
                <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate("CourseScreen")}>
                    <Text style={styles.buttonText}>Tạo khóa học</Text>
                </TouchableOpacity>
            </View>
        </View>

    )
}

export default TeachScreen;