import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { ImagesAssets } from '../../assets/images/ImagesAssets';
import { useRoute } from '@react-navigation/native';
import AppHeader from '../navigation/app.header';
import { globalFont } from '../../utils/const';
import AntDesign from '@expo/vector-icons/AntDesign';
import { db } from '../../fireBaseConfig';
import { doc, collection, query, where, onSnapshot, addDoc, getDocs } from 'firebase/firestore';
import AddVocabularyModal from '../modal/modal.addvocalbulary';
import VocabularyCard from '../modal/modal.vocabularycard';
import EditVocabularyModal from '../modal/modal.editvocalbulary';
import EditLessonModal from '../modal/modal.editlesson';
import { useUser } from './UserContext';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
const DetailVocabularyDay = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisiblelearn, setModalVisiblelearn] = useState(false);
    const [modalVisibleedit, setModalVisibleedit] = useState(false);
    const [modalVisibleeditlesson, setModalVisibleeditlesson] = useState(false);
    const [lessonData, setLessonData] = useState(null);
    const [vocabularies, setVocabularies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [vocabId, setVocabId] = useState(null); // State to store selected vocabId
    const [progressPercentage, setProgressPercentage] = useState(0);
    const route = useRoute();
    const { lessonId } = route.params;
    const { userInfo } = useUser();
    const currentUserId = userInfo?.data?.user?.id;
    const { courseData } = route.params;

    const calculateLearningProgress = async (currentUserId, lessonId) => {
        try {
            const vocabQuerySnapshot = await getDocs(
                query(collection(db, 'Vocabularies'), where('lessonId', '==', lessonId))
            );
            const totalVocabulary = vocabQuerySnapshot.size;

            if (totalVocabulary === 0) {

                return 0;
            }

            const progressQuerySnapshot = await getDocs(
                query(
                    collection(db, 'User_Progress'),
                    where('user_id', '==', currentUserId),
                    where('lesson_id', '==', lessonId),
                    where('status', 'in', ['đã học']) // Learning statuses
                )
            );
            const learnedVocabulary = progressQuerySnapshot.size;
            const progressPercentage = (learnedVocabulary / totalVocabulary) * 100;

            return progressPercentage;
        } catch (error) {
            console.error("Error calculating learning progress: ", error);
            return 0;
        }
    };

    useEffect(() => {
        // Fetch Lesson Data in Real-Time
        const fetchLessonData = () => {
            if (lessonId) {
                const lessonDocRef = doc(db, 'Lessons', lessonId);
                const unsubscribeLesson = onSnapshot(lessonDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setLessonData(docSnap.data());
                    } else {
                        console.log("No such document!");
                    }
                }, (error) => {
                    console.error("Error fetching lesson data: ", error);
                });

                return unsubscribeLesson;
            }
        };

        // Fetch Vocabulary Data in Real-Time
        const fetchVocabularyData = () => {
            const vocabCollection = collection(db, 'Vocabularies');
            const vocabQuery = query(vocabCollection, where('lessonId', '==', lessonId));

            const unsubscribeVocab = onSnapshot(vocabQuery, async (snapshot) => {
                const vocabList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setVocabularies(vocabList);
                // Cập nhật lại tiến trình học sau mỗi thay đổi từ vựng
                const progress = await calculateLearningProgress(currentUserId, lessonId);
                setProgressPercentage(progress);
            }, (error) => {
                console.error("Error fetching vocabulary data: ", error);
            });

            return unsubscribeVocab;
        };

        // Real-Time Progress Update
        const updateProgressRealTime = () => {
            const progressQuery = query(
                collection(db, 'User_Progress'),
                where('user_id', '==', currentUserId),
                where('lesson_id', '==', lessonId),
                where('status', 'in', ['đã học'])
            );
            const unsubscribeProgress = onSnapshot(progressQuery, async () => {
                const progress = await calculateLearningProgress(currentUserId, lessonId);
                setProgressPercentage(progress);
            });
            return unsubscribeProgress;
        };

        setLoading(true); // Set loading state to true initially
        const unsubscribeLesson = fetchLessonData();
        const unsubscribeVocab = fetchVocabularyData();
        const unsubscribeProgress = updateProgressRealTime();

        // Update loading state once data is fetched
        const timeoutId = setTimeout(() => setLoading(false), 500); // Set a small delay to handle async updates

        return () => {
            clearTimeout(timeoutId);
            unsubscribeLesson();
            unsubscribeVocab();
            unsubscribeProgress();
        };
    }, [lessonId, currentUserId]);


    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (!lessonData) {
        return <Text>Không tìm thấy dữ liệu bài học.</Text>;
    }

    const handleAddUserCourse = async () => {
        try {
            if (!currentUserId || !lessonId || !courseData?.courseId) {
                console.warn("Thiếu thông tin cần thiết để lưu khóa học.");
                return;
            }

            const userCourseId = `${currentUserId}_${courseData.courseId}`;

            // Kiểm tra khóa học trong Firestore
            const userCourseQuery = query(
                collection(db, 'User_Course'),
                where('user_course_id', '==', userCourseId) // So sánh bằng ID duy nhất
            );
            const querySnapshot = await getDocs(userCourseQuery);

            // Nếu chưa tồn tại, thêm bản ghi mới
            if (querySnapshot.empty) {

                await addDoc(collection(db, 'User_Course'), {
                    user_course_id: userCourseId,
                    user_id: currentUserId,
                    course_id: courseData.courseId, // Đảm bảo giá trị này đúng
                    lesson_id: lessonId,
                    progress: 0, // Mặc định là 0 khi bắt đầu học
                    createdAt: new Date(), // Thêm timestamp nếu cần
                });
            } else {
                console.log("Khóa học này đã tồn tại trong User_Course.");
            }
        } catch (error) {
            console.error("Lỗi khi thêm User_Course:", error);
        }
    };


    const renderItem = ({ item }) => (
        currentUserId === courseData.idUser ? (
            <TouchableOpacity onPress={() => {
                setVocabId(item.id);
                setModalVisibleedit(true);
            }}>
                <View style={styles.tableRow}>
                    <Text style={styles.columnEn} numberOfLines={1} ellipsizeMode="tail">
                        {item.englishWord}
                    </Text>
                    <Text style={styles.columnVn} numberOfLines={1} ellipsizeMode="tail">
                        {item.vietnameseWord}
                    </Text>
                    <Text style={styles.columnType} numberOfLines={1} ellipsizeMode="tail">
                        {item.wordType}
                    </Text>
                </View>
            </TouchableOpacity>
        ) : (
            <View>
                <View style={styles.tableRow}>
                    <Text style={styles.columnEn} numberOfLines={1} ellipsizeMode="tail">
                        {item.englishWord}
                    </Text>
                    <Text style={styles.columnVn} numberOfLines={1} ellipsizeMode="tail">
                        {item.vietnameseWord}
                    </Text>
                    <Text style={styles.columnType} numberOfLines={1} ellipsizeMode="tail">
                        {item.wordType}
                    </Text>
                </View>
            </View>
        )
    );

    return (
        <View style={styles.container}>
            <AppHeader />
            <View style={styles.containerbox}>
                <View style={styles.header}>


                    <View style={styles.creator}>
                        <View style={styles.boxdescription}>
                            <Text style={styles.textdescription}>
                                {lessonData.description}
                            </Text>
                        </View>
                        {currentUserId === courseData.idUser && (
                            <View style={styles.buttonbox}>
                                 <TouchableOpacity
                                    style={styles.buttonstudya}
                                    onPress={() => setModalVisible(true)}
                                >
                                    <View style={styles.buttonboxx}>
                                        <Entypo name="circle-with-plus" size={24} color="white" />

                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.buttonstudyb}
                                    onPress={() => setModalVisibleeditlesson(true)}
                                >
                                    <View style={styles.buttonboxx}>
                                     <MaterialIcons name="edit" size={24} color="white" />
                                    </View>
                                </TouchableOpacity>
                               
                            </View>
                        )}
                    </View>

                </View>
            </View>
            <View style={styles.dayInfo}>
                <Image source={ImagesAssets.logodetail} style={styles.dayImage} />
                <View style={styles.dayInfoBox}>
                    <Text style={styles.dayText}>{lessonData.title}</Text>
                    <View style={styles.progressBarContainer}>
                        <View style={styles.progressBar}>
                            <View style={[styles.progress, { width: `${progressPercentage}%` }]} />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.buttonstudy} onPress={() => {
                        handleAddUserCourse();
                        setModalVisiblelearn(true);
                    }}>
                        <Text style={styles.reviewText}>Học từ mới</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.mainContent}>
             
                <FlatList
                    data={vocabularies}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            </View>

            <AddVocabularyModal modalVisible={modalVisible} setModalVisible={setModalVisible} lessonId={lessonId} />
            <VocabularyCard modalVisible={modalVisiblelearn} setModalVisible={setModalVisiblelearn} vocabularies={vocabularies} currentUserId={currentUserId} lessonId={lessonId} courseId={courseData.courseId} courseTitle={courseData.title} />
            <EditVocabularyModal modalVisible={modalVisibleedit} setModalVisible={setModalVisibleedit} vocabId={vocabId} />
            <EditLessonModal modalVisible={modalVisibleeditlesson} setModalVisible={setModalVisibleeditlesson} lessonId={lessonId} />
        </View>
    );
};
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#e6f4f5',
    },
    containerbox: {
        backgroundColor: '#e6f4f5',
    },
    buttonboxx: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textdescription: {
        fontSize: 16,
        fontFamily: globalFont,
        color: '#fff'
    },
    buttonbox: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    boxdescription: {
        display: 'flex',
        justifyContent: 'center',

    },
    boxtextbutton: {
        fontFamily: globalFont,
        fontSize: 16
    },

    buttonstudy: {
        backgroundColor: '#e6f4f5',
        padding: 10,
        borderRadius: 10,
    },
    textbutton: {
        color: "#fff",
        fontFamily: globalFont,
        fontSize: 14,
        fontWeight: "bold",
        marginLeft: 10
    },
    buttonstudya: {
        backgroundColor: "#25B212",
        padding: 10,
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },
    buttonstudyb: {
        backgroundColor: "#FFC107",
        padding: 10,
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },
    boxbutton: {
        marginHorizontal: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'

    },
    boxtop: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'

    },
    header: {
        borderTopWidth: 1,
        borderTopColor: '#fff',
        backgroundColor: '#02929A',
        padding: 20,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: 'center',
    },
    dayInfoBox: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        marginLeft: 20,
    },
    progressBarContainer: {
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
        backgroundColor: '#02929A',
    },
    headerTexttitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    subHeaderText: {
        color: '#fff',
        marginTop: 5,
    },
    dayImage: {
        backgroundColor: '#F2F2F7',
        borderRadius: 10,
        width: 110,
        height: '100%',
    },
    creator: {
        flexDirection: 'row',
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
    mascot: {
        width: 50,
        height: 50,
    },
    headerTextContainer: {
        flex: 1,
        alignItems: 'center',
    },

    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    userName: {
        color: 'white',
        marginLeft: 8,
    },

    dayInfo: {
        margin: 20,
        padding: 20,
        backgroundColor: '#ddd',
        flexDirection: 'row',
        marginBottom: 16,
        borderRadius: 10,
    },
    dayText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: globalFont,
        marginBottom: 10,   
    },
    reviewText: {
        fontSize: 18,
        fontFamily: globalFont,
        textAlign: 'center'
    },
    wordList: {
        marginTop: 16,
    },

    text: {
        fontSize: 16,
        fontFamily: globalFont,
    },
    icon: {
        width: 20,
        height: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },


    wordListContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 20,
    },




    headerText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: globalFont,
        textAlign: 'center'
    },


    mainContent: {
        flex: 1,
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 10,
    },

    headerColumnEn: {
        flex: 3,
        paddingHorizontal: 5, // Giới hạn padding để text không bị dãn quá nhiều
        paddingVertical: 10,
        borderRightColor: '#000',
    },
    headerColumnVn: {
        flex: 3,
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderRightColor: '#000',
    },
    headerColumnType: {
        flex: 2,
        paddingHorizontal: 5,
        paddingVertical: 10,

    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7', // Đường viền dưới mỗi hàng
        backgroundColor: '#FFFFFF',
    },
    columnEn: {
        flex: 3,
        fontSize: 16,
        fontFamily: globalFont,
        color: '#4E4E4E',
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderRightColor: '#000', // Màu đường chia cột
        textAlign: 'center'

    },
    columnVn: {
        flex: 3,
        fontSize: 16,
        fontFamily: globalFont,
        color: '#4E4E4E',
        paddingHorizontal: 5,
        paddingVertical: 10,
        textAlign: 'center',
        borderRightColor: '#F2F2F7', // Màu đường chia cột
    },
    columnType: {
        flex: 2,
        fontSize: 16,
        fontFamily: globalFont,
        color: '#333',
        paddingHorizontal: 5,
        paddingVertical: 10,
        textAlign: 'center'

    },

    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#02929A',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderBottomWidth: 1,
        borderBottomColor: '#000', // Đường viền dưới mỗi hàng
    },

});

export default DetailVocabularyDay;