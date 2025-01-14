import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Task from './components/task';
import { getTeamsWithDraftKingsPrices } from './api/parsing';
import { addMoney, placeBet } from './moneyHandling/money';
import NewPage from './components/NewPage';
import { TaskProvider, TaskContext } from './context/TaskContext'; // Import TaskProvider and TaskContext

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const [teams, setTeams] = useState([]);
  const [money, setMoney] = useState(0); // State variable to store the current amount of money
  const { addTask } = useContext(TaskContext);

  useEffect(() => {
    const teamsArray = getTeamsWithDraftKingsPrices();
    setTeams(teamsArray);

    // Load the current amount of money from local storage
    const loadMoney = async () => {
      try {
        const storedMoney = await AsyncStorage.getItem('currMoney');
        if (storedMoney !== null) {
          setMoney(JSON.parse(storedMoney));
        }
      } catch (error) {
        console.error('Error loading money from local storage:', error);
      }
    };

    loadMoney();
  }, []);

  const handlePlaceBet = async (amount, selectedTeam, selectedOdds, id, commence_time) => {
    await placeBet(amount, selectedTeam, selectedOdds, id, addTask, commence_time);
    // Update the money state variable after placing a bet
    const storedMoney = await AsyncStorage.getItem('currMoney');
    if (storedMoney !== null) {
      setMoney(JSON.parse(storedMoney));
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.tasksWrapper}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.sectionTitle}>Teams with DraftKings Prices</Text>
          <Text>Money: {money}</Text>
          <Button title="Go to New Page" onPress={() => navigation.navigate('NewPage')} />
          <View style={styles.items}>
            {teams.map((team, index) => (
              <Task
                key={index}
                team1={team.home_team}
                team2={team.away_team}
                odds1={team.home_team_price}
                odds2={team.away_team_price}
                id={team.id}
                commence_time={team.commence_time}
                onPress={(amount, selectedTeam, selectedOdds, id, commence_time) => handlePlaceBet(amount, selectedTeam, selectedOdds, id, commence_time)}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="NewPage" component={NewPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </TaskProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  items: {
    flex: 1,
  },
});
