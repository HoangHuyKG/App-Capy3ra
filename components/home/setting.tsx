
import { StyleSheet, Text, View, Image, Button, TouchableOpacity } from "react-native"
import AppHeader from "../navigation/app.header"
import { ScrollView, Switch, TextInput } from "react-native-gesture-handler"
import Ionicons from '@expo/vector-icons/Ionicons';
import CourseItem from "./itemcourse";
import { globalFont } from "../../utils/const";
import React from "react";
import { ImagesAssets } from "../../assets/images/ImagesAssets";
import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import { useUser } from "./UserContext";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#02929A',
        paddingVertical: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 10,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: globalFont,
    },
    contact: {
        fontSize: 14,
        color: 'white',
        fontFamily: globalFont,
    },
    option: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 10,
        marginVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 16,
        fontFamily: globalFont,

    },
    optionRightText: {
        fontSize: 16,
        color: '#02929A',
        fontFamily: globalFont,

    },
    switchbox: {
        margin: -8
    },
    containerview: {
        flex: 1,
        paddingBottom: 50,
    }
})


const SettingScreen = () => {
    const navigation: NavigationProp<RootStackParamList> = useNavigation();
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
    const [theme, setTheme] = React.useState('Sáng');
    const { userInfo } = useUser();

    const toggleNotifications = () => setNotificationsEnabled(previousState => !previousState);
  
    const toggleTheme = () => setTheme(theme === 'Sáng' ? 'Tối' : 'Sáng');
  
    return (

        <ScrollView style={styles.container}>
            <Ionicons name="arrow-back" size={30} color="white" onPress={()=> navigation.goBack()}/>

            <View style={styles.containerview}>

            <View style={styles.header}>
                <Image source={{uri: userInfo?.data?.user?.photo}} style={styles.profileImage} />
                <Text style={styles.name}>{userInfo?.data?.user?.name}</Text>
                <Text style={styles.contact}>{userInfo?.data?.user?.email}</Text>
            </View>

            <TouchableOpacity style={styles.option} onPress={()=> navigation.navigate("EditProfileScreen")}>
                <Text style={styles.optionText}>Chỉnh sửa thông tin cá nhân</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={()=> navigation.navigate("NotificationSettings")}>
                <Text style={styles.optionText}>Thông báo</Text>
                <Switch value={notificationsEnabled} onValueChange={toggleNotifications} style={styles.switchbox}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={()=> navigation.navigate("LanguageSelection")}>
                <Text style={styles.optionText}>Ngôn ngữ</Text>
                <Text style={styles.optionRightText}>Tiếng Việt</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={()=> navigation.navigate("SettingLearningScreen")}>
                <Text style={styles.optionText}>Cài đặt chế độ âm thanh và học tập</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={toggleTheme}>
                <Text style={styles.optionText}>Giao diện</Text>
                <Text style={styles.optionRightText}>{theme}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option}>
                <Text style={styles.optionText}>Trợ giúp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option}>
                <Text style={styles.optionText}>Đăng xuất</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option}>
                <Text style={styles.optionText}>Xóa tài khoản</Text>
            </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

export default SettingScreen;