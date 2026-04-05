import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { ThemeProvider, useTheme } from "../components/ThemeContext";

function RootStack() {
  const { colors, theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false, // Drawer handles headers for its screens
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="setup" options={{ title: "Setup Budget", headerShown: false }} />
        <Stack.Screen name="add" options={{ title: "Add Expense", presentation: 'modal', headerShown: true, headerStyle: { backgroundColor: colors.card }, headerTintColor: colors.text }} />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootStack />
    </ThemeProvider>
  );
}
