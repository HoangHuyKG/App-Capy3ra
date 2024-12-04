import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { collection, setDoc, doc } from 'firebase/firestore';
import { db } from '../../fireBaseConfig';
import { globalFont } from '../../utils/const';
import { TextInput } from 'react-native-gesture-handler';

const AddVocabularyModal = ({ modalVisible, setModalVisible, lessonId }) => {
  const [englishWord, setEnglishWord] = useState('');
  const [vietnameseWord, setVietnameseWord] = useState('');
  const [wordType, setWordType] = useState('');
  const [openWordType, setOpenWordType] = useState(false);
  const [audioFile, setAudioFile] = useState(null);

  const [wordTypes] = useState([
    { label: 'Danh từ', value: 'Danh từ' },
    { label: 'Động từ', value: 'Động từ' },
    { label: 'Tính từ', value: 'Tính từ' },
    { label: 'Trạng từ', value: 'Trạng từ' },
  ]);

  const handlePickFile = async () => {
    try {
      const file = await DocumentPicker.pickSingle({
        type: DocumentPicker.types.audio, // Chỉ chọn tệp âm thanh
      });
  
      // Lưu tệp mà không sao chép ngay lập tức
      setAudioFile(file);
  
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Hủy chọn tệp');
      } else {
        console.error('Lỗi chọn tệp:', err);
        Alert.alert('Lỗi', 'Không thể chọn tệp.');
      }
    }
  };
  
  const handleAddWord = async () => {
    if (englishWord && vietnameseWord && wordType && lessonId && audioFile) {
      try {
        // Tạo đường dẫn lưu trữ cục bộ khi bấm thêm
        const destinationPath = `${RNFS.DocumentDirectoryPath}/${audioFile.name}`;
  
        // Sao chép tệp vào đường dẫn cục bộ
        await RNFS.copyFile(audioFile.uri, destinationPath);
  
        // Lưu thông tin từ vựng vào Firestore
        const wordId = `vocab_${Date.now()}`;
        const vocabularyData = {
          wordId,
          lessonId,
          englishWord,
          vietnameseWord,
          wordType,
          audioFileName: audioFile.name, // Tên tệp
          localPath: destinationPath, // Đường dẫn cục bộ
          createdAt: new Date(),
        };
  
        // Lưu dữ liệu vào Firestore
        await setDoc(doc(db, 'Vocabularies', wordId), vocabularyData);
  
        // Reset form
        setModalVisible(false);
        setEnglishWord('');
        setVietnameseWord('');
        setWordType('');
        setAudioFile(null);
      } catch (error) {
        console.error('Lỗi:', error);
        alert('Lỗi khi thêm từ vựng: ' + error.message);
      }
    } else {
      alert('Vui lòng điền đầy đủ thông tin và chọn tệp âm thanh.');
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

          <TouchableOpacity onPress={handlePickFile} style={styles.filePickerButton}>
            <Text style={styles.filePickerText}>
              {audioFile ? audioFile.name : 'Chọn tệp âm thanh'}
            </Text>
          </TouchableOpacity>

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
  filePickerButton: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  filePickerText: {
    color: '#555',
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
    borderRadius: 5,
  },
  buttontext: {
    fontFamily: globalFont,
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default AddVocabularyModal;
