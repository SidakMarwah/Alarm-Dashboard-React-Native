import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashBoardScreen from '../screens/DashBoardScreen';
import CreateAlarmScreen from '../screens/CreateAlarmScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../contexts/AuthContext';
import ButtonPrimary from '../components/ButtonPrimary';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {

    const { logout } = useContext(AuthContext);

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
                headerRight: () => {
                    if (route.name === 'Dashboard') {
                        return <ButtonPrimary title="Logout" onPress={logout} style={{ marginRight: 15 }} />;
                    }
                    return null;
                }

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
