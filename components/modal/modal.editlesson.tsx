import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { globalFont } from '../../utils/const';
import { db } from '../../fireBaseConfig'; // Import cấu hình Firebase
import { collection, query, where, onSnapshot, setDoc, doc } from 'firebase/firestore';

const EditLessonModal = ({ modalVisible, setModalVisible }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lessons, setLessons] = useState([]);


  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Sửa bài học</Text>
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
            <Button mode="contained"  style={styles.button}>
              <Text style={styles.buttontext}>Sửa</Text>
            </Button>
            <Button mode="contained"  style={styles.button}>
              <Text style={styles.buttontext}>Xóa</Text>
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

export default EditLessonModal;
