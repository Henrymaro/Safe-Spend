import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTheme } from '../../components/ThemeContext';
import { ThemeToggle } from '../../components/ThemeToggle';

export default function DrawerLayout() {
    const { colors, theme } = useTheme();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.card,
                    },
                    headerTintColor: colors.text,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerRight: () => <ThemeToggle />,
                    drawerStyle: {
                        backgroundColor: colors.background,
                    },
                    drawerActiveTintColor: colors.primary,
                    drawerInactiveTintColor: colors.text,
                }}
            >
                <Drawer.Screen
                    name="index"
                    options={{
                        drawerLabel: "Dashboard",
                        title: "Safe Spend"
                    }}
                />
                <Drawer.Screen
                    name="emergency"
                    options={{
                        drawerLabel: "Emergency Funds",
                        title: "Emergency Funds"
                    }}
                />
                <Drawer.Screen
                    name="debts"
                    options={{
                        drawerLabel: "Debt Manager",
                        title: "Debt Manager"
                    }}
                />
                <Drawer.Screen
                    name="history"
                    options={{
                        drawerLabel: "Campaign History",
                        title: "Campaign History"
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}
