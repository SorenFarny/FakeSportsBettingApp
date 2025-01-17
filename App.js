import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Task from './components/task';
import { getTeamsWithDraftKingsPrices } from './api/parsing';
import { addMoney, placeBet, checkResults } from './moneyHandling/money';
import MyBets from './components/MyBets';
import { TaskProvider, TaskContext } from './context/TaskContext'; // Import TaskProvider and TaskContext
import { fetchBets, saveBetsToFile, clearAllLocalStorage } from './api/betsApi'; // Import fetchBets, saveBetsToFile, and clearAllLocalStorage functions

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const [teams, setTeams] = useState([]);
  const [money, setMoney] = useState(0); // State variable to store the current amount of money
  const [currentBets, setCurrentBets] = useState({}); // State variable to store the current bets
  const { addTask } = useContext(TaskContext);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        // Fetch and save bets if not already in AsyncStorage
        await saveBetsToFile();
        const teamsArray = await getTeamsWithDraftKingsPrices();
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

    // Load current bets from local storage
    const loadCurrentBets = async () => {
      try {
        const storedBets = await AsyncStorage.getItem('currentBets');
        if (storedBets !== null) {
          setCurrentBets(JSON.parse(storedBets));
        }
      } catch (error) {
        console.error('Error loading current bets from local storage:', error);
      }
    };

    loadCurrentBets();
    checkResults();
    
  }, []);

  const handlePlaceBet = async (amount, selectedTeam, selectedOdds, id, commence_time) => {
    await placeBet(amount, selectedTeam, selectedOdds, id, addTask, commence_time);
    // Update the money state variable after placing a bet
    const storedMoney = await AsyncStorage.getItem('currMoney');
    if (storedMoney !== null) {
      setMoney(JSON.parse(storedMoney));
    }
  }

  const isTeamInCurrentBets = (teamName) => {
    return Object.values(currentBets).some(bet => bet.team === teamName);
  }

  return (
    <View style={styles.container}>
      <View style={styles.moneyWrapper}>
        <Text style={styles.moneyText}>Current Money: ${money}</Text>
      </View>
      <View style={styles.tasksWrapper}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.sectionTitle}>Games not bet on:</Text>
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
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={({ navigation }) => ({
              headerRight: () => (
                <Button
                  onPress={() => navigation.navigate('MyBets')}
                  title="Go to My Bets"
                  color="#007bff"
                />
              ),
            })}
          />
          <Stack.Screen name="MyBets" component={MyBets} />
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
    //flex: 1,
    padding: 60,
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
  }

});
