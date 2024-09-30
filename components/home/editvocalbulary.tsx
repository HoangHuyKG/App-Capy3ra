import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Button, Image } from 'react-native';
import AppHeader from '../navigation/app.header';
import { globalFont } from '../../utils/const';

const EditVocabularyScreen = () => {
    const [words, setWords] = useState([{ english: 'thank', vietnamese: 'cảm ơn', type: 'Động từ' }]);
    const [english, setEnglish] = useState('');
    const [vietnamese, setVietnamese] = useState('');
    const [wordType, setWordType] = useState('');

    const addWord = () => {
        setWords([...words, { english, vietnamese, type: wordType }]);
        setEnglish('');
        setVietnamese('');
        setWordType('');
    };

    return (
        <View style={styles.container}>
            <AppHeader />
            <View style={styles.header}>
                <Text style={styles.headerText}>Bộ từ vựng AA</Text>
                <Text style={styles.subHeaderText}>Learn the first 400 words that have helped other students to succeed in the TOEFL exam. Memrise makes these words stick to your mind instantly, and it makes sure that you really memorise them so that you can use them with confidence.</Text>
                <View style={styles.creator}>
                    <Image
                        source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
                        style={styles.avatar}
                    />
                    <Text style={styles.creatorName}>Võ Hoàng Thành</Text>
                    <TouchableOpacity style={styles.buttonstudy}>
                        <Text style={styles.textbutton}>
                            Trở lại khóa học
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>

          
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e0f7fa',
    },

    courseTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#004d40',
    },
    buttonstudy: {
        backgroundColor: "#25B212",
        padding: 10,
        borderRadius: 10,

    },
    textbutton: {
        color: "#fff",
        fontFamily: globalFont,
        fontSize: 14,
        fontWeight: "bold"
    },
    author: {
        fontSize: 16,
        color: '#00796b',
    },
    addWordContainer: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
        color: '#004d40',
    },
    header: {
        borderTopWidth: 1,
        borderTopColor: '#fff',
        backgroundColor: '#02929A',
        padding: 20,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    headerText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    subHeaderText: {
        color: '#fff',
        marginTop: 5,
    },
    creator: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
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
    input: {
        height: 40,
        borderColor: '#004d40',
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
        marginBottom: 10,
    },
    wordTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        color: '#004d40',
    },
    wordType: {
        fontSize: 16,
        padding: 8,
        borderColor: '#004d40',
        borderWidth: 1,
        borderRadius: 5,
    },
    selectedType: {
        backgroundColor: '#b2dfdb',
    },
    wordItem: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 10,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    actionIcon: {
        fontSize: 20,
        marginHorizontal: 10,
    },
});

export default EditVocabularyScreen;
