import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyBets = () => {
  const [currentBets, setCurrentBets] = useState({});

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const bets = await AsyncStorage.getItem('currentBets');
        if (bets !== null) {
          setCurrentBets(JSON.parse(bets));
        }
      } catch (error) {
        console.error('Error fetching bets from local storage:', error);
      }
    };

    fetchBets();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Placed Bets</Text>
      {Object.keys(currentBets).map((key, index) => (
        <View key={index} style={styles.taskContainer}>
          <Text style={styles.taskText}>Team: {currentBets[key].team}</Text>
          <Text style={styles.taskText}>Odds: {currentBets[key].odds}</Text>
          <Text style={styles.taskText}>Amount: {currentBets[key].amount}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
  taskContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  taskText: {
    fontSize: 18,
  },
});

export default MyBets;