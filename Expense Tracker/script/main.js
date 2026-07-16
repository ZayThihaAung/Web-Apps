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
const navTagMobile = document.querySelector('.budget-nav-mobile');
const resetBtn = document.querySelector('.reset-bd');
const burgerToggler = document.querySelector('.burger-toggler');
const burgerMenu = document.querySelector('.burger-menu-container');
const menuItems = document.querySelector('.menu-item');

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

const alertTag4 = `
    <div class="alert alert-danger" role="alert">
        Your budget is underfunded. Please add your budget.
    </div>
`;

const clearExpense = () => {
    alertContainer.innerHTML = '';
    amountTag.value = '';
    typeTag.value = '';
}

let storedBudget;
sumitBtn.addEventListener('click', () => {
    const amount = amountTag.value.trim();
    const description = typeTag.value.trim();
    // Validation for empty amount and description
    if (description === '' && amount === ''){
        clearExpense();
        alertContainer.innerHTML += alertTag3;
    }
    if(amount === ''){
        clearExpense();
        alertContainer.innerHTML = '';
        alertContainer.innerHTML += alertTag1;
        description = ''; // Pervent subtracting budget when amount is empty
        console.log('worked');
        return;
    }
    if(description === ''){
        clearExpense();
        alertContainer.innerHTML = '';
        alertContainer.innerHTML += alertTag2;
        amount = ''; // Pervent subtracting budget when description is empty 
        console.log('worked');
        return;
    } else{
        clearExpense(); 
        alertContainer.innerHTML += confirmTag;
    }

    storedBudget = JSON.parse(localStorage.getItem('budget'));
    let newBudget = storedBudget - amount;
    localStorage.setItem('budget', JSON.stringify(newBudget));
    // If the budget is underfunded, clear the expense list and alert the user
    if(storedBudget < 0 || newBudget < 0){
        clearExpense();
        alertContainer.innerHTML = '';
        alertContainer.innerHTML += alertTag4;
        localStorage.removeItem('budget');
        return;
    } else{ 
        // Set up expense list to local storage        
        const expenseItem = {
            id: Date.now(),
            description: description,
            amount: Number(amount)
        };
        const expenses = JSON.parse(localStorage.getItem('expensesList')) || [];
        expenses.push(expenseItem);
        localStorage.setItem('expensesList', JSON.stringify(expenses));
    }
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

let budgetTag = '';
const retriveBudget = () => {
    storedBudget = JSON.parse(localStorage.getItem('budget'));
    navTag.innerHTML = '';
    navTagMobile.innerHTML = '';
    budgetTag = `<a class="nav-link init-budget" href="#" title="Initial Budget">${storedBudget} MMK</a>`;
}

const showBudgetTag = () => {
    if(localStorage.getItem('budget')) {
        retriveBudget();
    }else{
        budgetTag = `<a class="nav-link init-budget" href="#" title="Initial Budget">0 MMK</a>`;
    };
    navTagMobile.innerHTML += budgetTag;
    navTag.innerHTML += budgetTag;
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
        navTagMobile.innerHTML += budgetTag;
        budgetInputTag.value = '';
    }
    else{
        let budget = budgetInputTag.value.trim();
        localStorage.setItem('budget', JSON.stringify(budget));
        retriveBudget();
        navTag.innerHTML += budgetTag;
        navTagMobile.innerHTML += budgetTag;
        budgetInputTag.value = '';
    }
});

resetBtn.addEventListener('click', () => {
    localStorage.removeItem('budget');
    localStorage.removeItem('expensesList');
    navTag.innerHTML = '';
    showBudgetTag();
});


// Humburger menu toggle
burgerToggler.addEventListener('click', () => {
  burgerMenu.classList.toggle('open');
  burgerToggler.classList.toggle('open');
});

menuItems.addEventListener('click', () => {
    burgerMenu.classList.toggle('open');
});

showBudgetTag();
