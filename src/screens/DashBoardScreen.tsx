import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { use, useContext, useEffect, useState } from 'react'
import { Alarm, deleteAlarm, fetchAlarms, updateAlarmActiveStatus } from '../db/alarms';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AlarmCard from '../components/AlarmCard';

const DashBoardScreen = ({ navigation }) => {

    const [time, setTime] = useState(getCurrentTime());
    const [alarms, setAlarms] = useState<Alarm[]>([]);
    const [email, setEmail] = useState<string>('');

    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString(); // or format as needed
    }

    // Load email on mount
    useEffect(() => {
        const loadEmail = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem('userEmail');
                if (storedEmail) {
                    // console.log("Loaded user email:", storedEmail);
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

    // Fetch alarms when email is set
    const loadAlarms = async () => {
        try {
            if (email) {
                const result = await fetchAlarms(email);
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
    }, [email, navigation]);

    useEffect(() => {
        // console.log("Alarms loaded:", alarms);

    }, [alarms])

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(getCurrentTime());
        }, 1000)

        return () => clearInterval(interval);
    }, [])

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.time}>{time}</Text>
                <View style={styles.titleBox}>
                    <Text style={styles.alarmsTitle}>Alarms:</Text>
                    <Button
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