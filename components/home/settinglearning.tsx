import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { globalFont } from '../../utils/const';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

interface CustomSliderButtonsProps {
    options: number[];
    selectedValue: number;
    onValueChange: (value: number) => void;
  }
  
  const CustomSliderButtons: React.FC<CustomSliderButtonsProps> = ({ options, selectedValue, onValueChange }) => {
    return (
      <View style={styles.sliderRow}>
        {options.map((value) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.sliderButton,
              selectedValue === value ? styles.selectedSliderButton : undefined, 
            ]}
            onPress={() => onValueChange(value)}
          >
            <Text style={selectedValue === value ? styles.selectedSliderText : styles.sliderText}>
              {value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  

const SettingLearningScreen = () => {
    const [isQuestionTypeEnabled, setIsQuestionTypeEnabled] = useState(false);
    const [isDialogSuggestionEnabled, setIsDialogSuggestionEnabled] = useState(true);
    const [isListeningTestEnabled, setIsListeningTestEnabled] = useState(false);
    const [isSoundEffectEnabled, setIsSoundEffectEnabled] = useState(true);
    const [lessonWords, setLessonWords] = useState(10);
    const [difficultWords, setDifficultWords] = useState(5);
    const [reviewWords, setReviewWords] = useState(15);
    const [quickReviewWords, setQuickReviewWords] = useState(100);
    const navigation: NavigationProp<RootStackParamList> = useNavigation();

    return (
        <ScrollView style={styles.container}>
            <Ionicons name="arrow-back" size={30} color="white" onPress={() => navigation.goBack()} />

            <Text style={styles.title}>Cài đặt chế độ âm thanh và học tập</Text>

            {/* Ưu tiên loại trắc nghiệm */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ưu tiên loại trắc nghiệm</Text>
                <View style={styles.row}>
                    <Text>Kiểm tra và sắp xếp từ</Text>
                    <Switch
                        value={isQuestionTypeEnabled}
                        onValueChange={setIsQuestionTypeEnabled}
                    />
                </View>
                <View style={styles.row}>
                    <Text>Gợi ý tập trả lời hội thoại</Text>
                    <Switch
                        value={isDialogSuggestionEnabled}
                        onValueChange={setIsDialogSuggestionEnabled}
                    />
                </View>
            </View>

            {/* Ưu tiên nghe */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ưu tiên nghe</Text>
                <View style={styles.row}>
                    <Text>Kiểm tra nghe</Text>
                    <Switch
                        value={isListeningTestEnabled}
                        onValueChange={setIsListeningTestEnabled}
                    />
                </View>
                <View style={styles.row}>
                    <Text>Hiệu ứng âm thanh</Text>
                    <Switch
                        value={isSoundEffectEnabled}
                        onValueChange={setIsSoundEffectEnabled}
                    />
                </View>
            </View>

            {/* Ưu tiên tiết học */}
            <View style={[styles.section, { marginBottom: 60  }]}>

                <Text style={styles.sectionTitle}>Ưu tiên tiết học</Text>

                {/* Từ mỗi tiết học */}
                <Text style={styles.label}>Từ mỗi tiết học</Text>
                <CustomSliderButtons
                    options={[3, 5, 7, 10]}
                    selectedValue={lessonWords}
                    onValueChange={setLessonWords}
                />

                {/* Số từ trong mỗi phần ôn tập từ khó */}
                <Text style={styles.label}>Số từ trong mỗi phần ôn tập từ khó</Text>
                <CustomSliderButtons
                    options={[5, 10, 15, 20]}
                    selectedValue={difficultWords}
                    onValueChange={setDifficultWords}
                />

                {/* Từ mỗi tiết ôn tập */}
                <Text style={styles.label}>Từ mỗi tiết ôn tập</Text>
                <CustomSliderButtons
                    options={[5, 15, 25, 50]}
                    selectedValue={reviewWords}
                    onValueChange={setReviewWords}
                />

                {/* Số từ trong 1 phiên ôn tập nhanh */}
                <Text style={styles.label}>Số từ trong 1 phiên ôn tập nhanh</Text>
                <CustomSliderButtons
                    options={[25, 50, 100, 150]}
                    selectedValue={quickReviewWords}
                    onValueChange={setQuickReviewWords}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 40,
        paddingHorizontal: 20,
        
        backgroundColor: '#02929A',
    },
    title: {
        fontSize: 24,
        fontFamily: globalFont,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    section: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
    sectionTitle: {
        fontFamily: globalFont,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    slider: {
        width: '100%',
        height: 35,
    },

    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 10,
    },
    sliderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    sliderButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
    },
    selectedSliderButton: {
        backgroundColor: '#ffffff',
        borderColor: '#ccc',
        borderWidth: 1,
    },
    sliderText: {
        fontSize: 16,
        color: '#000',
    },
    selectedSliderText: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
    },
});

export default SettingLearningScreen;
