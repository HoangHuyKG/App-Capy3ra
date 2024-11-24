
import { StyleSheet, Text, View, Image, Button, TouchableOpacity } from "react-native"
import AppHeader from "../navigation/app.header"
import { ScrollView, TextInput } from "react-native-gesture-handler"
import Ionicons from '@expo/vector-icons/Ionicons';
import CourseItem from "./itemcourse";
import { globalFont } from "../../utils/const";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import CourseSearch from "./itemsearch";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e6f4f5',
    },
    header: {
        padding: 20,
        backgroundColor: '#4CAF50',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: globalFont

    },
    headerSubtitle: {
        fontSize: 16,
        color: '#fff',
        fontFamily: globalFont

    },
    createButton: {
        backgroundColor: '#28a745',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    createButtonText: {
        color: '#fff',
    },
    searchBar: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
    },

    courseList: {
        paddingHorizontal: 20,
    },
    courseCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    courseImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    courseInfo: {
        marginLeft: 15,
        flex: 1,
    },
    courseTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        fontFamily: globalFont

    },
    courseStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    courseStatText: {
        fontSize: 14,
        color: '#888',
        fontFamily: globalFont

    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        fontFamily: globalFont

    },
    searchIcon: {
        marginLeft: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginHorizontal: 20,
        marginVertical: 10,

    },
    button: {
        width: 200,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginVertical: 10,
        marginHorizontal: 20,
        backgroundColor: '#02929A', 
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: globalFont
    },
    boxbutton: {
        display: 'flex',
        alignItems: 'flex-end'
    }

})
const CourseScreen = () => {
    const navigation: NavigationProp<any> = useNavigation();
    const [searchQuery, setSearchQuery] = useState(""); // Từ khóa tìm kiếm

    const isSearching = searchQuery.trim().length > 0; // Xác định trạng thái tìm kiếm dựa trên từ khóa

    return (
        <View style={styles.container}>
            <AppHeader />
            <View style={styles.boxbutton}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("CreateCourseScreen")}>
                    <Text style={styles.buttonText}>Tạo khóa học</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery} // Cập nhật từ khóa tìm kiếm
                />
                <Ionicons name="search" size={24} style={{ marginLeft: 10, color: '#333' }} />
            </View>

            <ScrollView style={styles.courseList}>
                {isSearching ? (
                    <CourseSearch searchQuery={searchQuery} /> // Tìm kiếm dựa trên từ khóa
                ) : (
                    <CourseItem /> // Hiển thị tất cả khóa học
                )}
            </ScrollView>
        </View>
    );
};

export default CourseScreen;