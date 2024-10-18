
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, ScrollView } from "react-native"
import AppHeader from "../navigation/app.header"
import { globalFont } from "../../utils/const"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ItemHome from "./itemhome";
import { FlatList } from "react-native-gesture-handler";
import ModalLearnOrTeach from "../modal/modal.learnorteach";
import { useState } from "react";
import { useRoute } from '@react-navigation/native';
import ModalMenu from "../modal/modal.menu";
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
    boxitem: {
        display: 'flex',
        flex: 1,
        overflow: 'scroll'
    }
})
const HomeScreen = () => {
const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={styles.container}>
            <AppHeader />
            <TouchableOpacity style={styles.boxchange} onPress={()=>setModalVisible(true)}>
                <FontAwesome name="graduation-cap" size={20} color="white" />
                <Text style={styles.boxchangetext}>Đang học</Text>
                <MaterialIcons name="arrow-drop-down" size={24} color="white" />
            </TouchableOpacity>
            <ScrollView style={styles.boxitem}>
                    <ItemHome />
                    <ItemHome />
                    <ItemHome />
                    <ItemHome />
                    <ItemHome />
                
            </ScrollView>
            <ModalLearnOrTeach
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
            />
            
        </View>

    )
}

export default HomeScreen;