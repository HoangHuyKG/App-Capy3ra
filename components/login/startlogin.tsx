import { StyleSheet, Text, View, Image, Button, TouchableOpacity } from "react-native"
import { ImagesAssets } from "../../assets/images/ImagesAssets";
import AntDesign from '@expo/vector-icons/AntDesign';
import { globalFont } from "../../utils/const";
import { useNavigation } from '@react-navigation/native';
import {  NavigationProp } from '@react-navigation/native'
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useUser } from '../home/UserContext.js';
import { auth, db } from '../../fireBaseConfig'; // Update this import path as needed
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";

import { doc, setDoc, getDoc  } from 'firebase/firestore'; 
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        textAlign: 'center',
        backgroundColor: '#02929A',
        padding: 30
    },
    boxlogo: {
        marginTop: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        height: 300,
        width: 300,
    },
    boxtext: {

    },
    text: {
        fontSize: 34,
        fontFamily: globalFont,
        color: '#fff',
        fontWeight: 'bold',
    },
    boxtextinfo: {
        
        marginTop: 30,
    },
    boxtextinfodetail: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 20
    },
    textinfo: {
        fontSize: 18,
        fontFamily: globalFont,
        color: '#fff',
        marginLeft: 20

    },
    boxbutton: {
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f7',
        padding: 15,
        borderRadius: 10
    },
    buttonText: {
        fontSize: 18,
        color: '#000',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontFamily: globalFont,
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
      imagelogin: {
        width: 30,
        height: 30,
      },
      textlogin: {
        marginLeft: 20,
        fontSize: 18,
        fontFamily: globalFont,
        fontWeight: '600'
      },
  });

const StartedLoginScreen = () => {
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
          const ggid = data.data?.user?.id; 
          const photo = data.data?.user?.photo;
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
              ggid: ggid,
              photo: photo
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
       
        <SafeAreaView  style={styles.container}>
             <StatusBar barStyle="light-content" backgroundColor="#02929A" hidden={true}/>
            <View style={styles.boxlogo}>
                
            <Image
                style={styles.logo}
                source={ImagesAssets.imagelogo}
            />
            </View>
            <View>
            <Text  style={styles.text}>
                Điều làm cho
            </Text>
            <Text  style={styles.text}>
                Capy3ra khác biệt ? 
            </Text>
            </View>
            <View style={styles.boxtextinfo}>
                <View style={styles.boxtextinfodetail}>
                    <AntDesign name="bulb1" size={20} color="white" />
                    <Text style={styles.textinfo}>Học từ vựng liên quan đến đời sống.</Text>
                </View>
                <View style={styles.boxtextinfodetail}>
                    <AntDesign name="book" size={20} color="white" />
                    <Text style={styles.textinfo}>Nhớ lâu hơn, học nhanh hơn.</Text>
                </View>
                <View style={styles.boxtextinfodetail}>
                    <AntDesign name="earth" size={20} color="white" />
                    <Text style={styles.textinfo}>Học mọi lúc, học mọi nơi.</Text>
                </View>
            </View>
            <View style={styles.boxbutton}>
            <TouchableOpacity style={styles.boxlogin} onPress={signIn}>
        <Image source={ImagesAssets.imagegg} style={styles.imagelogin} />
        <Text style={styles.textlogin}>Đăng nhập bằng Google</Text>
      </TouchableOpacity>
            </View>
        </SafeAreaView >
    )
}

export default StartedLoginScreen;