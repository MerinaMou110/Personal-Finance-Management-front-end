document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');

    const loadSavingsGoals = async (startDate = null, endDate = null) => {
        try {
            const url = new URL('https://personal-finance-management-hauf.onrender.com/finance/savings_goals/');
            url.searchParams.append('user_id', userId);
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch savings goals: ${response.statusText}`);
            }

            let data = await response.json();

            // Filter data if startDate and/or endDate are provided
            if (startDate) {
                data = data.filter(goal => new Date(goal.deadline) >= new Date(startDate));
            }
            if (endDate) {
                data = data.filter(goal => new Date(goal.deadline) <= new Date(endDate));
            }

            const tbody = document.querySelector('table tbody');
            tbody.innerHTML = '';
            let totalAmount = 0;

            data.forEach((goal) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${goal.target_amount}</td>
                    <td>${goal.current_amount}</td>
                    <td>${goal.deadline}</td>
                    <td>${goal.description}</td>
                    <td class="actions">
                        <button class="btn btn-sm btn-warning edit-btn" data-id="${goal.id}" data-toggle="modal" data-target="#editSavingsGoalModal">Edit</button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${goal.id}">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);

                totalAmount += parseFloat(goal.current_amount);
            });

            // Display total savings
            document.getElementById('totalSavingsAmount').textContent = totalAmount.toFixed(2);
        } catch (error) {
            console.error('Error loading savings goals:', error);
        }
    };
    
    document.getElementById('filterButton').addEventListener('click', () => {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        loadSavingsGoals(startDate, endDate);
    });

    const addSavingsGoalForm = document.getElementById('addSavingsGoalForm');
    addSavingsGoalForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(addSavingsGoalForm);
        const payload = {
            user: userId,
            target_amount: formData.get('target_amount'),
            current_amount: formData.get('current_amount'),
            deadline: formData.get('deadline'),
            description: formData.get('description')
        };
        const response = await fetch('https://personal-finance-management-hauf.onrender.com/finance/savings_goals/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            $('#addSavingsGoalModal').modal('hide');
            loadSavingsGoals();
            addSavingsGoalForm.reset();
        } else {
            console.error('Failed to add savings goal');
        }
    });

    document.addEventListener('click', async (event) => {
        if (event.target.classList.contains('edit-btn')) {
            const goalId = event.target.dataset.id;
            try {
                const response = await fetch(`https://personal-finance-management-hauf.onrender.com/finance/savings_goals/${goalId}/`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch savings goal: ${response.statusText}`);
                }
                const goal = await response.json();
                console.log('Savings goal to edit:', goal);
                document.getElementById('goalId').value = goal.id;
                document.getElementById('editTargetAmount').value = goal.target_amount;
                document.getElementById('editCurrentAmount').value = goal.current_amount;
                document.getElementById('editDeadline').value = goal.deadline;
                document.getElementById('editDescription').value = goal.description;
            } catch (error) {
                console.error('Error fetching savings goal for edit:', error);
            }
        }

        if (event.target.classList.contains('delete-btn')) {
            const goalId = event.target.dataset.id;
            if (confirm('Are you sure you want to delete this goal?')) {
                try {
                    const response = await fetch(`https://personal-finance-management-hauf.onrender.com/finance/savings_goals/${goalId}/`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Token ${token}`
                        }
                    });
                    if (response.ok) {
                        console.log('Savings goal deleted successfully');
                        loadSavingsGoals();
                    } else {
                        console.error('Failed to delete savings goal');
                    }
                } catch (error) {
                    console.error('Error deleting savings goal:', error);
                }
            }
        }
    });

    const editSavingsGoalForm = document.getElementById('editSavingsGoalForm');
    editSavingsGoalForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const goalId = document.getElementById('goalId').value;
        const formData = new FormData(editSavingsGoalForm);
        const payload = {
            user: userId,
            target_amount: formData.get('target_amount'),
            current_amount: formData.get('current_amount'),
            deadline: formData.get('deadline'),
            description: formData.get('description')
        };
        try {
            const response = await fetch(`https://personal-finance-management-hauf.onrender.com/finance/savings_goals/${goalId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                console.log('Savings goal updated successfully');
                $('#editSavingsGoalModal').modal('hide');
                loadSavingsGoals();
                editSavingsGoalForm.reset();
            } else {
                const errorData = await response.json();
                console.error('Failed to update savings goal:', errorData);
            }
        } catch (error) {
            console.error('Error updating savings goal:', error);
        }
    });

    loadSavingsGoals();
});
