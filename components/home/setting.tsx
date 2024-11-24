
import { StyleSheet, Text, View, Image, Button, TouchableOpacity } from "react-native"
import AppHeader from "../navigation/app.header"
import { ScrollView, Switch, TextInput } from "react-native-gesture-handler"
import Ionicons from '@expo/vector-icons/Ionicons';
import CourseItem from "./itemcourse";
import { globalFont } from "../../utils/const";
import React, { useEffect, useState } from "react";
import { ImagesAssets } from "../../assets/images/ImagesAssets";
import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import { useUser } from "./UserContext";
import { auth, db } from '../../fireBaseConfig'; // Đảm bảo đường dẫn này đúng
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

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
    const { setUserInfo } = useUser();
    const toggleNotifications = () => setNotificationsEnabled(previousState => !previousState);
  
    const handleLogout = async () => {
        try {
          await auth.signOut(); // Đăng xuất từ Firebase
          await GoogleSignin.signOut();
          navigation.navigate("StartedLoginScreen");
        } catch (error) {
          console.error("Sign-out error: ", error);
        }
      };
     
    const [name, setName] = useState('');
  

    useEffect(() => {
        const user = auth.currentUser; 
        if (!user) {
            console.log("No authenticated user found.");
            return;
        }
    
        const userDocRef = doc(db, 'Users', user.uid);
        const unsubscribe = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
                const userData = doc.data();
                setName(userData.name || 'Tên chưa được cập nhật');
            } else {
                console.log("Không tìm thấy tài liệu người dùng.");
            }
        });
    
        return () => unsubscribe(); 
    }, []);
    
    return (

        <ScrollView style={styles.container}>
            <Ionicons name="arrow-back" size={30} color="white" onPress={()=> navigation.goBack()}/>

            <View style={styles.containerview}>

            <View style={styles.header}>
                <Image source={
                        userInfo?.data?.user?.photo
                            ? { uri: userInfo.data.user.photo }
                            : ImagesAssets.unknowuser // Đường dẫn tới ảnh mặc định
                    } style={styles.profileImage} />
                <Text style={styles.name}>{name || 'Tên chưa được cập nhật'}</Text>
                <Text style={styles.contact}>{userInfo?.data?.user?.email}</Text>
            </View>

            <TouchableOpacity style={styles.option} onPress={()=> navigation.navigate("EditProfileScreen")}>
                <Text style={styles.optionText}>Chỉnh sửa thông tin cá nhân</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={()=> navigation.navigate("NotificationSettings")}>
                <Text style={styles.optionText}>Thông báo</Text>
                <Switch value={notificationsEnabled} onValueChange={toggleNotifications} style={styles.switchbox}/>
            </TouchableOpacity>


{/* 
            <TouchableOpacity style={styles.option} onPress={()=> navigation.navigate("SettingLearningScreen")}>
                <Text style={styles.optionText}>Cài đặt chế độ âm thanh và học tập</Text>
            </TouchableOpacity> */}



                <TouchableOpacity style={styles.option} onPress={handleLogout}>
                    <Text style={styles.optionText}>{userInfo ? "Đăng xuất" : "Đăng nhập"}</Text>
                </TouchableOpacity>


            </View>
        </ScrollView>
    );
}

export default SettingScreen;