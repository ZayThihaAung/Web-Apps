const listTag = document.querySelector('.list-group');
const ascendTag = document.querySelector('.ascend');
const decendTag = document.querySelector('.decend');
const deletExpense = document.querySelector('.btn-delete');

const getExpenses = JSON.parse(localStorage.getItem('expensesList')) || [];
const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' });

const renderHTML = (expenseList) => {
    const items = expenseList.map((e, i) => `
    <li class="list-group-item d-flex justify-content-between align-items-start">
      <div class="ms-2 me-auto">
        <div class="fw-bold">${String(e.description)}</div>
        ${Number(e.amount).toLocaleString()} MMK
        <div>${String(dateFormatter.format(new Date(e.id)))}</div>
      </div>
      <span class="badge rounded-pill ${Number(e.amount) > 20000 ? 'bg-danger' : 'bg-primary'}">${i+1}</span>
    </li>
  `).join('');
    listTag.innerHTML = items || `<li class="list-group-item">No expenses added yet.</li>`;
};

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

deletExpense.addEventListener('click', (event) => {
  event.preventDefault();
  localStorage.removeItem('expensesList');
  renderHTML([]);
});

renderHTML(getExpenses);