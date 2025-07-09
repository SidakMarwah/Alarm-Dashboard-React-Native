// components/AlarmCard.tsx

import React from 'react';
import { StyleSheet, Text, View, Switch, Button } from 'react-native';
import { Alarm } from '../db/alarms'; // Assuming you export the Alarm type
import { cancelAlarmNotification, scheduleAlarmNotification } from '../utils/notifications';

interface AlarmCardProps {
    alarm: Alarm;
    onDelete: (id: number) => void;
    onToggleActive: (id: number, isActive: boolean) => void;
}

const handleDelete = async (id: number, onDelete: (id: number) => void) => {
    // This function can be used to handle the delete action
    await cancelAlarmNotification(id);
    await onDelete(id);
}

const handleToggleActive = async (alarm: Alarm, onToggleActive: (id: number, isActive: boolean) => void) => {
    await onToggleActive(alarm.id!, !alarm.isActive);
    if (alarm.isActive) {
        await scheduleAlarmNotification(alarm, alarm.id!);
    } else {
        await cancelAlarmNotification(alarm.id!);
    }
};

const AlarmCard: React.FC<AlarmCardProps> = ({ alarm, onDelete, onToggleActive }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{alarm.title}</Text>
            <Text style={styles.time}>{alarm.time}</Text>
            <Text style={styles.repeat}>Repeat: {alarm.repeat ? 'Daily' : 'Once'}</Text>

            <View style={styles.row}>
                <Text style={styles.activeLabel}>Active</Text>
                <Switch
                    value={alarm.isActive}
                    onValueChange={() => handleToggleActive(alarm, onToggleActive)}
                />
            </View>

            <Button title="Delete" color="#d33" onPress={() => handleDelete(alarm.id!, onDelete)} />
        </View>
    );
};

export default AlarmCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#eee',
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        width: '100%',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    time: {
        fontSize: 16,
        marginVertical: 4,
    },
    repeat: {
        fontSize: 14,
        color: '#555',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        justifyContent: 'space-between',
    },
    activeLabel: {
        fontSize: 16,
    },
});
