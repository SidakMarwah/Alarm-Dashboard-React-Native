import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { use, useContext, useEffect, useState } from 'react'
import { Alarm, deleteAlarm, fetchAlarms, updateAlarmActiveStatus } from '../db/alarms';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AlarmCard from '../components/AlarmCard';
import notifee from '@notifee/react-native';
import ButtonPrimary from '../components/ButtonPrimary';

const DashBoardScreen = ({ navigation }) => {

    const [time, setTime] = useState(getCurrentTime());
    const [alarms, setAlarms] = useState<Alarm[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString(); // or format as needed
    }

    // Load userId on mount
    useEffect(() => {
        const loadUserId = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                if (storedUserId) {
                    // console.log("Loaded userId:", storedUserId);
                    setUserId(storedUserId);
                }
            } catch (error) {
                console.error("Failed to load userId:", error);
            }
        };

        loadUserId();
    }, []);

    // Fetch alarms when email is set
    const loadAlarms = async () => {
        try {
            if (userId) {
                const result = await fetchAlarms(userId);
                // console.log("Fetched alarms:", result);
                setAlarms(result);
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to load alarms');
        }
    };
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => loadAlarms());
        return () => {
            unsubscribe();
        };
    }, [userId, navigation]);

    useEffect(() => {
        // console.log("Alarms loaded:", alarms);

    }, [alarms])

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(getCurrentTime());
        }, 1000)

        return () => clearInterval(interval);
    }, [])

    async function onDisplayNotification() {
        // Request permissions (required for iOS)
        await notifee.requestPermission()

        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
        });

        // Display a notification
        await notifee.displayNotification({
            title: 'Notification Title',
            body: 'Main body content of the notification',
            android: {
                channelId,
                // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
                // pressAction is needed if you want the notification to open the app when pressed
                pressAction: {
                    id: 'default',
                },
            },
        });
    }

    return (
        <ScrollView>
            <View style={styles.container}>

                <Text style={styles.time}>{time}</Text>
                <View style={styles.titleBox}>
                    <Text style={styles.alarmsTitle}>Alarms:</Text>
                    <ButtonPrimary
                        style={{ backgroundColor: '#1976d2' }}
                        title="Create Alarm"
                        onPress={() => {
                            // Navigate to CreateAlarmScreen
                            navigation.navigate('Create Alarm');
                        }}
                    />
                </View>
                {alarms.length > 0 ? (
                    alarms.map((alarm, i) => (
                        <AlarmCard
                            key={i}
                            alarm={alarm}
                            onDelete={() => {
                                deleteAlarm(alarm.id);
                                loadAlarms();
                            }}
                            onToggleActive={() => {
                                updateAlarmActiveStatus(alarm.id, !alarm.isActive);
                                loadAlarms();
                            }}
                        />
                    ))
                ) : (
                    <Text>No alarms set</Text>
                )}

                <ButtonPrimary
                    title="Push Notification"
                    style={{ marginVertical: 20 }}
                    onPress={() => onDisplayNotification()}
                />

            </View>
        </ScrollView>
    )
}

export default DashBoardScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        margin: 20
    },
    time: {
        fontSize: 40,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    alarmsTitle: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    titleBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'flex-start'
    }
})