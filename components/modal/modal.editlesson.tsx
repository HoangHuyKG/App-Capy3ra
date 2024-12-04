import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { globalFont } from '../../utils/const';
import { db } from '../../fireBaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { NavigationProp, useNavigation } from '@react-navigation/native';

const EditLessonModal = ({ modalVisible, setModalVisible, lessonId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  useEffect(() => {
    let unsubscribe;
    if (lessonId && modalVisible) {
      const lessonRef = doc(db, 'Lessons', lessonId);
      
      // Sử dụng onSnapshot để lắng nghe thay đổi real-time
      unsubscribe = onSnapshot(lessonRef, (lessonDoc) => {
        if (lessonDoc.exists()) {
          const lessonData = lessonDoc.data();
          setTitle(lessonData.title || '');
          setDescription(lessonData.description || '');
        } else {
        
          setModalVisible(false); // Đóng modal nếu bài học không tồn tại
        }
      });
    }
    
    // Clean up subscription khi component unmount hoặc modal đóng
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [lessonId, modalVisible]);

  const handleUpdateLesson = async () => {
    try {
      await setDoc(doc(db, 'Lessons', lessonId), { title, description }, { merge: true });
      Alert.alert('Cập nhật thành công');
      setModalVisible(false);
    } catch (error) {
      console.error('Lỗi khi cập nhật bài học: ', error);
      Alert.alert('Cập nhật thất bại');
    }
  };

  const handleDeleteLesson = async () => {
    if (!lessonId) {
      Alert.alert("Lỗi", "ID bài học không hợp lệ");
      return;
    }
  
    try {
      // Truy vấn các từ vựng liên quan đến bài học
      const vocabulariesRef = collection(db, 'Vocabularies');
      const q = query(vocabulariesRef, where('lessonId', '==', lessonId));
      const querySnapshot = await getDocs(q);
  
      // Xóa từng từ vựng
      const deleteVocabularyPromises = querySnapshot.docs.map((docSnapshot) =>
        deleteDoc(doc(db, 'Vocabularies', docSnapshot.id))
      );
      await Promise.all(deleteVocabularyPromises);
  
      // Xóa bài học sau khi xóa tất cả từ vựng
      await deleteDoc(doc(db, 'Lessons', lessonId));
  
      Alert.alert('Xóa bài học và từ vựng thành công');
      setModalVisible(false);
      navigation.goBack();
  
    } catch (error) {
      console.error('Lỗi khi xóa bài học và từ vựng: ', error);
      Alert.alert('Xóa thất bại');
    }
  };
  
  

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
            <Button mode="contained" onPress={handleUpdateLesson} style={styles.button}>
              <Text style={styles.buttontext}>Sửa</Text>
            </Button>
            <Button mode="contained" onPress={handleDeleteLesson} style={styles.button}>
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
});

export default EditLessonModal;
