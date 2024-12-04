import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { globalFont } from '../../utils/const';
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../fireBaseConfig';
interface Vocabulary {
    englishWord: string;
    vietnameseWord: string;
    wordType: string;
}

interface Iprops {
    modalVisible: boolean;
    setModalVisible: (v: boolean) => void;
    vocabularies: Vocabulary[];
    currentUserId: string
    lessonId: string
    courseId: string
}

const ReviewVocabularyModal = (props: Iprops) => {
    const navigation: NavigationProp<any> = useNavigation();
    const { modalVisible, setModalVisible, vocabularies, currentUserId, lessonId, courseId } = props;
    const [isReviewComplete, setIsReviewComplete] = useState(false);

    const [reviewIndex, setReviewIndex] = useState(0);
    const [reviewedVocabularies, setReviewedVocabularies] = useState<Vocabulary[]>([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
    const [actionTaken, setActionTaken] = useState(false);
    const [isSelecting, setIsSelecting] = useState(true);
    // Fetch learned vocabularies
    const fetchLearnedVocabularies = async () => {
        const learnedVocabularies: Vocabulary[] = [];
        try {
            const progressQuerySnapshot = await getDocs(
                query(
                    collection(db, 'User_Progress'),
                    where('user_id', '==', currentUserId),
                    where('lesson_id', '==', lessonId),
                    where('status', '==', 'đã học')
                )
            );
            const learnedWordIds = progressQuerySnapshot.docs.map(doc => doc.data().vocab_id);

            vocabularies.forEach(vocab => {
                if (learnedWordIds.includes(vocab.wordId)) {
                    learnedVocabularies.push(vocab);
                }
            });

            setReviewedVocabularies(learnedVocabularies);
        } catch (error) {
            console.error("Error fetching learned vocabularies: ", error);
        }
    };

    useEffect(() => {
        fetchLearnedVocabularies();
    }, [vocabularies, currentUserId, lessonId]);

    useEffect(() => {
        setSelectedOption('');
        setShowCorrectAnswer(false);
        setCorrectAnswer(reviewedVocabularies[reviewIndex]?.englishWord || '');
    }, [reviewIndex, reviewedVocabularies]);

    const getRandomOptions = () => {
        if (reviewedVocabularies.length === 0) return [];
        const currentVocabulary = reviewedVocabularies[reviewIndex];
        const optionsSet = new Set<string>([currentVocabulary.englishWord]);

        while (optionsSet.size < Math.min(4, reviewedVocabularies.length)) {
            const randomIndex = Math.floor(Math.random() * reviewedVocabularies.length);
            optionsSet.add(reviewedVocabularies[randomIndex].englishWord);
        }

        return Array.from(optionsSet);
    };

    const options = useMemo(() => getRandomOptions(), [reviewIndex, reviewedVocabularies]);

    const handleOptionSelect = (option: string) => {
        if (!isSelecting) return; // Ngăn người dùng chọn lại
    
        setIsSelecting(false); // Khóa lựa chọn khi đã chọn
        setSelectedOption(option);
        setShowCorrectAnswer(true);
    
        if (option === correctAnswer) {
            setTimeout(() => {
                handleNextVocabulary();
            }, 500);
        } else {
            // Nếu sai đáp án, bật nút tiếp theo
            setActionTaken(true);
        }
    };
    


    const handleDontKnowPress = () => {
        setShowCorrectAnswer(true);
        setActionTaken(true);
    };

    const handleNextVocabulary = () => {
        setSelectedOption(''); // Reset lựa chọn của người dùng
        setShowCorrectAnswer(false); // Reset hiển thị đáp án
        setActionTaken(false); // Reset trạng thái người dùng đã chọn hành động
        setIsSelecting(true); // Bật lại khả năng chọn đáp án
    
        // Kiểm tra xem đã ôn hết tất cả các từ hay chưa
        if (reviewIndex + 1 === reviewedVocabularies.length) {
            setIsReviewComplete(true); // Đánh dấu ôn tập hoàn thành
        } else {
            setReviewIndex(reviewIndex + 1); // Chuyển sang từ vựng tiếp theo
        }
    };
    



    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
                setIsReviewComplete(false); // Reset trạng thái hoàn thành
                setReviewIndex(0); // Reset chỉ số từ đang ôn tập
                setShowCorrectAnswer(false); // Reset trạng thái hiển thị đáp án
                setActionTaken(false); // Reset trạng thái người dùng đã chọn hành động
                setSelectedOption(''); // Reset lựa chọn của người dùng
                fetchLearnedVocabularies(); // Lấy lại danh sách từ vựng đã học
            }}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Ôn tập từ vựng</Text>
                    <TouchableOpacity onPress={() => {
                        setModalVisible(false)
                        setIsReviewComplete(false); // Reset trạng thái hoàn thành
                        setReviewIndex(0); // Reset chỉ số từ đang ôn tập
                        setShowCorrectAnswer(false); // Reset trạng thái hiển thị đáp án
                        setActionTaken(false); // Reset trạng thái người dùng đã chọn hành động
                        setSelectedOption(''); // Reset lựa chọn của người dùng
                        fetchLearnedVocabularies(); // Lấy lại danh sách từ vựng đã học
                    }}>
                        <AntDesign name="closecircle" size={30} color="white" />
                    </TouchableOpacity>
                </View>
                {reviewedVocabularies.length === 0 ? (
                    <View style={styles.noVocabContainer}>
                        <Text style={styles.noVocabText}>Không có từ vựng để ôn tập</Text>

                    </View>
                ) :
                    isReviewComplete ? (
                        <View style={styles.summaryContainer}>
                            <Text style={styles.summaryText}>Bạn đã ôn tập xong!</Text>
                            <TouchableOpacity
                                style={styles.restartButton}
                                onPress={() => {
                                    setIsReviewComplete(false);
                                    setReviewIndex(0);
                                }}
                            >
                                <Text style={styles.restartButtonText}>Ôn lại từ đầu</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.restartButton, { marginTop: 10 }]}
                                onPress={() => {
                                    setModalVisible(false)
                                    setIsReviewComplete(false);
                                }}
                            >
                                <Text style={styles.restartButtonText}>Quay lại</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.containerscr3}>
                            <View style={styles.containerscr3box}>
                                <View style={styles.soundContainer}>
                                    <Text style={styles.labelvietnamese}>{reviewedVocabularies[reviewIndex]?.vietnameseWord}</Text>
                                    <Text style={styles.label}>{reviewedVocabularies[reviewIndex]?.wordType}</Text>
                                </View>
                                <View style={styles.optionsContainer}>
                                    {options.map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={[
                                                styles.optionButtonscr3,
                                                selectedOption === option && option === correctAnswer
                                                    ? styles.correctAnswerButton
                                                    : selectedOption === option && option !== correctAnswer
                                                        ? styles.wrongAnswerButton
                                                        : showCorrectAnswer && option === correctAnswer
                                                            ? styles.correctAnswerButton
                                                            : null,
                                            ]}
                                            onPress={() => handleOptionSelect(option)}
                                            disabled={!isSelecting}
                                        >
                                            <Text style={styles.optionText} numberOfLines={1}>{option}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            <TouchableOpacity
                                style={[styles.dontKnowButton, actionTaken && styles.nextButton]}
                                onPress={actionTaken ? handleNextVocabulary : handleDontKnowPress}
                            >
                                <Text style={[styles.dontKnowText, actionTaken && styles.whiteText]}>
                                    {actionTaken ? 'Tiếp theo' : '? Tôi không biết'}
                                </Text>
                                {actionTaken && (
                                    <AntDesign name="arrowright" size={24} color="white" style={styles.icon} />
                                )}
                            </TouchableOpacity>

                        </View>
                    )}
            </View>
        </Modal>
    );

};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e6f4f5',
    },
    containerscr2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e6f4f5',
    },
    labelvietnamese: {
        fontFamily: globalFont,
        fontSize: 35,

    },
    containerscr3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e6f4f5',
    },
    whiteText: {
        color: "#fff",
        fontSize: 18,
        fontFamily: globalFont,
        fontWeight: 'bold'
    },
    containerscr2box: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e6f4f5',
        padding: 40
    },
    containerscr3box: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#e6f4f5',
        padding: 40
    },
    icon: {
        marginLeft: 10, // Khoảng cách giữa text và icon
    },
    soundContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 30,
    },
    soundButtonb: {
        padding: 40,
        borderRadius: 80,
        backgroundColor: '#fff',
        marginRight: 10,
    },
    soundIcon: {
        width: 40,
        height: 40,
    },
    label: {
        marginTop: 20,
        fontFamily: globalFont,
        backgroundColor: '#02929A',
        padding: 15,
        color: '#fff',
        borderRadius: 20,
        fontSize: 16,
        fontWeight: 'bold',
    },
    optionsContainer: {
    },
    optionButtonscr3: {
        width: 250,
        padding: 15,
        marginVertical: 5,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    optionButton: {
        padding: 15,
        width: 150,
        marginVertical: 5,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    correctAnswerButton: {
        backgroundColor: '#8deed2',

    },
    wrongAnswerButton: {
        backgroundColor: '#ffded7',
    },
    optionText: {
        fontSize: 18,
        fontFamily: globalFont,
        textAlign: 'center',
    },
    dontKnowButton: {
        backgroundColor: '#dcdcdc',
        position: 'absolute',
        bottom: 60,
        left: 20,
        right: 20,
        marginHorizontal: 20,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    dontKnowText: {
        fontSize: 18,
        color: '#555',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: "#02929A",
        paddingTop: 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerText: {
        fontFamily: globalFont,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },

    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    searchBar: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
    },
    soundButtonclick: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 10,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        width: 50,
        height: 50,
        borderRadius: 10,
    },
    counter: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    vocabContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    englishWord: {
        marginTop: 20,
        textTransform: 'uppercase',
        fontFamily: globalFont,
        fontSize: 16,
        color: '#000',
    },
    englishWordtext: {
        fontSize: 24,
        fontFamily: globalFont,
        fontWeight: 'bold',
        color: '#000',
    },
    vietnameseWord: {
        marginTop: 20,
        textTransform: 'uppercase',
        fontFamily: globalFont,
        fontSize: 16,
        color: '#000',
    },
    vietnameseWordtext: {
        fontSize: 24,
        fontFamily: globalFont,
        color: '#000',
        fontWeight: 'bold',

    },
    typeContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    typeLabel: {
        marginBottom: 20,
        textTransform: 'uppercase',
        fontFamily: globalFont,
        fontSize: 16,
        color: '#000',
    },
    typeBox: {
        width: 150,
        backgroundColor: '#02929A',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    typeText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
    },
    soundButton: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    nextButton: {
        position: 'absolute',
        bottom: 60,
        left: 20,
        right: 20,
        marginHorizontal: 20,
        backgroundColor: '#5de7c0',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

    progressBarbox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    progressBarContainer: {
        flex: 1,
        height: 40,
        shadowColor: '#cfd3d3',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        borderRadius: 20,
        backgroundColor: '#cfd3d3',
        marginRight: 10,
    },
    progressBar: {
        width: '100%',
        height: '100%', // Chiều cao của thanh tiến độ
        backgroundColor: '#cfd3d3',
        borderRadius: 20,
        overflow: 'hidden',
    },
    progress: {
        height: '100%',
        width: '20%', // Tiến độ
        backgroundColor: '#02929A',
    },
    progressText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000', // Màu của số 1548
        fontFamily: globalFont,
    },
    noVocabText: {
        fontFamily: globalFont,
        fontSize: 18,
        textAlign: 'center'
    },
    customprogressText: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 10,

        borderRadius: 20,
    },
    summaryContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e6f4f5',
        padding: 40,
    },
    summaryText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20,
        fontFamily: globalFont,
    },
    restartButton: {
        width: 200,

        backgroundColor: '#02929A',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    restartButtonText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: globalFont,
    },
    

});

export default ReviewVocabularyModal;
