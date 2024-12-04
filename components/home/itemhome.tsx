import React, { useCallback, useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
} from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../../fireBaseConfig';
import { NavigationProp, useNavigation } from "@react-navigation/native";
import ModalMenu from "../modal/modal.menu";
import ModalDashBoard from "../modal/modal.dashboard";
import { globalFont } from "../../utils/const";
import ReviewVocabularyModal from "../modal/modal.ontap";

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        backgroundColor: '#fff',
        height: 200,
        alignSelf: 'stretch',
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 20,
        display: 'flex',
        justifyContent: 'space-between'
    },
    itemtop: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    itemtoptext: {
        fontFamily: globalFont,
        width: '80%',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10
    },
    itemcenter: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemcentertext: {
        fontFamily: globalFont,
        fontSize: 16,
        fontWeight: 'bold'
    },
    itemcentertextsmall: {
        fontFamily: globalFont,
        fontSize: 12,
    },
    imageuser: {
        height: 40,
        width: 40,
        backgroundColor: '#fff',
        borderRadius: 20
    },
    progressBarContainer: {
        marginTop: 10,
        shadowColor: '#cfd3d3',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        borderRadius: 7.5,
        backgroundColor: '#cfd3d3',
        marginBottom: 15,
    },
    progressBar: {
        width: '100%',
        height: 15,
        backgroundColor: '#cfd3d3',
        borderRadius: 7.5,
        overflow: 'hidden',
    },
    progress: {
        height: '100%',
        backgroundColor: '#02929A',  // Màu của thanh tiến trình
        borderRadius: 7.5,
        overflow: 'hidden',
    },

    itembottom: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itembottomchild: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itembottomtextchild: {
        fontSize: 16,
        fontFamily: globalFont,
        fontWeight: 'bold'
    },
    itembottombutton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 150,
        padding: 8,
        backgroundColor: '#02929A',
        borderRadius: 10,

    },
    itembottombuttontext: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '800',
        fontFamily: globalFont,
        color: "#fff"
    },
    boxchange: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 20,
        marginLeft: 20,
        padding: 10,
        backgroundColor: '#02929A',
        width: 200,
        borderRadius: 10
    },
    boxchangetext: {
        color: '#fff',
        fontFamily: globalFont
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333', // Darker color for the title text
        fontFamily: globalFont

    },
    description: {
        fontSize: 16,
        textAlign: 'justify',
        color: '#555', // Gray color for description text
        marginBottom: 30,
        fontFamily: globalFont

    },
    button: {
        backgroundColor: '#02929A', // Teal button color
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: globalFont
    },
    box: {
        display: 'flex',
        alignItems: 'center',
        marginHorizontal: 20,
    },

})



