import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AppHeader from '../navigation/app.header';
import { useState } from 'react';
import { globalFont } from '../../utils/const';
import AddVocabularyModal from '../modal/modal.addvocalbulary';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';

const Editcourevocalbulary = () => {
    const navigation: NavigationProp<RootStackParamList> = useNavigation();
    const [modalVisible, setModalVisible] = useState(false); // Thêm state cho modal
    const data = [
        { id: '1', en: 'thank', vn: 'cảm ơn', type: "Động từ" },
        { id: '2', en: 'love', vn: 'yêu', type: "Động từ" },
        { id: '3', en: 'run', vn: 'chạy', type: "Động từ" },
        { id: '4', en: 'walk', vn: 'đi bộ', type: "Động từ" },
        { id: '5', en: 'eat', vn: 'ăn', type: "Động từ" },
    ];

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.columnEn}>{item.en}</Text>
            <Text style={styles.columnVn}>{item.vn}</Text>
            <Text style={styles.columnType}>{item.type}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <AppHeader />
            <View style={styles.boxbutton}>
                <TouchableOpacity
                    style={styles.buttonadd}
                    onPress={() => setModalVisible(true)} // Hiển thị modal khi nhấn nút
                >
                    <Text style={styles.buttonaddtext}>Thêm từ vựng</Text>
                </TouchableOpacity>
            </View>

            {/* Thêm hàng tiêu đề */}
            <View style={styles.headerRow}>
                <View style={styles.headerColumnEn}>
                    <Text style={styles.headerText}>Tiếng Anh</Text>
                </View>
                <View style={styles.headerColumnVn}>
                    <Text style={styles.headerText}>Tiếng Việt</Text>
                </View>
                <View style={styles.headerColumnType}>
                    <Text style={styles.headerText}>Từ loại</Text>
                </View>
            </View>

            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                style={styles.wordList}
            />

            {/* Gọi modal và điều khiển hiển thị */}
            <AddVocabularyModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e6f4f5',
        display: 'flex',
    },
    buttonadd: {
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
    buttonaddtext: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: globalFont,
    },
    text: {
        fontSize: 16,
        fontFamily: globalFont,
    },
    boxbutton: {
        display: 'flex',
        alignItems: 'flex-end',
    },
    wordList: {
        paddingHorizontal: 20,
        marginHorizontal: 20,
        backgroundColor: "#fff",
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#02929A',
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginHorizontal: 20,
        marginTop: 10,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    headerText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: globalFont,
    },
    // Cột tiêu đề
    headerColumnEn: {
        flex: 3,
        justifyContent: 'center',
    },
    headerColumnVn: {
        flex: 3,
        justifyContent: 'center',
    },
    headerColumnType: {
        flex: 2,
        justifyContent: 'center',
    },
    // Cột từ vựng
    columnEn: {
        flex: 3,
        fontSize: 16,
        fontFamily: globalFont,
    },
    columnVn: {
        flex: 3,
        fontSize: 16,
        fontFamily: globalFont,
    },
    columnType: {
        flex: 2,
        fontSize: 16,
        fontFamily: globalFont,
    },
});

export default Editcourevocalbulary;
