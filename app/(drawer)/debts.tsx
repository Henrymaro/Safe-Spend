import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../components/ThemeContext';
import { getExpenses, saveExpenses } from '../../utils/storage';

export default function Debts() {
    const router = useRouter();
    const { colors } = useTheme();
    const [debts, setDebts] = useState<any[]>([]);

    useFocusEffect(
        useCallback(() => {
            loadDebts();
        }, [])
    );

    const loadDebts = async () => {
        const expenses = await getExpenses();
        const debtList = expenses.filter((e: any) => e.isDebt);
        setDebts(debtList);
    };

    const handlePayOff = async (id: string, amount: number) => {
        Alert.alert(
            "Pay Off Debt",
            `Mark ₦${amount} as paid? This will remove it from your debt list.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes, Paid",
                    onPress: async () => {
                        const expenses = await getExpenses();
                        // Remove the debt item completely or mark it as paid. 
                        // For simplicity, we delete it from the expenses list so it doesn't show up anymore.
                        // Or we could keep it but set isDebt to false? 
                        // Better to just delete it so it's "cleared".
                        const updatedExpenses = expenses.filter((e: any) => e.id !== id);
                        await saveExpenses(updatedExpenses);
                        loadDebts();
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={{ flex: 1 }}>
                <Text style={[styles.amount, { color: colors.danger }]}>₦{item.amount.toLocaleString()}</Text>
                <Text style={[styles.reason, { color: colors.text }]}>{item.reason || 'No reason'}</Text>
                <Text style={[styles.date, { color: colors.subText }]}>{new Date(item.date).toDateString()}</Text>
            </View>
            <TouchableOpacity
                style={[styles.payButton, { backgroundColor: colors.success }]}
                onPress={() => handlePayOff(item.id, item.amount)}
            >
                <Text style={styles.payButtonText}>Pay Off</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.header, { color: colors.text }]}>Your Debts</Text>

            {debts.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: colors.subText }]}>No debts! You are free. 🎉</Text>
                </View>
            ) : (
                <FlatList
                    data={debts}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}

            <TouchableOpacity onPress={() => router.back()} style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: colors.primary }}>Close</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 10,
    },
    card: {
        flexDirection: 'row',
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        borderWidth: 1,
        alignItems: 'center',
    },
    amount: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    reason: {
        fontSize: 16,
        marginBottom: 5,
    },
    date: {
        fontSize: 12,
    },
    payButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    payButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
    }
});
