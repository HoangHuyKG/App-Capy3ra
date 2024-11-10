import { StyleSheet, Text, View, TouchableOpacity, Modal, Pressable, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../fireBaseConfig';
import { globalFont } from "../../utils/const";

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
      elevation: 10,
      shadowColor: '#000',
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
      fontWeight: 'bold',
  },
});

interface Iprops {
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  courseId: string | null;
  userId: string;
}

const ModalMenu = ({ modalVisible, setModalVisible, courseId, userId }: Iprops) => {
  const navigation = useNavigation();

  // Hàm xử lý rời khóa học
  const leaveCourse = async () => {
    if (!courseId || !userId) {
      Alert.alert("Lỗi", "Thiếu thông tin cần thiết.");
      return;
    }

    try {
      const userCourseRef = collection(db, "User_Course");
      const q = query(userCourseRef, where("user_id", "==", userId), where("course_id", "==", courseId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Thông báo", "Không tìm thấy khóa học để rời.");
        return;
      }

      // Xóa tất cả các tài liệu tìm thấy
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      Alert.alert("Thông báo", "Bạn đã rời khỏi khóa học thành công.");
      setModalVisible(false); // Đóng modal sau khi hoàn tất

    } catch (error) {
      console.error("Lỗi khi rời khóa học:", error);
      Alert.alert("Lỗi", "Không thể rời khóa học. Vui lòng thử lại.");
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          {/* Modal Options */}
          <TouchableOpacity
            style={styles.modalItem}
            onPress={() => {
              setModalVisible(false);
              navigation.navigate("ReviewCourseScreen", { courseId });
            }}
          >
            <Text style={styles.modalText}>Chi tiết khóa học</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalItem2}
            onPress={() => {
              setModalVisible(false);
              navigation.navigate("Leaderboard");
            }}
          >
            <Text style={styles.modalText}>Bảng xếp hạng</Text>
          </TouchableOpacity>

          {/* Red Text Option */}
          <TouchableOpacity style={styles.modalItem} onPress={leaveCourse}>
            <Text style={styles.modalTextRed}>Rời khóa học</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

export default ModalMenu;
