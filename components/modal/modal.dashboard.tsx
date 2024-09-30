
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, Modal, Pressable } from "react-native"
import AppHeader from "../navigation/app.header"
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { globalFont } from "../../utils/const";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons'; // Use this for the close icon or icons
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E0F2F1',
      },
      openButton: {
        backgroundColor: '#26A69A',
        padding: 15,
        borderRadius: 25,
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: globalFont
      },
      modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
      },
      modalContainer: {
        width: 317,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000', 
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 10, // For Android shadow
      },
      closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
      },
      title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: globalFont

      },
      subtitle: {
        fontSize: 16,
        marginBottom: 20,
        color: '#555',
        fontFamily: globalFont

      },
      mainButton: {
        backgroundColor: '#26A69A',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
        marginBottom: 20,
      },
      mainButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: globalFont

      },
      secondaryText: {
        fontSize: 14,
        marginBottom: 15,
        color: '#555',
        fontFamily: globalFont

      },
      iconButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
      },
      iconButton: {
        alignItems: 'center',
        marginHorizontal: 10,
      },
      iconText: {
        fontSize: 10,
        marginTop: 5,
        color: '#333',
        fontFamily: globalFont

      },
})
interface Iprops {
    modalVisible: boolean;
    setModalVisible: (v: boolean) => void;
}
const ModalDashBoard = (props: Iprops) => {

    const {modalVisible, setModalVisible} = props;
    return (
        <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <MaterialIcons name="close" size={24} color="#555" />
            </TouchableOpacity>

            {/* Modal Content */}
            <Text style={styles.title}>Bộ từ vựng BB</Text>
            <Text style={styles.subtitle}>Tiếp theo dành cho bạn</Text>

            {/* Main Button */}
            <TouchableOpacity style={styles.mainButton}>
              <Text style={styles.mainButtonText}>Ôn Siêu Tốc</Text>
            </TouchableOpacity>

            <Text style={styles.secondaryText}>Hoặc chọn bài học của bạn</Text>

            {/* Icon Buttons */}
            <View style={styles.iconButtons}>
              <View style={styles.iconButton}>
                <MaterialIcons name="book" size={24} color="#333" />
                <Text style={styles.iconText}>Học từ mới</Text>
              </View>
              <View style={styles.iconButton}>
                <MaterialIcons name="water-drop" size={24} color="#333" />
                <Text style={styles.iconText}>Ôn tập thông thường</Text>
              </View>
              <View style={styles.iconButton}>
                <MaterialIcons name="timer" size={24} color="#333" />
                <Text style={styles.iconText}>Ôn siêu tốc</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>

    )
}

export default ModalDashBoard;