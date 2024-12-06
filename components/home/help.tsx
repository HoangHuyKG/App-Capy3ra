import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
const Help = () => {
    const navigation = useNavigation();
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: '1. Làm thế nào để bắt đầu học trên ứng dụng?',
            answer: 'Bạn có thể bắt đầu bằng cách chọn một khóa học yêu thích trong danh mục. Hãy đăng ký tài khoản để lưu tiến trình học tập.',
        },
        {
            question: '2. Tôi có thể học ngoại tuyến không?',
            answer: 'Có, bạn có thể tải về các bài học và học ngoại tuyến mà không cần kết nối internet.',
        },
        {
            question: '3. Làm thế nào để theo dõi tiến độ học tập của mình?',
            answer: 'Bạn có thể theo dõi tiến độ học tập trong mục "Hồ sơ cá nhân" hoặc bảng thống kê trong ứng dụng.',
        },
        {
            question: '4. Tôi quên mật khẩu, làm sao để khôi phục?',
            answer: 'Hãy nhấn vào nút "Quên mật khẩu" trên màn hình đăng nhập và làm theo hướng dẫn.',
        },
        {
            question: '5. Có cách nào để luyện tập từ vựng không?',
            answer: 'Ứng dụng cung cấp các bài tập tương tác giúp bạn ôn luyện từ vựng như Flashcards và Quiz.',
        },
        {
            question: '6. Tôi có thể thay đổi ngôn ngữ giao diện không?',
            answer: 'Có, bạn có thể thay đổi ngôn ngữ trong phần "Cài đặt".',
        },
        {
            question: '7. Ứng dụng này có miễn phí không?',
            answer: 'Ứng dụng cung cấp nội dung miễn phí, nhưng bạn có thể nâng cấp lên tài khoản Premium để truy cập tất cả các tính năng.',
        },
        {
            question: '8. Làm sao để hủy gia hạn tài khoản Premium?',
            answer: 'Bạn có thể hủy gia hạn trong phần "Quản lý đăng ký" của cửa hàng ứng dụng (App Store hoặc Google Play).',
        },
        {
            question: '9. Tại sao tôi không nhận được thông báo?',
            answer: 'Hãy kiểm tra xem bạn đã bật thông báo cho ứng dụng trong phần cài đặt của điện thoại chưa.',
        },
        {
            question: '10. Làm thế nào để liên hệ hỗ trợ?',
            answer: 'Bạn có thể gửi email cho chúng tôi tại địa chỉ support@example.com hoặc sử dụng mục "Liên hệ hỗ trợ" trong ứng dụng.',
        },
    ];

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Ionicons name="arrow-back" size={30} color="black" onPress={() => navigation.goBack()} />
                <Text style={styles.title}>Trợ Giúp</Text>
            </View>

            {/* FAQ List */}
            <ScrollView style={styles.content}>
                {faqs.map((faq, index) => (
                    <View key={index} style={styles.faqItem}>
                        <TouchableOpacity onPress={() => toggleExpand(index)} style={styles.questionContainer}>
                            <Text style={styles.question}>{faq.question}</Text>
                            <Ionicons
                                name={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                color="black"
                            />
                        </TouchableOpacity>
                        {expandedIndex === index && <Text style={styles.answer}>{faq.answer}</Text>}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    content: {
        flex: 1,
    },
    faqItem: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 10,
    },
    questionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    question: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    answer: {
        fontSize: 14,
        color: '#555',
        marginTop: 10,
        textAlign: 'justify',
    },
});

export default Help;
