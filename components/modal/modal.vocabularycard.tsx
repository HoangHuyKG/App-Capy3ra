import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { globalFont } from '../../utils/const';

interface Vocabulary {
    englishWord: string;
    vietnameseWord: string;
    wordType: string;
}

interface Iprops {
    modalVisible: boolean;
    setModalVisible: (v: boolean) => void;
    vocabularies: Vocabulary[];
}

const VocabularyCard = (props: Iprops) => {
    const navigation: NavigationProp<any> = useNavigation();
    const { modalVisible, setModalVisible, vocabularies } = props;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentScreen, setCurrentScreen] = useState('screen1');
    const [selectedOption, setSelectedOption] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
    const [actionTaken, setActionTaken] = useState(false);
    const [isSelecting, setIsSelecting] = useState(true); // New state variable
    const totalVocabularies = vocabularies.length; // Tổng số từ vựng có sẵn
    const [progress, setProgress] = useState(0); // New state for progress

    const [totalScore, setTotalScore] = useState(0); // New state for total score
    useEffect(() => {
        setSelectedOption('');
        setShowCorrectAnswer(false);
        setActionTaken(false);
        setIsSelecting(true);
        setCorrectAnswer(vocabularies[currentIndex]?.englishWord || '');
       
    }, [currentScreen, currentIndex, vocabularies]);

    const getRandomOptions = () => {
        if (vocabularies.length === 0) return []; // Return empty array if vocabularies are empty
        const currentVocabulary = vocabularies[currentIndex];
        const optionsSet = new Set<string>([currentVocabulary.englishWord]);

        while (optionsSet.size < Math.min(4, vocabularies.length)) {
            const randomIndex = Math.floor(Math.random() * vocabularies.length);
            optionsSet.add(vocabularies[randomIndex].englishWord);
        }

        return Array.from(optionsSet);
    };

    const options = useMemo(() => getRandomOptions(), [currentIndex, vocabularies]); // Use vocabularies as dependency


    const handleOptionSelect = (option: string) => {
        if (!isSelecting) return;
        setSelectedOption(option);
        setShowCorrectAnswer(false);
        setActionTaken(true);
        setIsSelecting(false);

        if (option === correctAnswer) {
            setTotalScore((prevScore) => prevScore + 1000); // Increment score by 1000
            if (currentScreen === 'screen3') {
                setTimeout(() => {
                    handleNextVocabulary();
                }, 500);
            } else {
                setTimeout(() => {
                    setCurrentScreen('screen3');
                    setIsSelecting(true);
                    setSelectedOption('');
                }, 500);
            }
        } else {
            // Handle wrong answer case if needed
        }
    };

    const handleDontKnowPress = () => {
        setShowCorrectAnswer(true);
        setActionTaken(true);
    };

    const handleNextVocabulary = () => {
        if (currentIndex + 1 === vocabularies.length) {
            setProgress(100);
            setCurrentScreen('screen4');
        } else {
            const newIndex = currentIndex + 1;
            setProgress((newIndex / totalVocabularies) * 100);
            setCurrentIndex(newIndex);
            setCurrentScreen('screen1');
            setSelectedOption('');
            setShowCorrectAnswer(false);
            setActionTaken(false);
            setIsSelecting(true);
            setCorrectAnswer(vocabularies[newIndex]?.englishWord || '');
        }
    };
    
    




    const renderScreen = () => {
        const currentVocabulary = vocabularies[currentIndex];
        if (!currentVocabulary) {
            return <Text>No vocabulary to display.</Text>;
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
                            <TouchableOpacity style={styles.soundButtonclick}>
                                <AntDesign name="sound" size={30} color="black" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.nextButton} onPress={() => setCurrentScreen('screen2')}>
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
                                <TouchableOpacity style={styles.soundButtonb}>
                                    <AntDesign name="sound" size={40} color="black" />
                                </TouchableOpacity>
                                <Text style={styles.label}>TRẠNG TỪ</Text>
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
                            style={[styles.dontKnowButton, actionTaken && styles.nextButton]} // Combine styles
                            onPress={actionTaken ? () => setCurrentScreen('screen3') : handleDontKnowPress}
                        >
                            <Text style={[styles.dontKnowText, actionTaken && styles.whiteText]}>{actionTaken ? 'Tiếp theo' : '? Tôi không biết'}</Text>
                            {actionTaken && (<AntDesign name="arrowright" size={24} color="white" style={styles.icon} />)}
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
                    <Text style={styles.summaryText}>Số từ đã học: {currentIndex+1}</Text>
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
                setProgress(0)


            }}
        >
            <View style={styles.container}>

                <View style={styles.header}>
                    <Text style={styles.headerText}>Bộ từ vựng AA</Text>
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
