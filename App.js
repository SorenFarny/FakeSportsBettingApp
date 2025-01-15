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
import { fetchBets, saveBetsToFile } from './api/betsApi'; // Import fetchBets and saveBetsToFile functions
import { clearAllLocalStorage } from './api/betsApi';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const [teams, setTeams] = useState([]);
  const [money, setMoney] = useState(0); // State variable to store the current amount of money
  const { addTask } = useContext(TaskContext);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const betData = await fetchBets();
        console.log('Fetched bet data:', betData); // Log fetched data
        const teamsArray = getTeamsWithDraftKingsPrices(betData);
        console.log('Parsed teams data:', teamsArray); // Log parsed data
        setTeams(teamsArray); // Update the teams state variable with the parsed data
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    loadTeams();

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

    // Save bets to AsyncStorage
    const saveBets = async () => {
      try {
        await saveBetsToFile();
      } catch (error) {
        console.error('Error saving bets to AsyncStorage:', error);
      }
    };

    saveBets();

    // Load bets from AsyncStorage
    const loadBets = async () => {
      try {
        const storedBets = await AsyncStorage.getItem('betData');
        if (storedBets !== null) {
          const bets = JSON.parse(storedBets);
          console.log('Loaded bets from AsyncStorage:', bets);
          // Do something with the loaded bets
        }
      } catch (error) {
        console.error('Error loading bets from AsyncStorage:', error);
      }
    };
    clearAllLocalStorage();
    //loadBets();
  }, []);

  const handlePlaceBet = async (amount, selectedTeam, selectedOdds, id, commence_time) => {
    await placeBet(amount, selectedTeam, selectedOdds, id, addTask, commence_time);
    // Update the money state variable after placing a bet
    const storedMoney = await AsyncStorage.getItem('currMoney');
    if (storedMoney !== null) {
      setMoney(JSON.parse(storedMoney));
    }
  }

  const isTeamInCurrentBets =  async (teamName) => {
     currentBets = await AsyncStorage.getItem('currentBets');
    return Object.values(currentBets).some(bet => bet.team === teamName);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Betting App</Text>
      </View>
      <View style={styles.header}>
        <Button title="Go to New Page" onPress={() => navigation.navigate('NewPage')} />
      </View>
      <View style={styles.moneyWrapper}>
        <Text style={styles.moneyText}>Current Money: ${money}</Text>
      </View>
      <View style={styles.tasksWrapper}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.sectionTitle}>Teams with DraftKings Prices</Text>
          <View style={styles.items}>
            {teams.map((team, index) => (
              !isTeamInCurrentBets(team.home_team) && !isTeamInCurrentBets(team.away_team) && (
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
              )
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
  moneyWrapper: {
    padding: 20,
    alignItems: 'center',
  },
  moneyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tasksWrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
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
  footer: {
    padding: 20,
    alignItems: 'center',
  },
});
