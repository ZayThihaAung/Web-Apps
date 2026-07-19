const groupUsername = document.getElementById('group-username');
const btnSubmit = document.getElementById('btn-submit');
const authTitle = document.getElementById('auth-title');
const authForm = document.getElementById('auth-form');
const messageBox = document.getElementById('message-box');

let currentMode = 'signin';

// Toggle Setup between Sign In / Sign Up
function setMode(mode) {
  currentMode = mode;
  messageBox.textContent = ''; // Clear prior notices

  const btnSignIn = document.getElementById('btn-signin');
  const btnSignUp = document.getElementById('btn-signup');

  if (mode === 'signin') {
    btnSignIn.classList.add('active');
    btnSignUp.classList.remove('active');
    groupUsername.classList.add('hidden');
    document.getElementById('username').removeAttribute('required');
    
    authTitle.textContent = 'Welcome to Expense Tracker';
    btnSubmit.textContent = 'Sign in';
  } else {
    btnSignUp.classList.add('active');
    btnSignIn.classList.remove('active');
    groupUsername.classList.remove('hidden');
    document.getElementById('username').setAttribute('required', 'true');

    authTitle.textContent = 'Create an Account';
    btnSubmit.textContent = 'Sign up';
  }
}

// 2. Handle Mock Form Submission
authForm.addEventListener('submit', (e) => {
  e.preventDefault();
  messageBox.textContent = '';
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const username = document.getElementById('username').value;

  if (currentMode === 'signup') {
    // ---- Mock Sign Up ----
    showMessage(`Success! Account created for ${username} (${email}).`, 'success');
    
    // Optional: Switch back to sign in automatically after registering
    setTimeout(() => {
      setMode('signin');
    }, 2000);

  } else {
    // ---- Mock Sign In ----
    showMessage(`Logged in successfully as ${email}!`, 'success');
  }
});

function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
}