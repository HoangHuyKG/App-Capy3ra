
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, Modal, Pressable } from "react-native"
import AppHeader from "../navigation/app.header"
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { globalFont } from "../../utils/const";
import { NavigationProp, useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E0F2F1',
      },
     
      buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
      modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        height: '100%',
      },
      modalContainer: {
        width: 317,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        elevation: 10, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
      },
      modalItem: {
        paddingVertical: 10,
        alignItems: 'center',

        width: '100%',
      },
      modalItem2: {
        paddingVertical: 10,
        alignItems: 'center',

        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
      },
      modalText: {
        fontSize: 16,
        color: '#333',
        fontFamily: globalFont,
      },
      modalTextRed: {
        fontSize: 16,
        color: '#FF3B30',
        fontFamily: globalFont,
        fontWeight: 'bold'
      },
})
interface Iprops {
    modalVisible: boolean;
    setModalVisible: (v: boolean) => void;
}
const ModalMenu = (props: Iprops) => {
    const navigation: NavigationProp<RootStackParamList> = useNavigation();

    const {modalVisible, setModalVisible} = props;
    return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={()=>setModalVisible(false)}>
          <View style={styles.modalContainer}>
            {/* Modal Options */}
            <TouchableOpacity style={styles.modalItem} onPress={()=>navigation.navigate("DetailCourseScreen")}>
              <Text style={styles.modalText}>Chi tiết khóa học</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalItem2} onPress={()=>navigation.navigate("Leaderboard")}>
              <Text style={styles.modalText}>Bảng xếp hạng</Text>
            </TouchableOpacity>

            {/* Red Text Option */}
            <TouchableOpacity style={styles.modalItem}>
              <Text style={styles.modalTextRed}>Rời khóa học</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

    )
}

export default ModalMenu;