import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from "react-native";
import AppHeader from "../navigation/app.header";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { globalFont } from "../../utils/const";
import ModalLearnOrTeach from "../modal/modal.learnorteach";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import AntDesign from '@expo/vector-icons/AntDesign';
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth"; // Assuming you're using Firebase Auth for user management.
import { db } from "../../fireBaseConfig";
import { useUser } from "./UserContext";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e6f4f5',
    },
    box: {
        marginHorizontal: 20
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
      },
    boxchange: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 20,
        marginLeft: 20,
        padding: 10,
        backgroundColor: '#02929A',
        width: 200,
        borderRadius: 10,
    },
    boxchangetext: {
        color: '#fff',
        fontFamily: globalFont,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        fontFamily: globalFont,
    },
    description: {
        fontSize: 16,
        textAlign: 'justify',
        color: '#555',
        marginBottom: 30,
        fontFamily: globalFont,
    },
    button: {
        backgroundColor: '#02929A',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: globalFont,
    },
    courseItem: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 10,
        marginHorizontal: 20,
        borderRadius: 10,
        elevation: 3,
    },
    courseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: globalFont,
    },
    courseDescription: {
        fontSize: 14,
        color: '#555',
        fontFamily: globalFont,
    },
    courseImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
      },
      categoryIcon: {
        position: 'absolute',
        left: 10,
        top: -15,
        backgroundColor: '#fff',
        borderRadius: 25,
        padding: 5,
      },
      iconImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
      },
      detailsContainer: {
        paddingHorizontal: 5,
        paddingTop: 10,
      },
      courseInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
      },
      categoryText: {
        fontSize: 12,
        color: '#555',
      },
      authorText: {
        fontSize: 12,
        color: '#555',
      },
 
      statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 5,
        borderTopWidth: 1,
        borderTopColor: '#eee',
      },
      stat: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      statText: {
        fontSize: 14,
        color: '#999',
        marginLeft: 5,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
});

const TeachScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [courses, setCourses] = useState([]); // Danh sách khóa học
    const navigation: NavigationProp<RootStackParamList> = useNavigation();
    const { userInfo } = useUser();
    // Tạo dữ liệu mẫu
    const auth = getAuth(); // Firebase Auth instance
    useEffect(() => {
        if (!userInfo) return; // Ensure a user is logged in

        // Query Firestore to fetch courses created by the current user
        const coursesQuery = query(
            collection(db, 'Courses'),
            where('idUser', '==', userInfo.data.user.id) // Match the creatorId field to the user's ID
        );

        const unsubscribe = onSnapshot(coursesQuery, (snapshot) => {
            const coursesData = snapshot.docs.map(doc => {
                const data = doc.data();
                const createdAt = data.createdAt ? data.createdAt.toDate() : null;
                return { id: doc.id, ...data, createdAt };
            });
            setCourses(coursesData);
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, [userInfo]); // Re-run if the user changes

    // Hàm render từng khóa học
    const renderCourseItem = ({ item }) => (
        <View style={styles.cardContainer}>

        <TouchableOpacity 
          onPress={() => navigation.navigate("ReviewCourseScreen", { courseId: item.id })}
        >
          <View style={styles.header}>
            <Image
              source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
              style={styles.courseImage}
            />
            <View style={styles.categoryIcon}>
              <Image
                source={{ uri: item.imageUser || 'https://via.placeholder.com/150' }}
                style={styles.iconImage}
              />
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.courseInfo}>
              <Text style={styles.categoryText}>{item.language ? item.language.trim() : 'N/A'}</Text>
              <Text style={styles.authorText}>{item.created_by ? item.created_by.trim() : 'N/A'}</Text>
            </View>
            <Text style={styles.courseTitle}>{item.title ? item.title.trim() : 'N/A'}</Text>

            <View style={styles.statsContainer}>
              <View style={styles.stat}>
              </View>
              <View style={styles.stat}>
                <AntDesign name="clockcircleo" size={24} color="black" />
                <Text style={styles.statText}>
                  {item.createdAt ? format(item.createdAt, 'dd/MM/yyyy') : 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        </View>

    );

    return (
        <View style={styles.container}>
            <AppHeader />
            <TouchableOpacity style={styles.boxchange} onPress={() => setModalVisible(true)}>
                <FontAwesome name="graduation-cap" size={20} color="white" />
                <Text style={styles.boxchangetext}>Đang dạy</Text>
                <MaterialIcons name="arrow-drop-down" size={24} color="white" />
            </TouchableOpacity>
            <ModalLearnOrTeach
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
            />
            {courses.length > 0 ? (
                <FlatList
                    data={courses}
                    renderItem={renderCourseItem}
                    keyExtractor={(item) => item.id}
                    style={styles.box}
                />
            ) : (
                <View style={styles.box}>
                    <Text style={styles.title}>Ở đây chưa có khóa học nào!</Text>
                    <Text style={styles.description}>
                        Bạn vẫn chưa tạo ra một khóa học nào. Để tạo một khóa học, chia sẻ với bạn bè hoặc học viên và xem các thống kê, hãy nhấn vào nút bên dưới.
                    </Text>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("CourseScreen")}>
                        <Text style={styles.buttonText}>Tạo khóa học</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default TeachScreen;
