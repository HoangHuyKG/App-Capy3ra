import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AppHeader from '../navigation/app.header';
import { db } from '../../fireBaseConfig';
import { globalFont } from '../../utils/const';
import { doc, onSnapshot, updateDoc, deleteDoc, query, collection, where, getDocs } from 'firebase/firestore'; // Import deleteDoc
import { useUser } from './UserContext';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { useEffect, useState } from 'react';

const EditCourse = ({ route }) => {
    const { userInfo } = useUser();
    const courseId = route.params.course; // Nhận courseId từ navigation params

    const [created_by, setCreatedBy] = useState('');
    const [description, setDescription] = useState('');
    const [language, setLanguage] = useState('');
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "Courses", courseId), (courseDoc) => {
            if (courseDoc.exists()) {
                const courseData = courseDoc.data();
                setCreatedBy(courseData.created_by);
                setDescription(courseData.description);
                setLanguage(courseData.language);
                setTitle(courseData.title);
                setImageUrl(courseData.imageUrl);
            } 
        }, (error) => {
            console.error("Lỗi khi lắng nghe thay đổi:", error);
            Alert.alert("Đã xảy ra lỗi khi lắng nghe thay đổi.");
        });

        // Clean up the listener on unmount
        return () => unsubscribe();
    }, [courseId]);

    // Hàm cập nhật dữ liệu khóa học
    const updateCourse = async () => {
        try {
            await updateDoc(doc(db, "Courses", courseId), {
                created_by,
                description,
                language,
                title,
                imageUrl,
            });
            Alert.alert("Khóa học đã được cập nhật thành công!");
            navigation.goBack();
        } catch (error) {
            console.error("Lỗi khi cập nhật khóa học:", error);
            Alert.alert("Đã xảy ra lỗi khi cập nhật khóa học.");
        }
    };

    // Hàm xóa dữ liệu khóa học
    const deleteCourse = async () => {
        try {
            if (!courseId) {
                console.error('courseId không hợp lệ:', courseId);
                Alert.alert('Lỗi: courseId không hợp lệ');
                return;
            }

            const lessonsQuery = query(collection(db, 'Lessons'), where('courseId', '==', courseId));
            const lessonsSnapshot = await getDocs(lessonsQuery);

            for (const lessonDoc of lessonsSnapshot.docs) {
                const lessonId = lessonDoc.id;
                if (lessonId) {
                    const vocabQuery = query(collection(db, 'Vocabularies'), where('lessonId', '==', lessonId));
                    const vocabSnapshot = await getDocs(vocabQuery);

                    for (const vocabDoc of vocabSnapshot.docs) {
                        await deleteDoc(doc(db, 'Vocabularies', vocabDoc.id));
                    }
                    await deleteDoc(doc(db, 'Lessons', lessonId));
                }
            }

            await deleteDoc(doc(db, 'Courses', courseId));
            Alert.alert('Khóa học đã được xóa thành công!');
            navigation.navigate("CourseScreen");
        } catch (error) {
            console.error('Lỗi khi xóa khóa học và dữ liệu liên quan:', error);
            Alert.alert('Đã xảy ra lỗi khi xóa khóa học và dữ liệu liên quan.');
        }
    };

    return (
        <View style={styles.container}>
            <AppHeader />
            <ScrollView style={styles.containerbox}>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Người tạo</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập tên người tạo"
                        value={created_by}
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

                    <View style={styles.buttoncenter}>
                        <TouchableOpacity style={styles.button} onPress={updateCourse}>
                            <Feather name="edit" size={24} color="white" />
                            <Text style={styles.buttonText}>Sửa khóa học</Text>
                        </TouchableOpacity>
                        
                        {/* Nút xóa khóa học */}
                        <TouchableOpacity style={styles.button} onPress={deleteCourse}>
                            <Feather name="trash-2" size={24} color="white" />
                            <Text style={styles.buttonText}>Xóa khóa học</Text>
                        </TouchableOpacity>
                    </View>
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
    formContainer: {
        marginTop: 20,
    },
    buttoncenter: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
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
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        backgroundColor: '#02929A',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        marginLeft: 10,
        fontFamily: globalFont
    },
});

export default EditCourse;
