import React from 'react';
import { View, Text, StyleSheet, Image, ProgressBarAndroid, TouchableOpacity, ScrollView } from 'react-native';
import AppHeader from '../navigation/app.header';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { globalFont } from '../../utils/const';
import { ImagesAssets } from '../../assets/images/ImagesAssets';
import { NavigationProp, useNavigation } from '@react-navigation/native';

const DetailCourseScreen = () => {
const navigation: NavigationProp<RootStackParamList> = useNavigation();

    return (
        <View style={styles.container}>
            <AppHeader />
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Bộ từ vựng AA</Text>
                    <Text style={styles.subHeaderText}>Learn the first 400 words that have helped other students to succeed in the TOEFL exam. Memrise makes these words stick to your mind instantly, and it makes sure that you really memorise them so that you can use them with confidence.</Text>
                    <View style={styles.creator}>
                        <Image
                            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
                            style={styles.avatar}
                        />
                        <Text style={styles.creatorName}>Võ Hoàng Thành</Text>

                    </View>
                </View>

                {/* Progress Section */}
                <View style={styles.box}>
                    <Text>Đã học 300/300 từ</Text>
                    <View style={styles.progressBarContainer}>
                        <View style={styles.progressBar}>
                            <View style={styles.progress}></View>
                        </View>
                    </View>
                    <View style={styles.boxbutton}>
                        <TouchableOpacity style={styles.button}>
                            <MaterialIcons name="access-time" size={24} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttontext}>Ôn tập (20)</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Days */}
                <View style={styles.daySection}>
                    {["Ngày 1", "Ngày 2", "Ngày 3", "Ngày 4"].map((day, index) => (
                        <TouchableOpacity key={index} style={styles.dayCard} onPress={() => navigation.navigate("DetailVocabularyDay")}>
                            <Image
                                source={ImagesAssets.logodetail}
                                style={styles.dayImage}
                            />
                            <Text style={styles.textimage}>{day}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e6f4f5',
    },
    boxbutton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    button: {
        padding: 15,
        backgroundColor: '#e6f4f5',
        borderRadius: 10,
        margin: 10
    },
    box: {
        backgroundColor: '#fff',
        padding: 20,
        margin: 10,
        borderRadius: 10,
    },
    buttontext: {
        fontFamily: globalFont,
        fontSize: 14,
        fontWeight: '500'
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
    progressSection: {
        padding: 20,
        alignItems: 'center',
    },
    progress: {
        height: '100%',
        width: '90%',
        backgroundColor: '#02929A',
    },
    reviewButton: {
        marginTop: 10,
        backgroundColor: '#e0e0e0',
        padding: 10,
        borderRadius: 5,
    },
    daySection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        padding: 20,
    },
    dayCard: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    dayImage: {
        backgroundColor: '#F2F2F7',
        borderRadius: 10,
        width: 100,
        height: 100,
    },
    textimage: {
        fontFamily: globalFont,
        fontWeight: '600',
        fontSize: 14,
        marginTop: 10,
    }
});

export default DetailCourseScreen;
