import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { globalFont } from '../../utils/const';
import { NavigationProp, useNavigation } from '@react-navigation/native';

// Define types for language category
type LanguageCategory = {
    category: string;
    data: string[];
};

const LanguageSelection = () => {
    const [selectedLanguage, setSelectedLanguage] = useState<string>('Vietnamese');

    const languages: LanguageCategory[] = [
        { category: 'Đề xuất', data: ['English (US)', 'Vietnamese'] },
        { category: 'Khác', data: ['Mandarin', 'Hindi', 'Spanish', 'French', 'Arabic', 'Russian', 'Indonesia', 'English (UK)'] }
    ];

    // Define the navigation type properly
    const navigation: NavigationProp<any> = useNavigation();

    const renderItem = ({ item }: { item: string }) => (
        <TouchableOpacity style={styles.option} onPress={() => setSelectedLanguage(item)}>
            <Text style={styles.text}>{item}</Text>
            <View style={[styles.radio, selectedLanguage === item && styles.selectedRadio]} />
        </TouchableOpacity>
    );

    const renderCategory = ({ item }: { item: LanguageCategory }) => (
        <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{item.category}</Text>
            <FlatList
                data={item.data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );

    return (
        
        <View style={styles.container}>
            <Ionicons name="arrow-back" size={30} color="white" onPress={() => navigation.goBack()} />

            <Text style={styles.textbox}>Ngôn ngữ</Text>
            <FlatList
                style={styles.list}
                data={languages}
                renderItem={renderCategory}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 40,
        paddingHorizontal: 20,
        backgroundColor: '#02929A', 
    },
    list: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20
    },
    textbox: {
        fontFamily: globalFont,
        fontSize: 24,
        fontWeight: 'bold',
        color: "#fff",
        textAlign: 'center',
        marginVertical: 10,
    },
    categoryContainer: {
        marginBottom: 15,
    },
    categoryText: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10,
        fontFamily: globalFont,

    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    text: {
        fontSize: 16,
        fontFamily: globalFont,
    },
    radio: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ccc',
    },
    selectedRadio: {
        borderColor: '#007AFF',
        backgroundColor: '#007AFF',
    },
});

export default LanguageSelection;
