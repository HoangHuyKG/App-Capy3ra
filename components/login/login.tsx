import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { ImagesAssets } from "../../assets/images/ImagesAssets";
import { globalFont } from "../../utils/const";
import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useUser } from '../home/UserContext.js';
import { auth, db } from '../../fireBaseConfig'; // Update this import path as needed
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";

import { doc, setDoc, getDoc  } from 'firebase/firestore'; 

const LoginScreen = () => {

  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const { setUserInfo } = useUser();

  const signIn = async () => {
    try {
      GoogleSignin.configure({
        webClientId: '205669129959-j7hjsdpbslrqibpr6aunaujbis4ahpm5.apps.googleusercontent.com',
      });
      
      const data = await GoogleSignin.signIn();
      setUserInfo(data); // Lưu thông tin người dùng
  
      const idToken = data.data?.idToken; // Sử dụng optional chaining để lấy idToken
  
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;
      const userRef = doc(db, 'Users', user.uid);
      const userSnapshot = await getDoc(userRef);
  
      // Kiểm tra nếu người dùng chưa tồn tại trước khi thêm dữ liệu
      if (!userSnapshot.exists()) {
        // Thêm người dùng nếu chưa có trong Firestore
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName || '', // Tên người dùng từ Google hoặc mặc định 'Anonymous'
          email: user.email,
          gender: user.gender || '', // Google không trả về giới tính
          country: user.country || '', // Google không trả về quốc gia
          phone: user.phoneNumber || '', // Số điện thoại từ Google, có thể không có
          address: '', // Địa chỉ mặc định là rỗng, người dùng có thể cập nhật sau
        });
        // Xóa console.log
      } 
      // Xóa console.log
  
      navigation.navigate("HomeScreen"); // Chuyển hướng sau khi đăng nhập
    } catch (error) {
      console.error("Sign-in error: ", error);
    }
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.boxlogin} onPress={signIn}>
        <Image source={ImagesAssets.imagegg} style={styles.imagelogin} />
        <Text style={styles.textlogin}>Đăng nhập bằng Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.boxloginfacebook} onPress={() => navigation.navigate("HomeScreen")}>
        <Ionicons name="logo-facebook" size={30} color="white" style={styles.iconfacebook} />
        <Text style={styles.textloginfacebook}>Đăng nhập bằng Facebook</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
    backgroundColor: '#02929A',
    padding: 30,
  },
  boxlogin: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  boxloginfacebook: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  imagelogin: {
    width: 30,
    height: 30,
  },
  textlogin: {
    marginLeft: 20,
    fontSize: 16,
    fontFamily: globalFont,
  },
  textloginfacebook: {
    color: '#fff',
    marginLeft: 20,
    fontSize: 16,
    fontFamily: globalFont,
  },
  iconfacebook: {
    marginLeft: 20,
  },
});

export default LoginScreen;
