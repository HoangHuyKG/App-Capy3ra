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
import { collection, query, where, onSnapshot } from 'firebase/firestore';


const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        backgroundColor: '#fff',
        height: 200,
        alignSelf: 'stretch',
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 20
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
        marginTop: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemcentertext: {
        fontFamily: globalFont,
        fontSize: 16,
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
        width: '90%',
        backgroundColor: '#02929A',
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
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itembottomtextchild: {
        fontSize: 16,
        fontFamily: globalFont
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
    }

})
const ItemHome = ({ userId }) => {
    const [courses, setCourses] = useState([]);
    const [userCourses, setUserCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null); // State để lưu courseId

    useEffect(() => {
        // Lấy tất cả User_Course
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

        // Lấy tất cả Courses
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

        return () => {
            userCourseUnsubscribe();
            coursesUnsubscribe();
        };
    }, []);

    useEffect(() => {
        const matchedCourses = userCourses
            .filter(userCourse => userCourse.user_id === userId)
            .map(userCourse => {
                const course = courses.find(c => c.courseId === userCourse.course_id);
                return {
                    ...course,
                    progress: userCourse.progress,
                };
            });

        setFilteredCourses(matchedCourses);
    }, [userCourses, courses, userId]);

    if (filteredCourses.length === 0) return <Text>Bạn chưa có trong khóa học nào!!!</Text>;

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
                    <Text style={styles.itemcentertext}>
                        {course.progress || '0%'} đã hoàn thành
                    </Text>
                    <View style={styles.progressBarContainer}>
                        <View style={styles.progressBar}>
                            <View style={styles.progress}></View>
                        </View>
                    </View>
                    <View style={styles.itembottom}>
                        <View style={styles.itembottomchild}>
                            <AntDesign name="book" size={24} color="black" />
                            <Text style={styles.itembottomtextchild}>244</Text>
                        </View>
                        <View style={styles.itembottomchild}>
                            <MaterialCommunityIcons name="lightning-bolt-outline" size={24} color="black" />
                            <Text style={styles.itembottomtextchild}>22</Text>
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