import { createContext, useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
    isAuthenticated: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    login: async () => { },
    logout: async () => { }
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async () => {
        await AsyncStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('isAuthenticated');
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