import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { globalFont } from '../../utils/const';

const AddLessonModal = ({ modalVisible, setModalVisible }) => {
  const [lessonId, setLessonId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAddLesson = () => {
    if (lessonId && courseId && title && description) {
      // Logic xử lý thêm bài học (lưu trữ local hoặc xử lý khác)
      console.log({
        lessonId,
        courseId,
        title,
        description,
      });
      setModalVisible(false);
      setLessonId('');
      setCourseId('');
      setTitle('');
      setDescription('');
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
            placeholder="Mã bài học"
            value={lessonId}
            onChangeText={setLessonId}
          />
          <TextInput
            style={styles.input}
            placeholder="Mã khóa học"
            value={courseId}
            onChangeText={setCourseId}
          />
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
});

export default AddLessonModal;
