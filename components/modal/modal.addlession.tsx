import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { globalFont } from '../../utils/const';
import { db } from '../../fireBaseConfig'; // Import cấu hình Firebase
import { collection, query, where, onSnapshot, setDoc, doc } from 'firebase/firestore';

const AddLessonModal = ({ modalVisible, setModalVisible, courseId }) => {
  const [title, setTitle] = useState('');
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
    if (title && courseId && description) {
      try {
        // Tạo ID bài học tự động
        const lessonId = `lesson_${Date.now()}`;
  
        // Dữ liệu bài học, bao gồm lessonId
        const lessonData = {
          lessonId,  // Thêm lessonId vào dữ liệu
          courseId,  // Sử dụng courseId từ props
          title,
          description,
          createdAt: new Date(), // Thêm trường createdAt nếu cần
        };
  
        // Thêm tài liệu vào Firestore với ID cụ thể
        await setDoc(doc(db, 'Lessons', lessonId), lessonData);
  
        // Đóng modal và reset trường nhập liệu
        setModalVisible(false);
        setTitle('');
        setDescription('');
      } catch (error) {
        alert('Lỗi khi thêm bài học: ' + error.message);
      }
    } else {
      alert('Vui lòng điền đầy đủ thông tin');
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
