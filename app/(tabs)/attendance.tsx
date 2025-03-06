import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AttendanceScreen() {
  const [attendance, setAttendance] = useState({});

  useFocusEffect(
    useCallback(() => {
      loadAttendance();
    }, [])
  );

  const loadAttendance = async () => {
    try {
      const savedAttendance = await AsyncStorage.getItem('attendance');
      if (savedAttendance) {
        setAttendance(JSON.parse(savedAttendance));
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  };

  const toggleAttendance = async (date) => {
    const updatedAttendance = {
      ...attendance,
      [date]: !attendance[date],
    };
    
    try {
      await AsyncStorage.setItem('attendance', JSON.stringify(updatedAttendance));
      setAttendance(updatedAttendance);
    } catch (error) {
      console.error('Error saving attendance:', error);
    }
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(currentYear, currentMonth, i));
    }

    return days;
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const calendarDays = generateCalendarDays();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Attendance Tracker</Text>
      
      <View style={styles.calendar}>
        <View style={styles.weekDays}>
          {DAYS_OF_WEEK.map((day) => (
            <Text key={day} style={styles.weekDay}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.days}>
          {calendarDays.map((date, index) => (
            <View key={index} style={styles.dayCell}>
              {date && (
                <Pressable
                  style={[
                    styles.day,
                    isToday(date) && styles.today,
                    attendance[formatDate(date)] && styles.present,
                  ]}
                  onPress={() => toggleAttendance(formatDate(date))}>
                  <Text
                    style={[
                      styles.dayText,
                      (isToday(date) || attendance[formatDate(date)]) &&
                        styles.dayTextLight,
                    ]}>
                    {date.getDate()}
                  </Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {Object.values(attendance).filter(Boolean).length}
          </Text>
          <Text style={styles.statLabel}>Days Present</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {calendarDays.filter(Boolean).length}
          </Text>
          <Text style={styles.statLabel}>Total Days</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#212529',
  },
  calendar: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    color: '#6c757d',
    fontWeight: '600',
  },
  days: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 2,
  },
  day: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  today: {
    backgroundColor: '#0066cc',
  },
  present: {
    backgroundColor: '#28a745',
  },
  dayText: {
    color: '#212529',
  },
  dayTextLight: {
    color: '#fff',
  },
  stats: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#212529',
  },
  statLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
});