import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import AppHeader from '../navigation/app.header';
import { globalFont } from '../../utils/const';

const data = [
    { id: '1', username: 'vohoangthanh24', score: '100,000,000' },
    { id: '2', username: 'ahhiek', score: '100.000' },
    { id: '3', username: 'dasd', score: '100.000' },
    { id: '4', username: 'qqq333', score: '100.000' },
    { id: '5', username: 'nkk123', score: '100.000' },
    { id: '6', username: 'ndhhh4', score: '100.000' },
    { id: '7', username: '33r', score: '50' },
    { id: '8', username: 'sfaafffffassdasdad', score: '50' },
    { id: '9', username: 'wjklpiuytr', score: '30' },
    { id: '10', username: 'dddd1dfs4rf', score: '15' },
];

const Leaderboard = () => {
    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <Image
                source={{ uri: 'https://via.placeholder.com/150' }}
                style={styles.avatar}
            />
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.score}>{item.score}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <AppHeader />

            <View style={styles.containerboard}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Bảng xếp hạng</Text>
                </View>
                <FlatList
                    style={styles.containerboard}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Xem thêm</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e6f4f5',
    },
    containerboard: {
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 10,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        marginTop: 20,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    username: {
        flex: 1,
        fontSize: 14,
        fontFamily: globalFont,
        color: '#333',
    },
    score: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: globalFont,

        color: '#000',
    },
    button: {
        paddingVertical: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#02929A',
        fontSize: 16,
        fontFamily: globalFont,
        fontWeight: '700'
    },
});

export default Leaderboard;
