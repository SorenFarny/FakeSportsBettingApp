import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, SafeAreaView } from "react-native";
import PickerModal from 'react-native-picker-modal-view';

const Task = ({ team1, team2, odds1, odds2, id, commence_time, onPress }) => {
    const [betAmount, setBetAmount] = useState('');
    const [selectedTeam, setSelectedTeam] = useState({ Name: team1, Value: team1 });

    const handlePress = () => {
        const selectedOdds = selectedTeam.Value === team1 ? odds1 : odds2;
        onPress(betAmount, selectedTeam.Value, selectedOdds, id, commence_time);
    };

    const items = [
        { Name: team1, Value: team1 },
        { Name: team2, Value: team2 }
    ];

    return (
        <SafeAreaView style={styles.item}>
            <View style={styles.itemLeft}>
                <Text style={styles.itemText}>{team1 + " " + odds1 + " vs. "}</Text>
                <Text style={styles.itemText}>{team2 + " " + odds2 + " "}</Text>
                <Text style={styles.itemText}>{commence_time + " "}</Text>
                <View style={styles.row}>
                    <PickerModal
                        renderSelectView={(disabled, selected, showModal) =>
                            <Button disabled={disabled} title={selected.Name || 'Select Team'} onPress={showModal} style={styles.pickerButton} />
                        }
                        onSelected={(selected) => setSelectedTeam(selected)}
                        onClosed={() => console.log('Picker closed')}
                        onBackButtonPressed={() => console.log('Back button pressed')}
                        items={items}
                        sortingLanguage={'en'}
                        showToTopButton={true}
                        selected={selectedTeam}
                        showAlphabeticalIndex={true}
                        autoGenerateAlphabeticalIndex={true}
                        selectPlaceholderText={'Choose one...'}
                        searchPlaceholderText={'Search...'}
                        requireSelection={false}
                        autoSort={false}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter bet"
                        value={betAmount}
                        onChangeText={setBetAmount}
                        keyboardType="numeric"
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handlePress}>
                    <Text style={styles.buttonText}>Place Bet</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#d6d6d6',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 20,
        width: '90%',
    },
    itemLeft: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    itemText: {
        maxWidth: '90%',
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    pickerButton: {
        height: 50,
        flex: 1,
        //marginRight: 10,
    },
    input: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        width: 125,
        backgroundColor: "white",
    },
    button: {
        backgroundColor: '#55BCF6',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: 325,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Task;
