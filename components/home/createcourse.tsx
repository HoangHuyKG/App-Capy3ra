import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import from the package
import AppHeader from '../navigation/app.header';
import { globalFont } from '../../utils/const';
const CreateCourseScreen = () => {
    const [language, setLanguage] = useState('');

    return (
        <View style={styles.container}>
            <AppHeader />
            <ScrollView style={styles.containerbox}>
               

                {/* Form Nhập Liệu */}
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Tên</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Đặt tên phù hợp cho khóa học"
                    />

                    <Text style={styles.label}>Dạy</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={language}
                            onValueChange={(itemValue) => setLanguage(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Vui lòng lựa chọn 1 ngôn ngữ" value="" />
                            <Picker.Item label="Tiếng Anh" value="english" />
                            <Picker.Item label="Tiếng Tây Ban Nha" value="spanish" />
                            <Picker.Item label="Tiếng Pháp" value="french" />
                        </Picker>
                    </View>

                    <Text style={styles.label}>Từ Khóa</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ví dụ: từ vựng Tây Ban Nha, học tiếng Tây Ban Nha online"
                    />

                    <Text style={styles.label}>Mô tả</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Mô tả khóa học bằng ngôn ngữ của người học"
                        multiline
                        numberOfLines={4}
                    />

                    <Text style={styles.label}>Mô tả ngắn gọn</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Mô tả ngắn gọn về ứng dụng của chúng tôi"
                    />

                    {/* Nút tạo khóa học */}
                    <TouchableOpacity style={styles.button}>
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
