import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { globalFont } from '../../utils/const';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationProp, useNavigation } from '@react-navigation/native';

const EditProfileScreen = () => {
    const [fullName, setFullName] = useState('Hoàng Gia Huy');
    const [username, setUsername] = useState('aHuy.Ruacon');
    const [email, setEmail] = useState('youremail@domain.com');
    const [phone, setPhone] = useState('012 123 999 999');
    const [address, setAddress] = useState('123 Nguyen van cu noi dai');

    const [gender, setGender] = useState('Nam');
    const [country, setCountry] = useState('Việt Nam');
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

    return (
        <View style={styles.containerbox}>
            <Ionicons name="arrow-back" size={30} color="white" onPress={() => navigation.goBack()} />
            <Text style={styles.textbox}>Chỉnh sửa thông tin cá nhân</Text>
            <ScrollView contentContainerStyle={styles.container}>
                <TextInput
                    label="Họ và tên"
                    value={fullName}
                    onChangeText={text => setFullName(text)}
                    style={styles.input}
                    underlineColor="transparent"
                />
                <TextInput
                    label="Tên bí danh"
                    value={username}
                    onChangeText={text => setUsername(text)}
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

                <View style={[styles.dropdownRow, styles.input]}>
                    <DropDownPicker
                        open={openCountry}
                        value={country}
                        items={countryItems}
                        setOpen={setOpenCountry}
                        setValue={setCountry}
                        placeholder="Đất nước"
                        style={styles.dropdown}
                        containerStyle={{ flex: 1 }}
                    />
                    <DropDownPicker
                        open={openGender}
                        value={gender}
                        items={genderItems}
                        setOpen={setOpenGender}
                        setValue={setGender}
                        placeholder="Giới tính"
                        style={styles.dropdown}
                        containerStyle={{ flex: 1, marginLeft: 10 }}
                    />
                </View>


                <TextInput
                    label="Địa chỉ"
                    value={address}
                    onChangeText={text => setAddress(text)}
                    style={styles.input}
                    underlineColor="transparent"
                />

                <Button mode="contained" onPress={() => console.log('Chỉnh sửa xong')} style={styles.button}>
                    CHỈNH SỬA XONG
                </Button>
            </ScrollView>
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
        marginBottom: 10,
    },
    dropdown: {
        height: 50,
    },
});

export default EditProfileScreen;
