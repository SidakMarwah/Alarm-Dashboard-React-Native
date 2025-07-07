import React, { useCallback, useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import { connectToDatabase, createTables } from './src/db/db';
import { AuthProvider, AuthContext } from './src/contexts/AuthContext';

const RootNavigator = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
}

export default function App() {

  const loadData = useCallback(async () => {
    try {
      const db = await connectToDatabase()
      await createTables(db)
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
