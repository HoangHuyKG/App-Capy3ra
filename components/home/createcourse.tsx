import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AppHeader from '../navigation/app.header';
import { db } from '../../firebaseConfig';
import { globalFont } from '../../utils/const';
import { collection, addDoc } from 'firebase/firestore';
import { useUser } from './UserContext';

const CreateCourseScreen = () => {
    const { userInfo } = useUser(); // Lấy userInfo từ context
    const [courseId, setCourseId] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [description, setDescription] = useState('');
    const [language, setLanguage] = useState('');
    const [level, setLevel] = useState('');
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageUser, setImageUser] = useState(userInfo?.data?.user?.photo || ''); // Đặt giá trị ban đầu đúng

    const handleCreateCourse = async () => {
        if (!courseId || !createdBy || !description || !language || !level || !title || !imageUrl || !imageUser) {
            Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
            return;
        }

        try {
            await addDoc(collection(db, 'Courses'), {
                course_id: courseId,
                created_by: createdBy,
                description,
                language,
                level,
                title,
                imageUrl,
                imageUser, // Lưu URL ảnh vào Firestore
                createdAt: new Date()
            });
            Alert.alert("Thành công", "Khóa học đã được tạo thành công");
            setCourseId('');
            setCreatedBy('');
            setDescription('');
            setLanguage('');
            setLevel('');
            setTitle('');
            setImageUrl('');
            setImageUser('');
        } catch (error) {
            Alert.alert("Lỗi", "Không thể tạo khóa học, vui lòng thử lại");
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <AppHeader />
            <ScrollView style={styles.containerbox}>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Mã khóa học</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập mã khóa học"
                        value={courseId}
                        onChangeText={setCourseId}
                    />

                    <Text style={styles.label}>Người tạo</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập tên người tạo"
                        value={createdBy}
                        onChangeText={setCreatedBy}
                    />

                    <Text style={styles.label}>Mô tả</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Mô tả khóa học"
                        multiline
                        numberOfLines={4}
                        value={description}
                        onChangeText={setDescription}
                    />

                    <Text style={styles.label}>Ngôn ngữ</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={language}
                            onValueChange={(itemValue) => setLanguage(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Vui lòng lựa chọn 1 ngôn ngữ" value="" />
                            <Picker.Item label="Tiếng Anh" value="English" />
                            <Picker.Item label="Tiếng Tây Ban Nha" value="Spanish" />
                            <Picker.Item label="Tiếng Nhật" value="Japanese" />
                        </Picker>
                    </View>

                    <Text style={styles.label}>Cấp độ</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập cấp độ (ví dụ: 1, 2, 3)"
                        value={level}
                        onChangeText={setLevel}
                    />

                    <Text style={styles.label}>Tiêu đề</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập tiêu đề khóa học"
                        value={title}
                        onChangeText={setTitle}
                    />

                    <Text style={styles.label}>URL Hình Ảnh</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập URL hình ảnh của khóa học"
                        value={imageUrl}
                        onChangeText={setImageUrl}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleCreateCourse}>
                        <Text style={styles.buttonText}>Tạo khóa học</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e6f4f5',
    },
    containerbox: {
        flex: 1,
        backgroundColor: '#e6f4f5',
        padding: 20
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#02929A',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerText: {
        fontSize: 18,
        color: '#fff',
        fontFamily: globalFont
    },
    headerTextSelected: {
        fontSize: 18,
        color: '#fff',
        textDecorationLine: 'underline',
        fontFamily: globalFont

    },
    avatar: {
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
    },
    formContainer: {
        marginTop: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
        fontFamily: globalFont

    },
    input: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 16,
        padding: 10,
        backgroundColor: '#fff',
    },
    pickerContainer: {
        display: 'flex',
        justifyContent: 'center',
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ddd',
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    picker: {
        height: 30,
        width: '100%',
    },
    textArea: {
        padding: 15,
        height: 100,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 16,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
        textAlignVertical: 'top'
    },
    button: {
        marginTop: 20,
        backgroundColor: '#02929A',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: globalFont

    },
});

export default CreateCourseScreen;
