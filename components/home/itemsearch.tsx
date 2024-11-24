import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { db } from '../../fireBaseConfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';

interface CourseSearchProps {
  searchQuery: string; // Từ khóa tìm kiếm được truyền từ component cha
}

const CourseSearch: React.FC<CourseSearchProps> = ({ searchQuery }) => {
  const [courses, setCourses] = useState([]);
  const navigation: NavigationProp<any> = useNavigation();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setCourses([]); // Nếu từ khóa trống, không hiển thị kết quả
      return;
    }

    const q = query(
      collection(db, 'Courses'),
      where('title', '>=', searchQuery),
      where('title', '<=', searchQuery + '\uf8ff') // Tìm kiếm chuỗi bắt đầu với từ khóa
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const coursesData = snapshot.docs.map((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt ? data.createdAt.toDate() : null;
        return { id: doc.id, ...data, createdAt };
      });
      setCourses(coursesData);
    });

    return () => unsubscribe();
  }, [searchQuery]); // Chỉ chạy lại khi `searchQuery` thay đổi

  return (
    <View>
      {courses.length > 0 ? (
        courses.map((course) => (
          <View key={course.id} style={styles.cardContainer}>
            <TouchableOpacity 
              onPress={() => navigation.navigate("ReviewCourseScreen", { courseId: course.id })}
            >
              <View style={styles.header}>
                <Image
                  source={{ uri: course.imageUrl || 'https://via.placeholder.com/150' }}
                  style={styles.courseImage}
                />
                <View style={styles.categoryIcon}>
                  <Image
                    source={{ uri: course.imageUser || 'https://via.placeholder.com/150' }}
                    style={styles.iconImage}
                  />
                </View>
              </View>

              <View style={styles.detailsContainer}>
                <View style={styles.courseInfo}>
                  <Text style={styles.categoryText}>{course.language ? course.language.trim() : 'N/A'}</Text>
                  <Text style={styles.authorText}>{course.created_by ? course.created_by.trim() : 'N/A'}</Text>
                </View>
                <Text style={styles.courseTitle}>{course.title ? course.title.trim() : 'N/A'}</Text>

                <View style={styles.statsContainer}>
                  <View style={styles.stat}>
                  </View>
                  <View style={styles.stat}>
                    <AntDesign name="clockcircleo" size={24} color="black" />
                    <Text style={styles.statText}>
                      {course.createdAt ? format(course.createdAt, 'dd/MM/yyyy') : 'N/A'}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Không tìm thấy khóa học nào.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  courseImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  categoryIcon: {
    position: 'absolute',
    left: 10,
    top: -15,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 5,
  },
  iconImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  detailsContainer: {
    paddingHorizontal: 5,
    paddingTop: 10,
  },
  courseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 12,
    color: '#555',
  },
  authorText: {
    fontSize: 12,
    color: '#555',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 5,
  },
});

export default CourseSearch;
