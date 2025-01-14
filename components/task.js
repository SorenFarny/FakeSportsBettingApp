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
                <Text style={styles.itemText}>{team1 + " vs. "}</Text>
                <Text style={styles.itemText}>{team2 + " "}</Text>
                <Text style={styles.itemText}>{odds1 + " "}</Text>
                <Text style={styles.itemText}>{odds2 + " "}</Text>
                <Text style={styles.itemText}>{commence_time + " "}</Text>
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
        backgroundColor: '#d6d6d6',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    itemLeft: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        flex: 1,
    },
    itemText: {
        maxWidth: '80%',
    },
    picker: {
        height: 50,
        width: 150,
    },
    input: {
        height: 40,
        borderColor: 'white',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        width: 100,
        backgroundColor: "white",
    },
    button: {
        backgroundColor: '#55BCF6',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Task;
