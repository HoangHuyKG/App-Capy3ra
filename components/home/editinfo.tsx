import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { globalFont } from '../../utils/const';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../fireBaseConfig'; // Firebase Auth để lấy thông tin user hiện tại

const EditProfileScreen = () => {
    const [fullName, setFullName] = useState('');

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const [gender, setGender] = useState('');
    const [country, setCountry] = useState('');
    const [openGender, setOpenGender] = useState(false);
    const [openCountry, setOpenCountry] = useState(false);

    const [genderItems] = useState([
        { label: 'Nam', value: 'Nam' },
        { label: 'Nữ', value: 'Nữ' },
        { label: 'Khác', value: 'Khác' },
    ]);

    const [countryItems] = useState([
        { label: 'Việt Nam', value: 'Việt Nam' },
        { label: 'USA', value: 'USA' },
        { label: 'Japan', value: 'Japan' },
    ]);

    const navigation: NavigationProp<RootStackParamList> = useNavigation();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const userDoc = await getDoc(doc(db, 'Users', user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setFullName(userData.name || '');
                        setEmail(userData.email || '');
                        setPhone(userData.phone || '');
                        setAddress(userData.address || '');
                        setGender(userData.gender || '');
                        setCountry(userData.country || '');
                    } else {
                        console.log("Không tìm thấy dữ liệu người dùng");
                    }
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu người dùng: ", error);
            }
        };

        fetchUserData();
    }, []);

    const handleUpdateProfile = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                await setDoc(doc(db, 'Users', user.uid), {
                    name: fullName,
                    email: email,
                    phone: phone,
                    address: address,
                    gender: gender,
                    country: country,
                }, { merge: true }); // merge: true sẽ cập nhật dữ liệu mà không xóa dữ liệu hiện có
                Alert.alert("Thành công", "Cập nhật thông tin thành công!");
                // Có thể thêm thông báo cho người dùng tại đây
            }
        } catch (error) {
            Alert.alert("Thất bại", "Cập nhật thông tin thất bại!");
        }
    };

    return (
        <View style={styles.containerbox}>
            <Ionicons name="arrow-back" size={30} color="white" onPress={() => navigation.goBack()} />
            <Text style={styles.textbox}>Chỉnh sửa thông tin cá nhân</Text>
            <View contentContainerStyle={styles.container}>
                <TextInput
                    label="Họ và tên"
                    value={fullName}
                    onChangeText={text => setFullName(text)}
                    style={styles.input}
                    underlineColor="transparent"
                />
                <TextInput
                    label="Địa chỉ email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                    keyboardType="email-address"
                    underlineColor="transparent"
                />
                <TextInput
                    label="Số điện thoại"
                    value={phone}
                    onChangeText={text => setPhone(text)}
                    style={styles.input}
                    keyboardType="phone-pad"
                    underlineColor="transparent"
                />
                <View style={[styles.dropdownRow, { zIndex: openCountry ? 2000 : 1000 }]}>
                    <DropDownPicker
                        open={openCountry}
                        value={country}
                        items={countryItems}
                        setOpen={setOpenCountry}
                        setValue={setCountry}
                        placeholder="Đất nước"
                        style={styles.dropdown}
                        containerStyle={{ flex: 1, zIndex: 2000 }}  // Ensure high zIndex for country dropdown
                    />

                    <DropDownPicker
                        open={openGender}
                        value={gender}
                        items={genderItems}
                        setOpen={setOpenGender}
                        setValue={setGender}
                        placeholder="Giới tính"
                        style={styles.dropdown}
                        containerStyle={{ flex: 1, marginLeft: 10, zIndex: 1000 }}  // Ensure lower zIndex for gender dropdown
                    />
                </View>
                <TextInput
                    label="Địa chỉ"
                    value={address}
                    onChangeText={text => setAddress(text)}
                    style={[styles.input, { zIndex: 500 }]}  // Ensure the address field is below the dropdown
                    underlineColor="transparent"
                />
                <Button mode="contained" onPress={handleUpdateProfile} style={styles.button}>
                    Cập nhật
                </Button>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    containerbox: {
        paddingVertical: 40,
        paddingHorizontal: 20,
        display: 'flex',
        flex: 1,
        backgroundColor: '#02929A',
    },
    textbox: {
        fontFamily: globalFont,
        fontSize: 24,
        fontWeight: 'bold',
        color: "#fff",
        textAlign: 'center',
        marginVertical: 20,
    },
    container: {
        fontFamily: globalFont,

        paddingTop: 20,
    },
    input: {
        fontFamily: globalFont,
        marginBottom: 30,
        borderRadius: 5,
    },
    button: {
        fontFamily: globalFont,

        marginTop: 20,
        padding: 5,
        borderRadius: 10,
        backgroundColor: '#1e88e5',
    },
    dropdownRow: {
        fontFamily: globalFont,

        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    dropdown: {
        height: 50,
    },
});

export default EditProfileScreen;
