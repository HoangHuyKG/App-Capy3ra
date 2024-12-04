import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import AppHeader from '../navigation/app.header';
import { globalFont } from '../../utils/const';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../fireBaseConfig';
import { useRoute } from '@react-navigation/native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


const Leaderboard = () => {
    const route = useRoute();
    const { courseId } = route.params;
    const [leaderboard, setLeaderboard] = useState([]);
    const [usersInfo, setUsersInfo] = useState({});
    // Hàm lấy dữ liệu bảng xếp hạng từ Firestore
    const fetchLeaderboard = async (courseId) => {
        try {
            const leaderboardRef = collection(db, 'Course_Leaderboard');
            // Chỉ lọc theo course_id, không orderBy.
            const leaderboardQuery = query(
                leaderboardRef,
                where('course_id', '==', courseId),
                limit(10) // Lấy 50 bản ghi, có thể thay đổi theo nhu cầu.
            );
            const snapshot = await getDocs(leaderboardQuery);
            const leaderboard = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
    
            // Sắp xếp theo điểm số trên client
            leaderboard.sort((a, b) => b.totalScore - a.totalScore); // Sắp xếp theo totalScore giảm dần
            return leaderboard.slice(0, 10); // Lấy 10 bản ghi đầu tiên
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }
    };
    const fetchUserInfo = async (userId) => {
        try {
            const userRef = collection(db, 'Users');
            const userQuery = query(
                userRef,
                where('ggid', '==', userId),
                limit(1) // Lấy thông tin 1 người dùng
            );
            const snapshot = await getDocs(userQuery);
            if (!snapshot.empty) {
                const userInfo = snapshot.docs[0].data();
                return userInfo;
            } else {
                console.log('No user found for ggid:', userId);
                return null;
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            return null;
        }
    };

    // useEffect để tải dữ liệu bảng xếp hạng
    useEffect(() => {
        const loadLeaderboard = async () => {
            const data = await fetchLeaderboard(courseId);
            setLeaderboard(data);
        };
        loadLeaderboard();
    }, [courseId]); useEffect(() => {
        const loadLeaderboard = async () => {
            const data = await fetchLeaderboard(courseId);

            // Lấy thông tin người dùng cho từng user_id trong leaderboard
            const usersData = {};
            for (let user of data) {
                const userInfo = await fetchUserInfo(user.user_id); // user_id có trong bảng Course_Leaderboard
                if (userInfo) {
                    usersData[user.user_id] = userInfo;
                }
            }
            setLeaderboard(data);
            setUsersInfo(usersData);
        };

        loadLeaderboard();
    }, [courseId]);

    // Render từng item trong danh sách
    const renderItem = ({ item }) => {
        const userInfo = usersInfo[item.user_id] || {}; // Lấy thông tin người dùng từ state
        return (
            <View style={styles.row}>
                <Image
                    source={{ uri: userInfo.photo || 'https://via.placeholder.com/150' }} // Hình ảnh người dùng
                    style={styles.avatar}
                />
                <Text style={styles.username}>{userInfo.name || 'Người dùng'}</Text>
                <Text style={styles.score}>{item.totalScore}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <AppHeader />

            <View style={styles.containerboard}>
                <View style={styles.header}>
                        <FontAwesome5 name="trophy" size={24} color="orange" />

                    <Text style={styles.headerText}>Bảng xếp hạng</Text>
                </View>
                
                {/* Check if leaderboard is empty and display a message */}
                {leaderboard.length === 0 ? (
                    <View style={styles.noDataContainer}>
                        <Text style={styles.noDataText}>Chưa có dữ liệu</Text>
                    </View>
                ) : (
                    // Hiển thị danh sách bảng xếp hạng
                    <FlatList
                        style={styles.containerboard}
                        data={leaderboard} // Sử dụng state leaderboard
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id} // Trích id từ dữ liệu
                    />
                )}
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
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    headerText: {
        marginLeft: 20,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    noDataContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noDataText: {
        fontSize: 16,
        color: '#999',
        fontFamily: globalFont,
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
