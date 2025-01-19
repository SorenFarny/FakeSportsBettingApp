import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View, FlatList, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Task from './components/task';
import { getTeamsWithDraftKingsPrices } from './api/parsing';
import { addMoney, placeBet, checkResults } from './moneyHandling/money';
import MyBets from './components/MyBets';
import { TaskProvider, TaskContext } from './context/TaskContext'; // Import TaskProvider and TaskContext
import { fetchBets, saveBetsToFile, clearAllLocalStorage } from './api/betsApi'; // Import fetchBets, saveBetsToFile, and clearAllLocalStorage functions

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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
     // Load the current amount of money from local storage
     const loadMoney = async () => {
      try {
        const storedMoney = await AsyncStorage.getItem('currMoney');
        if (storedMoney !== null) {
          setMoney(JSON.parse(storedMoney));
          if (storedMoney <= 0) {
            await AsyncStorage.setItem('currMoney', JSON.stringify(100000));
            setMoney(100000);
          }
        }
      } catch (error) {
        console.error('Error loading money from local storage:', error);
      }
    };

loadMoney();
  useEffect(() => {
    clearAllLocalStorage(); 
  }, []);

  const handlePlaceBet = async (amount, selectedTeam, selectedOdds, id, commence_time) => {
    await placeBet(amount, selectedTeam, selectedOdds, id, addTask, commence_time);
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
        <Text style={styles.sectionTitle}>Games not bet on:</Text>
        <FlatList
          data={teams.filter(team => !isTeamInCurrentBets(team.home_team) && !isTeamInCurrentBets(team.away_team))}
          renderItem={({ item }) => (
            <Task
              team1={item.home_team}
              team2={item.away_team}
              odds1={item.home_team_price}
              odds2={item.away_team_price}
              id={item.id}
              commence_time={item.commence_time}
              onPress={(amount, selectedTeam, selectedOdds, id, commence_time) => handlePlaceBet(amount, selectedTeam, selectedOdds, id, commence_time)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    </View>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: { flex: 1 }, 
      }}
    >
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
  );
}

export default function App() {
  return (
    <TaskProvider>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="Home" component={HomeStack} />
         
        </Tab.Navigator>
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
  flatListContent: {
    paddingBottom: 20,
  },
  items: {
    flex: 1,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
