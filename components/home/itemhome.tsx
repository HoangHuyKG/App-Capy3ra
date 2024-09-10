import { StyleSheet, Text, View, Image, Button, TouchableOpacity } from "react-native"
import Entypo from '@expo/vector-icons/Entypo';
import { ImagesAssets } from "../../assets/images/ImagesAssets";
import { globalFont } from "../../utils/const";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ModalMenu from "../modal/modal.menu";
import { useState } from "react";
const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        backgroundColor: '#fff',
        height: 200,
        alignSelf: 'stretch',
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 20
    },
    itemtop: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    itemtoptext: {
        fontFamily: globalFont,
        fontSize: 16,
        fontWeight: 'bold'
    },
    itemcenter: {
        marginTop: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemcentertext: {
        fontFamily: globalFont,
        fontSize: 16,
    },
    itemcentertextsmall: {
        fontFamily: globalFont,
        fontSize: 12,
    },
    imageuser: {
        height: 40,
        width: 40,
        backgroundColor: '#fff',
        borderRadius: 20
    },
    progressBarContainer: {
        marginTop: 10,
        shadowColor: '#cfd3d3',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        borderRadius: 7.5,
        backgroundColor: '#cfd3d3',
        marginBottom: 15,
    },
    progressBar: {
        width: '100%',
        height: 15,
        backgroundColor: '#cfd3d3',
        borderRadius: 7.5,
        overflow: 'hidden',
    },
    progress: {
        height: '100%',
        width: '90%',
        backgroundColor: '#02929A',
    },
    itembottom: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itembottomchild: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itembottomtextchild: {
        fontSize: 16,
        fontFamily: globalFont
    },
    itembottombutton: {
        padding: 8,
        backgroundColor: '#02929A',
        borderRadius: 10,

    },
    itembottombuttontext: {
        fontSize: 12,
        fontFamily: globalFont,
        color: "#fff"
    }

})
const ItemHome = () => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.itemtop}>
                <Image
                    style={styles.imageuser}
                    source={ImagesAssets.unknowuser}
                />
                <Text style={styles.itemtoptext}>Bộ từ vựng AA</Text>
                <Entypo name="dots-three-vertical" size={24} color="black" onPress={() => setModalVisible(true)}/>
            </View>
            <View style={styles.itemcenter}>
                <Text style={styles.itemcentertext}>
                    100%
                </Text>
                <Text style={styles.itemcentertext}>
                    300/300 mục đã học
                </Text>
            </View>
            <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                    <View style={styles.progress}></View>
                </View>
            </View>
            <View style={styles.itembottom}>
                <View style={styles.itembottomchild}>
                    <AntDesign name="book" size={24} color="black" />
                    <Text style={styles.itembottomtextchild}>244</Text>
                </View>
                <View style={styles.itembottomchild}>
                <MaterialCommunityIcons name="lightning-bolt-outline" size={24} color="black" />
                    <Text style={styles.itembottomtextchild}>22</Text>
                </View>
                <TouchableOpacity style={styles.itembottombutton}>
                    <Text style={styles.itembottombuttontext}>Ôn tập thông thường</Text>
                </TouchableOpacity>
                <View>
                <MaterialIcons name="dashboard" size={24} color="black" />
                </View>
            </View>
            <ModalMenu 
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
            />
        </View>
    )
}

export default ItemHome;