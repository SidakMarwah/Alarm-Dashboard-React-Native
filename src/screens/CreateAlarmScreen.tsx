import { Alert, Button, StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-native-date-picker'
import ButtonPrimary from '../components/ButtonPrimary'
import { getFormattedTime } from '../utils/dateUtils'
import { addAlarm } from '../db/alarms'
import AsyncStorage from '@react-native-async-storage/async-storage'

const CreateAlarmScreen = ({ navigation }) => {
    const [time, setTime] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [repeat, setRepeat] = useState(false);
    const [email, setEmail] = useState<string>('');

    // Load email on mount
    useEffect(() => {
        const loadEmail = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem('userEmail');
                if (storedEmail) {
                    console.log("Loaded user email:", storedEmail);
                    setEmail(storedEmail);
                } else {
                    console.warn("No user email found in AsyncStorage");
                }
            } catch (error) {
                console.error("Failed to load user email:", error);
            }
        };

        loadEmail();
    }, []);

    const handleCreateAlarm = async () => {
        if (!title.trim()) {
            Alert.alert('Validation', 'Alarm title is required');
            return;
        }

        // Save to SQLite here
        // console.log({
        //     title,
        //     time: getFormattedTime(time),
        //     repeat,
        //     isActive: 1,
        // });

        try {
            await addAlarm({
                alarm: {
                    title,
                    time: getFormattedTime(time),
                    repeat,
                    isActive: true
                },
                email
            })
            Alert.alert('Success', 'Alarm created!');
        } catch (error) {
            console.error('Error creating alarm:', error);
            Alert.alert('Error', 'Failed to create alarm');
        }
        finally {
            // Reset form after creating alarm
            setTitle('');
            setTime(new Date());
            setRepeat(false);
            navigation.navigate('Dashboard'); // Navigate to the Dashboard list screen
        }

    };

    return (
        <View style={styles.container}>

            <Text style={styles.label}>Alarm Title:</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter alarm title"
                value={title}
                onChangeText={setTitle}
            />

            <Text style={styles.label}>Selected Time:</Text>
            <Text style={styles.timeText}>
                {getFormattedTime(time)}
            </Text>

            <ButtonPrimary title="Pick the time" onPress={() => setOpen(true)} />
            <DatePicker
                modal
                mode='time'
                open={open}
                date={time}
                onConfirm={(date) => {
                    setOpen(false)
                    setTime(date)
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />
            <View style={styles.switchContainer}>
                <Text style={styles.label}>Repeat:</Text>
                <Switch value={repeat} onValueChange={setRepeat} />
            </View>
            <Button title="Create Alarm" onPress={handleCreateAlarm} />
        </View>
    )
}

export default CreateAlarmScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
    },
    text: {
        fontSize: 20,
        color: '#333',
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
    },
    timeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#eee',
        color: '#333',
        padding: 10,
        borderRadius: 6,
        borderWidth: 1,
        marginBottom: 20
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 16,
    },
})