const ItemHome = ({ userId }) => {
    const navigation = useNavigation();
    const [courses, setCourses] = useState([]);
    const [userCourses, setUserCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [courseVocabularyMap, setCourseVocabularyMap] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [reviewModalVisible, setReviewModalVisible] = useState(false)
    const [vocabularies, setVocabularies] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(userId); // userId đã có sẵn
    const [lessonId, setLessonId] = useState(null);
    const [courseId, setCourseId] = useState(null);

    const fetchCourses = useCallback(async () => {
        const coursesRef = collection(db, "Courses");
        const userCoursesRef = query(
            collection(db, "User_Course"),
            where("user_id", "==", userId)
        );

        try {
            const [coursesSnapshot, userCoursesSnapshot] = await Promise.all([
                getDocs(coursesRef),
                getDocs(userCoursesRef),
            ]);

            const allCourses = coursesSnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            const userCourses = userCoursesSnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));

            setCourses(allCourses);
            setUserCourses(userCourses);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    }, [userId]);

    const calculateVocabulary = useCallback(async (courses) => {
        const vocabularyMap = {};

        await Promise.all(
            courses.map(async (course) => {
                const lessonsRef = query(
                    collection(db, "Lessons"),
                    where("courseId", "==", course.id)
                );

                const lessonsSnapshot = await getDocs(lessonsRef);
                let totalVocabulary = 0;
                let learnedVocabulary = 0;

                await Promise.all(
                    lessonsSnapshot.docs.map(async (lessonDoc) => {
                        const lessonId = lessonDoc.id;

                        // Count total vocabularies
                        const vocabSnapshot = await getDocs(
                            query(collection(db, "Vocabularies"), where("lessonId", "==", lessonId))
                        );
                        totalVocabulary += vocabSnapshot.size;

                        // Count learned vocabularies
                        const learnedSnapshot = await getDocs(
                            query(
                                collection(db, "User_Progress"),
                                where("user_id", "==", userId),
                                where("lesson_id", "==", lessonId),
                                where("status", "in", ["đã học"])
                            )
                        );
                        learnedVocabulary += learnedSnapshot.size;
                    })
                );

                vocabularyMap[course.id] = {
                    totalVocabulary,
                    learnedVocabulary,
                };
            })
        );

        setCourseVocabularyMap(vocabularyMap);
    }, [userId]);

    const filterUserCourses = useCallback(() => {
        const matchedCourses = userCourses
            .map((userCourse) => {
                const course = courses.find((c) => c.courseId === userCourse.course_id);
                return course ? { ...course, progress: userCourse.progress } : null;
            })
            .filter(Boolean);

        setFilteredCourses(matchedCourses);
    }, [userCourses, courses]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchCourses();
        setRefreshing(false);
    }, [fetchCourses]);

    useEffect(() => {
        const unsubscribe = fetchCourses();
        return () => unsubscribe;
    }, [fetchCourses]);

    useEffect(() => {
        filterUserCourses();
    }, [userCourses, courses, filterUserCourses]);

    useEffect(() => {
        if (filteredCourses.length > 0) calculateVocabulary(filteredCourses);
    }, [filteredCourses, calculateVocabulary]);

    if (filteredCourses.length === 0) {
        return (

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#02929A"]} // Màu sắc của spinner khi làm mới
                    />
                }
            >
                <View style={styles.box}>

                    <Text style={styles.title}>Ở đây chưa có khóa học nào!</Text>
                    <Text style={styles.description}>
                        Bạn vẫn chưa tạo ra tham gia khóa học nào. Để tạo tham gia một khóa học, hãy nhấn vào nút bên dưới.
                    </Text>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("CourseScreen")}>
                        <Text style={styles.buttonText}>Tham gia khóa học</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        );
    }

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#02929A"]} // Màu sắc của spinner khi làm mới
                />
            }
        >
            {filteredCourses.map((course, index) => {
                const vocabulary = courseVocabularyMap[course.id] || { totalVocabulary: 0, learnedVocabulary: 0 };
                return (
                    <View key={index} style={styles.container}>
                        <View style={styles.itemtop}>
                            <Image
                                source={{
                                    uri: course.imageUrl.startsWith('/data/user/')
                                        ? `file://${course.imageUrl}`
                                        : course.imageUrl || 'https://via.placeholder.com/150',
                                }}
                                style={styles.imageuser}
                            />

                            <Text style={styles.itemtoptext}
                                numberOfLines={1}
                                ellipsizeMode="tail">{course.title || 'N/A'}</Text>
                            <Entypo
                                name="dots-three-vertical"
                                size={24}
                                color="black"
                                onPress={() => {
                                    setSelectedCourseId(course.id); // Lưu courseId trước khi mở modal
                                    setModalVisible(true);
                                }}
                            />
                        </View>
                        <View style={styles.itemcenter}>
                            <Text style={styles.itemcentertext}>{course.progress || '0'}%</Text>
                            <Text style={styles.itemcentertext}>
                                {vocabulary.learnedVocabulary}/{vocabulary.totalVocabulary} mục đã học
                            </Text>
                        </View>
                        <View style={styles.progressBarContainer}>
                            <View style={styles.progressBar}>
                                <View
                                    style={[styles.progress, { width: `${course.progress || 0}%` }]} // Cập nhật chiều rộng theo course.progress
                                />
                            </View>
                        </View>
                        <View style={styles.itembottom}>
                            <View style={styles.itembottomchild}>
                                <Feather name="book" size={24} color="black" />
                                <Text style={styles.itembottomtextchild}>{vocabulary.totalVocabulary}</Text>
                            </View>
                            <View style={styles.itembottomchild}>
                                <Feather name="bookmark" size={24} color="black" />
                                <Text style={styles.itembottomtextchild}>{vocabulary.learnedVocabulary}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.itembottombutton}
                                onPress={async () => {
                                    // Đặt courseId hiện tại
                                    setCourseId(course.id);

                                    // Lấy dữ liệu vocabularies và lessonId liên quan đến course
                                    const lessonsRef = query(
                                        collection(db, "Lessons"),
                                        where("courseId", "==", course.id)
                                    );
                                    const lessonsSnapshot = await getDocs(lessonsRef);

                                    if (!lessonsSnapshot.empty) {
                                        const firstLesson = lessonsSnapshot.docs[0]; // Lấy bài học đầu tiên làm ví dụ
                                        setLessonId(firstLesson.id);

                                        // Lấy vocabularies liên quan đến bài học
                                        const vocabSnapshot = await getDocs(
                                            query(
                                                collection(db, "Vocabularies"),
                                                where("lessonId", "==", firstLesson.id)
                                            )
                                        );
                                        const vocabList = vocabSnapshot.docs.map(doc => ({
                                            id: doc.id,
                                            ...doc.data()
                                        }));
                                        setVocabularies(vocabList);
                                    }

                                    // Hiển thị modal
                                    setReviewModalVisible(true);
                                }}
                            >
                                <Text style={styles.itembottombuttontext}>Ôn tập</Text>
                            </TouchableOpacity>

                            <MaterialIcons
                                name="dashboard"
                                size={24}
                                color="black"
                                onPress={() => {
                                    setSelectedCourseId(course.id);
                                    setModalVisible2(true);
                                }}
                            />
                        </View>
                    </View>
                );
            })}
            <ModalMenu
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                courseId={selectedCourseId}
                userId={userId}
            />
            <ModalDashBoard
                modalVisible={modalVisible2}
                setModalVisible={setModalVisible2}
                vocabularies={vocabularies}
                currentUserId={currentUserId}
                lessonId={lessonId}
                courseId={courseId}
            />
            <ReviewVocabularyModal
                modalVisible={reviewModalVisible}
                setModalVisible={setReviewModalVisible}
                vocabularies={vocabularies}
                currentUserId={currentUserId}
                lessonId={lessonId}
                courseId={courseId}
            />

        </ScrollView>
    );
};

export default ItemHome;