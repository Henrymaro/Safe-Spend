import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../components/ThemeContext';
import { CampaignHistoryItem, getCampaignHistory } from '../../utils/storage';

export default function HistoryScreen() {
    const { colors } = useTheme();
    const [history, setHistory] = useState<CampaignHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [])
    );

    const loadHistory = async () => {
        setLoading(true);
        const data = await getCampaignHistory();
        setHistory(data);
        setLoading(false);
    };

    const getStatusColor = (status: string) => {
        if (status === 'red') return colors.danger;
        if (status === 'yellow') return colors.accent;
        return colors.success;
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.text }}>Loading history...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.header, { color: colors.text }]}>Past Campaigns</Text>

            {history.length === 0 ? (
                <Text style={{ color: colors.subText, textAlign: 'center', marginTop: 20 }}>
                    No history found yet. Complete a campaign to see it here!
                </Text>
            ) : (
                history.map((item) => (
                    <View key={item.id} style={[styles.card, { backgroundColor: colors.card, borderLeftColor: getStatusColor(item.status), borderLeftWidth: 5 }]}>
                        <View style={styles.cardHeader}>
                            <Text style={[styles.campaignName, { color: colors.text }]}>{item.name}</Text>
                            <Text style={[styles.date, { color: colors.subText }]}>
                                {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                            </Text>
                        </View>

                        <View style={styles.statsRow}>
                            <View>
                                <Text style={[styles.label, { color: colors.subText }]}>Budget</Text>
                                <Text style={[styles.value, { color: colors.text }]}>₦{item.totalBudget.toLocaleString()}</Text>
                            </View>
                            <View>
                                <Text style={[styles.label, { color: colors.subText }]}>Spent</Text>
                                <Text style={[styles.value, { color: getStatusColor(item.status) }]}>₦{item.totalSpent.toLocaleString()}</Text>
                            </View>
                            <View>
                                <Text style={[styles.label, { color: colors.subText }]}>Result</Text>
                                <Text style={[styles.value, { color: getStatusColor(item.status), fontWeight: 'bold' }]}>
                                    {item.status === 'green' ? 'Success' : item.status === 'yellow' ? 'Warning' : 'Overspent'}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 2,
    },
    cardHeader: {
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333', // will need theme adjustment usually but keeping simple
        paddingBottom: 5,
    },
    campaignName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 12,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 12,
        marginBottom: 2,
    },
    value: {
        fontSize: 16,
    }
});
