import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashBoardScreen from '../screens/DashBoardScreen';
import CreateAlarmScreen from '../screens/CreateAlarmScreen';


const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="Dashboard"
            screenOptions={{
                headerShown: true,
                tabBarActiveTintColor: '#007AFF',
                tabBarLabelStyle: { fontSize: 14 },
            }}
        >
            <Tab.Screen name="Dashboard" component={DashBoardScreen} />
            <Tab.Screen name="Create Alarm" component={CreateAlarmScreen} />
        </Tab.Navigator>
    );
};

export default AppNavigator;
