import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AppHeader from '../navigation/app.header';
import { db } from '../../fireBaseConfig';
import { globalFont } from '../../utils/const';
import { doc, onSnapshot, updateDoc, deleteDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { useUser } from './UserContext';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import RNFS from 'react-native-fs';
import { launchImageLibrary } from 'react-native-image-picker'; 

const EditCourse = ({ route }) => {
    const { userInfo } = useUser();
    const navigation: NavigationProp<RootStackParamList> = useNavigation();
    const courseId = route.params.course; 

    const [createdBy, setCreatedBy] = useState('');
    const [description, setDescription] = useState('');
    const [language, setLanguage] = useState('');
    const [title, setTitle] = useState('');
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'Courses', courseId), (courseDoc) => {
            if (courseDoc.exists()) {
                const courseData = courseDoc.data();
                setCreatedBy(courseData.created_by || '');
                setDescription(courseData.description || '');
                setLanguage(courseData.language || '');
                setTitle(courseData.title || '');
                setImageFile(courseData.imageUrl || null);
            }
        }, (error) => {
            console.error('Lỗi khi lắng nghe thay đổi:', error);
            Alert.alert('Lỗi khi lấy thông tin khóa học.');
        });

        return () => unsubscribe();
    }, [courseId]);

    const pickImage = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.8,
            });

            if (result.didCancel) return;

            const asset = result.assets?.[0];
            if (asset && asset.uri) {
                const localUri = asset.uri;
                const fileName = localUri.split('/').pop();
                const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
                await RNFS.copyFile(localUri, destPath);
                setImageFile(`file://${destPath}`);
            }
        } catch (error) {
            console.error('Lỗi chọn và lưu hình ảnh:', error);
        }
    };

    const validateInput = () => {
        if (!title.trim() || !description.trim() || !language || !imageFile) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
            return false;
        }
        if (title.trim().length < 10) {
            Alert.alert('Lỗi', 'Tiêu đề phải có ít nhất 10 ký tự.');
            return false;
        }
        if (description.trim().length < 15) {
            Alert.alert('Lỗi', 'Mô tả phải có ít nhất 15 ký tự.');
            return false;
        }
        return true;
    };

    const updateCourse = async () => {
        if (!validateInput()) return;

        try {
            await updateDoc(doc(db, 'Courses', courseId), {
                created_by: createdBy,
                description,
                language,
                title,
                imageUrl: imageFile,
            });
            Alert.alert('Thành công', 'Khóa học đã được cập nhật!');
            navigation.goBack();
        } catch (error) {
            console.error('Lỗi khi cập nhật khóa học:', error);
            Alert.alert('Đã xảy ra lỗi khi cập nhật khóa học.');
        }
    };

    const deleteCourse = async () => {
        try {
            const lessonsQuery = query(collection(db, 'Lessons'), where('courseId', '==', courseId));
            const lessonsSnapshot = await getDocs(lessonsQuery);

            for (const lessonDoc of lessonsSnapshot.docs) {
                const vocabQuery = query(collection(db, 'Vocabularies'), where('lessonId', '==', lessonDoc.id));
                const vocabSnapshot = await getDocs(vocabQuery);

                for (const vocabDoc of vocabSnapshot.docs) {
                    await deleteDoc(doc(db, 'Vocabularies', vocabDoc.id));
                }
                await deleteDoc(doc(db, 'Lessons', lessonDoc.id));
            }
            await deleteDoc(doc(db, 'Courses', courseId));
            Alert.alert('Thành công', 'Khóa học đã được xóa!');
            navigation.navigate('CourseScreen');
        } catch (error) {
            console.error('Lỗi khi xóa khóa học:', error);
            Alert.alert('Đã xảy ra lỗi khi xóa khóa học.');
        }
    };

    return (
        <View style={styles.container}>
            <AppHeader />
            <ScrollView style={styles.containerbox}>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Tiêu đề</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập tiêu đề khóa học"
                        value={title}
                        onChangeText={setTitle}
                        maxLength={100}
                    />
                    <Text style={styles.characterCount}>{title.length}/100</Text>

                    <Text style={styles.label}>Mô tả</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Nhập mô tả khóa học"
                        multiline
                        value={description}
                        onChangeText={setDescription}
                        maxLength={500}
                    />
                    <Text style={styles.characterCount}>{description.length}/500</Text>

                    <Text style={styles.label}>Ngôn ngữ</Text>
                    <Picker
                        selectedValue={language}
                        onValueChange={setLanguage}
                        style={styles.picker}
                    >
                        <Picker.Item label="Chọn ngôn ngữ" value="" />
                        <Picker.Item label="Tiếng Anh" value="English" />
                        <Picker.Item label="Tiếng Tây Ban Nha" value="Spanish" />
                        <Picker.Item label="Tiếng Nhật" value="Japanese" />
                    </Picker>

                    <Text style={styles.label}>Hình ảnh</Text>
                    {imageFile && <Image source={{ uri: imageFile }} style={{ height: 150, marginBottom: 10 }} />}
                    <TouchableOpacity style={styles.buttonimg} onPress={pickImage}>
                        <Text style={styles.buttonText}>Chọn Ảnh</Text>
                    </TouchableOpacity>

                    <View style={styles.buttoncenter}>
                        <TouchableOpacity style={styles.button} onPress={updateCourse}>
                            <Text style={styles.buttonText}>Cập nhật</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttondelte} onPress={deleteCourse}>
                            <Text style={styles.buttonText}>Xóa</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e6f4f5' },
    containerbox: { flex: 1, padding: 20 },
    formContainer: {},
    label: { fontSize: 16, color: '#333', fontWeight: 'bold', marginBottom: 8},
    input: { fontSize: 16, borderColor: '#ddd', borderWidth: 1, borderRadius: 10, marginBottom: 8, padding: 10, backgroundColor: '#fff' },
    picker: { marginBottom: 8,backgroundColor: '#fff', borderRadius: 10,},
    textArea: { fontSize: 16,backgroundColor: '#fff', height: 100, borderColor: '#ddd', borderWidth: 1, borderRadius: 5, padding: 10, textAlignVertical: 'top', marginBottom: 8 },
    characterCount: { fontSize: 12, color: '#666', textAlign: 'right'},
    buttoncenter: { flexDirection: 'row', justifyContent: 'space-between' },
    button: { backgroundColor: '#02929A', padding: 12, borderRadius: 5, alignItems: 'center', flex: 1, marginRight: 10 },
    buttondelte: { backgroundColor: 'red', padding: 12, borderRadius: 5, alignItems: 'center', flex: 1 },
    buttonText: { color: '#fff', fontSize: 18 },
    buttonimg: { padding: 10, borderWidth: 1, borderColor: '#02929A', borderRadius: 5, backgroundColor: '#02929A', alignItems: 'center', marginBottom: 20},
});

export default EditCourse;
