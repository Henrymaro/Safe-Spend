import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../components/ThemeContext';
import { getExpenses, saveExpenses } from '../utils/storage';

const DEFAULT_CATEGORIES = ['Food', 'Transport', 'Airtime', 'Data', 'Groceries', 'Other'];

export default function AddExpense() {
    const router = useRouter();
    const { colors } = useTheme();
    const [amount, setAmount] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORIES[0]);
    const [customCategory, setCustomCategory] = useState('');

    const handleSave = async () => {
        if (!amount) {
            Alert.alert('Error', 'Please enter an amount.');
            return;
        }

        const category = selectedCategory === 'Other' && customCategory ? customCategory : selectedCategory;

        const newExpense = {
            id: Date.now().toString(),
            amount: parseFloat(amount),
            category: category,
            date: new Date().toISOString()
        };

        const currentExpenses = await getExpenses();
        const updatedExpenses = [...currentExpenses, newExpense];
        await saveExpenses(updatedExpenses);

        router.back();
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.label, { color: colors.subText }]}>Amount (₦)</Text>
            <TextInput
                style={[styles.inputBig, { color: colors.text, borderBottomColor: colors.border }]}
                keyboardType="numeric"
                autoFocus={true}
                placeholder="0"
                placeholderTextColor={colors.subText}
                value={amount}
                onChangeText={setAmount}
            />

            <Text style={[styles.label, { color: colors.subText }]}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
                {DEFAULT_CATEGORIES.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={[
                            styles.categoryChip,
                            { backgroundColor: colors.card, borderColor: colors.border },
                            selectedCategory === cat && { backgroundColor: colors.primary, borderColor: colors.primary }
                        ]}
                        onPress={() => setSelectedCategory(cat)}
                    >
                        <Text style={[
                            styles.categoryText,
                            { color: colors.subText },
                            selectedCategory === cat && { color: '#fff', fontWeight: 'bold' }
                        ]}>{cat}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {selectedCategory === 'Other' && (
                <TextInput
                    style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                    placeholder="Enter Category Name"
                    placeholderTextColor={colors.subText}
                    value={customCategory}
                    onChangeText={setCustomCategory}
                />
            )}

            <TouchableOpacity style={[styles.button, { backgroundColor: colors.success }]} onPress={handleSave}>
                <Text style={styles.buttonText}>Save Expense</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                <Text style={[styles.cancelText, { color: colors.subText }]}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        marginTop: 20,
        marginBottom: 10,
    },
    inputBig: {
        fontSize: 50,
        borderBottomWidth: 1,
        paddingVertical: 10,
        textAlign: 'center',
    },
    input: {
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
    },
    categoryContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        maxHeight: 60,
    },
    categoryChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
    },
    categoryText: {
        // handled inline
    },
    button: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 30,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cancelButton: {
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelText: {
        // handled inline
    }
});
