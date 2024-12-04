import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { TextInput } from 'react-native-gesture-handler';
import { globalFont } from '../../utils/const';
import { db } from '../../fireBaseConfig';
import { doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

const EditVocabularyModal = ({ modalVisible, setModalVisible, vocabId }) => {
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

  useEffect(() => {
    let unsubscribe;
    if (vocabId && modalVisible) {
      const vocabRef = doc(db, 'Vocabularies', vocabId);
      unsubscribe = onSnapshot(vocabRef, (doc) => {
        if (doc.exists()) {
          const vocabData = doc.data();
          setEnglishWord(vocabData.englishWord || '');
          setVietnameseWord(vocabData.vietnameseWord || '');
          setWordType(vocabData.wordType || '');
          setAudioFile({
            name: vocabData.audioFileName || '',
            uri: vocabData.localPath || '',
          });
        } else {
          Alert.alert('Thông báo', 'Từ vựng không tồn tại.');
          setModalVisible(false);
        }
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [vocabId, modalVisible]);

  const handlePickFile = async () => {
    try {
      const file = await DocumentPicker.pickSingle({
        type: DocumentPicker.types.audio,
      });
      setAudioFile(file);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Hủy chọn tệp');
      } else {
        console.error('Lỗi chọn tệp:', err);
        Alert.alert('Lỗi', 'Không thể chọn tệp âm thanh.');
      }
    }
  };

  const handleUpdateVocabulary = async () => {
    if (englishWord && vietnameseWord && wordType) {
      try {
        let destinationPath = audioFile.uri;
        if (audioFile && audioFile.uri && !audioFile.uri.includes(RNFS.DocumentDirectoryPath)) {
          destinationPath = `${RNFS.DocumentDirectoryPath}/${audioFile.name}`;
          await RNFS.copyFile(audioFile.uri, destinationPath);
        }

        await setDoc(
          doc(db, 'Vocabularies', vocabId),
          {
            englishWord,
            vietnameseWord,
            wordType,
            audioFileName: audioFile.name,
            localPath: destinationPath,
            updatedAt: new Date(),
          },
          { merge: true }
        );
        Alert.alert('Thông báo', 'Cập nhật từ vựng thành công.');
        setModalVisible(false);
      } catch (error) {
        console.error('Lỗi khi cập nhật từ vựng: ', error);
        Alert.alert('Lỗi', 'Cập nhật thất bại.');
      }
    } else {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin.');
    }
  };

  const handleDeleteVocabulary = async () => {
    try {
      await deleteDoc(doc(db, 'Vocabularies', vocabId));
      Alert.alert('Thông báo', 'Xóa từ vựng thành công.');
      setModalVisible(false);
    } catch (error) {
      console.error('Lỗi khi xóa từ vựng: ', error);
      Alert.alert('Lỗi', 'Xóa thất bại.');
    }
  };

  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Sửa từ vựng</Text>

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
            <Button mode="contained" onPress={handleUpdateVocabulary} style={styles.button}>
              <Text style={styles.buttonText}>Sửa</Text>
            </Button>
            <Button mode="contained" onPress={handleDeleteVocabulary} style={styles.button}>
              <Text style={styles.buttonText}>Xóa</Text>
            </Button>
            <Button mode="outlined" onPress={() => setModalVisible(false)} style={styles.button}>
              <Text style={styles.buttonText}>Hủy</Text>
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
    backgroundColor: '#02929A',
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  buttonText: {
    fontFamily: globalFont,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default EditVocabularyModal;
