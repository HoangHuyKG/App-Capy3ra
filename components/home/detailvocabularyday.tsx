import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { ImagesAssets } from '../../assets/images/ImagesAssets';
import { useRoute } from '@react-navigation/native';
import AppHeader from '../navigation/app.header';
import { globalFont } from '../../utils/const';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AddVocabularyModal from '../modal/modal.addvocalbulary';     

import { db } from '../../fireBaseConfig';
import { doc, getDoc, collection, getDocs, query, where, addDoc, onSnapshot } from 'firebase/firestore';

const DetailVocabularyDay = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [lessonData, setLessonData] = useState(null);
    const [vocabularies, setVocabularies] = useState([]); 
    const [loading, setLoading] = useState(true);
    const route = useRoute();
    const { lessonId } = route.params;

    useEffect(() => {
        const fetchLessonData = async () => {
            try {
                const docRef = doc(db, 'Lessons', lessonId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setLessonData(docSnap.data());
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching lesson data: ", error);
            }
        };

        const fetchVocabularyData = () => {
            // Lắng nghe các thay đổi trong bộ sưu tập từ vựng
            const vocabCollection = collection(db, 'Vocabularies'); 
            const vocabQuery = query(vocabCollection, where('lessonId', '==', lessonId)); // Lọc theo lessonId

            const unsubscribe = onSnapshot(vocabQuery, (snapshot) => {
                const vocabList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setVocabularies(vocabList);
            }, (error) => {
                console.error("Error fetching vocabulary data: ", error);
            });

            return unsubscribe; // Trả về hàm hủy để ngăn lắng nghe khi component bị hủy
        };

        const fetchData = async () => {
            setLoading(true);
            await fetchLessonData();
            fetchVocabularyData();
            setLoading(false);
        };

        fetchData();
    }, [lessonId]);

    // Hàm thêm từ vựng mới
    const addVocabulary = async (newVocabulary) => {
        try {
            await addDoc(collection(db, 'Vocabularies'), newVocabulary);
        } catch (error) {
            console.error("Error adding vocabulary: ", error);
        }
    };

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (!lessonData) {
        return <Text>Không tìm thấy dữ liệu bài học.</Text>;
    }

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.columnEn}>{item.englishWord}</Text>
            <Text style={styles.columnVn}>{item.vietnameseWord}</Text>
            <Text style={styles.columnType}>{item.wordType}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <AppHeader />
            <View style={styles.containerbox}>
                <View style={styles.header}>
                    <View style={styles.creator}>
                        <Image
                            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
                            style={styles.avatar}
                        />
                        <TouchableOpacity style={styles.buttonstudya}>
                            <TouchableOpacity style={styles.buttonboxx} onPress={()=> setModalVisible(true)}>
                                <FontAwesome5 name="pen" size={14} color="white" />
                                <Text style={styles.textbutton}>Thêm từ vựng</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.dayInfo}>
                <Image source={ImagesAssets.logodetail} style={styles.dayImage} />
                <View style={styles.dayInfoBox}>
                    <Text style={styles.dayText}>{lessonData.title}</Text>
                    <View style={styles.progressBarContainer}>
                        <View style={styles.progressBar}>
                            <View style={styles.progress}></View>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.buttonstudy}>
                        <Text style={styles.reviewText}>Ôn tập</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.mainContent}>
                <View style={styles.headerRow}>
                    <View style={styles.headerColumnEn}>
                        <Text style={styles.headerText}>Tiếng Anh</Text>
                    </View>
                    <View style={styles.headerColumnVn}>
                        <Text style={styles.headerText}>Tiếng Việt</Text>
                    </View>
                    <View style={styles.headerColumnType}>
                        <Text style={styles.headerText}>Từ loại</Text>
                    </View>
                </View>

                <FlatList
                    data={vocabularies} 
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    style={styles.wordList}
                />
            </View>
            <AddVocabularyModal 
                modalVisible={modalVisible} 
                setModalVisible={setModalVisible} 
                lessonId={lessonId}
            />
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
            justifyContent:'center',
            alignItems: 'center'
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

        },
        boxbutton: {
            marginHorizontal: 10,
            display: 'flex',
            justifyContent: 'center',  
            flexDirection: 'row',
        },
        boxtop: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center'
        },
        header: {
            borderTopWidth: 1,
            borderTopColor: '#fff',
            backgroundColor: '#02929A',
            padding: 20,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
        },
        dayInfoBox: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            marginLeft: 10,
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
            width: '100%',
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
            width: 100,
            height: '100%',
        },
        creator: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
            justifyContent: 'space-between'
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
            backgroundColor: '#CFD3D3',
            flexDirection: 'row',
            marginBottom: 16,
            borderRadius: 10,
        },
        dayText: {
            fontSize: 16,
            fontFamily: globalFont,
        },
        reviewText: {
            fontSize: 16,
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

        headerRow: {
            flexDirection: 'row',
            backgroundColor: '#02929A',
            paddingVertical: 12,
            marginTop: 10,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
        },
        headerText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16,
            fontFamily: globalFont,
            textAlign: 'center',
        },
        headerColumnEn: {
            flex: 3,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 8,
        },
        headerColumnVn: {
            flex: 3,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 8,
        },
        headerColumnType: {
            flex: 2,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 8,
        },
        // Các cột từ vựng
        columnEn: {
            flex: 3,
            fontSize: 16,
            fontFamily: globalFont,
            textAlign: 'left',
            paddingVertical: 12,
            paddingHorizontal: 8,
            color: '#4E4E4E',
        },
        columnVn: {
            flex: 3,
            fontSize: 16,
            fontFamily: globalFont,
            textAlign: 'left',
            paddingVertical: 12,
            paddingHorizontal: 8,
            color: '#4E4E4E',
        },
        columnType: {
            flex: 2,
            fontSize: 16,
            fontFamily: globalFont,
            textAlign: 'left',
            paddingVertical: 12,
            paddingHorizontal: 8,
            color: '#4E4E4E',
        },
        // Căn chỉnh hàng từ vựng
        itemContainer: {
            flexDirection: 'row',
            paddingVertical: 12,
            paddingHorizontal: 8,
            borderBottomWidth: 1,
            borderBottomColor: '#E0E0E0',
            alignItems: 'center', // Giúp căn giữa theo chiều dọc cho các ô từ vựng
        },

        mainContent: {
            flex: 1,
            padding: 20,
            backgroundColor: '#fff',
            margin: 20,
            borderRadius: 10,
        },


    });

    export default DetailVocabularyDay;
