
// helper to get days remaining
export const getDaysRemaining = (endDateString: string) => {
    const today = new Date();
    const end = new Date(endDateString);

    // set times to midnight to just count days
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // if it's today or past, return 1 to avoid divide by zero (assume meant for today)
    return diffDays > 0 ? diffDays : 1;
};

// The Survivor Algorithm
export const calculateSafeSpend = (
    totalBudget: number,
    deductions: number,
    expenses: any[],
    endDate: string
) => {
    // 1. Calculate how much money is actually left
    // Filter out 'debt' items if they shouldn't affect the limit
    const totalSpent = expenses
        .filter((item: any) => !item.isDebt)
        .reduce((sum, item) => sum + Number(item.amount), 0);
    const safePool = totalBudget - deductions;
    const currentBalance = safePool - totalSpent;

    // 2. How many days left?
    const daysLeft = getDaysRemaining(endDate);

    // 4. Status Check - Calculate today's spend first so we can return it if needed
    const todayStr = new Date().toISOString().split('T')[0];
    const spentToday = expenses
        .filter((e: any) => e.date.startsWith(todayStr))
        .reduce((sum: any, item: any) => sum + Number(item.amount), 0);

    // 3. The Daily Safe Limit
    // If we have negative balance, limit is 0
    if (currentBalance <= 0) return {
        limit: 0,
        status: 'red',
        balance: currentBalance,
        daysLeft,
        spentToday
    };

    const dailyLimit = currentBalance / daysLeft;

    let status = 'green';
    if (spentToday > dailyLimit) {
        status = 'red';
    } else if (spentToday > (dailyLimit * 0.8)) {
        // 80% used
        status = 'yellow';
    }

    return {
        limit: Math.floor(dailyLimit), // round down to be safe
        status: status,
        balance: currentBalance,
        spentToday: spentToday,
        daysLeft: daysLeft
    };
};
