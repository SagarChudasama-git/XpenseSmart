function handleSignup(event) {
    event.preventDefault();
    
    const userData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        salary: 0,
        currency: 'USD',
        transactions: [],
        dateJoined: new Date().toISOString()
    };

    localStorage.setItem('userData', JSON.stringify(userData));
    window.location.href = 'index.html';
    return false;
}

function loadUserProfile() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {
        username: 'Guest User',
        email: 'guest@example.com'
    };

    document.getElementById('userName').textContent = userData.username;
    document.querySelector('.user-email').textContent = userData.email;
    updateProfileInfo();
}

function updateProfileInfo() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {
        salary: 0,
        currency: 'USD',
        transactions: []
    };

    const expenses = userData.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const income = userData.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    document.getElementById('totalExpenses').textContent = 
        `${currencySymbols[userData.currency]}${expenses.toFixed(2)}`;
    document.getElementById('totalIncome').textContent = 
        `${currencySymbols[userData.currency]}${income.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', loadUserProfile); 