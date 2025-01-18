import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
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

  const renderItem = ({ item }) => (
    <View style={styles.taskContainer}>
      <Text style={styles.taskText}>Team: {item.team}</Text>
      <Text style={styles.taskText}>Odds: {item.odds}</Text>
      <Text style={styles.taskText}>Amount: {item.amount}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      
      {Object.keys(currentBets).length === 0 ? (
        <Text style={styles.noBetsText}>No bets placed yet.</Text>
      ) : (
        <FlatList
          data={Object.keys(currentBets).map(key => ({ ...currentBets[key], key }))}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#007bff',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  flatListContent: {
    padding: 20,
  },
  noBetsText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  taskContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  taskText: {
    fontSize: 18,
    color: '#333',
  },
});

export default MyBets;