const listTag = document.querySelector('.list-group');
const ascendTag = document.querySelector('.ascend');
const decendTag = document.querySelector('.decend');
const deletAllExpense = document.querySelector('.btn-delete');
const deleteExpense = document.querySelector('.delete-item');

let getExpenses = JSON.parse(localStorage.getItem('expensesList')) || [];
const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' });

const renderHTML = (expenseList) => {
    const items = expenseList.map((e, i) => `
    <li class="list-group-item d-flex justify-content-between align-items-start">
      <div class="ms-2 me-auto">
        <div class="fw-bold">${String(e.description)}</div>
        ${Number(e.amount).toLocaleString()} MMK
        <div>${String(dateFormatter.format(new Date(e.id)))}</div>
      </div>
      <span class="badge rounded-pill ${Number(e.amount) > 20000 ? 'bg-danger' : 'bg-primary'}">.</span>
      <button type="button" class="btn btn-outline-danger delete-item" onclick="deleteExpenseItem(this)" data-id="${e.id}">Delete</button>
    </li>
  `).join('');
    listTag.innerHTML = items || `<li class="list-group-item">No expenses added yet.</li>`;
};
// Sort
const sortAndRender = (compareFn) => {
  const expenseList = getExpenses.slice();
  expenseList.sort(compareFn);
  renderHTML(expenseList);
};

ascendTag.addEventListener('click', (event) => {
  event.preventDefault();
  sortAndRender((a, b) => a.amount - b.amount);
});

decendTag.addEventListener('click', (event) => {
  event.preventDefault();
  sortAndRender((a, b) => b.amount - a.amount);
});

deletAllExpense.addEventListener('click', (event) => {
  event.preventDefault();
  localStorage.removeItem('expensesList');
  getExpenses = [];
  renderHTML([]);
});
// Delete single expense item
const deleteExpenseItem = (button) => {
  const id = button.getAttribute('data-id');
  const updatedExpenses = getExpenses.filter((e) => e.id !== Number(id));
  localStorage.setItem('expensesList', JSON.stringify(updatedExpenses));
  getExpenses = updatedExpenses; // Update the in-memory list of expenses
  renderHTML(updatedExpenses);
  return;
}

renderHTML(getExpenses);