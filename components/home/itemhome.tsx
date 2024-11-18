import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import { ImagesAssets } from "../../assets/images/ImagesAssets";
import { globalFont } from "../../utils/const";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ModalMenu from "../modal/modal.menu";
import React, { useEffect, useState } from "react";
import ModalDashBoard from "../modal/modal.dashboard";
import { db } from '../../fireBaseConfig';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import ModalLearnOrTeach from "../modal/modal.learnorteach";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Feather from '@expo/vector-icons/Feather';

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
        fontSize: 16,
        fontWeight: 'bold'
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
        padding: 8,
        backgroundColor: '#02929A',
        borderRadius: 10,

    },
    itembottombuttontext: {
        fontSize: 12,
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
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [courseVocabulary, setCourseVocabulary] = useState({ totalVocabulary: 0, learnedVocabulary: 0 });

    const fetchVocabularyData = (courseId, currentUserId) => {
        const lessonsRef = query(collection(db, 'Lessons'), where('courseId', '==', courseId));
    
        onSnapshot(lessonsRef, (lessonsSnapshot) => {
            let totalVocabularyCount = 0;
            let learnedVocabularyCount = 0;
    
            const lessonPromises = lessonsSnapshot.docs.map(async (lessonDoc) => {
                const lessonId = lessonDoc.id;
    
                // Vocabulary count for each lesson
                const vocabSnapshot = await getDocs(query(collection(db, 'Vocabularies'), where('lessonId', '==', lessonId)));
                totalVocabularyCount += vocabSnapshot.size;
    
                // Learned vocabulary count for each lesson
                const learnedSnapshot = await getDocs(
                    query(
                        collection(db, 'User_Progress'),
                        where('user_id', '==', currentUserId),
                        where('lesson_id', '==', lessonId),
                        where('status', 'in', ['đã học'])
                    )
                );
                learnedVocabularyCount += learnedSnapshot.size;
            });
    
            // Wait for lesson promises to complete
            Promise.all(lessonPromises).then(() => {
                setCourseVocabulary({
                    totalVocabulary: totalVocabularyCount,
                    learnedVocabulary: learnedVocabularyCount,
                });
            });
        });
    };

    useEffect(() => {
        const userCourseUnsubscribe = onSnapshot(
            collection(db, 'User_Course'),
            (snapshot) => {
                const userCourseData = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setUserCourses(userCourseData);
            }
        );
    
        const coursesUnsubscribe = onSnapshot(
            collection(db, 'Courses'),
            (snapshot) => {
                const courseData = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setCourses(courseData);
            }
        );
    
        // Real-time listener on User_Progress
        const unsubscribeProgress = onSnapshot(
            collection(db, 'User_Progress'),
            () => {
                if (filteredCourses.length > 0) {
                    fetchVocabularyData(filteredCourses[0].id, userId);  // Fetch and update vocabulary in real-time
                }
            }
        );
    
        return () => {
            userCourseUnsubscribe();
            coursesUnsubscribe();
            unsubscribeProgress();
        };
    }, [filteredCourses, userId]);

    useEffect(() => {
        const matchedCourses = userCourses
            .filter(userCourse => userCourse.user_id === userId)
            .map(userCourse => {
                const course = courses.find(c => c.courseId === userCourse.course_id);
                return course ? { ...course, progress: userCourse.progress } : null;
            })
            .filter(course => course !== null);

        setFilteredCourses(matchedCourses);
    }, [userCourses, courses, userId]);

    if (filteredCourses.length === 0) {
        return (
            <View style={styles.box}>
                <Text style={styles.title}>Ở đây chưa có khóa học nào!</Text>
                <Text style={styles.description}>
                    Bạn vẫn chưa tạo ra tham gia khóa học nào. Để tạo tham gia một khóa học, hãy nhấn vào nút bên dưới.
                </Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("CourseScreen")}>
                    <Text style={styles.buttonText}>Tham gia khóa học</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View>
            {filteredCourses.map((course, index) => (
                <View key={index} style={styles.container}>
                    <View style={styles.itemtop}>
                        <Image
                            style={styles.imageuser}
                            source={{ uri: course.imageUrl || 'https://via.placeholder.com/150' }}
                        />
                        <Text style={styles.itemtoptext}>{course.title || 'N/A'}</Text>
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
                    <Text style={styles.itemcentertext}>
                        {course.progress || '0'}% 
                    </Text>
                    <Text style={styles.itemcentertext}>
                        {courseVocabulary.learnedVocabulary}/{courseVocabulary.totalVocabulary} mục đã học
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
                            <Text style={styles.itembottomtextchild}>{courseVocabulary.totalVocabulary || 0}</Text>
                        </View>
                        <View style={styles.itembottomchild}>
                            <Feather name="bookmark" size={24} color="black" />
                            <Text style={styles.itembottomtextchild}>{courseVocabulary.learnedVocabulary || 0}</Text>
                        </View>
                        <TouchableOpacity style={styles.itembottombutton}>
                            <Text style={styles.itembottombuttontext}>Ôn tập thông thường</Text>
                        </TouchableOpacity>
                        <MaterialIcons 
                            name="dashboard" 
                            size={24} 
                            color="black" 
                            onPress={() => {
                                setSelectedCourseId(course.id); // Lưu courseId trước khi mở modal dashboard
                                setModalVisible2(true);
                            }}
                        />
                    </View>
                </View>
            ))}
            <ModalMenu 
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                courseId={selectedCourseId}
                userId={userId}   // Truyền courseId vào modal
            />
            <ModalDashBoard 
                modalVisible={modalVisible2}
                setModalVisible={setModalVisible2}
      
            />
        </View>
    );
};


export default ItemHome;