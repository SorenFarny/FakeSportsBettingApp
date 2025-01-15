import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";

const Task = ({ team1, team2, odds1, odds2, id, commence_time, onPress }) => {
    const [betAmount, setBetAmount] = useState('');
    const [selectedTeam, setSelectedTeam] = useState(team1); 

    const handlePress = () => {
        const selectedOdds = selectedTeam === team1 ? odds1 : odds2;
        onPress(betAmount, selectedTeam, selectedOdds, id, commence_time);
    };

    return (
        <View style={styles.item}>
            <View style={styles.itemLeft}>
                <Text style={styles.itemText}>{team1} vs. {team2}</Text>
                <Text style={styles.itemText}>Odds: {odds1} / {odds2}      Commence time: {commence_time}</Text>
                <Picker
                    selectedValue={selectedTeam}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedTeam(itemValue)}
                >
                    <Picker.Item label={team1} value={team1} />
                    <Picker.Item label={team2} value={team2} />
                </Picker>
                <TextInput
                    style={styles.input}
                    placeholder="Enter bet"
                    value={betAmount}
                    onChangeText={setBetAmount}
                    keyboardType="numeric"
                />
                <TouchableOpacity style={styles.button} onPress={handlePress}>
                    <Text style={styles.buttonText}>Place Bet</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#f8f9fa',
        padding: 20,
        borderRadius: 10,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    itemLeft: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        flex: 1,
    },
    itemText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 10,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: '#ced4da',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        width: '100%',
        backgroundColor: "#fff",
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Task;
