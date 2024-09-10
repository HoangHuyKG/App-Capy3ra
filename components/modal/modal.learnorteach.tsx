
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, Modal, Pressable } from "react-native"
import AppHeader from "../navigation/app.header"
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { globalFont } from "../../utils/const";
import { NavigationProp, useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }, 
      modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      },
      modalView: {
        width: 250,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
      },
      modalText: {
        fontFamily: globalFont,
        marginLeft: 10,
        fontSize: 16,
      },
})
interface Iprops {
    modalVisible: boolean;
    setModalVisible: (v: boolean) => void;
}
const ModalLearnOrTeach = (props: Iprops) => {
    const navigation: NavigationProp<RootStackParamList> = useNavigation();

    const {modalVisible, setModalVisible} = props;
    return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable  style={styles.modalOverlay} onPress={()=>setModalVisible(false)}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.modalOption} onPress={()=> navigation.navigate("HomeScreen")}>
            <Entypo name="book" size={24} color="black" />
              <Text style={styles.modalText}>Đang học</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={()=> navigation.navigate("TeachScreen")}>
            <FontAwesome5 name="chalkboard-teacher" size={24} color="black" />
              <Text style={styles.modalText}>Đang dạy</Text>
            </TouchableOpacity>
          </View>
        </Pressable >
      </Modal>

    )
}

export default ModalLearnOrTeach;