import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Task from './components/task';
export default function App() {
  return (
    <View style={styles.container}>


      <View style = {styles.tasksWrapper}>
        <Text style = {styles.sectionTitle}> Current Bets</Text>

        <View style = {styles.items}>
          {/* This is where the tasks will go */}
          <Task text = {'Task 1'}/>
          </View>

      </View>
    </View>
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
  },
sectionTitle: {
  fontSize: 24,
  fontWeight: 'bold',
},
items: {},
});
