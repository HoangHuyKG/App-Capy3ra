
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import AppHeader from '../navigation/app.header';
import { globalFont } from '../../utils/const';
import { ImagesAssets } from '../../assets/images/ImagesAssets';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from './UserContext';
import AddLessonModal from '../modal/modal.addlession';
import { db } from '../../fireBaseConfig';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from 'react';

const ReviewCourseScreen = () => {
    const navigation: NavigationProp<RootStackParamList> = useNavigation();
    const route = useRoute();
    const { courseId } = route.params || {}; // Sử dụng courseId từ params nếu có
    const [modalVisibleadd, setModalVisibleadd] = useState(false);
    const [lessons, setLessons] = useState([]);
    const [courseData, setCourseData] = useState(null);

    const { userInfo } = useUser();
    const currentUserId = userInfo?.data?.user?.id;

    // Lấy dữ liệu khóa học nếu courseId tồn tại
    useEffect(() => {
        if (courseId) {
            const courseRef = doc(db, 'Courses', courseId);
            const unsubscribe = onSnapshot(courseRef, (doc) => {
                if (doc.exists()) {
                    setCourseData({ id: doc.id, ...doc.data() });
                }
            });
            return () => unsubscribe();
        }
    }, [courseId]);

    // Lấy danh sách bài học theo courseId
    useEffect(() => {
        if (courseId) {
            const lessonsRef = collection(db, 'Lessons');
            const q = query(lessonsRef, where('courseId', '==', courseId));
            
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const lessonsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setLessons(lessonsData);
            });
            
            return () => unsubscribe();
        }
    }, [courseId]);

    if (!courseData) {
        return (
            <View style={styles.container}>
                <Text>Không có dữ liệu khóa học.</Text>
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <AppHeader />
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>{courseData.title}</Text>
                    <Text style={styles.subHeaderText}>{courseData.description}</Text>
                    <View style={styles.creator}>
                        <Image
                            source={{ uri: courseData.imageUser || 'https://randomuser.me/api/portraits/women/44.jpg' }}
                            style={styles.avatar}
                        />
                        <Text style={styles.creatorName}>{courseData.created_by}</Text>
                        {currentUserId === courseData.idUser ? (
                            <View style={styles.boxbutton}>
                                <TouchableOpacity style={styles.buttonstudy} onPress={() => setModalVisibleadd(true)}>
                                    <Entypo name="circle-with-plus" size={20} color="white" />
                                    <Text style={styles.textbutton}>Thêm bài học</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.buttonstudy} onPress={() => navigation.navigate("EditCourse", { course: courseData.id })}>
                                    <MaterialIcons name="edit" size={20} color="white" />
                                    <Text style={styles.textbutton}>Chỉnh sửa</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View></View>
                        )}
                    </View>
                </View>
                
                <View style={styles.daySection}>
                    {lessons.length > 0 ? (
                        lessons.map((lesson) => (
                            <TouchableOpacity 
                                key={lesson.id} 
                                style={styles.dayCard} 
                                onPress={() => navigation.navigate("DetailVocabularyDay", { lessonId: lesson.id, courseData: courseData})}
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
        
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: "#25B212",
        padding: 10,
        borderRadius: 10,
        marginRight: 10
    },
    boxcenter: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center'
    },
    textbutton: {
        color: "#fff",
        fontFamily: globalFont,
        fontSize: 14,
        fontWeight: "bold",
        marginLeft: 5
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
    boxbutton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 10
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
