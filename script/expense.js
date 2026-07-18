const listTag = document.querySelector('.list-group');
const ascendTag = document.querySelector('.ascend');
const decendTag = document.querySelector('.decend');
const deletAllExpense = document.querySelector('.btn-delete');
const canvas = document.querySelector('.expense-chart');

let getExpenses = [];
let expenseChart = null;

 const dateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Yangon',
    dateStyle: 'medium',
    timeStyle: 'short'
});

const formatExpenseDate = (expense) => {
    const value = expense.created_at || expense.date;
    return value ? dateFormatter.format(new Date(value)) : 'Unknown date';
};

const normalizeExpense = (expense) => ({
    id: expense.id,
    product_name: expense.product_name,
    description: expense.description,
    amount: expense.product_price,
    date: formatExpenseDate(expense),
    category: expense.Category?.category ?? 'Uncategorized',
    paymentMethod: expense.Category?.payment_method ?? 'Unknown'
});

const renderHTML = (expenseList) => {
    const normalized = expenseList.map(normalizeExpense);

    const items = normalized.map((expense) => `
    <li class="list-group-item d-flex justify-content-between align-items-start">
      <div class="ms-2 me-auto">
        <div class="fw-bold">${String(expense.product_name)}</div>
        ${Number(expense.amount).toLocaleString()} MMK
        <div>${String(expense.description) || 'No notes available'}</div>
        <div>${String(expense.date)}</div>
        <small class="text-muted">${expense.category} · ${expense.paymentMethod}</small>
      </div>
      <span class="badge rounded-pill ${Number(expense.amount) > 20000 ? 'bg-danger' : 'bg-primary'}">.</span>
      <button type="button" class="btn btn-outline-danger delete-item" onclick="deleteExpenseItem(this)" data-id="${expense.id}">Delete</button>
    </li>
  `).join('');

    if (expenseChart) {
        expenseChart.destroy();
        expenseChart = null;
    }

    if (normalized.length > 0) {
        expenseChart = new Chart('expense-chart', {
            type: 'bar',
            data: {
                labels: normalized.map((expense) => String(expense.product_name)),
                datasets: [{
                    label: 'Red indicates expenses over 20,000 MMK',
                    data: normalized.map((expense) => Number(expense.amount)),
                    backgroundColor: normalized.map((expense) =>
                        Number(expense.amount) > 20000 ? 'rgba(255, 99, 132, 0.2)' : 'rgba(0, 123, 255, 0.2)'
                    ),
                    borderColor: normalized.map((expense) =>
                        Number(expense.amount) > 20000 ? 'rgba(255, 99, 132, 1)' : 'rgba(0, 123, 255, 1)'
                    ),
                    borderWidth: 1
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Expense Bar Chart'
                }
            }
        });
    }

    listTag.innerHTML = items || `<li class="list-group-item">No expenses added yet.</li>`;
    canvas.style.display = normalized.length > 0 ? 'block' : 'none';
};

const sortAndRender = (compareFn) => {
    const expenseList = getExpenses.slice();
    expenseList.sort(compareFn);
    renderHTML(expenseList);
};

const loadExpenses = async () => {
    const { data, error } = await supabaseClient
        .from('Expense List')
        .select(`
            id,
            date,
            created_at,
            product_name,
            product_price,
            description,
            Category (
                category,
                payment_method
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching expenses:', error);
        getExpenses = [];
    } else {
        getExpenses = data ?? [];
    }

    renderHTML(getExpenses);
};

ascendTag.addEventListener('click', (event) => {
    event.preventDefault();
    sortAndRender((a, b) => a.product_price - b.product_price);
});

decendTag.addEventListener('click', (event) => {
    event.preventDefault();
    sortAndRender((a, b) => b.product_price - a.product_price);
});

deletAllExpense.addEventListener('click', async (event) => {
    event.preventDefault();
    deletAllExpense.disabled = true;

    await supabaseClient.from('Category').delete().gte('id', 0);
    await supabaseClient.from('Expense List').delete().gte('id', 0);

    getExpenses = [];
    renderHTML([]);
    deletAllExpense.disabled = false;
});

const deleteExpenseItem = async (button) => {
    const id = Number(button.getAttribute('data-id'));

    await supabaseClient.from('Category').delete().eq('id', id);
    const { error } = await supabaseClient.from('Expense List').delete().eq('id', id);

    if (error) {
        console.error('Error deleting expense:', error);
        return;
    }

    getExpenses = getExpenses.filter((expense) => expense.id !== id);
    renderHTML(getExpenses);
};

loadExpenses();
