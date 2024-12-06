import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const PrivacyPolicyScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Ionicons
                    name="arrow-back"
                    size={30}
                    color="black"
                    onPress={() => navigation.goBack()}
                    style={styles.backIcon}
                />
                <Text style={styles.title}>Chính Sách Quyền Riêng Tư</Text>
            </View>

            {/* Nội dung */}
            <ScrollView style={styles.content}>
                <Text style={styles.sectionTitle}>1. Loại dữ liệu chúng tôi thu thập</Text>
                <Text style={styles.text}>
                    Chúng tôi thu thập các thông tin cá nhân như họ tên, địa chỉ email, số điện thoại, và địa chỉ của bạn khi sử dụng dịch vụ. 
                    Dữ liệu này giúp chúng tôi cải thiện trải nghiệm và cung cấp dịch vụ phù hợp hơn.
                </Text>

                <Text style={styles.sectionTitle}>2. Mục đích sử dụng dữ liệu cá nhân</Text>
                <Text style={styles.text}>
                    Dữ liệu cá nhân của bạn sẽ được sử dụng để xác minh tài khoản, hỗ trợ khách hàng, và gửi các thông báo liên quan đến dịch vụ. 
                    Chúng tôi cam kết không sử dụng dữ liệu của bạn vào mục đích khác khi chưa có sự đồng ý.
                </Text>

                <Text style={styles.sectionTitle}>3. Chia sẻ dữ liệu cá nhân</Text>
                <Text style={styles.text}>
                    Trong một số trường hợp cần thiết, dữ liệu của bạn có thể được chia sẻ với đối tác tin cậy để đảm bảo cung cấp dịch vụ tối ưu. 
                    Tuy nhiên, chúng tôi luôn tuân thủ các quy định pháp luật về bảo mật thông tin cá nhân.
                </Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backIcon: {
        marginRight: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'justify',
    },
});

export default PrivacyPolicyScreen;
