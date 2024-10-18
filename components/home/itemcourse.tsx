import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ImagesAssets } from '../../assets/images/ImagesAssets';
import AntDesign from '@expo/vector-icons/AntDesign';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationProp, useNavigation } from '@react-navigation/native';

const CourseItem = () => {
  const [courses, setCourses] = useState([]);
  const navigation: NavigationProp<any> = useNavigation();
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Courses'));
        const coursesData = querySnapshot.docs.map(doc => {
          console.log('Document data:', doc.data()); // Log dữ liệu tài liệu
          return { id: doc.id, ...doc.data() };
        });
        console.log('Courses Data:', coursesData); // Log mảng dữ liệu khóa học
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses: ", error);
      }
    };
    
    fetchCourses();
  }, []);

  return (   
     
 

    <View >
      {courses.length > 0 ? (
        courses.map(course => (
          <View key={course.course_id} style={styles.cardContainer}>
            <TouchableOpacity  onPress={()=>navigation.navigate("ReviewCourseScreen")}>
            <View style={styles.header}>
              <Image
                source={ImagesAssets.imagelogo}
                style={styles.courseImage}
              />
              <View style={styles.categoryIcon}>
                <Image
                  source={ImagesAssets.imagelogo}
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
                  <MaterialIcons name="groups" size={24} color="black" />
                  <Text style={styles.statText}>22k</Text>
                </View>
                <View style={styles.stat}>
                  <AntDesign name="clockcircleo" size={24} color="black" />
                  <Text style={styles.statText}>72h</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text>No courses found</Text>
        
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

export default CourseItem;
