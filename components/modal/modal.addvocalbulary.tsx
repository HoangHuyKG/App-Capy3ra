import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { globalFont } from '../../utils/const';
import { db } from '../../fireBaseConfig';
import { collection, setDoc, doc } from 'firebase/firestore';

const AddVocabularyModal = ({ modalVisible, setModalVisible, lessonId }) => {
  const [englishWord, setEnglishWord] = useState('');
  const [vietnameseWord, setVietnameseWord] = useState('');
  const [wordType, setWordType] = useState('');
  const [openWordType, setOpenWordType] = useState(false);

  const [wordTypes] = useState([
    { label: 'Danh từ', value: 'Danh từ' },
    { label: 'Động từ', value: 'Động từ' },
    { label: 'Tính từ', value: 'Tính từ' },
    { label: 'Trạng từ', value: 'Trạng từ' },
  ]);

  const handleAddWord = async () => {
    
  
    if (englishWord && vietnameseWord && wordType && lessonId) {
      try {
        const wordId = `vocab_${Date.now()}`;
  
        const vocabularyData = {
          wordId,
          lessonId, // Đảm bảo lessonId có giá trị
          englishWord,
          vietnameseWord,
          wordType,
          createdAt: new Date(),
        };
  
        await setDoc(doc(db, 'Vocabularies', wordId), vocabularyData);
  
        setModalVisible(false);
        setEnglishWord('');
        setVietnameseWord('');
        setWordType('');
      } catch (error) {
        alert('Lỗi khi thêm từ vựng: ' + error.message);
      }
    } else {
      alert('Vui lòng điền đầy đủ thông tin và chắc chắn rằng lessonId không bị thiếu');
    }
  };
  

  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Thêm từ vựng</Text>
          <TextInput
            style={styles.input}
            placeholder="Từ tiếng Anh"
            value={englishWord}
            onChangeText={setEnglishWord}
          />
          <TextInput
            style={styles.input}
            placeholder="Từ tiếng Việt"
            value={vietnameseWord}
            onChangeText={setVietnameseWord}
          />
          <DropDownPicker
            open={openWordType}
            value={wordType}
            items={wordTypes}
            setOpen={setOpenWordType}
            setValue={setWordType}
            placeholder="Loại từ"
            style={styles.dropdown}
          />
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={handleAddWord} style={styles.button}>
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
  dropdown: {
    width: '100%',
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

export default AddVocabularyModal;
