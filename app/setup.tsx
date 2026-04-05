import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { saveBudgetSettings, saveExpenses } from '../utils/storage';

export default function Setup() {
    const router = useRouter();
    const { colors } = useTheme();
    const [balance, setBalance] = useState('');
    const [deductions, setDeductions] = useState('');
    const [days, setDays] = useState('30'); // Default 30 days
    const [campaignName, setCampaignName] = useState('');
    const [userName, setUserName] = useState('');

    const handleSave = async () => {
        if (!balance || !days || !campaignName || !userName) {
            Alert.alert('Error', 'Please fill in all fields (Name, Campaign, Balance, Days).');
            return;
        }

        // Calculate End Date from Days
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + parseInt(days));

        // Save Settings
        const settings = {
            userName: userName,
            campaignName: campaignName,
            totalBudget: parseFloat(balance),
            deductions: parseFloat(deductions) || 0,
            endDate: endDate.toISOString()
        };

        await saveBudgetSettings(settings);

        // Clear old expenses on new setup
        await saveExpenses([]);

        // Go to Dashboard
        router.replace('/');
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.header, { color: colors.text }]}>Setup Your Budget</Text>

            <Text style={[styles.label, { color: colors.subText }]}>Your Name</Text>
            <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                placeholder="e.g. Daniel"
                placeholderTextColor={colors.subText}
                value={userName}
                onChangeText={setUserName}
            />

            <Text style={[styles.label, { color: colors.subText }]}>Campaign Name</Text>
            <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                placeholder="e.g. December Survival"
                placeholderTextColor={colors.subText}
                value={campaignName}
                onChangeText={setCampaignName}
            />

            <Text style={[styles.label, { color: colors.subText }]}>Total Current Balance (₦)</Text>
            <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                keyboardType="numeric"
                placeholder="e.g. 20000"
                placeholderTextColor={colors.subText}
                value={balance}
                onChangeText={setBalance}
            />

            <Text style={[styles.label, { color: colors.subText }]}>Fixed Deductions (Savings, Tithe)</Text>
            <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                keyboardType="numeric"
                placeholder="e.g. 5000"
                placeholderTextColor={colors.subText}
                value={deductions}
                onChangeText={setDeductions}
            />

            <Text style={[styles.label, { color: colors.subText }]}>Days until next income</Text>
            <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                keyboardType="numeric"
                placeholder="e.g. 30"
                placeholderTextColor={colors.subText}
                value={days}
                onChangeText={setDays}
            />

            <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSave}>
                <Text style={styles.buttonText}>Start Budgeting</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    label: {
        marginBottom: 5,
    },
    input: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        fontSize: 18,
    },
    button: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
