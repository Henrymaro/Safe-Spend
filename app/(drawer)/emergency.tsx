import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '../../components/ThemeContext';
import { getExpenses, saveExpenses } from '../../utils/storage';

export default function Emergency() {
    const router = useRouter();
    const { colors } = useTheme();
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');

    const handleSave = async (isDebt: boolean) => {
        if (!amount) {
            Alert.alert('Error', 'Please enter an amount.');
            return;
        }

        const newExpense = {
            id: Date.now().toString(),
            amount: parseFloat(amount),
            category: isDebt ? 'Debt' : 'Emergency',
            reason: reason || 'Sapa',
            date: new Date().toISOString(),
            isDebt: isDebt
        };

        const currentExpenses = await getExpenses();
        const updatedExpenses = [...currentExpenses, newExpense];
        await saveExpenses(updatedExpenses);

        Alert.alert(
            isDebt ? "Recorded as Debt" : "Budget Recalculated",
            isDebt ? "This won't affect your daily limit for now." : "Your daily limit has been adjusted down."
        );
        router.back();
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.header, { color: colors.danger }]}>⚠️ Emergency Funds</Text>
            <Text style={[styles.subText, { color: colors.subText }]}>Unexpected big spend? We got you.</Text>

            <Text style={[styles.label, { color: colors.subText }]}>Amount (₦)</Text>
            <TextInput
                style={[styles.inputBig, { color: colors.danger, borderBottomColor: colors.danger }]}
                keyboardType="numeric"
                autoFocus={true}
                placeholder="0"
                placeholderTextColor={colors.subText}
                value={amount}
                onChangeText={setAmount}
            />

            <Text style={[styles.label, { color: colors.subText }]}>What happened?</Text>
            <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                placeholder="e.g. Medical bill, Urgent handout"
                placeholderTextColor={colors.subText}
                value={reason}
                onChangeText={setReason}
            />

            <Text style={[styles.question, { color: colors.text }]}>How should we handle this?</Text>

            <TouchableOpacity
                style={[styles.button, styles.recalcButton, { backgroundColor: colors.card, borderColor: colors.accent }]}
                onPress={() => handleSave(false)}
            >
                <Text style={[styles.buttonTitle, { color: colors.text }]}>Recalculate</Text>
                <Text style={[styles.buttonDesc, { color: colors.subText }]}>Subtract from my budget. I'll spend less daily.</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.debtButton, { backgroundColor: colors.card, borderColor: colors.primary }]}
                onPress={() => handleSave(true)}
            >
                <Text style={[styles.buttonTitle, { color: colors.text }]}>Treat as Debt</Text>
                <Text style={[styles.buttonDesc, { color: colors.subText }]}>I'll pay this back later. Don't touch my limit.</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                <Text style={{ color: colors.subText }}>Cancel</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
    },
    subText: {
        textAlign: 'center',
        marginBottom: 30,
    },
    label: {
        marginBottom: 10,
    },
    inputBig: {
        fontSize: 40,
        borderBottomWidth: 1,
        paddingVertical: 10,
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 30,
    },
    question: {
        fontSize: 18,
        marginBottom: 15,
        textAlign: 'center',
    },
    button: {
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        borderWidth: 1,
    },
    recalcButton: {
        // styles handled inline style for theme
    },
    debtButton: {
        // styles handled inline style for theme
    },
    buttonTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    buttonDesc: {
        fontSize: 12,
    },
    closeButton: {
        alignItems: 'center',
        padding: 15,
        marginTop: 10,
    }
});
