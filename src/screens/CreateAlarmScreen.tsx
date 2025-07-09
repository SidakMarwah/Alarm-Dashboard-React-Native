import { Alert, StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import DatePicker from 'react-native-date-picker'
import ButtonPrimary from '../components/ButtonPrimary'
import { getFormattedTime } from '../utils/dateUtils'
import { addAlarm } from '../db/alarms'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { scheduleAlarmNotification } from '../utils/notifications'

const CreateAlarmScreen = ({ navigation }) => {
    const [time, setTime] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [repeat, setRepeat] = useState(false);
    const [userId, setUserId] = useState<string>('');

    // Load user ID on mount
    useEffect(() => {
        const loadUserId = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                if (storedUserId) {
                    console.log("Loaded user ID:", storedUserId);
                    setUserId(storedUserId);
                } else {
                    console.warn("No user ID found in AsyncStorage");
                }
            } catch (error) {
                console.error("Failed to load user ID:", error);
            }
        };

        loadUserId();
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

        const alarmData = {
            title,
            time: getFormattedTime(time),
            repeat,
            isActive: true
        };

        try {
            const insertId = await addAlarm({
                alarm: alarmData,
                userId
            })
            await scheduleAlarmNotification(alarmData, insertId);
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
            <ButtonPrimary
                title="Create Alarm"
                style={{ backgroundColor: '#1976d2' }}
                onPress={handleCreateAlarm}
            />
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