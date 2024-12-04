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
import { launchImageLibrary } from 'react-native-image-picker'; // Nếu dùng react-native-image-picker
import RNFS from 'react-native-fs'; // Import react-native-fs


const CreateCourseScreen = () => {
    const { userInfo } = useUser(); // Lấy userInfo từ context
    const [createdBy, setCreatedBy] = useState(''); // Sẽ tự động lấy
    const [description, setDescription] = useState('');
    const [language, setLanguage] = useState('');
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageUser, setImageUser] = useState('');
    const [idUser, setIdUser] = useState('');
    const [imageFile, setImageFile] = useState(null); // Lưu trữ file hình ảnh
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

    const pickImage = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.8,
            });

            if (result.didCancel) {
                console.log('Người dùng hủy chọn ảnh');
                return;
            }

            if (result.errorCode) {
                console.error('Lỗi chọn ảnh:', result.errorMessage);
                return;
            }

            const asset = result.assets?.[0]; // Lấy hình ảnh đầu tiên
            if (asset && asset.uri) {
                const localUri = asset.uri;

                // Tạo đường dẫn lưu tệp
                const fileName = localUri.split('/').pop(); // Lấy tên tệp từ URI
                const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

                // Lưu hình ảnh vào bộ nhớ cục bộ
                await RNFS.copyFile(localUri, destPath);

                setImageFile(`file://${destPath}`); // Hiển thị ảnh từ đường dẫn cục bộ
                console.log('Hình ảnh đã được lưu tại:', destPath);
            }
        } catch (error) {
            console.error('Lỗi khi chọn và lưu hình ảnh:', error);
        }
    };

    const handleCreateCourse = async () => {
        // Xử lý chuỗi để kiểm tra toàn khoảng trắng
        const trimmedTitle = title.trim();
        const trimmedDescription = description.trim();

        if (!createdBy || !trimmedDescription || !language || !trimmedTitle || !imageFile || !imageUser || !idUser) {
            Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
            return;
        }

        if (trimmedTitle.length === 0) {
            Alert.alert("Lỗi", "Tiêu đề không được chứa toàn khoảng cách, vui lòng nhập nội dung hợp lệ");
            return;
        }

        if (trimmedDescription.length === 0) {
            Alert.alert("Lỗi", "Mô tả không được chứa toàn khoảng cách, vui lòng nhập nội dung hợp lệ");
            return;
        }

        if (trimmedTitle.length < 10) {
            Alert.alert("Lỗi", "Tiêu đề phải có ít nhất 10 ký tự, không bao gồm khoảng trắng");
            return;
        }

        if (trimmedDescription.length < 15) {
            Alert.alert("Lỗi", "Mô tả phải có ít nhất 15 ký tự, không bao gồm khoảng trắng");
            return;
        }

        try {
            // Lưu tệp hình ảnh cục bộ (nếu cần)
            const localImagePath = imageFile.replace('file://', '');
            const fileName = localImagePath.split('/').pop(); // Lấy tên tệp
            const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

            // Sao chép hình ảnh sang thư mục ứng dụng (nếu chưa lưu)
            if (!localImagePath.startsWith(RNFS.DocumentDirectoryPath)) {
                await RNFS.copyFile(localImagePath, destPath);
            }

            // Lưu thông tin khóa học vào Firebase
            const docRef = await addDoc(collection(db, 'Courses'), {
                created_by: createdBy,
                description: trimmedDescription,
                language,
                title: trimmedTitle,
                imageUrl: destPath, // Lưu đường dẫn cục bộ của hình ảnh
                imageUser,
                createdAt: new Date(),
                idUser,
            });

            // Cập nhật ID khóa học vào tài liệu
            await updateDoc(docRef, { courseId: docRef.id });

            Alert.alert("Thành công", "Khóa học đã được tạo thành công");
            navigation.navigate("CourseScreen");

            // Reset lại form
            setDescription('');
            setLanguage('');
            setTitle('');
            setImageFile(null);
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
                    <Text style={[styles.label, { display: 'none' }]}>Người tạo</Text>
                    <Text style={[styles.input, { display: 'none' }]}>{createdBy || "Đang tải..."}</Text>
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
                        placeholder="Mô tả khóa học"
                        multiline
                        numberOfLines={6}
                        value={description}
                        onChangeText={setDescription}
                        maxLength={500}
                    />
                    <Text style={styles.characterCount}>{description.length}/500</Text>
                    <Text style={styles.label}>Ngôn ngữ</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={language}
                            onValueChange={(itemValue) => setLanguage(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item style={styles.picker} label="Vui lòng lựa chọn 1 ngôn ngữ" value="" />
                            <Picker.Item style={styles.picker} label="Tiếng Anh" value="English" />
                            <Picker.Item style={styles.picker} label="Tiếng Tây Ban Nha" value="Spanish" />
                            <Picker.Item style={styles.picker} label="Tiếng Nhật" value="Japanese" />
                            <Picker.Item style={styles.picker} label="Tiếng Pháp" value="French" />
                        </Picker>
                    </View>

                    <Text style={styles.label}>Hình ảnh</Text>

                    <View style={{ alignItems: 'center', marginBottom: 16 }}>
                        {imageFile && (
                            <Image
                                source={{ uri: imageFile }}
                                style={{ width: '100%', height: 150, marginBottom: 10, borderRadius: 10 }}
                            />
                        )}
                        <TouchableOpacity style={styles.buttonimg} onPress={pickImage}>
                            <Text style={styles.buttonText}>Chọn Ảnh</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.boxbutton}>

                        <TouchableOpacity style={styles.button} onPress={handleCreateCourse}>
                            <Text style={styles.buttonText}>Xác nhận</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e6f4f5' },
    containerbox: { flex: 1, backgroundColor: '#e6f4f5', padding: 20 },
    formContainer: { },
    label: { fontSize: 16, marginBottom: 8, color: '#333', fontFamily: globalFont, fontWeight: 'bold' },
    input: { fontSize: 16, fontFamily: globalFont, borderColor: '#ddd', borderWidth: 1, borderRadius: 10, marginBottom: 8, padding: 10, backgroundColor: '#fff' },
    pickerContainer: { fontSize: 16, fontFamily: globalFont, justifyContent: 'center', padding: 10, borderWidth: 1, borderRadius: 10, borderColor: '#ddd', marginBottom: 8, backgroundColor: '#fff' },
    picker: { fontSize: 16, fontFamily: globalFont, height: 30, width: '100%' },
    textArea: { fontSize: 16, fontFamily: globalFont, padding: 15, height: 100, borderColor: '#ddd', borderWidth: 1, borderRadius: 5, marginBottom: 8, backgroundColor: '#fff', textAlignVertical: 'top' },
    button: { backgroundColor: '#02929A', paddingVertical: 12, borderRadius: 5, alignItems: 'center', },
    buttonText: { color: '#fff', fontSize: 18, fontFamily: globalFont },
    characterCount: {
        fontSize: 12,
        color: '#666',
        textAlign: 'right',
    },
    boxbutton: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end',
    },
    buttonimg: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#02929A',
        borderRadius: 5,
        marginVertical: 15,
        alignItems: 'center',
        backgroundColor: '#02929A'
    }
});

export default CreateCourseScreen;