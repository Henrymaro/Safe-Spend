import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../components/ThemeContext';
import { calculateSafeSpend } from '../../utils/calculations';
import { archiveCurrentCampaign, getBudgetSettings, getExpenses } from '../../utils/storage';

export default function Dashboard() {
  const router = useRouter();
  const { colors } = useTheme();

  const [loading, setLoading] = useState(true);
  const [dailyLimit, setDailyLimit] = useState(0);
  const [status, setStatus] = useState<'green' | 'yellow' | 'red'>('green');
  const [daysLeft, setDaysLeft] = useState(0);
  const [spentToday, setSpentToday] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [userName, setUserName] = useState('');

  // Load data every time we come to this screen
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    setLoading(true);
    const budget = await getBudgetSettings();

    // if no budget, go to setup
    if (!budget) {
      router.replace('/setup');
      return;
    }

    const expenses = await getExpenses();
    const result = calculateSafeSpend(
      budget.totalBudget,
      budget.deductions,
      expenses,
      budget.endDate
    );

    // Calculate total spent for archiving purposes
    const total = expenses.reduce((sum: number, item: any) => sum + Number(item.amount), 0);

    setDailyLimit(result.limit);
    setStatus(result.status as any);
    setDaysLeft(result.daysLeft);
    setSpentToday(result.spentToday);
    setTotalSpent(total);
    setUserName(budget.userName || 'Friend');
    setLoading(false);
  };

  const handleReset = () => {
    Alert.alert(
      "New Budget Campaign",
      "This will archive your current campaign and start a fresh one.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Archive & Start New",
          style: 'default',
          onPress: async () => {
            await archiveCurrentCampaign(status, totalSpent);
            await AsyncStorage.removeItem('budget_data'); // Clear budget not everything (keep history)
            await AsyncStorage.removeItem('expenses_list');
            router.replace('/setup');
          }
        },
        {
          text: "Delete Everything (No Archive)",
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            router.replace('/setup');
          }
        }
      ]
    );
  };

  // Get color based on status
  const getStatusColor = () => {
    if (status === 'red') return colors.danger;
    if (status === 'yellow') return colors.accent;
    return colors.success;
  };

  if (loading) {
    return <View style={[styles.container, { backgroundColor: colors.background }]}><Text style={{ color: colors.text }}>Loading...</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>

      {/* Greeting */}
      <Text style={[styles.greeting, { color: colors.text }]}>Hello, {userName}!</Text>

      {/* Top Section: Status & Big Number */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: getStatusColor(), borderWidth: 2 }]}>
        <Text style={[styles.label, { color: colors.subText }]}>Daily Safe Limit</Text>
        <Text style={[styles.bigNumber, { color: getStatusColor() }]}>
          ₦{dailyLimit.toLocaleString()}
        </Text>
        <Text style={[styles.subText, { color: colors.subText }]}>
          You spent ₦{spentToday.toLocaleString()} today
        </Text>
        <Text style={[styles.subText, { color: colors.subText }]}>
          {daysLeft} days remaining
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {/* Massive Add Button */}
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/add')}
        >
          <Text style={styles.addButtonText}>+</Text>
          <Text style={styles.addButtonLabel}>Add Expense</Text>
        </TouchableOpacity>
      </View>

      {/* Reset Budget */}
      <TouchableOpacity onPress={handleReset} style={{ marginTop: 20 }}>
        <Text style={{ color: colors.subText, fontSize: 12 }}>Start New Budget Campaign</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    paddingTop: 40,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  card: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
    marginBottom: 40,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  bigNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    marginTop: 5,
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  addButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 60,
    lineHeight: 70,
  },
  addButtonLabel: {
    color: '#fff',
    fontSize: 12,
    position: 'absolute',
    bottom: 20,
  },
});
