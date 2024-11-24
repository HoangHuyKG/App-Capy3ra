import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AppHeader from '../navigation/app.header';
import { db, auth } from '../../fireBaseConfig';
import { globalFont } from '../../utils/const';
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useUser } from './UserContext';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';

const CreateCourseScreen = () => {
    const { userInfo } = useUser(); // Lấy userInfo từ context
    const [createdBy, setCreatedBy] = useState(''); // Sẽ tự động lấy
    const [description, setDescription] = useState('');
    const [language, setLanguage] = useState('');
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageUser, setImageUser] = useState('');
    const [idUser, setIdUser] = useState('');
    const navigation: NavigationProp<RootStackParamList> = useNavigation();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const userDoc = await getDoc(doc(db, 'Users', user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setCreatedBy(userData?.name || ''); // Tên người tạo
                        setImageUser(userInfo?.data?.user?.photo || ''); // Ảnh người tạo
                        setIdUser(userInfo?.data?.user?.id || ''); // ID người dùng
                    }
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng: ", error);
            }
        };

        if (userInfo) {
            fetchUserData();
        } else {
            console.warn("userInfo không có giá trị");
        }
    }, [userInfo]);

    const isValidImageUrl = async (url: string) => {
        try {
            const result = await Image.prefetch(url);
            return result; // `true` nếu URL hợp lệ
        } catch (error) {
            
            return false; // `false` nếu URL không hợp lệ
        }
    };

    const handleCreateCourse = async () => {
        if (!createdBy || !description || !language || !title || !imageUrl || !imageUser || !idUser) {
            Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
            return;
        }

        const isImageValid = await isValidImageUrl(imageUrl);

        if (!isImageValid) {
            Alert.alert("Lỗi", "URL hình ảnh không hợp lệ, vui lòng kiểm tra lại");
            return;
        }

        try {
            const docRef = await addDoc(collection(db, 'Courses'), {
                created_by: createdBy,
                description,
                language,
                title,
                imageUrl,
                imageUser,
                createdAt: new Date(),
                idUser,
            });

            await updateDoc(docRef, { courseId: docRef.id });

            Alert.alert("Thành công", "Khóa học đã được tạo thành công");
            navigation.navigate("CourseScreen");

            // Reset lại form
            setDescription('');
            setLanguage('');
            setTitle('');
            setImageUrl('');
        } catch (error) {
            Alert.alert("Lỗi", "Không thể tạo khóa học, vui lòng thử lại");
            console.error(error);
        }
    };

    if (!createdBy) {
        return (
            <View style={styles.container}>
                <AppHeader />
                <Text style={{ textAlign: 'center', marginTop: 20 }}>Đang tải dữ liệu...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppHeader />
            <ScrollView style={styles.containerbox}>
                <View style={styles.formContainer}>
                    <Text style={[styles.label, { display: 'none' }]}>Người tạo</Text>
                    <Text style={[styles.input, { display: 'none' }]}>{createdBy || "Đang tải..."}</Text>

                    <Text style={styles.label}>Mô tả</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Mô tả khóa học"
                        multiline
                        numberOfLines={4}
                        value={description}
                        onChangeText={setDescription}
                        maxLength={100} 
                    />
                    <Text style={styles.characterCount}>{description.length}/100</Text>
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
                            <Picker.Item label="Tiếng Pháp" value="French" />
                        </Picker>
                    </View>

                    <Text style={styles.label}>Tiêu đề</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập tiêu đề khóa học"
                        value={title}
                        onChangeText={setTitle}
                        maxLength={100} 
                    />
                    <Text style={styles.characterCount}>{description.length}/100</Text>
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
    container: { flex: 1, backgroundColor: '#e6f4f5' },
    containerbox: { flex: 1, backgroundColor: '#e6f4f5', padding: 20 },
    formContainer: { marginTop: 20 },
    label: { fontSize: 16, marginBottom: 8, color: '#333', fontFamily: globalFont },
    input: { borderColor: '#ddd', borderWidth: 1, borderRadius: 10, marginBottom: 16, padding: 10, backgroundColor: '#fff' },
    pickerContainer: { justifyContent: 'center', padding: 10, borderWidth: 1, borderRadius: 10, borderColor: '#ddd', marginBottom: 16, backgroundColor: '#fff' },
    picker: { height: 30, width: '100%' },
    textArea: { padding: 15, height: 100, borderColor: '#ddd', borderWidth: 1, borderRadius: 5, marginBottom: 16, backgroundColor: '#fff', textAlignVertical: 'top' },
    button: { marginTop: 20, backgroundColor: '#02929A', paddingVertical: 12, borderRadius: 5, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 18, fontFamily: globalFont },
    characterCount: {
        fontSize: 12,
        color: '#666',
        marginBottom: 10,
        textAlign: 'right',
    },
});

export default CreateCourseScreen;
