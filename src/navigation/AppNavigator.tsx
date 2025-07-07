import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashBoardScreen from '../screens/DashBoardScreen';
import CreateAlarmScreen from '../screens/CreateAlarmScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="Dashboard"
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: '#888',
                tabBarStyle: {
                    backgroundColor: '#111',
                    height: 70,
                    paddingTop: 5,
                },
                tabBarLabelStyle: {
                    fontSize: 14,
                    marginBottom: 5,
                },
                headerShown: true,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Dashboard') {
                        iconName = focused ? 'home' : 'home-outline'; // Example: different icon for focused state
                    } else if (route.name === 'Create Alarm') {
                        iconName = focused ? 'alarm' : 'alarm-outline';
                    }

                    // Return the icon component
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashBoardScreen}
            />
            <Tab.Screen
                name="Create Alarm"
                component={CreateAlarmScreen}
            />
        </Tab.Navigator>
    );
};

export default AppNavigator;
