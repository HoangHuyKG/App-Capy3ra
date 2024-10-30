import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import AppHeader from '../navigation/app.header';
import { globalFont } from '../../utils/const';
import { ImagesAssets } from '../../assets/images/ImagesAssets';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import VocabularyCard from '../modal/modal.vocabularycard';
import { useUser } from './UserContext';
import AddLessonModal from '../modal/modal.addlession';
import { db } from '../../fireBaseConfig'; // Import cấu hình Firebase
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const ReviewCourseScreen = () => {
    const navigation: NavigationProp<RootStackParamList> = useNavigation();
    const route = useRoute();
    const { course } = route.params; // Lấy dữ liệu từ params

    // Kiểm tra nếu course không tồn tại
    if (!course) {
        return (
            <View style={styles.container}>
                <Text>Không có dữ liệu khóa học.</Text>
            </View>
        );
    }

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleadd, setModalVisibleadd] = useState(false);
    const [lessons, setLessons] = useState([]); // Dữ liệu bài học
    const { userInfo } = useUser();
    const currentUserId = userInfo?.data?.user?.id;

    // Lấy courseId từ course
    const courseId = course.id; // Hoặc course.courseId tùy thuộc vào cách bạn định nghĩa course

    // Lắng nghe dữ liệu bài học theo courseId
    useEffect(() => {
        const lessonsRef = collection(db, 'Lessons');
        const q = query(lessonsRef, where('courseId', '==', courseId));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const lessonsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setLessons(lessonsData);
        });

        return () => unsubscribe(); // Hủy đăng ký khi component unmount
    }, [courseId]);

    return (
        <View style={styles.container}>
            <AppHeader />
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>{course.title}</Text>
                    <Text style={styles.subHeaderText}>{course.description}</Text>
                    <View style={styles.creator}>
                        <Image
                            source={{ uri: course.imageUser || 'https://randomuser.me/api/portraits/women/44.jpg' }}
                            style={styles.avatar}
                        />
                        <Text style={styles.creatorName}>{course.created_by}</Text>
                        {currentUserId === course.idUser ? (
                            <TouchableOpacity style={styles.buttonstudy} onPress={() => setModalVisibleadd(true)}>
                                <Text style={styles.textbutton}>Thêm bài học</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.buttonstudy} onPress={() => setModalVisible(true)}>
                                <Text style={styles.textbutton}>Bắt đầu học</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                {/* Hiển thị danh sách bài học */}
                <View style={styles.daySection}>
                    {lessons.length > 0 ? (
                        lessons.map((lesson) => (
                        <TouchableOpacity 
                            key={lesson.id} 
                            style={styles.dayCard} 
                            onPress={() => navigation.navigate("DetailVocabularyDay", { lessonId: lesson.id })} // Truyền lessonId qua params
                        >
                            <Image
                                source={ImagesAssets.logodetail}
                                style={styles.dayImage}
                            />
                            <Text style={styles.textimage}>{lesson.title}</Text>
                        </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={styles.noLessonsText}>Chưa có bài học nào.</Text>
                    )}
                </View>
                <VocabularyCard modalVisible={modalVisible} setModalVisible={setModalVisible} />
                <AddLessonModal modalVisible={modalVisibleadd} setModalVisible={setModalVisibleadd} courseId={courseId} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e6f4f5',
    },
    buttonstudy: {
        backgroundColor: "#25B212",
        padding: 10,
        borderRadius: 10,
    },
    textbutton: {
        color: "#fff",
        fontFamily: globalFont,
        fontSize: 14,
        fontWeight: "bold"
    },
    header: {
        borderTopWidth: 1,
        borderTopColor: '#fff',
        backgroundColor: '#02929A',
        padding: 20,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    headerText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    subHeaderText: {
        color: '#fff',
        marginTop: 5,
    },
    creator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        justifyContent: "space-between"
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    creatorName: {
        color: '#fff',
    },
    daySection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        padding: 20,
    },
    dayCard: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        width: '45%', // Đặt chiều rộng của card bài học
    },
    dayImage: {
        backgroundColor: '#F2F2F7',
        borderRadius: 10,
        width: 100,
        height: 100,
    },
    textimage: {
        fontFamily: globalFont,
        fontWeight: '600',
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center', // Căn giữa văn bản
    },
    noLessonsText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
    }
});

export default ReviewCourseScreen;
