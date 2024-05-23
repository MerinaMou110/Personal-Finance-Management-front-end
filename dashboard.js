document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');

    const fetchTotals = async () => {
        try {
            const [incomesResponse, expensesResponse, savingsResponse] = await Promise.all([
                fetch(`https://personal-finance-management-hauf.onrender.com/finance/incomes/?user_id=${userId}`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                }),
                fetch(`https://personal-finance-management-hauf.onrender.com/finance/expenses/?user_id=${userId}`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                }),
                fetch(`https://personal-finance-management-hauf.onrender.com/finance/savings_goals/?user_id=${userId}`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                })
            ]);

            if (!incomesResponse.ok) throw new Error('Failed to fetch incomes');
            if (!expensesResponse.ok) throw new Error('Failed to fetch expenses');
            if (!savingsResponse.ok) throw new Error('Failed to fetch savings');

            const [incomesData, expensesData, savingsData] = await Promise.all([
                incomesResponse.json(),
                expensesResponse.json(),
                savingsResponse.json()
            ]);

            console.log('Incomes:', incomesData);
            console.log('Expenses:', expensesData);
            console.log('Savings Goals:', savingsData);

            let totalIncome = 0;
            incomesData.forEach(income => {
                totalIncome += parseFloat(income.amount);
            });

            let totalExpense = 0;
            expensesData.forEach(expense => {
                totalExpense += parseFloat(expense.amount);
            });

            let totalSavings = 0;
            savingsData.forEach(goal => {
                totalSavings += parseFloat(goal.current_amount);
            });

            const currentBalance = totalIncome - totalExpense;

            document.getElementById('totalIncomeAmount').textContent = totalIncome.toFixed(2);
            document.getElementById('totalExpenseAmount').textContent = totalExpense.toFixed(2);
            document.getElementById('totalSavingsAmount').textContent = totalSavings.toFixed(2);
            document.getElementById('currentBalanceAmount').textContent = currentBalance.toFixed(2);

        } catch (error) {
            console.error('Error fetching totals:', error);
        }
    };

    fetchTotals();
});