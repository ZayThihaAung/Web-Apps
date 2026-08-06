const sumitBtn = document.querySelector('.sumit-btn');
const amountTag = document.querySelector('.amount');
const typeTag = document.querySelector('.describe');
const productTag = document.querySelector('.product');
const budgetContainer = document.querySelector('.form-budget-container');
const budgetBtn = document.querySelector('.budget-btn');
const budgetInputTag = document.querySelector('.ib-input');
const alertContainer = document.querySelector('.alert-container');
const navTag = document.querySelector('.budget-nav');
const navTagMobile = document.querySelector('.budget-nav-mobile');
const resetBtn = document.querySelector('.reset-bd');
const burgerToggler = document.querySelector('.burger-toggler');
const burgerMenu = document.querySelector('.burger-menu-container');
const menuItems = document.querySelector('.menu-item');
const paymentToggle = document.querySelector('.payment .dropdown-toggle');
const categoryToggle = document.querySelector('.category .dropdown-toggle');

let selectedPayment = 'Cash';
let selectedCategory = 'Food';
let storedBudget = 0;

const confirmTag = `
    <div class="alert alert-success" role="alert">
        Your bought item has been added! Check out <a href="expense.html" class="alert-link">here.</a>
    </div>
`;

const alertTag1 = `
    <div class="alert alert-danger" role="alert">
        Please add the amount you have spent.
    </div>
`;

const alertTag2 = `
    <div class="alert alert-danger" role="alert">
        Please add the product name you have bought.
    </div>
`;

const alertTag3 = `
    <div class="alert alert-danger" role="alert">
        Please add both amounts and product name.
    </div>
`;

const alertTag4 = `
    <div class="alert alert-danger" role="alert">
        Your budget is underfunded. Please add your budget.
    </div>
`;

const alertTag5 = `
    <div class="alert alert-danger" role="alert">
        Could not save to the database. Please try again.
    </div>
`;

const clearExpense = () => {
    alertContainer.innerHTML = '';
    amountTag.value = '';
    productTag.value = '';
    typeTag.value = '';
};

const showAlert = (html) => {
    clearExpense();
    alertContainer.innerHTML = html;
};

const updateBudgetDisplay = () => {
    const budgetTag = `<a class="nav-link init-budget" href="#" title="Initial Budget">${storedBudget.toLocaleString()} MMK</a>`;
    navTag.innerHTML = budgetTag;
    navTagMobile.innerHTML = budgetTag;
};

const fetchBudget = async () => {
    const { data, error } = await supabaseClient
        .from('Budget')
        .select('amount')
        .eq('id', 1)
        .maybeSingle();

    if (error) {
        console.error('Error fetching budget:', error);
        storedBudget = 0;
    } else {
        storedBudget = data?.amount ?? 0;
    }

    updateBudgetDisplay();
};

const saveBudget = async (amount) => {
    const { error } = await supabaseClient
        .from('Budget')
        .upsert({ id: 1, amount }, { onConflict: 'id' });

    if (error) {
        console.error('Error saving budget:', error);
        return false;
    }

    storedBudget = amount;
    updateBudgetDisplay();
    return true;
};

const setupDropdown = (containerSelector, toggleElement, onSelect) => {
    document.querySelectorAll(`${containerSelector} .dropdown-item`).forEach((item) => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const value = item.textContent.trim();
            onSelect(value);
            toggleElement.textContent = value;
        });
    });
};

setupDropdown('.payment', paymentToggle, (value) => {
    selectedPayment = value;
});

setupDropdown('.category', categoryToggle, (value) => {
    selectedCategory = value;
});

sumitBtn.addEventListener('click', async () => {
    const amount = amountTag.value.trim();
    const description = typeTag.value.trim();
    const product = productTag.value.trim();

    if (product === '' && amount === '') {
        showAlert(alertTag3);
        return;
    }
    if (amount === '') {
        showAlert(alertTag1);
        return;
    }
    if (product === '') {
        showAlert(alertTag2);
        return;
    }

    const expenseAmount = Number(amount);
    const newBudget = storedBudget - expenseAmount;

    if (storedBudget <= 0 || newBudget < 0) {
        showAlert(alertTag4);
        await saveBudget(0);
        return;
    }

    sumitBtn.disabled = true;

    const { data: expense, error: expenseError } = await supabaseClient
        .from('Expense List')
        .insert({
            date: new Date().toISOString().slice(0, 10),
            product_name: product,
            product_price: expenseAmount,
            description: description
        })
        .select('id')
        .single();

    if (expenseError || !expense) {
        console.error('Error saving expense:', expenseError);
        showAlert(alertTag5);
        sumitBtn.disabled = false;
        return;
    }

    const { error: categoryError } = await supabaseClient
        .from('Category')
        .insert({
            id: expense.id,
            category: selectedCategory,
            payment_method: selectedPayment
        });

    if (categoryError) {
        console.error('Error saving category:', categoryError);
        await supabaseClient.from('Expense List').delete().eq('id', expense.id);
        showAlert(alertTag5);
        sumitBtn.disabled = false;
        return;
    }

    const saved = await saveBudget(newBudget);
    if (!saved) {
        showAlert(alertTag5);
        sumitBtn.disabled = false;
        return;
    }

    clearExpense();
    alertContainer.innerHTML = confirmTag;
    sumitBtn.disabled = false;
});

const showBudgetInput = () => {
    budgetContainer.classList.remove('hide');
    budgetContainer.classList.add('show');
};

const hideBudgetInput = () => {
    budgetContainer.classList.remove('show');
    budgetContainer.classList.add('hide');
};

budgetInputTag.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        budgetBtn.click();
    }
    if (event.key === 'Escape') {
        hideBudgetInput();
    }
});

budgetBtn.addEventListener('click', async () => {
    const addedAmount = Number(budgetInputTag.value.trim());
    if (!addedAmount || addedAmount <= 0) {
        return;
    }

    const newBudget = storedBudget + addedAmount;
    const saved = await saveBudget(newBudget);

    if (saved) {
        budgetInputTag.value = '';
        hideBudgetInput();
    }
});

resetBtn.addEventListener('click', async () => {
    resetBtn.disabled = true;

    const { error: categoryError } = await supabaseClient
        .from('Category')
        .delete()
        .gte('id', 0);

    const { error: expenseError } = await supabaseClient
        .from('Expense List')
        .delete()
        .gte('id', 0);

    await saveBudget(0);

    if (categoryError || expenseError) {
        console.error('Error resetting data:', categoryError || expenseError);
    }

    resetBtn.disabled = false;
});

burgerToggler.addEventListener('click', () => {
    burgerMenu.classList.toggle('open');
    burgerToggler.classList.toggle('open');
});

menuItems.addEventListener('click', () => {
    burgerMenu.classList.toggle('open');
});

fetchBudget();
