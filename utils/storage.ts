import AsyncStorage from '@react-native-async-storage/async-storage';

// simple keys to save things
const KEYS = {
    BUDGET: 'budget_data',
    EXPENSES: 'expenses_list',
    HISTORY: 'campaign_history',
};

export interface BudgetSettings {
    totalBudget: number;
    deductions: number;
    endDate: string;
    campaignName?: string;
    userName?: string;
}

export interface CampaignHistoryItem {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    totalBudget: number;
    totalSpent: number;
    status: 'green' | 'yellow' | 'red';
}

// save the budget settings
export const saveBudgetSettings = async (settings: BudgetSettings) => {
    try {
        const jsonValue = JSON.stringify(settings);
        await AsyncStorage.setItem(KEYS.BUDGET, jsonValue);
    } catch (e) {
        // saving error
        console.log("Error saving budget", e);
    }
};

// get the budget settings
export const getBudgetSettings = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(KEYS.BUDGET);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        // error reading value
        console.log("Error reading budget", e);
        return null;
    }
};

// save new expense list
export const saveExpenses = async (expenses: any[]) => {
    try {
        const jsonValue = JSON.stringify(expenses);
        await AsyncStorage.setItem(KEYS.EXPENSES, jsonValue);
    } catch (e) {
        console.log("Error saving expenses", e);
    }
};

// get all expenses
export const getExpenses = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(KEYS.EXPENSES);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.log("Error reading expenses", e);
        return [];
    }
};

// --- HISTORY FUNCTIONS ---

export const saveCampaignHistory = async (history: CampaignHistoryItem[]) => {
    try {
        const jsonValue = JSON.stringify(history);
        await AsyncStorage.setItem(KEYS.HISTORY, jsonValue);
    } catch (e) {
        console.log("Error saving history", e);
    }
};

export const getCampaignHistory = async (): Promise<CampaignHistoryItem[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(KEYS.HISTORY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.log("Error reading history", e);
        return [];
    }
};

// Archive the current campaign
export const archiveCurrentCampaign = async (status: 'green' | 'yellow' | 'red', spent: number) => {
    const settings = await getBudgetSettings();
    if (!settings) return; // Nothing to archive

    const history = await getCampaignHistory();

    const newItem: CampaignHistoryItem = {
        id: Date.now().toString(),
        name: settings.campaignName || 'Unnamed Campaign',
        startDate: new Date().toISOString(), // In a real app we'd track actual start date
        endDate: settings.endDate,
        totalBudget: settings.totalBudget,
        totalSpent: spent,
        status: status
    };

    await saveCampaignHistory([newItem, ...history]);
};
