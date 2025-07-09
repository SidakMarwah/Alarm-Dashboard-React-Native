import React, { use, useCallback, useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import { createTables, logAllTablesAndSchema, removeTable } from './src/db/db';
import { AuthProvider, AuthContext } from './src/contexts/AuthContext';
import notifee, { AndroidImportance } from '@notifee/react-native';

const RootNavigator = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
}

export default function App() {

  const loadData = useCallback(async () => {
    try {
      await createTables();
      // await removeTable('Alarms')
    } catch (error) {
      console.error(error)
    }
    // await logAllTablesAndSchema()
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function setupAlarmChannel() {
    await notifee.createChannel({
      id: 'alarm',
      name: 'Alarm Notifications',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });
  }

  useEffect(() => {
    setupAlarmChannel().catch(error => console.error('Failed to setup alarm notification channel:', error));
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
