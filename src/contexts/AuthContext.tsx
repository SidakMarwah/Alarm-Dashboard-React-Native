import { createContext, useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
    isAuthenticated: boolean;
    login: (userId: string, email: string) => Promise<void>;
    logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    login: async () => { },
    logout: async () => { }
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async (userId: number, email: string) => {
        await AsyncStorage.setItem('isAuthenticated', 'true');
        await AsyncStorage.setItem('userId', userId.toString());
        await AsyncStorage.setItem('userEmail', email);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        await AsyncStorage.clear();
        setIsAuthenticated(false);
    };

    const checkAuth = useCallback(async () => {
        const stored = await AsyncStorage.getItem('isAuthenticated');
        setIsAuthenticated(stored === 'true');
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}