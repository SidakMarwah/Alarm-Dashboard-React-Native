import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import { connectToDatabase, createTables } from './src/db/db';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Replace with real auth logic

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
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
