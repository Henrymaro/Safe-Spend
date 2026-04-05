import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

const Colors = {
    light: {
        background: '#FFFFFF',
        card: '#F5F5F5',
        text: '#000000',
        subText: '#666666',
        primary: '#2196F3',
        accent: '#FFD740', // Yellow
        danger: '#FF5252',
        success: '#4CAF50',
        border: '#E0E0E0',
    },
    dark: {
        background: '#121212',
        card: '#1E1E1E',
        text: '#FFFFFF',
        subText: '#AAAAAA',
        primary: '#2196F3',
        accent: '#FFD740',
        danger: '#FF5252',
        success: '#69F0AE',
        border: '#333333',
    }
};

type ThemeContextType = {
    theme: Theme;
    colors: typeof Colors.light;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark',
    colors: Colors.dark,
    toggleTheme: () => { },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const systemScheme = useColorScheme();
    const [theme, setTheme] = useState<Theme>('dark'); // Default to dark as per original design

    useEffect(() => {
        // Load saved theme or fall back to system/default
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('app_theme');
            if (savedTheme) {
                setTheme(savedTheme as Theme);
            }
        } catch (e) {
            console.log('Failed to load theme');
        }
    };

    const toggleTheme = async () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        await AsyncStorage.setItem('app_theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, colors: Colors[theme], toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
