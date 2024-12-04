import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { globalFont } from '../../utils/const';
import { addDoc, collection, doc, getDoc, getDocs, increment, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../fireBaseConfig';
import Sound from 'react-native-sound';

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
    courseTitle: string
}

const VocabularyCard = (props: Iprops) => {
    const navigation: NavigationProp<any> = useNavigation();
    const { modalVisible, setModalVisible, vocabularies, currentUserId, lessonId, courseId, courseTitle } = props;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentScreen, setCurrentScreen] = useState('screen1');
    const [selectedOption, setSelectedOption] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
    const [actionTaken, setActionTaken] = useState(false);
    const [isSelecting, setIsSelecting] = useState(true);
    const [progress, setProgress] = useState(0);
    const [totalScore, setTotalScore] = useState(0);

    const [filteredVocabularies, setFilteredVocabularies] = useState<Vocabulary[]>([]);

    // Fetch unlearned vocabularies
    const fetchUnlearnedVocabularies = async () => {
        const unlearnedVocabularies: Vocabulary[] = [];
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
                if (!learnedWordIds.includes(vocab.wordId)) {
                    unlearnedVocabularies.push(vocab);
                }
            });

            setFilteredVocabularies(unlearnedVocabularies);
        } catch (error) {
            console.error("Error fetching unlearned vocabularies: ", error);
        }
    };

    // Trong useEffect, chỉ cần gọi hàm
    useEffect(() => {
        fetchUnlearnedVocabularies();
    }, [vocabularies, currentUserId, lessonId]);

    useEffect(() => {
        setSelectedOption('');
        setShowCorrectAnswer(false);
        setActionTaken(false);
        setIsSelecting(true);
        setCorrectAnswer(filteredVocabularies[currentIndex]?.englishWord || '');
    }, [currentScreen, currentIndex, filteredVocabularies]);

    const getRandomOptions = () => {
        if (filteredVocabularies.length === 0) return [];

        const currentVocabulary = filteredVocabularies[currentIndex];
        const optionsSet = new Set<string>([currentVocabulary.englishWord]);
        const maxAttempts = 10; // Giới hạn số lần lặp để tránh vô hạn

        // Bổ sung từ filteredVocabularies (từ chưa học)
        let attempts = 0;
        while (optionsSet.size < 4 && attempts < maxAttempts) {
            const randomIndex = Math.floor(Math.random() * filteredVocabularies.length);
            optionsSet.add(filteredVocabularies[randomIndex].englishWord);
            attempts++;
        }

        // Nếu chưa đủ 4, bổ sung từ vocabularies (tất cả từ)
        attempts = 0; // Reset lại bộ đếm
        while (optionsSet.size < 4 && attempts < maxAttempts) {
            const randomIndex = Math.floor(Math.random() * vocabularies.length);
            const randomWord = vocabularies[randomIndex].englishWord;
            optionsSet.add(randomWord); // Thêm từ nếu chưa có trong Set
            attempts++;
        }

        // Nếu không thể đủ 4 tùy chọn, cảnh báo
        if (optionsSet.size < 4) {
        }

        return Array.from(optionsSet).sort(() => Math.random() - 0.5); // Trả về danh sách đã ngẫu nhiên hóa
    };


    const options = useMemo(() => getRandomOptions(), [currentIndex, filteredVocabularies]);

    const playAudio = (audioFile) => {
        const sound = new Sound(audioFile, Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('Error loading sound:', error.message);
                return;
            }
            sound.setVolume(1.0); // Âm thanh lớn nhất
            sound.play((success) => {
                if (!success) {
                    console.log('Playback failed');
                } else {
                    console.log('Playback completed');
                }
            });
        });
    };

    const updateLeaderboard = async (userId: string, courseId: string, score: number) => {
        try {
            const leaderboardRef = collection(db, 'Course_Leaderboard');
            const leaderboardQuery = query(
                leaderboardRef,
                where('user_id', '==', userId),
                where('course_id', '==', courseId)
            );
            const snapshot = await getDocs(leaderboardQuery);
    
            if (!snapshot.empty) {
                // Nếu đã có điểm, cập nhật tổng điểm
                const docId = snapshot.docs[0].id;
                const userDocRef = doc(db, 'Course_Leaderboard', docId);
                await updateDoc(userDocRef, {
                    totalScore: increment(score), // Cộng thêm điểm mới
                    updated_at: new Date().toISOString()
                });
            } else {
                // Nếu chưa có, tạo mới
                await addDoc(leaderboardRef, {
                    user_id: userId,
                    course_id: courseId,
                    totalScore: score,
                    updated_at: new Date().toISOString()
                });
            }
            console.log('Leaderboard updated successfully!');
        } catch (error) {
            console.error('Error updating leaderboard:', error);
        }
    };
    


    const handleOptionSelect = async (option: string) => {
        if (!isSelecting) return; // Ngăn chặn chọn lại nếu đã chọn
        setSelectedOption(option);
        setActionTaken(true); // Đánh dấu đã thực hiện hành động
        setIsSelecting(false); // Ngừng cho phép chọn thêm
    
        if (option === correctAnswer) {
            // Nếu đáp án đúng, tăng điểm và chuyển sang screen3
            const scoreToAdd = 1000;
            setTotalScore((prevScore) => prevScore + scoreToAdd);
    
            // Cập nhật điểm lên Firestore
            try {
                await updateLeaderboard(currentUserId, courseId, scoreToAdd); // userId, courseId và username cần được truyền vào component
                console.log('Điểm đã được cập nhật lên Firestore!');
            } catch (error) {
                console.error('Lỗi khi cập nhật điểm:', error);
            }
    
            // Chuyển sang màn hình screen3 sau 500ms
            setTimeout(() => {
                setCurrentScreen('screen3');
            }, 500);
        } else {
            // Nếu đáp án sai, chỉ hiện đáp án đúng trên screen2
            setShowCorrectAnswer(true); // Hiển thị câu trả lời đúng
        }
    };
    





    const handleDontKnowPress = () => {
        setShowCorrectAnswer(true); // Hiển thị câu trả lời đúng
        setActionTaken(true); // Đánh dấu rằng người dùng đã thực hiện hành động
    };

    const handleNextVocabulary = () => {
        // Chuyển sang từ vựng tiếp theo hoặc kết thúc
        handleCompleteLearning(filteredVocabularies[currentIndex].wordId, currentUserId, lessonId);
        if (currentIndex + 1 === filteredVocabularies.length) {
            setProgress(100);
            setCurrentScreen('screen4'); // Kết thúc học
        } else {
            const newIndex = currentIndex + 1;
            setProgress(((newIndex) / filteredVocabularies.length) * 100);
            setCurrentIndex(newIndex);
            setCurrentScreen('screen1');
            setSelectedOption('');
            setShowCorrectAnswer(false);
            setActionTaken(false);
            setIsSelecting(true);
            setCorrectAnswer(filteredVocabularies[newIndex]?.englishWord || '');
        }
    };


    const handleCompleteLearning = async (vocabId: string, currentUserId: string, lessonId: string) => {
        try {
            const progressId = `${currentUserId}_${lessonId}_${vocabId}`;
            const progressDocSnapshot = query(
                collection(db, 'User_Progress'),
                where('progress_id', '==', progressId)
            );
            const querySnapshot = await getDocs(progressDocSnapshot);

            if (!querySnapshot.empty) {
                const docId = querySnapshot.docs[0].id;
                const progressDocRef = doc(db, 'User_Progress', docId);
                await updateDoc(progressDocRef, {
                    status: 'đã học',
                });
            }
        } catch (error) {
            console.error("Error updating User_Progress: ", error);
        }
    };
    const handleStartLearning = async (vocabId, currentUserId, lessonId) => {
        if (!currentUserId || !lessonId || !vocabId) {
            console.log(currentUserId)
            console.log(lessonId)
            console.log(vocabId)
            console.error("Missing required data for creating User_Progress: user_id, lesson_id, or vocab_id is undefined.");
            return;
        }
        try {
            const progress_id = `${currentUserId}_${lessonId}_${vocabId}`;
            const progressDocSnapshot = query(
                collection(db, 'User_Progress'),
                where('progress_id', '==', progress_id)
            );
            const querySnapshot = await getDocs(progressDocSnapshot);
            if (querySnapshot.empty) {
                await addDoc(collection(db, 'User_Progress'), {
                    progress_id: progress_id,
                    user_id: currentUserId,
                    lesson_id: lessonId,
                    vocab_id: vocabId,
                    status: 'đang học',
                });
                console.log("User_Progress record created successfully!");
            }
        } catch (error) {
            console.error("Error adding User_Progress record: ", error);
        }
    };





    const updateCourseProgress = async (currentUserId, courseId) => {
        try {
            // 1. Lấy tất cả các bài học trong khóa học
            const lessonsSnapshot = await getDocs(
                query(collection(db, 'Lessons'), where('courseId', '==', courseId))
            );
            const totalLessons = lessonsSnapshot.size;

            // Kiểm tra nếu không có bài học nào
            if (totalLessons === 0) {
                console.error("Không tìm thấy bài học nào trong khóa học.");
                return;
            }

            let totalVocabulary = 0;   // Tổng số từ vựng trong khóa học
            let learnedVocabulary = 0; // Số từ vựng đã học trong khóa học

            // 2. Tính tổng số từ vựng và số từ vựng đã học cho từng bài học
            for (const lessonDoc of lessonsSnapshot.docs) {
                const lessonId = lessonDoc.id;

                // 2.1 Lấy số lượng từ vựng trong bài học
                const vocabQuerySnapshot = await getDocs(
                    query(collection(db, 'Vocabularies'), where('lessonId', '==', lessonId))
                );
                const lessonTotalVocabulary = vocabQuerySnapshot.size;  // Số từ vựng của bài học
                totalVocabulary += lessonTotalVocabulary;  // Cộng số từ vựng vào tổng số từ vựng của khóa học

                // 2.2 Lấy số lượng từ vựng đã học của người dùng trong bài học
                const learnedVocabQuerySnapshot = await getDocs(
                    query(
                        collection(db, 'User_Progress'),
                        where('user_id', '==', currentUserId),
                        where('lesson_id', '==', lessonId),
                        where('status', 'in', ['đã học']) // Learning statuses
                    )
                );
                learnedVocabulary += (learnedVocabQuerySnapshot.size);  // Cộng số từ vựng đã học vào tổng số từ vựng đã học
            }

            // 3. Tính tiến độ khóa học dựa trên số từ vựng đã học
            const courseProgress = totalVocabulary > 0 ? (learnedVocabulary / totalVocabulary) * 100 : 0;

            // 4. Cập nhật tiến độ khóa học trong bảng User_Course nếu tiến độ hợp lệ
            const userCourseQuerySnapshot = await getDocs(
                query(
                    collection(db, 'User_Course'),
                    where('user_id', '==', currentUserId),
                    where('course_id', '==', courseId)
                )
            );

            if (!userCourseQuerySnapshot.empty && !isNaN(courseProgress)) {
                const userCourseDocRef = userCourseQuerySnapshot.docs[0].ref;
                await updateDoc(userCourseDocRef, { progress: courseProgress.toFixed(2) });
            } else {
                console.warn("Không thể cập nhật tiến độ khóa học: không tìm thấy bản ghi người dùng-khóa học hoặc tiến độ là NaN.");
            }

        } catch (error) {
            console.error("Lỗi khi cập nhật tiến độ khóa học: ", error);
        }
    };








    const renderScreen = () => {
        const currentVocabulary = filteredVocabularies[currentIndex];

        if (!currentVocabulary) {
            return <Text style={styles.textnone}>Không có từ vựng mới</Text>;
        }

        switch (currentScreen) {
            case 'screen1':
                return (
                    <View style={styles.container}>
                        <View style={styles.vocabContainer}>
                            <Text style={styles.englishWord}>English</Text>
                            <Text style={styles.englishWordtext}>{currentVocabulary.englishWord}</Text>
                            <Text style={styles.vietnameseWord}>Vietnamese</Text>
                            <Text style={styles.vietnameseWordtext}>{currentVocabulary.vietnameseWord}</Text>
                        </View>

                        <View style={styles.typeContainer}>
                            <Text style={styles.typeLabel}>Attributes</Text>
                            <View style={styles.typeBox}>
                                <Text style={styles.typeText}>{currentVocabulary.wordType}</Text>
                            </View>
                        </View>

                        <View style={styles.soundButton}>
                            <Text style={styles.typeLabel}>AUDIO</Text>
                            <TouchableOpacity
                                style={styles.soundButtonclick}
                                onPress={() => playAudio(currentVocabulary.localPath)}
                            >
                                <AntDesign name="sound" size={30} color="black" />
                            </TouchableOpacity>



                        </View>

                        <TouchableOpacity
                            style={styles.nextButton}
                            onPress={() => {
                                handleStartLearning(currentVocabulary.wordId, currentUserId, lessonId); // Gọi hàm với từ vựng hiện tại
                                setCurrentScreen('screen2');
                            }}
                        >
                            <Text style={styles.nextButtonText}>Tiếp theo</Text>
                            <AntDesign name="arrowright" size={24} color="white" style={styles.icon} />
                        </TouchableOpacity>

                    </View>

                );
            case 'screen2':
                return (
                    <View style={styles.containerscr2}>
                        <View style={styles.containerscr2box}>

                            <View style={styles.soundContainer}>
                                <TouchableOpacity style={styles.soundButtonb} onPress={() => playAudio(currentVocabulary.localPath)}>
                                    <AntDesign name="sound" size={40} color="black" />

                                </TouchableOpacity>
                                <Text style={styles.label}>{currentVocabulary.wordType}</Text>
                            </View>

                            <View style={styles.optionsContainer}>
                                {options.map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[
                                            styles.optionButton,
                                            // Apply styles based on selection
                                            selectedOption === option && option === correctAnswer
                                                ? styles.correctAnswerButton // Correct answer: green
                                                : selectedOption === option && option !== correctAnswer
                                                    ? styles.wrongAnswerButton // Incorrect answer: red
                                                    : showCorrectAnswer && option === correctAnswer
                                                        ? styles.correctAnswerButton // Show correct answer when "I don't know" is pressed
                                                        : null,
                                        ]}
                                        onPress={() => handleOptionSelect(option)}
                                        disabled={!isSelecting} // Disable the button if isSelecting is false
                                    >
                                        <Text style={styles.optionText} numberOfLines={1}>{option}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* "I don't know" button */}
                        <TouchableOpacity
                            style={[styles.dontKnowButton, actionTaken && styles.nextButton]} // Kết hợp style
                            onPress={() => {
                                if (actionTaken) {
                                    // Nếu người dùng đã chọn, chuyển màn hình hoặc tiếp tục
                                    setCurrentScreen('screen3'); // Chuyển sang màn hình 3
                                } else {
                                    handleDontKnowPress(); // Nếu chưa chọn gì, xử lý trường hợp "Tôi không biết"
                                }
                            }}
                        >
                            <Text style={[styles.dontKnowText, actionTaken && styles.whiteText]}>
                                {actionTaken ? 'Tiếp theo' : '? Tôi không biết'}
                            </Text>
                            {actionTaken && (
                                <AntDesign name="arrowright" size={24} color="white" style={styles.icon} />
                            )}
                        </TouchableOpacity>




                    </View>

                );
            case 'screen3':
                return (
                    <View style={styles.containerscr3}>
                        <View style={styles.containerscr3box}>
                            <View style={styles.soundContainer}>
                                <Text style={styles.labelvietnamese}>{currentVocabulary.vietnameseWord}</Text>
                                <Text style={styles.label}>{currentVocabulary.wordType}</Text>
                            </View>

                            <View style={styles.optionsContainer}>
                                {options.map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[
                                            styles.optionButtonscr3,
                                            // Apply styles based on selection
                                            selectedOption === option && option === correctAnswer
                                                ? styles.correctAnswerButton // Correct answer: green
                                                : selectedOption === option && option !== correctAnswer
                                                    ? styles.wrongAnswerButton // Incorrect answer: red
                                                    : showCorrectAnswer && option === correctAnswer
                                                        ? styles.correctAnswerButton // Show correct answer when "I don't know" is pressed
                                                        : null,
                                        ]}
                                        onPress={() => handleOptionSelect(option)}
                                        disabled={!isSelecting} // Disable the button if isSelecting is false
                                    >
                                        <Text style={styles.optionText} numberOfLines={1}>{option}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Button "I don't know" */}
                        <TouchableOpacity
                            style={[styles.dontKnowButton, actionTaken && styles.nextButton]} // Combine styles
                            onPress={actionTaken ? handleNextVocabulary : handleDontKnowPress}
                        >
                            <Text style={[styles.dontKnowText, actionTaken && styles.whiteText]}>{actionTaken ? 'Tiếp theo' : '? Tôi không biết'}</Text>
                            {actionTaken && (<AntDesign name="arrowright" size={24} color="white" style={styles.icon} />)}
                        </TouchableOpacity>
                    </View>
                );
            case 'screen4': // New screen for summary
                return (
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryText}>Tổng điểm: {totalScore}</Text>
                        <Text style={styles.summaryText}>Số từ đã học: {currentIndex + 1}</Text>
                    </View>
                );
            default:
                return null;
        }
    };
    return (

        <Modal

            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
                setCurrentScreen('screen1'); // Đặt lại về screen1
                setCurrentIndex(0); // Reset về chỉ số từ vựng đầu tiên
                setSelectedOption(''); // Reset lựa chọn
                setShowCorrectAnswer(false); // Reset hiện đáp án đúng
                setActionTaken(false); // Reset trạng thái hành động
                setIsSelecting(true); // Đặt lại trạng thái chọn
                setTotalScore(0); // Đặt lại trạng thái chọn
                setProgress(0);
                updateCourseProgress(currentUserId, courseId);
                fetchUnlearnedVocabularies();

            }}
        >
            <View style={styles.container}>

                <View style={styles.header}>
                    <Text style={styles.headerText}>{courseTitle}</Text>
                    <TouchableOpacity onPress={() => {
                        setModalVisible(false);
                        setCurrentScreen('screen1'); // Đặt lại về screen1
                        setCurrentIndex(0); // Reset về chỉ số từ vựng đầu tiên
                        setSelectedOption(''); // Reset lựa chọn
                        setShowCorrectAnswer(false); // Reset hiện đáp án đúng
                        setActionTaken(false); // Reset trạng thái hành động
                        setIsSelecting(true); // Đặt lại trạng thái chọn
                        setTotalScore(0); // Đặt lại trạng thái chọn
                        setProgress(0)
                        updateCourseProgress(currentUserId, courseId);
                        fetchUnlearnedVocabularies();

                    }}>
                        <AntDesign name="closecircle" size={30} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={styles.progressBarbox}>
                    <View style={styles.progressBarContainer}>
                        <View style={styles.progressBar}>
                            <Text style={[styles.progress, { width: `${progress}%` }]}></Text>
                        </View>

                    </View>
                    <View style={styles.customprogressText}>
                        <Text style={styles.progressText}>{totalScore}</Text>
                    </View>
                </View>
                {renderScreen()}
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
        justifyContent: 'center',
        marginBottom: 30,
    },
    soundButtonb: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
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
        width: '100%',
        textAlign: 'center'
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
    textnone: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: globalFont,

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
        backgroundColor: '#5de7c0',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    restartButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: globalFont,
    },
});

export default VocabularyCard;
