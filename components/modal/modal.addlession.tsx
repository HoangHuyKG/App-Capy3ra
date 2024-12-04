import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { globalFont } from '../../utils/const';
import { db } from '../../fireBaseConfig'; // Import cấu hình Firebase
import { collection, query, where, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { useUser } from '../home/UserContext';

const AddLessonModal = ({ modalVisible, setModalVisible, courseId }) => {
  const { userInfo } = useUser();
  const currentUserId = userInfo?.data?.user?.id;
  const [title, setTitle] = useState('');
  const [idUser, setidUser] = useState(currentUserId);
  const [description, setDescription] = useState('');
  const [lessons, setLessons] = useState([]);
  
  // Lắng nghe real-time cho collection Lessons với courseId
  useEffect(() => {
    const lessonsRef = collection(db, 'Lessons');
    const q = query(lessonsRef, where('courseId', '==', courseId)); // Lấy bài học theo courseId

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lessonsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLessons(lessonsData);
    });

    return () => unsubscribe(); // Hủy đăng ký khi component unmount
  }, [courseId]); // Thêm courseId vào dependency array

  const handleAddLesson = async () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
  
    // Kiểm tra tiêu đề không được rỗng hoặc toàn khoảng trắng
    if (trimmedTitle.length === 0) {
      Alert.alert("Lỗi", "Tiêu đề không được chứa toàn khoảng cách, vui lòng nhập nội dung hợp lệ");
      return;
    }
  
    // Cho phép mô tả rỗng nhưng nếu có nội dung thì không được là khoảng trắng
    if (description.length > 0 && trimmedDescription.length === 0) {
      Alert.alert("Lỗi", "Mô tả không được chứa toàn khoảng cách, vui lòng nhập nội dung hợp lệ");
      return;
    }
  
    if (courseId) {
      try {
        // Tạo ID bài học tự động
        const lessonId = `lesson_${Date.now()}`;
  
        // Dữ liệu bài học
        const lessonData = {
          lessonId,
          courseId,
          idUser,
          title: trimmedTitle,
          description: trimmedDescription, // Sử dụng mô tả đã được xử lý
          createdAt: new Date(),
        };
  
        // Thêm tài liệu vào Firestore với ID cụ thể
        await setDoc(doc(db, 'Lessons', lessonId), lessonData);
  
        // Đóng modal và reset trường nhập liệu
        setModalVisible(false);
        setTitle('');
        setidUser('');
        setDescription('');
      } catch (error) {
        Alert.alert("Lỗi", "Lỗi khi thêm bài học: " + error.message);
      }
    } else {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
    }
  };
  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Thêm bài học</Text>
          <TextInput
            style={styles.input}
            placeholder="Tiêu đề bài học"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Mô tả bài học"
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            style={[styles.input, { display: 'none' }]}
            placeholder="idUser"
            value={currentUserId}
          />
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={handleAddLesson} style={styles.button}>
              <Text style={styles.buttontext}>Thêm</Text>
            </Button>
            <Button mode="outlined" onPress={() => setModalVisible(false)} style={styles.button}>
              <Text style={styles.buttontext}>Hủy</Text>
            </Button>
          </View>
          
       
         
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  buttontext: {
    fontFamily: globalFont,
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold"
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: "#02929A",
    flex: 1,
    marginHorizontal: 5,
  },
  lessonsContainer: {
    marginTop: 20,
    width: '100%',
  },
  lessonsTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  lessonItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  lessonTitle: {
    fontWeight: 'bold',
  },
});

export default AddLessonModal;
