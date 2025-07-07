import { Button, StyleSheet, Text, View } from 'react-native'
import React, { use, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';

const DashBoardScreen = () => {
    const { logout } = useContext(AuthContext);

    const [time, setTime] = useState(getCurrentTime());

    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString(); // or format as needed
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(getCurrentTime());
        }, 1000)

        return () => clearInterval(interval);
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.time}>{time}</Text>
            <Button title="Logout" onPress={logout} />
        </View>
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
})