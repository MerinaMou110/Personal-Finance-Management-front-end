document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');

    const loadExpenses = async (startDate = null, endDate = null) => {
        try {
            const url = new URL('https://personal-finance-management-hauf.onrender.com/finance/expenses/');
            url.searchParams.append('user_id', userId);

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch expense: ${response.statusText}`);
            }

            let data = await response.json();
            console.log(data);

            if (startDate) {
                data = data.filter(expense => new Date(expense.date) >= new Date(startDate));
            }
            if (endDate) {
                data = data.filter(expense => new Date(expense.date) <= new Date(endDate));
            }


            const tbody = document.querySelector('table tbody');
            tbody.innerHTML = '';
            let totalAmount = 0;

            data.forEach((expense) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${expense.amount}</td>
                    <td>${expense.category}</td>
                    <td>${expense.date}</td>
                    <td>${expense.description}</td>
                    <td class="actions">
                        <button class="btn btn-sm btn-warning edit-btn" data-id="${expense.id}" data-toggle="modal" data-target="#editExpenseModal">Edit</button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${expense.id}">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);

                totalAmount += parseFloat(expense.amount);
            });

            // Display total expenses
            document.getElementById('totalExpenseAmount').textContent = totalAmount.toFixed(2);
        } catch (error) {
            console.error('Error loading expenses:', error);
        }
    };


    document.getElementById('filterButton').addEventListener('click', () => {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        loadExpenses(startDate, endDate);
    });

    const addExpenseForm = document.getElementById('addExpenseForm');
    addExpenseForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(addExpenseForm);
        const payload = {
            user: userId,
            amount: formData.get('amount'),
            category: formData.get('category'),
            date: formData.get('date'),
            description: formData.get('description')
        };
        const response = await fetch('https://personal-finance-management-hauf.onrender.com/finance/expenses/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            // Hide the modal using Bootstrap's modal method
            $('#addExpenseModal').modal('hide');
            loadExpenses();
            addExpenseForm.reset();
        } else {
            console.error('Failed to add expense');
        }
    });

    document.addEventListener('click', async (event) => {
        if (event.target.classList.contains('edit-btn')) {
            const expenseId = event.target.dataset.id;
            try {
                const response = await fetch(`https://personal-finance-management-hauf.onrender.com/finance/expenses/${expenseId}/`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch expense: ${response.statusText}`);
                }
                const expense = await response.json();
                console.log('Expense to edit:', expense);
                document.getElementById('expenseId').value = expense.id;
                document.getElementById('editAmount').value = expense.amount;
                document.getElementById('editCategory').value = expense.category;
                document.getElementById('editDate').value = expense.date;
                document.getElementById('editDescription').value = expense.description;
            } catch (error) {
                console.error('Error fetching expense for edit:', error);
            }
        }

        if (event.target.classList.contains('delete-btn')) {
            const expenseId = event.target.dataset.id;
            if (confirm('Are you sure you want to delete this expense?')) {
                try {
                    const response = await fetch(`https://personal-finance-management-hauf.onrender.com/finance/expenses/${expenseId}/`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Token ${token}`
                        }
                    });
                    if (response.ok) {
                        console.log('Expense deleted successfully');
                        loadExpenses();
                    } else {
                        console.error('Failed to delete expense');
                    }
                } catch (error) {
                    console.error('Error deleting expense:', error);
                }
            }
        }
    });

    const editExpenseForm = document.getElementById('editExpenseForm');
    editExpenseForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const expenseId = document.getElementById('expenseId').value;
        const formData = new FormData(editExpenseForm);
        const payload = {
            user: userId,
            amount: formData.get('amount'),
            category: formData.get('category'),
            date: formData.get('date'),
            description: formData.get('description')
        };
        try {
            const response = await fetch(`https://personal-finance-management-hauf.onrender.com/finance/expenses/${expenseId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                console.log('Expense updated successfully');
                // Hide the modal using Bootstrap's modal method
                $('#editExpenseModal').modal('hide');
                loadExpenses();
                editExpenseForm.reset();
            } else {
                const errorData = await response.json();
                console.error('Failed to update expense:', errorData);
            }
        } catch (error) {
            console.error('Error updating expense:', error);
        }
    });

    loadExpenses();
});
