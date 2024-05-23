document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');

    const loadIncome = async (startDate = null, endDate = null) => {
        try {
            const url = new URL('https://personal-finance-management-hauf.onrender.com/finance/incomes/');
            url.searchParams.append('user_id', userId);

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch income: ${response.statusText}`);
            }

            let data = await response.json();
            console.log(data);

            if (startDate) {
                data = data.filter(income => new Date(income.date) >= new Date(startDate));
            }
            if (endDate) {
                data = data.filter(income => new Date(income.date) <= new Date(endDate));
            }

            const tbody = document.querySelector('table tbody');
            tbody.innerHTML = '';
            let totalAmount = 0;

            data.forEach((income) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${income.amount}</td>
                    <td>${income.category}</td>
                    <td>${income.date}</td>
                    <td>${income.description}</td>
                    <td class="actions">
                        <button class="btn btn-sm btn-warning edit-btn" data-id="${income.id}" data-toggle="modal" data-target="#editIncomeModal">Edit</button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${income.id}">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);

                totalAmount += parseFloat(income.amount);
            });

            // Display total income
            document.getElementById('totalIncomeAmount').textContent = totalAmount.toFixed(2);
        } catch (error) {
            console.error('Error loading income:', error);
        }
    };

    document.getElementById('filterButton').addEventListener('click', () => {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        loadIncome(startDate, endDate);
    });

    const addIncomeForm = document.getElementById('addIncomeForm');
    addIncomeForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(addIncomeForm);
        const payload = {
            user: userId,
            amount: formData.get('amount'),
            category: formData.get('category'),
            date: formData.get('date'),
            description: formData.get('description')
        };
        const response = await fetch('https://personal-finance-management-hauf.onrender.com/finance/incomes/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            // Hide the modal using Bootstrap's modal method
            $('#addIncomeModal').modal('hide');
            loadIncome();
            addIncomeForm.reset();
        } else {
            console.error('Failed to add income');
        }
    });

    document.addEventListener('click', async (event) => {
        if (event.target.classList.contains('edit-btn')) {
            const incomeId = event.target.dataset.id;
            try {
                const response = await fetch(`https://personal-finance-management-hauf.onrender.com/finance/incomes/${incomeId}/`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch income: ${response.statusText}`);
                }
                const income = await response.json();
                console.log('Income to edit:', income);
                document.getElementById('incomeId').value = income.id;
                document.getElementById('editIncomeAmount').value = income.amount;
                document.getElementById('editIncomeCategory').value = income.category;
                document.getElementById('editIncomeDate').value = income.date;
                document.getElementById('editIncomeDescription').value = income.description;
            } catch (error) {
                console.error('Error fetching income for edit:', error);
            }
        }

        if (event.target.classList.contains('delete-btn')) {
            const incomeId = event.target.dataset.id;
            if (confirm('Are you sure you want to delete this income?')) {
                try {
                    const response = await fetch(`https://personal-finance-management-hauf.onrender.com/finance/incomes/${incomeId}/`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Token ${token}`
                        }
                    });
                    if (response.ok) {
                        console.log('Income deleted successfully');
                        loadIncome();
                    } else {
                        console.error('Failed to delete income');
                    }
                } catch (error) {
                    console.error('Error deleting income:', error);
                }
            }
        }
    });

    const editIncomeForm = document.getElementById('editIncomeForm');
    editIncomeForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const incomeId = document.getElementById('incomeId').value;
        const formData = new FormData(editIncomeForm);
        const payload = {
            user: userId,
            amount: formData.get('amount'),
            category: formData.get('category'),
            date: formData.get('date'),
            description: formData.get('description')
        };
        try {
            const response = await fetch(`https://personal-finance-management-hauf.onrender.com/finance/incomes/${incomeId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                console.log('Income updated successfully');
                // Hide the modal using Bootstrap's modal method
                $('#editIncomeModal').modal('hide');
                loadIncome();
                editIncomeForm.reset();
            } else {
                const errorData = await response.json();
                console.error('Failed to update income:', errorData);
            }
        } catch (error) {
            console.error('Error updating income:', error);
        }
    });

    loadIncome();
});
