document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');

    const loadExpenses = async (page = 1, filters = {}) => {
        try {
            let url = `https://personal-finance-management-hauf.onrender.com/finance/expenses/?user_id=${userId}&page=${page}`;
            Object.keys(filters).forEach(key => {
                url += `&${key}=${filters[key]}`;
            });

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch expenses: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(data);

            const tbody = document.querySelector('table tbody');
            tbody.innerHTML = '';
            let totalAmount = 0;
            if (Array.isArray(data)) {
                data.forEach((expense) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${expense.amount}</td>
                        <td>${expense.category}</td>
                        <td>${expense.date}</td>
                        <td>${expense.description}</td>
                        <td class="actions">
                            <button class="btn btn-sm btn-warning edit-btn" data-id="${expense.id}" data-bs-toggle="modal" data-bs-target="#editIncomeModal">Edit</button>
                            <button class="btn btn-sm btn-danger delete-btn" data-id="${expense.id}">Delete</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                    totalAmount += parseFloat(expense.amount);
                });
            } else {
                console.error('Unexpected data structure:', data);
            }

            document.getElementById('totalIncomeAmount').textContent = totalAmount.toFixed(2);
            const pagination = document.querySelector('ul.pagination');
            pagination.innerHTML = '';
            total_pages = data.total_pages;
            for (let i = 1; i <= total_pages; i++) {
                const pageItem = document.createElement('li');
                pageItem.classList.add('page-item');
                if (i === data.current_page) {
                    pageItem.classList.add('active');
                }
                pageItem.innerHTML = `<a class="page-link" href="expense.html" data-page="${i}">${i}</a>`;
                pagination.appendChild(pageItem);
            }
        } catch (error) {
            console.error('Error loading expenses:', error);
        }
    };

    document.getElementById('filterExpensesForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const filters = {};
        formData.forEach((value, key) => {
            if (value) {
                filters[key] = value;
            }
        });
        loadExpenses(1, filters);
    });

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('page-link')) {
            event.preventDefault();
            const page = event.target.dataset.page;
            const filters = {};
            new FormData(document.getElementById('filterExpensesForm')).forEach((value, key) => {
                if (value) {
                    filters[key] = value;
                }
            });
            loadExpenses(page, filters);
        }
    });

    loadExpenses();
});
