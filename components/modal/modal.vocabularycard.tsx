import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, SafeAreaView, Modal } from 'react-native';
import { globalFont } from '../../utils/const';
import AntDesign from '@expo/vector-icons/AntDesign';
import { NavigationProp, useNavigation } from '@react-navigation/native';
interface Iprops {
    modalVisible: boolean;
    setModalVisible: (v: boolean) => void;
}
const VocabularyCard = (props: Iprops) => {
    const navigation: NavigationProp<RootStackParamList> = useNavigation();
    const { modalVisible, setModalVisible } = props;
    const [currentScreen, setCurrentScreen] = useState('screen1');
    const [selectedOption, setSelectedOption] = useState(''); // Trạng thái lưu lựa chọn của người dùng
    const [correctAnswer] = useState('therefore'); // Đáp án đúng
    const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
    const [actionTaken, setActionTaken] = useState(false);
    const handleOptionSelect = (option: string) => {
        setSelectedOption(option); // Lưu lựa chọn của người dùng
        setShowCorrectAnswer(false); // Reset lại trạng thái hiển thị đáp án đúng
        setActionTaken(true); // Đánh dấu là đã chọn đáp án
    };

    const handleDontKnowPress = () => {
        setShowCorrectAnswer(true); // Hiển thị đáp án đúng
        setActionTaken(true); // Đánh dấu là đã chọn không biết
    };
    const renderScreen = () => {
        switch (currentScreen) {
            case 'screen1':
                return (


                    <View style={styles.container}>
                        <View style={styles.vocabContainer}>
                            <Text style={styles.englishWord}>English</Text>
                            <Text style={styles.englishWordtext}>therefore</Text>
                            <Text style={styles.vietnameseWord}>Vietnamese</Text>
                            <Text style={styles.vietnameseWordtext}>vì thế</Text>
                        </View>

                        <View style={styles.typeContainer}>
                            <Text style={styles.typeLabel}>Attributes</Text>
                            <View style={styles.typeBox}>
                                <Text style={styles.typeText}>TRẠNG TỪ</Text>
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
                            <AntDesign name="arrowright" size={24} color="white" style={styles.icon}/>
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
                                {['therefore', 'alone', 'cute', 'nearly'].map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[
                                            styles.optionButton,
                                            selectedOption === option && option === correctAnswer
                                                ? styles.correctAnswerButton // Đáp án đúng: màu xanh
                                                : selectedOption === option && option !== correctAnswer
                                                    ? styles.wrongAnswerButton // Đáp án sai: màu đỏ
                                                    : showCorrectAnswer && option === correctAnswer
                                                        ? styles.correctAnswerButton // Hiển thị đáp án đúng khi không biết
                                                        : null,
                                        ]}
                                        onPress={() => handleOptionSelect(option)}
                                    >
                                        <Text style={styles.optionText} numberOfLines={3}>{option}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Nút "Tôi không biết" */}
                        <TouchableOpacity
                            style={[styles.dontKnowButton, actionTaken && styles.nextButton]} // Kết hợp các style
                            onPress={actionTaken ? () => setCurrentScreen('screen3') : handleDontKnowPress}
                        >
                            <Text style={[styles.dontKnowText, actionTaken && styles.whiteText]}>{actionTaken ? 'Tiếp theo' : '? Tôi không biết'}</Text>
                            {actionTaken && ( <AntDesign name="arrowright" size={24} color="white"  style={styles.icon}/>)}
                        </TouchableOpacity>

                    </View>

                );
                case 'screen3':
                    return (
                        <View style={styles.containerscr3}>
                        <View style={styles.containerscr3box}>

                            <View style={styles.soundContainer}>
                                <Text style={styles.labelvietnamese}>vì thế</Text>
                                <Text style={styles.label}>TRẠNG TỪ</Text>
                            </View>

                            <View style={styles.optionsContainer}>
                                {['therefore', 'alone', 'cute', 'nearly'].map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[
                                            styles.optionButtonscr3,
                                            selectedOption === option && option === correctAnswer
                                                ? styles.correctAnswerButton // Đáp án đúng: màu xanh
                                                : selectedOption === option && option !== correctAnswer
                                                    ? styles.wrongAnswerButton // Đáp án sai: màu đỏ
                                                    : showCorrectAnswer && option === correctAnswer
                                                        ? styles.correctAnswerButton // Hiển thị đáp án đúng khi không biết
                                                        : null,
                                        ]}
                                        onPress={() => handleOptionSelect(option)}
                                    >
                                        <Text style={styles.optionText} numberOfLines={3}>{option}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Nút "Tôi không biết" */}
                        <TouchableOpacity
                            style={[styles.dontKnowButton, actionTaken && styles.nextButton]} // Kết hợp các style
                            onPress={actionTaken ? () => setCurrentScreen('screen3') : handleDontKnowPress}
                        >
                            <Text style={[styles.dontKnowText, actionTaken && styles.whiteText]}>{actionTaken ? 'Tiếp theo' : '? Tôi không biết'}</Text>
                            {actionTaken && ( <AntDesign name="arrowright" size={24} color="white"  style={styles.icon}/>)}
                        </TouchableOpacity>

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
                setCurrentScreen('screen1');
            }}
        >
            <View style={styles.container}>

                <View style={styles.header}>
                    <Text style={styles.headerText}>Bộ từ vựng AA</Text>
                    <TouchableOpacity onPress={() => {
                        setModalVisible(false);
                        setCurrentScreen('screen1'); // Đặt lại về screen1
                    }}>
                        <AntDesign name="closecircle" size={30} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={styles.progressBarbox}>
                    <View style={styles.progressBarContainer}>
                        <View style={styles.progressBar}>
                            <View style={styles.progress}></View>
                        </View>
                    </View>
                    <View style={styles.customprogressText}>
                        <Text style={styles.progressText}>1548</Text>
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
    },
    customprogressText: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 10,

        borderRadius: 20,
    }
});

export default VocabularyCard;
