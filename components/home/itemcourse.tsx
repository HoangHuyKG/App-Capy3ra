import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ImagesAssets } from '../../assets/images/ImagesAssets';
import AntDesign from '@expo/vector-icons/AntDesign';
const CourseItem = () => {
  return (
    <View style={styles.cardContainer}>
      {/* Image and category icon */}
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

      {/* Course details */}
      <View style={styles.detailsContainer}>
        <View style={styles.courseInfo}>
          <Text style={styles.categoryText}>Tiếng Anh</Text>
          <Text style={styles.authorText}>bởi Thành dz</Text>
        </View>
        <Text style={styles.courseTitle}>400 từ toeic - Khóa học tuyệt vời</Text>

        {/* Stats */}
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
