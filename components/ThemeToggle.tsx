import { Text, TouchableOpacity } from 'react-native';
import { useTheme } from './ThemeContext';

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 15 }}>
            <Text style={{ fontSize: 24 }}>
                {theme === 'dark' ? '☀️' : '🌙'}
            </Text>
        </TouchableOpacity>
    );
};
