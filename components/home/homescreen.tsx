import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import AppHeader from "../navigation/app.header";
import { globalFont } from "../../utils/const";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ItemHome from "./itemhome";
import ModalLearnOrTeach from "../modal/modal.learnorteach";
import { useState } from "react";
import { useUser } from "./UserContext"; // Import useUser hook

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
        borderRadius: 10,
    },
    boxchangetext: {
        color: '#fff',
        fontFamily: globalFont,
    },
    boxitem: {
        display: 'flex',
        flex: 1,
        overflow: 'scroll',
    },
});

const HomeScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const { userInfo } = useUser(); // Lấy thông tin người dùng từ UserContext
    const userId = userInfo?.data?.user?.id; // Lấy userId từ userInfo

    return (
        <View style={styles.container}>
            <AppHeader />
            <TouchableOpacity
                style={styles.boxchange}
                onPress={() => setModalVisible(true)}
            >
                <FontAwesome name="graduation-cap" size={20} color="white" />
                <Text style={styles.boxchangetext}>Đang học</Text>
                <MaterialIcons name="arrow-drop-down" size={24} color="white" />
            </TouchableOpacity>
            <ScrollView style={styles.boxitem}>
                {/* Truyền userId vào ItemHome */}
                <ItemHome userId={userId} />
            </ScrollView>
            <ModalLearnOrTeach
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
            />
        </View>
    );
};

export default HomeScreen;
