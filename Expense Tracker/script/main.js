const sumitBtn = document.querySelector(".sumit-btn");
const containerTag = document.querySelector('.container');
const amountTag = document.querySelector('.amount');
const typeTag = document.querySelector('.describe');
const budgetContainer = document.querySelector('.form-budget-container');
const budgetBtn = document.querySelector('.budget-btn');
const budgetInputTag = document.querySelector('.ib-input');
const initialBudget = document.querySelector('.init-budget');
const alertContainer = document.querySelector('.alert-container');
const navTag = document.querySelector('.budget-nav');
const resetBtn = document.querySelector('.reset-bd');

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
        Please add the prodcut type you have bought.
    </div>
`;

const alertTag3 = `
    <div class="alert alert-danger" role="alert">
        Please add both amounts and description.
    </div>
`;

const clearExpense = () => {
    alertContainer.innerHTML = '';
    amountTag.value = '';
    typeTag.value = '';
}

sumitBtn.addEventListener('click', () => {
    const amount = amountTag.value.trim();
    const description = typeTag.value.trim();
    // Detect input emptiness
    if (description === '' && amount === ''){
        clearExpense();
        alertContainer.innerHTML += alertTag3;
    }
    if(amount === ''){
        clearExpense();
        alertContainer.innerHTML = '';
        alertContainer.innerHTML += alertTag1;
        description = ''; // Pervent subtracting budget when amount is empty
        return;
    }
    if(description === ''){
        clearExpense();
        alertContainer.innerHTML = '';
        alertContainer.innerHTML += alertTag2;
        amount = ''; // Pervent subtracting budget when description is empty
        return;
    } else{
        clearExpense(); 
        alertContainer.innerHTML += confirmTag;
    }
    const expenseItem = {
        id: Date.now(),
        description: description,
        amount: Number(amount)
    };
    // Set up expense list to local stroage
    const expenses = JSON.parse(localStorage.getItem('expensesList')) || [];
    expenses.push(expenseItem);
    localStorage.setItem('expensesList', JSON.stringify(expenses));

    storedBudget = JSON.parse(localStorage.getItem('budget'));
    let newBudget = storedBudget - amount;
    localStorage.setItem('budget', JSON.stringify(newBudget));
    navTag.innerHTML = '';
    navTag.innerHTML += `<a class="nav-link init-budget" href="#" title="Initial Budget">${newBudget} MMK</a>`;
});

const showBudgetInput = () => {
    budgetContainer.classList.remove('hide');
    budgetContainer.classList.add('show');
}

const hideBudgetInput = () => {
    budgetContainer.classList.remove('show');
    budgetContainer.classList.add('hide');
}

const retriveBudget = () => {
    let storedBudget = JSON.parse(localStorage.getItem('budget'));
    navTag.innerHTML = '';
    budgetTag = `<a class="nav-link init-budget" href="#" title="Initial Budget">${storedBudget} MMK</a>`;
}

budgetInputTag.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        budgetBtn.click();
    }
    if (event.key === 'Escape') {
        hideBudgetInput();
    }
});

budgetBtn.addEventListener('click', () => {
    storedBudget = JSON.parse(localStorage.getItem('budget'));
    if (storedBudget) {
        let newBudget = parseInt(storedBudget) + parseInt(budgetInputTag.value.trim());
        localStorage.setItem('budget', JSON.stringify(newBudget));
        retriveBudget();
        navTag.innerHTML += budgetTag;
        budgetInputTag.value = '';
    }
    else{
        let budget = budgetInputTag.value.trim();
        localStorage.setItem('budget', JSON.stringify(budget));
        retriveBudget();
        navTag.innerHTML += budgetTag;
        budgetInputTag.value = '';
    }
});

resetBtn.addEventListener('click', () => {
    localStorage.removeItem('budget');
    localStorage.removeItem('expensesList');
    navTag.innerHTML = '';
    showBudgetTag();
});

const showBudgetTag = () => {
    if(localStorage.getItem('budget')) {
        retriveBudget();
    }else{
        budgetTag = `<a class="nav-link init-budget" href="#" title="Initial Budget">0 MMK</a>`;
    };
    navTag.innerHTML += budgetTag;
}

showBudgetTag();
